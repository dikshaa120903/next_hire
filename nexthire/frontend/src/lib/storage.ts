/**
 * Safe error message extraction from various error types
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error) {
    return String((error as Record<string, unknown>).message);
  }
  return "An unexpected error occurred";
}

/**
 * Safe JSON parsing with error handling
 */
export function safeJSONParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

/**
 * Safe localStorage getter with validation
 */
export function getStorageItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/**
 * Safe localStorage setter with error handling
 */
export function setStorageItem(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Parse resume ID from localStorage with validation
 */
export function getResumeId(): number | null {
  const resumeId = getStorageItem("resume_id");
  if (!resumeId) return null;
  
  const id = parseInt(resumeId, 10);
  if (isNaN(id) || id <= 0) return null;
  
  return id;
}

/**
 * Parse skills from localStorage with validation
 */
export function getResumeSkills(): string[] {
  const skills = getStorageItem("resume_skills");
  if (!skills) return [];
  
  const parsed = safeJSONParse<Record<string, unknown>>(skills, {});
  if (Array.isArray(parsed?.all)) {
    return parsed.all.filter((s) => typeof s === "string");
  }
  
  return [];
}

/**
 * Get resume text from localStorage
 */
export function getResumeText(): string | null {
  return getStorageItem("resume_text");
}

export const getJobDescription = (): string | null => localStorage.getItem("jobDescription");
export const setJobDescription = (jobDescription: string) => localStorage.setItem("jobDescription", jobDescription);
