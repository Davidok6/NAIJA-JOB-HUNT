import React from 'react';
import type { AnalysisReport } from '../types';
import { CheckCircleIcon, LightBulbIcon, SparklesIcon, ArrowRightIcon } from './icons';

interface AnalysisResultProps {
  report: AnalysisReport;
}

const AtsScoreCard: React.FC<{ score: number; explanation: string }> = ({ score, explanation }) => {
    const scoreColor = score >= 80 ? 'text-green-500' : score >= 60 ? 'text-yellow-500' : 'text-red-500';
    const ringColor = score >= 80 ? 'stroke-green-500' : score >= 60 ? 'stroke-yellow-500' : 'stroke-red-500';

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center text-center">
            <h3 className="text-xl font-bold text-gray-700 mb-4">ATS Compatibility Score</h3>
            <div className="relative w-40 h-40">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path
                        className="stroke-current text-gray-200"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        strokeWidth="2.5"
                    ></path>
                    <path
                        className={`stroke-current ${ringColor}`}
                        strokeDasharray={`${score}, 100`}
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                    ></path>
                </svg>
                <div className={`absolute inset-0 flex items-center justify-center text-5xl font-extrabold ${scoreColor}`}>
                    {score}
                </div>
            </div>
            <p className="mt-4 text-gray-600 max-w-sm">{explanation}</p>
        </div>
    );
};


export const AnalysisResult: React.FC<AnalysisResultProps> = ({ report }) => {
  return (
    <div className="space-y-8">
      <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8">Your Analysis Results</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <AtsScoreCard score={report.atsScore} explanation={report.atsExplanation} />

        <div className="bg-white p-6 rounded-xl shadow-lg lg:col-span-2 h-full">
            <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center">
                <LightBulbIcon className="w-6 h-6 mr-2 text-yellow-500" />
                Keyword Suggestions
            </h3>
            <p className="text-gray-600 mb-4">Add these keywords from the job description to improve your relevance.</p>
            <div className="flex flex-wrap gap-2">
                {report.keywordSuggestions.map((keyword, index) => (
                <span key={index} className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                    {keyword}
                </span>
                ))}
            </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-2xl font-bold text-gray-700 mb-4 flex items-center">
          <SparklesIcon className="w-7 h-7 mr-2 text-green-600" />
          Quantification Engine
        </h3>
        <p className="text-gray-600 mb-6">We've transformed your responsibilities into impactful, metric-driven achievements.</p>
        <div className="space-y-6">
          {report.quantifiedAchievements.map((item, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-gray-50 p-4 rounded-lg">
              <div className="md:col-span-5">
                <p className="font-semibold text-gray-500 text-sm">BEFORE</p>
                <p className="text-gray-700">{item.original}</p>
              </div>
              <div className="hidden md:flex justify-center md:col-span-2">
                <ArrowRightIcon className="w-8 h-8 text-green-500" />
              </div>
               <div className="md:col-span-5">
                <p className="font-semibold text-green-600 text-sm">AFTER (SUGGESTION)</p>
                <p className="font-semibold text-green-800">{item.quantified}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};