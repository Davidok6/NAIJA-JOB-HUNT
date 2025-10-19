
import { GoogleGenAI, Type } from '@google/genai';
import type { AnalysisReport } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    atsScore: {
      type: Type.INTEGER,
      description: 'A score from 0 to 100 representing how well the resume is optimized for an Applicant Tracking System (ATS) based on the job description.',
    },
    atsExplanation: {
      type: Type.STRING,
      description: 'A brief, 1-2 sentence explanation for the ATS score, highlighting key strengths or weaknesses.',
    },
    keywordSuggestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'An array of important keywords and phrases from the job description that are missing from the resume.',
    },
    quantifiedAchievements: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          original: {
            type: Type.STRING,
            description: 'The original, vague responsibility statement from the resume.',
          },
          quantified: {
            type: Type.STRING,
            description: 'A rewritten, achievement-oriented version of the statement that includes specific metrics or results.',
          },
        },
        required: ['original', 'quantified'],
      },
      description: 'An array of 3-5 examples where vague resume statements are transformed into quantified, impactful achievements.',
    },
  },
  required: ['atsScore', 'atsExplanation', 'keywordSuggestions', 'quantifiedAchievements'],
};

export async function analyzeResume(resumeText: string, jobDescriptionText: string): Promise<AnalysisReport> {
  const systemInstruction = `You are an expert career coach and professional resume writer. Your task is to analyze a user's resume against a specific job description. Your analysis must be thorough, constructive, and strictly adhere to the provided JSON schema.
  
  Key tasks:
  1.  **ATS Score:** Evaluate the resume's compatibility with Applicant Tracking Systems (ATS). Consider formatting, keywords, and relevance to the job description.
  2.  **Keyword Optimization:** Identify crucial skills and terms from the job description that are absent in the resume.
  3.  **Quantification Engine:** This is the most critical part. Find vague statements about responsibilities and transform them into concrete, quantifiable achievements. For example, change "Managed a team" to "Led a team of 5 engineers to improve system uptime by 15% in Q3." Focus on adding metrics, results, and impact.`;

  const prompt = `
    Please analyze the following resume in the context of the provided job description.

    --- RESUME ---
    ${resumeText}
    --- END RESUME ---

    --- JOB DESCRIPTION ---
    ${jobDescriptionText}
    --- END JOB DESCRIPTION ---

    Provide your analysis in the specified JSON format.
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: analysisSchema,
        temperature: 0.2,
      },
    });

    const jsonText = response.text.trim();
    const result: AnalysisReport = JSON.parse(jsonText);
    return result;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get analysis from Gemini API.");
  }
}

/**
 * Simulates calling Gemini to generate a tailored answer for a complex application form field.
 */
export async function generateAnswerForFormField(resumeText: string, jobTitle: string, company: string): Promise<string> {
  console.log("Simulating Gemini call to generate answer for:", jobTitle, "at", company);
  console.log("Using resume content:", resumeText.substring(0, 100) + "...");
  
  return new Promise(resolve => {
    setTimeout(() => {
      // In a real app, this would be a complex prompt analyzing the resume against the question.
      // Here, we return a plausible, hardcoded response for demonstration.
      const generatedText = `Based on my experience in developing and launching scalable web applications, a particularly challenging and rewarding project was the 'Marketplace Platform Overhaul'. In that role, I led a cross-functional team to migrate a legacy system to a modern microservices architecture using Node.js and React.

We faced significant hurdles with data migration and ensuring zero downtime. By implementing a phased rollout strategy and rigorous automated testing, we successfully completed the project 15% ahead of schedule and improved system performance by 30%. This experience honed my skills in project management, technical problem-solving, and stakeholder communication, which I'm confident would be valuable for the ${jobTitle} role at ${company}.`;
      resolve(generatedText);
    }, 2000); // Simulate a 2-second API call
  });
}