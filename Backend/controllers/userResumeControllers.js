const TemplateModel = require('../models/template');
const PersonalModel = require('../models/personal');
const ExperienceModel = require('../models/experience');
const EducationModel = require('../models/education');
const CertificationModel = require('../models/certifications');
const resumeModel = require('../models/resume');

const latex = require('node-latex');
const { Readable } = require('stream');

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

        // Generate high-quality PDF (2 passes for proper references)
        const pdfStream = latex(latexContent, {
            passes: 2
        });

        // Collect PDF chunks
        const chunks = [];
        pdfStream.on('data', (chunk) => chunks.push(chunk));
        
        // Wait for PDF generation to complete
        await new Promise((resolve, reject) => {
            pdfStream.on('end', resolve);
            pdfStream.on('error', reject);
        });

        // Combine chunks into buffer
        const pdfBuffer = Buffer.concat(chunks);

        // Create or update resume in database
        const savedResume = await ResumeModel.create(
            {
                userId,
                templateId,
                latexCode: latexContent,
                pdfData: pdfBuffer,
                lastUpdated: new Date()
            }
        );

        // Return success response
        res.json({
            success: true,
            message: 'Resume saved successfully',
            resumeId: savedResume._id,
            updatedAt: savedResume.lastUpdated
        });

    } catch (error) {
        console.error('Save Resume Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to save resume',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};


module.exports = { generatePreviewPDF };