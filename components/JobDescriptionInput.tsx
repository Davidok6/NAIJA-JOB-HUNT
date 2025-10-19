import React from 'react';
import { BriefcaseIcon } from './icons';

interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const JobDescriptionInput: React.FC<JobDescriptionInputProps> = ({ value, onChange }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
        <BriefcaseIcon className="w-7 h-7 mr-3 text-green-500" />
        Target Job Description
      </h2>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste the job description here..."
        className="w-full h-96 p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-shadow duration-200 resize-none"
      />
    </div>
  );
};