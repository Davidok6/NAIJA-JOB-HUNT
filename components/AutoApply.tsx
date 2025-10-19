import React from 'react';
import { RocketLaunchIcon, PlayIcon, StopIcon, CheckIcon, XMarkIcon, CpuChipIcon } from './icons';
import type { Job } from '../types';

interface AutoApplyProps {
  isActive: boolean;
  onToggle: () => void;
  applicationsSent: number;
  maxApplications: number;
  isReady: boolean;
  mode: 'manual' | 'automatic';
  onModeChange: (mode: 'manual' | 'automatic') => void;
  jobsForReview: Job[];
  currentJobIndex: number;
  onReviewDecision: (applied: boolean) => void;
  formFillingJob: Job | null;
  isGeneratingAnswer: boolean;
  generatedAnswer: string;
  onSubmitApplication: () => void;
  onCancelFill: () => void;
}

const ModeToggle: React.FC<{ mode: 'manual' | 'automatic'; onModeChange: (mode: 'manual' | 'automatic') => void, disabled: boolean }> = ({ mode, onModeChange, disabled }) => {
  return (
    <div className="flex items-center justify-center space-x-2 bg-gray-100 p-1 rounded-lg">
      <button
        onClick={() => onModeChange('manual')}
        disabled={disabled}
        className={`px-4 py-1 rounded-md text-sm font-semibold transition-colors ${mode === 'manual' ? 'bg-white text-green-600 shadow' : 'text-gray-600 hover:bg-gray-200'} disabled:opacity-50`}
      >
        Manual Review
      </button>
      <button
        onClick={() => onModeChange('automatic')}
        disabled={disabled}
        className={`px-4 py-1 rounded-md text-sm font-semibold transition-colors ${mode === 'automatic' ? 'bg-white text-green-600 shadow' : 'text-gray-600 hover:bg-gray-200'} disabled:opacity-50`}
      >
        Fully Automatic
      </button>
    </div>
  );
};

const ReviewCard: React.FC<{ job: Job; onReviewDecision: (applied: boolean) => void }> = ({ job, onReviewDecision }) => {
    return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-6 text-center animate-fade-in">
            <h3 className="text-lg font-bold text-gray-800">Review Application</h3>
            <div className="mt-4 text-left p-4 bg-white rounded-md shadow-sm">
              <p className="font-bold text-lg">{job.title}</p>
              <p className="text-gray-600">{job.company}</p>
              <p className="text-sm text-gray-500">{job.location}</p>
            </div>
            <div className="mt-6 flex justify-center space-x-4">
                <button onClick={() => onReviewDecision(false)} className="inline-flex items-center px-6 py-2 bg-red-100 text-red-700 font-semibold rounded-md hover:bg-red-200 transition-colors">
                    <XMarkIcon className="w-5 h-5 mr-2" />
                    Skip
                </button>
                <button onClick={() => onReviewDecision(true)} className="inline-flex items-center px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors">
                    <CheckIcon className="w-5 h-5 mr-2" />
                    Apply
                </button>
            </div>
        </div>
    );
};

const FormFillCard: React.FC<{
  job: Job;
  isGenerating: boolean;
  answer: string;
  onSubmit: () => void;
  onCancel: () => void;
}> = ({ job, isGenerating, answer, onSubmit, onCancel }) => {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-6 animate-fade-in">
      <h3 className="text-lg font-bold text-gray-800 text-center">Intelligent Form Fill</h3>
      <div className="mt-4 p-4 bg-white rounded-md shadow-sm">
        <p className="text-gray-600 font-medium">Applying for: <span className="font-bold text-gray-900">{job.title}</span> at <span className="font-bold text-gray-900">{job.company}</span></p>
        <p className="mt-4 text-sm text-gray-800 italic">This application has a custom question: "Describe a challenging project you've worked on and how you overcame it."</p>
        
        <div className="mt-4 p-3 border-t">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center text-center text-gray-600 h-32">
              <CpuChipIcon className="w-8 h-8 text-green-500 animate-pulse" />
              <p className="mt-2 font-semibold">Gemini is generating a tailored answer...</p>
            </div>
          ) : (
            <div>
              <label className="text-sm font-semibold text-gray-700">Generated Answer:</label>
              <textarea
                readOnly
                value={answer}
                className="w-full h-40 p-2 mt-1 bg-gray-100 border border-gray-300 rounded-md text-sm text-gray-800"
              />
            </div>
          )}
        </div>
      </div>
      <div className="mt-6 flex justify-center space-x-4">
        <button onClick={onCancel} className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 transition-colors">
          Cancel
        </button>
        <button 
          onClick={onSubmit} 
          disabled={isGenerating}
          className="inline-flex items-center px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Submit Application
        </button>
      </div>
    </div>
  );
};

const Dashboard: React.FC<Omit<AutoApplyProps, 'onReviewDecision' | 'jobsForReview' | 'currentJobIndex' | 'formFillingJob' | 'isGeneratingAnswer' | 'generatedAnswer' | 'onSubmitApplication' | 'onCancelFill'>> = ({ isActive, onToggle, applicationsSent, maxApplications, isReady, mode }) => {
    const progress = (applicationsSent / maxApplications) * 100;

    return (
        <div className="mt-6 text-center">
            <div className="flex items-center justify-center space-x-4">
                <button
                    onClick={onToggle}
                    disabled={!isReady}
                    className={`inline-flex items-center justify-center px-6 py-3 font-bold text-white rounded-md shadow-md transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100 ${
                        isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-600 hover:bg-green-700'
                    }`}
                >
                    {isActive ? (
                        <><StopIcon className="w-6 h-6 mr-2" /> Stop Applying</>
                    ) : (
                        <><PlayIcon className="w-6 h-6 mr-2" /> Start Applying</>
                    )}
                </button>
                {isActive && (
                    <div className="flex items-center space-x-2">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        <span className="text-sm font-semibold text-gray-600">
                            {mode === 'manual' ? "Awaiting Review..." : "Applying..."}
                        </span>
                    </div>
                )}
            </div>

            <div className="mt-6">
                <div className="flex justify-between mb-1">
                    <span className="text-base font-medium text-gray-700">Daily Progress</span>
                    <span className="text-sm font-medium text-gray-700">{applicationsSent} / {maxApplications} Applications Sent</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
            </div>
        </div>
    );
};


export const AutoApply: React.FC<AutoApplyProps> = (props) => {
  const { 
    isActive, 
    isReady,
    mode,
    onModeChange,
    jobsForReview,
    currentJobIndex,
    onReviewDecision,
    formFillingJob,
    isGeneratingAnswer,
    generatedAnswer,
    onSubmitApplication,
    onCancelFill
  } = props;
  
  const showReview = isActive && mode === 'manual' && jobsForReview.length > 0 && !formFillingJob;
  const currentJob = jobsForReview[currentJobIndex];

  const renderContent = () => {
    if (formFillingJob) {
      return <FormFillCard 
        job={formFillingJob}
        isGenerating={isGeneratingAnswer}
        answer={generatedAnswer}
        onSubmit={onSubmitApplication}
        onCancel={onCancelFill}
      />
    }
    if (showReview && currentJob) {
      return <ReviewCard job={currentJob} onReviewDecision={onReviewDecision} />;
    }
    return <Dashboard {...props} />;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2 flex items-center">
            <RocketLaunchIcon className="w-7 h-7 mr-3 text-green-500" />
            AI Auto-Apply
          </h2>
          <p className="text-gray-600 max-w-md">
            {mode === 'manual' 
              ? 'The AI will find jobs and let you review each one before applying.'
              : 'The AI will automatically apply to jobs matching your target description.'}
          </p>
        </div>
        <ModeToggle mode={mode} onModeChange={onModeChange} disabled={isActive} />
      </div>

      {!isReady && (
        <div className="text-center bg-yellow-50 border border-yellow-300 text-yellow-800 p-3 rounded-md mt-4">
          Please provide a target job description before starting the auto-apply process.
        </div>
      )}

      {renderContent()}
    </div>
  );
};

export default AutoApply;