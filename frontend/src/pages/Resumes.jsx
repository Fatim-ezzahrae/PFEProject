import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../styles/Resumes.css"; // Assuming you create a separate CSS file for styling

const TemplateList = () => {
    const [templates, setTemplates] = useState([]);

    useEffect(() => {
        // Fetch all templates using Axios
        axios.get('http://localhost:4000/api/templates')
            .then((response) => {
                setTemplates(response.data);
            })
            .catch((error) => {
                console.error('Error fetching templates:', error);
            });
    }, []);

    return (
        <div className="template-list">
            {templates.map((template) => (
                <div key={template._id} className="template-card">
                    <h3>{template.name}</h3>
                    <iframe
                        src={template.pdfUrl}
                        className="pdf-iframe"
                        title={template.name}
                    ></iframe>
                </div>
            ))}
        </div>
    );
};

export default TemplateList;
