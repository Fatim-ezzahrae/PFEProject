import React from "react";

const ProgressSteps = ({ currentStep }) => {
  const steps = [
    { number: 1, label: "Choose template" },
    { number: 2, label: "Enter your details" },
    { number: 3, label: "Download resume" },
  ];

  return (
    <div className="progress-container">
      {steps.map((step, index) => (
        <div key={step.number} className="step">
          <div
            className={`step-circle ${currentStep === step.number ? "active" : ""}`}
          >
            {step.number}
          </div>
          <span className={`step-label ${currentStep === step.number ? "active-label" : ""}`}>
            {step.label}
          </span>
          {index < steps.length - 1 && <div className="step-line"></div>}
        </div>
      ))}
    </div>
  );
};

export default ProgressSteps;