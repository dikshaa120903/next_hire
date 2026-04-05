const API_BASE_URL = import.meta.env.PROD ? "" : (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000").replace(/\/+$/, "");
import { getAccessToken } from "./auth";

const apiFetch = async (url: string, options: RequestInit = {}) => {
  const token = getAccessToken();
  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return fetch(url, { ...options, headers });
};

// Response Types
type UploadResumeResponse = {
  resume_id: number;
  extracted_text: string;
  detected_role?: string;
  skills: {
    technical: string[];
    tools: string[];
    soft: string[];
    all: string[];
  };
};

type ScoreBreakdown = {
  skills_count: number;
  projects_count: number;
  experience_years: number;
  keyword_match_percent: number;
};

type ScoreResumeResponse = {
  resume_id: number | null;
  score: number;
  breakdown: ScoreBreakdown;
  features: ScoreBreakdown & { detected_role?: string; missing_keywords?: string[]; matched_keywords_list?: string[] };
};

type JobRecommendation = {
  title: string;
  company: string;
  location: string;
  match_percent: number;
  missing_skills: string[];
  why_recommended: string;
};

type RecommendJobsResponse = {
  recommendations: JobRecommendation[];
};

type ImproveResumeResponse = {
  improved_resume: string;
};

const parseErrorMessage = async (response: Response) => {
  try {
    const data = await response.json();
    if (typeof data?.error === "string") return data.error;
    if (typeof data?.detail === "string") return data.detail;
    const firstKey = data && typeof data === "object" ? Object.keys(data)[0] : null;
    if (firstKey && Array.isArray(data[firstKey]) && data[firstKey][0]) return String(data[firstKey][0]);
    if (firstKey && data[firstKey]) return String(data[firstKey]);
  } catch {
    return `Request failed with status ${response.status}`;
  }
  return `Request failed with status ${response.status}`;
};

export const uploadResume = async (file: File, jobDescription?: string): Promise<UploadResumeResponse> => {
  const url = `${API_BASE_URL}/api/upload-resume/`;
  console.log(`[API] Uploading resume to: ${url}`);
  const formData = new FormData();
  formData.append("file", file);
  if (jobDescription) {
    formData.append("job_description", jobDescription);
  }
  let response;
  try {
    response = await apiFetch(url, {
      method: "POST",
      body: formData,
    });
  } catch (error) {
    throw new Error(`Connection failed. Check if your backend is running at ${API_BASE_URL || window.location.origin}`);
  }
  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }
  return response.json();
};

export const scoreResume = async (resumeId: number): Promise<ScoreResumeResponse> => {
  const response = await apiFetch(`${API_BASE_URL}/api/score-resume/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resume_id: resumeId }),
  });
  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }
  return response.json();
};

export const scoreResumeWithDescription = async (resumeId: number, jobDescription: string): Promise<ScoreResumeResponse> => {
    const response = await apiFetch(`${API_BASE_URL}/api/score-resume/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resume_id: resumeId, job_description: jobDescription }),
    });
    if (!response.ok) {
      throw new Error(await parseErrorMessage(response));
    }
    return response.json();
};

export const recommendJobs = async (resumeId: number): Promise<RecommendJobsResponse> => {
  const response = await apiFetch(`${API_BASE_URL}/api/recommend-jobs-semantic/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resume_id: resumeId }),
  });
  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }
  return response.json();
};

export const improveResume = async (resumeText: string, customPrompt?: string, jobDescription?: string): Promise<ImproveResumeResponse> => {
  const response = await apiFetch(`${API_BASE_URL}/api/improve-resume/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resume_text: resumeText, custom_prompt: customPrompt, job_description: jobDescription }),
  });
  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }
  return response.json();
};

export const updateResumeRole = async (resumeId: number, role: string): Promise<any> => {
  const response = await apiFetch(`${API_BASE_URL}/api/update-resume-role/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resume_id: resumeId, role }),
  });
  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }
  return response.json();
};

export const loginUser = async (credentials: any) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }
  return response.json();
};

export const signupUser = async (userData: any) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/signup/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }
  return response.json();
};
