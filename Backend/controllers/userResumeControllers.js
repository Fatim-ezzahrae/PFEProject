const TemplateModel = require('../models/template');
const PersonalModel = require('../models/personal');
const ExperienceModel = require('../models/experience');
const EducationModel = require('../models/education');
const CertificationModel = require('../models/certifications');
const resumeModel = require('../models/resume');

const path = require('path');
const fs = require('fs');
const tmp = require('tmp');
const pdf = require('pdf-poppler');
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

        // Generate final LaTeX content
        const latexContent = await resumeModel.fillResume(template.latexCode, finalData);


        // 3. Generate PDF (with error handling)
        let pdfBuffer;
        try {
        const pdfStream = latex(latexContent, {
            passes: 1
        });

        const chunks = [];
        pdfStream.on('data', (chunk) => chunks.push(chunk));

        await new Promise((resolve, reject) => {
            pdfStream.on('end', resolve);
            pdfStream.on('error', reject);
        });

        pdfBuffer = Buffer.concat(chunks);

        } catch (latexError) {
        console.error('LaTeX Compilation Failed:', latexError);
        throw new Error('PDF generation failed');
        }

        // Create or update resume in database
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

        // Generate and store the resume image
        const tempPdf = tmp.fileSync({ postfix: '.pdf' });
        fs.writeFileSync(tempPdf.name, pdfBuffer);

        const imageFilename = `resume_${savedResume._id}.png`;
        const uploadDir = path.join(__dirname, '..', 'uploads', 'resume_images');
        fs.mkdirSync(uploadDir, { recursive: true }); // Ensure directory exists

        try {
            await pdf.convert(tempPdf.name, {
            format: 'png',
            out_dir: uploadDir,
            out_prefix: imageFilename.replace('.png', ''),
            page: 1
            });

            // Rename the output file (remove '-1' suffix)
            const tempImagePath = path.join(uploadDir, `${imageFilename.replace('.png', '')}-1.png`);
            const finalImagePath = path.join(uploadDir, imageFilename);
            fs.renameSync(tempImagePath, finalImagePath);

            // Store relative path in database
            const imageUrlPath = path.join('uploads', 'resume_images', imageFilename).replace(/\\/g, '/');

            // Update the resume with image URL
            const updatedResume = await resumeModel.findByIdAndUpdate(
            savedResume._id,
            { imageUrl: imageUrlPath },
            { new: true }
            ); 

        } catch (error) {
            console.error('Image conversion failed:', err);   
            
            // Return success response
            res.json({
                success: true,
                message: 'Resume saved successfully',
                resumeId: savedResume._id,
                updatedAt: savedResume.lastUpdated
            });
        } finally {
            // Always clean up temp files
            fs.unlinkSync(tempPdf.name);
        }

    } catch (error) {
        console.error('Save Resume Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to save resume',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
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

// get user's resumes
/*async function getUserResumes(req, res) {
    try {
      const { userId } = req.params;
  
      // 1️⃣ Check cache
      const cachedResumes = cache.get(`user-resumes-${userId}`);
      if (cachedResumes) return res.json(cachedResumes);
  
      // 2️⃣ Fetch resumes from DB
      const resumes = await resumeModel.find({ userId }).lean();
      if (!resumes.length) {
        return res.status(404).json({ message: "No resumes found" });
      }
  
      // 3️⃣ Process PDFs with concurrency limit
      const resumesWithImages = await Promise.all(
        resumes.map(resume => 
          limit(() => convertResumeToImage(resume))
        )
      );
  
      // 4️⃣ Cache results
      cache.set(`user-resumes-${userId}`, resumesWithImages);
  
      // 5️⃣ Send response
      res.json(resumesWithImages);
  
    } catch (error) {
      console.error("Error fetching resumes:", error);
      res.status(500).json({ message: "Failed to generate previews" });
    }
}
  
// Helper: Convert PDF to image + return temp URL
async function convertResumeToImage(resume) {

    // Unique temp paths (avoid race conditions)
    const tempPdf = tmp.fileSync({ postfix: `.${Date.now()}.pdf` });
    fs.writeFileSync(tempPdf.name, resume.pdfData);

    const tempDir = tmp.dirSync().name;
    const imagePrefix = `resume_${resume._id}_${Date.now()}`;

    // Convert PDF → PNG
    await pdf.convert(tempPdf.name, {
        format: 'png',
        out_dir: tempDir,
        out_prefix: imagePrefix,
        page: 1,
    });

    // Read PNG and cache it
    const imagePath = `${path.join(tempDir, imagePrefix)}-1.png`;
    const imageBuffer = fs.readFileSync(imagePath);
    tempImageCache.set(resume._id.toString(), imageBuffer); // Store for temp URLs

    // Cleanup
    fs.unlinkSync(tempPdf.name);
    fs.unlinkSync(imagePath);

    return {
        _id: resume._id,
        name: `Resume ${resume.pdfVersion}`,
        imageUrl: `/temp-resume-image/${resume._id}`, // Temp URL (not base64)
        createdAt: resume.createdAt,
    };
}*/

module.exports = { generatePreviewPDF, saveResume, exportResume };