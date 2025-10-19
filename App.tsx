import React, { useState, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { ResumeInput } from './components/ResumeInput';
import { JobDescriptionInput } from './components/JobDescriptionInput';
import { AnalysisResult } from './components/AnalysisResult';
import { Loader } from './components/Loader';
import { analyzeResume, generateAnswerForFormField } from './services/geminiService';
import type { AnalysisReport, Job } from './types';
import { AutoApply } from './components/AutoApply';

// Mock function to generate jobs for the manual review process
const generateMockJobs = (): Job[] => {
  return [
    { id: 1, title: 'Senior Frontend Developer', company: 'Paystack', location: 'Lagos, Nigeria' },
    { id: 2, title: 'Product Manager', company: 'Flutterwave', location: 'Remote' },
    { id: 3, title: 'Data Scientist', company: 'Andela', location: 'Accra, Ghana' },
    { id: 4, title: 'UX/UI Designer', company: 'Interswitch', location: 'Lagos, Nigeria' },
    { id: 5, title: 'DevOps Engineer', company: 'Konga', location: 'Remote' },
  ];
};


const App: React.FC = () => {
  const [resumeText, setResumeText] = useState('');
  const [jobDescriptionText, setJobDescriptionText] = useState('');
  const [analysisReport, setAnalysisReport] = useState<AnalysisReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileError, setFileError] = useState('');

  // State for Auto-Apply feature
  const [isAutoApplying, setIsAutoApplying] = useState(false);
  const [applicationsSent, setApplicationsSent] = useState(0);
  const [autoApplyMode, setAutoApplyMode] = useState<'manual' | 'automatic'>('manual');
  const [jobsForReview, setJobsForReview] = useState<Job[]>([]);
  const [currentReviewJobIndex, setCurrentReviewJobIndex] = useState(0);
  const autoApplyIntervalRef = useRef<number | null>(null);
  const MAX_APPLICATIONS = 100;

  // State for intelligent form filling
  const [formFillingJob, setFormFillingJob] = useState<Job | null>(null);
  const [isGeneratingAnswer, setIsGeneratingAnswer] = useState(false);
  const [generatedAnswer, setGeneratedAnswer] = useState('');


  useEffect(() => {
    // Cleanup interval on component unmount
    return () => {
      if (autoApplyIntervalRef.current) {
        clearInterval(autoApplyIntervalRef.current);
      }
    };
  }, []);

  const handleAnalyze = async () => {
    if (!resumeText.trim() || !jobDescriptionText.trim()) {
      setError('Please provide both your resume and the job description.');
      return;
    }
    setError(null);
    setAnalysisReport(null);
    setIsLoading(true);

    try {
      const report = await analyzeResume(resumeText, jobDescriptionText);
      setAnalysisReport(report);
    } catch (e) {
      setError('An error occurred during analysis. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const startAutoApply = () => {
    setIsAutoApplying(true);
    setApplicationsSent(0); // Reset progress on start
    if (autoApplyMode === 'automatic') {
      autoApplyIntervalRef.current = window.setInterval(() => {
        setApplicationsSent((prev) => {
          if (prev < MAX_APPLICATIONS) {
            return prev + 1;
          }
          stopAutoApply();
          return MAX_APPLICATIONS;
        });
      }, 1000); // Apply to one job per second for simulation
    } else { // Manual mode
      setJobsForReview(generateMockJobs());
      setCurrentReviewJobIndex(0);
    }
  };

  const stopAutoApply = () => {
    setIsAutoApplying(false);
    if (autoApplyIntervalRef.current) {
      clearInterval(autoApplyIntervalRef.current);
      autoApplyIntervalRef.current = null;
    }
    // Reset state for a clean slate
    setJobsForReview([]);
    setCurrentReviewJobIndex(0);
    setFormFillingJob(null);
    setGeneratedAnswer('');
  };
  
  const handleToggleAutoApply = () => {
    if (isAutoApplying) {
      stopAutoApply();
    } else {
      startAutoApply();
    }
  };
  
  const handleReviewDecision = async (applied: boolean) => {
    if (!applied) { // Skipped
      if (currentReviewJobIndex < jobsForReview.length - 1) {
        setCurrentReviewJobIndex(prev => prev + 1);
      } else {
        setIsAutoApplying(false);
        setJobsForReview([]);
      }
    } else { // Apply clicked, start form fill simulation
      const currentJob = jobsForReview[currentReviewJobIndex];
      setFormFillingJob(currentJob);
      setIsGeneratingAnswer(true);
      try {
        const answer = await generateAnswerForFormField(resumeText, currentJob.title, currentJob.company);
        setGeneratedAnswer(answer);
      } catch (error) {
        console.error("Failed to generate answer", error);
        setGeneratedAnswer("Sorry, I couldn't generate an answer at this time.");
      } finally {
        setIsGeneratingAnswer(false);
      }
    }
  };

  const handleSubmitApplication = () => {
    setApplicationsSent(prev => prev + 1);
    setFormFillingJob(null);
    setGeneratedAnswer('');

    if (currentReviewJobIndex < jobsForReview.length - 1) {
      setCurrentReviewJobIndex(prev => prev + 1);
    } else {
      // Last job reviewed
      setIsAutoApplying(false);
      setJobsForReview([]);
    }
  };

  const handleCancelFill = () => {
    setFormFillingJob(null);
    setGeneratedAnswer('');
  };


  const isAnalyzeButtonDisabled = isLoading || !resumeText.trim() || !jobDescriptionText.trim();

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ResumeInput value={resumeText} onChange={setResumeText} onFileError={setFileError} />
            <JobDescriptionInput value={jobDescriptionText} onChange={setJobDescriptionText} />
          </div>
          
          {fileError && <p className="text-red-500 text-center">{fileError}</p>}
          
          <div className="text-center">
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzeButtonDisabled}
              className={`inline-flex items-center justify-center px-8 py-4 bg-green-600 text-white font-bold text-lg rounded-md shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100`}
            >
              {isLoading ? (
                <>
                  <Loader />
                  <span className="ml-2">Analyzing...</span>
                </>
              ) : (
                'Analyze My Resume'
              )}
            </button>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-center mt-6" role="alert">
              <p>{error}</p>
            </div>
          )}

          <AutoApply
            isActive={isAutoApplying}
            onToggle={handleToggleAutoApply}
            applicationsSent={applicationsSent}
            maxApplications={MAX_APPLICATIONS}
            isReady={!!jobDescriptionText.trim()}
            mode={autoApplyMode}
            onModeChange={setAutoApplyMode}
            jobsForReview={jobsForReview}
            currentJobIndex={currentReviewJobIndex}
            onReviewDecision={handleReviewDecision}
            formFillingJob={formFillingJob}
            isGeneratingAnswer={isGeneratingAnswer}
            generatedAnswer={generatedAnswer}
            onSubmitApplication={handleSubmitApplication}
            onCancelFill={handleCancelFill}
          />
          
          {analysisReport && (
            <div className="mt-12">
              <AnalysisResult report={analysisReport} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;