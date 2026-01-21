const BASE_URL = "https://ai-resume-intelligence-1kzv.onrender.com";

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
