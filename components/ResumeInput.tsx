import React, { useState, useCallback, useRef } from 'react';
import { DocumentTextIcon, CloudArrowUpIcon } from './icons';

// Make mammoth and pdfjsLib available from the window object
declare const mammoth: any;
declare const pdfjsLib: any;

interface ResumeInputProps {
  value: string;
  onChange: (value: string) => void;
  onFileError: (message: string) => void;
}

export const ResumeInput: React.FC<ResumeInputProps> = ({ value, onChange, onFileError }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parsePdf = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    let textContent = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const text = await page.getTextContent();
      textContent += text.items.map((item: any) => item.str).join(' ');
      textContent += '\n'; // Add newline for each page
    }
    return textContent;
  };

  const parseDocx = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  };

  const handleFile = useCallback(async (file: File | null) => {
    if (!file) return;

    onFileError(''); // Clear previous errors
    try {
      let text = '';
      if (file.type === 'application/pdf') {
        text = await parsePdf(file);
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name.endsWith('.docx')) {
        text = await parseDocx(file);
      } else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        text = await file.text();
      }
      else {
        onFileError('Unsupported file type. Please upload a PDF, DOCX, or TXT file.');
        return;
      }
      onChange(text);
    } catch (error) {
      console.error('Error processing file:', error);
      onFileError('Could not read the resume file. It might be corrupted or in an unsupported format.');
    }
  }, [onChange, onFileError]);


  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const onUploadClick = () => {
    fileInputRef.current?.click();
  };


  return (
    <div 
      className="bg-white p-6 rounded-lg shadow-lg"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
        <DocumentTextIcon className="w-7 h-7 mr-3 text-green-500" />
        Your Resume
      </h2>
      <div className="relative">
         {isDragging && (
          <div className="absolute inset-0 bg-green-100 bg-opacity-80 border-2 border-dashed border-green-500 rounded-md flex flex-col items-center justify-center z-10 pointer-events-none">
            <CloudArrowUpIcon className="w-16 h-16 text-green-600" />
            <p className="text-lg font-semibold text-green-700 mt-2">Drop your resume here</p>
          </div>
        )}
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste your full resume here, or click below to upload a file..."
          className="w-full h-96 p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-shadow duration-200 resize-none"
        />
         <div className="absolute bottom-4 right-4">
           <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".pdf,.docx,.txt"
              className="hidden"
            />
            <button 
              onClick={onUploadClick}
              className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 font-semibold text-sm rounded-md border border-gray-300 hover:bg-gray-200 transition-colors"
            >
              <CloudArrowUpIcon className="w-5 h-5 mr-2" />
              Upload File
            </button>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2 text-center">Supported formats: PDF, DOCX, TXT</p>
    </div>
  );
};