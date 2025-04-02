const TemplateModel = require('../models/template');
const PersonalModel = require('../models/personal');
const ExperienceModel = require('../models/experience');
const EducationModel = require('../models/education');
const CertificationModel = require('../models/certifications');
const resumeModel = require('../models/resume');

const path = require('path');
const fs = require('fs');
const tmp = require('tmp');
const poppler = require('pdf-poppler');
const NodeCache = require('node-cache');
const pLimit = require('p-limit');
const { promisify } = require('util');
const writeFile = promisify(fs.writeFile);
const latex = require('node-latex');

const cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour
//const limit = pLimit(3); // 3 concurrent PDF conversions

// Temp in-memory store for images (alternative to base64)
const tempImageCache = new NodeCache({ stdTTL: 60 * 10 }); // 10-minute TTL

const generatePreviewPDF = async (req, res) => {
    try {
        const { templateId, userId } = req.params;

        // Parallel fetching of all required data
        const [template, personalData, experienceData, educationData, certificationData] = await Promise.all([
            TemplateModel.findById(templateId),
            PersonalModel.findOne({ userId }),
            ExperienceModel.findOne({ userId }),
            EducationModel.findOne({ userId }),
            CertificationModel.findOne({ userId })
        ]);

        // Data validation
        if (!template) throw new Error("Template not found");
        if (!personalData) throw new Error("Personal information not found");
        
        // Construct preview data (with fallbacks for optional sections)
        const previewData = {
            firstName: personalData.firstName,
            lastName: personalData.lastName,
            phone: personalData.phone || 'Not specified',
            email: personalData.email,
            address: personalData.address || 'Not specified',
            skills: personalData.skills || [],
            languages: personalData.languages || [],
            experience: experienceData?.experience || [],
            education: educationData?.education || [],
            certifications: certificationData?.certifications || []
        };

        // Generate LaTeX content for preview
        const latexContent = await resumeModel.fillResume(template.latexCode, previewData);

        console.log(latexContent)
        // Configure LaTeX compiler for preview (fast but less thorough)
        const pdfStream = latex(latexContent, {
            passes: 1,  // Faster preview with single pass
            draft: true, // Faster compilation
        });

        // Stream handling with proper error management
        let errored = false;
        
        pdfStream.on('error', (err) => {
            errored = true;
            console.error('Preview Generation Error:', err);
            if (!res.headersSent) {
                res.status(500).json({ 
                    success: false,
                    message: 'Preview generation failed',
                    error: process.env.NODE_ENV === 'development' ? err.message : undefined
                });
            }
        });

        pdfStream.on('end', () => {
            if (!errored && !res.headersSent) {
                console.log('Preview generated successfully');
            }
        });

        // Set PDF preview headers
        if (!res.headersSent) {
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'inline; filename="preview.pdf"');
            pdfStream.pipe(res);
        }

    } catch (error) {
        console.error('Preview Controller Error:', error);
        if (!res.headersSent) {
            res.status(500).json({ 
                success: false,
                message: 'Failed to generate preview',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
};

const saveResume = async (req, res) => {
    let tempPdf;
    try {
        const { templateId, userId } = req.body;

        // Validate input
        if (!templateId || !userId) {
            return res.status(400).json({
                success: false,
                message: 'Missing templateId or userId'
            });
        }

        // 1. Fetch all required data
        // Fetch all required data (same as preview but with full quality)
        const [template, personalData, experienceData, educationData, certificationData] = await Promise.all([
            TemplateModel.findById(templateId),
            PersonalModel.findOne({ userId }),
            ExperienceModel.findOne({ userId }),
            EducationModel.findOne({ userId }),
            CertificationModel.findOne({ userId })
        ]);

        // Validate data exists
        if (!template) {
            return res.status(404).json({ 
                success: false,
                message: "Template not found" 
            });
        }
        if (!personalData) {
            return res.status(404).json({ 
                success: false,
                message: "Personal information not found" 
            });
        }

        // 2. Generate LaTeX content
        // Prepare final data (without placeholder fallbacks)
        const finalData = {
            firstName: personalData.firstName,
            lastName: personalData.lastName,
            phone: personalData.phone,
            email: personalData.email,
            address: personalData.address,
            skills: personalData.skills || [],
            languages: personalData.languages || [],
            experience: experienceData?.experience || [],
            education: educationData?.education || [],
            certifications: certificationData?.certifications || []
        };

        // Generate final LaTeX content wirh timeout
        const latexContent = await Promise.race([
            resumeModel.fillResume(template.latexCode, finalData),
            new Promise((_, reject) => setTimeout(() => reject(new Error('LaTeX generation timeout')), 10000))
        ]);


        // 3. Generate PDF (with error handling)
        let pdfBuffer;
        try {
            pdfBuffer = await Promise.race([
                new Promise((resolve, reject) => {
                    const pdfStream = latex(latexContent, { passes: 1 });
                    const chunks = [];
                    
                    pdfStream.on('data', chunk => chunks.push(chunk));
                    pdfStream.on('end', () => resolve(Buffer.concat(chunks)));
                    pdfStream.on('error', reject);
                }),
                new Promise((_, reject) => setTimeout(() => reject(new Error('PDF generation timeout')), 15000))
            ]);

        } catch (latexError) {
            console.error('LaTeX Compilation Failed:', latexError);
            throw new Error('PDF generation failed: ' + latexError.message);
        }

        // 4. Create/update resume in database
        const savedResume = await resumeModel.findOneAndUpdate(
            { userId, templateId},
            {
                userId,
                templateId,
                latexCode: latexContent,
                pdfData: pdfBuffer,
                $inc: { pdfVersion: 1 }
            },
            { 
                upsert: true, 
                new: true,
                setDefaultsOnInsert: true 
            }
        );

        // 5. Generate and store resume image
        tempPdf = tmp.fileSync({ postfix: '.pdf' });
        fs.writeFileSync(tempPdf.name, pdfBuffer);

        const uploadDir = path.join(__dirname, '..', 'uploads', 'resume_images');
        fs.mkdirSync(uploadDir, { recursive: true }); // Ensure directory exists

        // Generate unique image filename with version
        const imageFilename = `resume_${savedResume._id}_v${savedResume.pdfVersion}.png`;
        const finalImagePath = path.join(uploadDir, imageFilename);

        // Delete previous images for this resume
        const previousImages = fs.readdirSync(uploadDir).filter(file => 
            file.startsWith(`resume_${savedResume._id}_v`)
        );
        previousImages.forEach(file => fs.unlinkSync(path.join(uploadDir, file)));

        // Convert PDF to image
        const tempImagePath = path.join(uploadDir, `${imageFilename.replace('.png', '')}-1.png`);

       // Convert using pdf-poppler
       await poppler.convert(tempPdf.name, {
            format: 'png',
            out_dir: uploadDir,
            out_prefix: imageFilename.replace('.png', ''),
            page: 1
        });

        // Verify and rename the image
        if (!fs.existsSync(tempImagePath)) {
            throw new Error('Temporary image file not created');
        }

        fs.renameSync(tempImagePath, finalImagePath);
        const imageUrlPath = path.join('uploads', 'resume_images', imageFilename).replace(/\\/g, '/');

        // Update the resume with image URL
        // Update the resume with image URL with verification
        console.log('Attempting to update with imageUrl:', imageUrlPath);
        const updatedResume = await resumeModel.findByIdAndUpdate(
            savedResume._id,
            { imageUrl: imageUrlPath },
            { new: true }
        ).lean();

        console.log('Updated resume document:', updatedResume);
        if (!updatedResume.imageUrl) {
            console.error('imageUrl was not saved in database!');
        }

        return res.json({
            success: true,
            message: 'Resume saved successfully',
            resumeId: savedResume._id,
            updatedAt: savedResume.updatedAt,
            imageUrl: imageUrlPath,
            pdfVersion: savedResume.pdfVersion
        });        

    } catch (error) {
        console.error('Save Resume Error:', error);
        if (error.message.includes('image conversion') || error.message.includes('Temporary image')) {
            return res.json({
                success: true,
                message: 'Resume saved (image conversion failed)',
                resumeId: savedResume._id,
                updatedAt: savedResume.updatedAt,
                pdfVersion: savedResume.pdfVersion
            });
        }
        return res.status(500).json({
            success: false,
            message: 'Failed to save resume',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    } finally {
        // Clean up temp files
        if (tempPdf?.name && fs.existsSync(tempPdf.name)) {
            try {
                fs.unlinkSync(tempPdf.name);
                tempPdf.removeCallback();
            } catch (cleanupError) {
                console.error('Temp file cleanup failed:', cleanupError);
            }
        }
    }
};

const exportResume = async (req, res) => {
    try {
        const { resumeId, format } = req.params;
        const { download } = req.query;
    
        // 1. Fetch resume from database
        const resume = await resumeModel.findById(resumeId);
        if (!resume) {
          return res.status(404).json({ message: 'Resume not found, please save your resume first' });
        }
    
        // 2. Handle different export formats
        switch (format) {
          case 'pdf':
            return handlePDFExport(resume, res, download === 'true');
          case 'latex':
            return handleLaTeXExport(resume, res, download === 'true');
          default:
            return res.status(400).json({ message: 'Invalid export format' });
        }
      } catch (error) {
        console.error('Export error:', error);
        res.status(500).json({ 
          message: 'Export failed',
          error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
      }
};

// PDF Export Handler
const handlePDFExport = async (resume, res, shouldDownload) => {

    // Option 1: Use pre-generated PDF if available
    if (resume.pdfData) {
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': resume.pdfData.length,
        'Content-Disposition': shouldDownload 
          ? `attachment; filename="${'My_resume'}.pdf"`
          : 'inline'
      });
      return res.send(resume.pdfData);
    }

};

// LaTeX Export Handler
const handleLaTeXExport = (resume, res, shouldDownload) => {
    const filename = `${'My_resume'}.tex`;
    const latexContent = resume.latexCode;
  
    res.set({
      'Content-Type': 'text/x-tex',
      'Content-Disposition': shouldDownload
        ? `attachment; filename="${filename}"`
        : 'inline',
      'Content-Length': Buffer.byteLength(latexContent)
    });
  
    res.send(latexContent);
  };

// Get all resumes for a user
const getUserResumes = async (req, res) => {
    try {
        const { userId } = req.params;

        // 1. Find all resumes for this user
        const resumes = await resumeModel.find({ userId })
        .select('_id templateId updatedAt pdfVersion imageUrl')
        .populate('templateId', 'name'); // Get template name if needed

        if (!resumes.length) {
        return res.status(404).json({ 
            success: false,
            message: 'No resumes found for this user' 
        });
        }

        // 2. Format response with full image URLs
        const response = resumes.map(resume => ({
        resumeId: resume._id,
        templateId: resume.templateId._id,
        templateName: resume.templateId?.name || 'Untitled',
        lastUpdated: resume.updatedAt,
        createdAt: resume.createdAt,
        version: resume.pdfVersion,
        imageUrl: resume.imageUrl 
            ? `${req.protocol}://${req.get('host')}/${resume.imageUrl.replace(/\\/g, '/')}`
            : null,
        downloadUrl: `${req.protocol}://${req.get('host')}/api/resumes/${resume._id}/pdf`
        }));

        res.status(200).json({
        success: true,
        count: resumes.length,
        resumes: response
        });

    } catch (error) {
        console.error("Error fetching user resumes:", error);
        res.status(500).json({ 
        success: false,
        message: 'Failed to fetch user resumes',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

const getResumeImage = async (req, res) => {
    try {
      const { userId, resumeId } = req.params;
  
      // 1. Verify resume belongs to user
      const resume = await resumeModel.findOne({ 
        _id: resumeId, 
        userId 
      });
  
      if (!resume) {
        return res.status(404).json({ 
          success: false,
          message: 'Resume not found or access denied' 
        });
      }
  
      // 2. Check if image exists
      if (!resume.imageUrl) {
        return res.status(404).json({ 
          success: false,
          message: 'Resume image not available' 
        });
      }
  
      const imagePath = path.join(__dirname, '..', resume.imageUrl);
  
      if (!fs.existsSync(imagePath)) {
        return res.status(404).json({ 
          success: false,
          message: 'Image file not found on server' 
        });
      }
  
      // 3. Serve the image
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Content-Disposition', `inline; filename=resume_${resumeId}_v${resume.pdfVersion}.png`);
      res.sendFile(imagePath);
  
    } catch (error) {
      console.error("Error serving resume image:", error);
      res.status(500).json({ 
        success: false,
        message: 'Failed to serve resume image',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
};


module.exports = { generatePreviewPDF, saveResume, exportResume, getUserResumes, getResumeImage };