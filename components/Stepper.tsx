import React from 'react';
import { Step } from '../types';
import { CheckIcon } from './IconComponents';

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center">
        {steps.map((step, stepIdx) => (
          <li key={step.name} className={`relative ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''} flex-1`}>
            {currentStep > step.id ? (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-primary" />
                </div>
                <div className="relative w-8 h-8 flex items-center justify-center bg-primary rounded-full">
                  <CheckIcon className="w-5 h-5 text-white" />
                </div>
                <span className="absolute top-10 left-1/2 -translate-x-1/2 text-sm font-medium text-primary text-center w-28">{step.name}</span>
              </>
            ) : currentStep === step.id ? (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-gray-200" />
                </div>
                <div className="relative w-8 h-8 flex items-center justify-center bg-white border-2 border-primary rounded-full">
                  <span className="h-2.5 w-2.5 bg-primary rounded-full" />
                </div>
                <span className="absolute top-10 left-1/2 -translate-x-1/2 text-sm font-medium text-primary text-center w-28">{step.name}</span>
              </>
            ) : (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-gray-200" />
                </div>
                <div className="relative w-8 h-8 flex items-center justify-center bg-white border-2 border-gray-300 rounded-full" />
                <span className="absolute top-10 left-1/2 -translate-x-1/2 text-sm font-medium text-gray-500 text-center w-28">{step.name}</span>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Stepper;
