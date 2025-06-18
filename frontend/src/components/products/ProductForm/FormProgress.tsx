import React from 'react';

type FormProgressProps = {
  currentStep: number;
  totalSteps: number;
};

const FormProgress: React.FC<FormProgressProps> = ({ currentStep, totalSteps }) => {
  const progress = (currentStep / totalSteps) * 100;

  const steps = [
    { step: 1, label: 'Title' },
    { step: 2, label: 'Categories' },
    { step: 3, label: 'Description' },
    { step: 4, label: 'Price' },
    { step: 5, label: 'Rent Details' },
    { step: 6, label: 'Summary' },
  ];

  return (
    <div>
      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
              Step {currentStep} of {totalSteps}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold inline-block text-blue-600">
              {Math.round(progress)}%
            </span>
          </div>
        </div>
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
          <div
            style={{ width: `${progress}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all duration-500 ease-in-out"
          ></div>
        </div>
      </div>

      <div className="hidden sm:flex justify-between">
        {steps.map((step) => (
          <div
            key={step.step}
            className={`flex flex-col items-center ${
              step.step === currentStep
                ? 'text-blue-600'
                : step.step < currentStep
                ? 'text-green-600'
                : 'text-gray-400'
            }`}
          >
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step.step === currentStep
                  ? 'bg-blue-600 text-white'
                  : step.step < currentStep
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200'
              }`}
            >
              {step.step < currentStep ? (
                <svg className="w-5 h-5\" fill="currentColor\" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              ) : (
                step.step
              )}
            </div>
            <span className="text-xs mt-1">{step.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormProgress;