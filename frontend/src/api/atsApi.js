const BASE_URL = import.meta.env.PROD
  ? import.meta.env.VITE_API_BASE_URL
  : "/api";

export async function atsMatch({ resumeText, jobDescription, jobRole }) {
  const response = await fetch(`${BASE_URL}/ats-match`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      resume_text: resumeText,
      job_description: jobDescription,
      job_role: jobRole,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "ATS match request failed");
  }

  return response.json();
}

export async function uploadResume(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${BASE_URL}/upload-resume`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Resume upload failed");
  }

  return response.json();
}
