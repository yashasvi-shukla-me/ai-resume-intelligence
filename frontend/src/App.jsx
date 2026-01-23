import { useState } from "react";
import { atsMatch, uploadResume } from "./api/atsApi";

function App() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobRole, setJobRole] = useState("backend_engineer");

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleAnalyze() {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await atsMatch({
        resumeText,
        jobDescription,
        jobRole,
      });
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-6">AI Resume Intelligence</h1>

        <label className="block font-semibold mb-2">Upload Resume (PDF)</label>

        <input
          type="file"
          accept=".pdf"
          className="mb-4"
          onChange={async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            try {
              setLoading(true);
              const data = await uploadResume(file);

              // Combine extracted skills text into a single string
              const extractedText = Object.values(data.extracted_skills)
                .flat()
                .join(" ");

              setResumeText(extractedText);
            } catch (err) {
              setError(err.message);
            } finally {
              setLoading(false);
            }
          }}
        />

        {/* Job Description */}
        <label className="block font-semibold mb-2">Job Description</label>
        <textarea
          className="w-full border rounded p-2 mb-4"
          rows={6}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />

        {/* Role Selector */}
        <label className="block font-semibold mb-2">Target Role</label>
        <select
          className="border rounded p-2 mb-6"
          value={jobRole}
          onChange={(e) => setJobRole(e.target.value)}
        >
          <option value="backend_engineer">Backend Engineer</option>
          <option value="ml_engineer">ML Engineer</option>
          <option value="frontend_engineer">Frontend Engineer</option>
        </select>

        {/* Action Button */}
        <div>
          <button
            onClick={handleAnalyze}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Analyze Resume"}
          </button>
        </div>

        {/* Error */}
        {error && <p className="text-red-600 mt-4">Error: {error}</p>}

        {/* Results */}
        {result && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">ATS Result</h2>

            <div className="mb-6 p-4 rounded bg-blue-50 border border-blue-200">
              <p className="text-sm text-gray-600">ATS Match Score</p>
              <p className="text-4xl font-bold text-blue-700">
                {result.analysis.ats_score}%
              </p>
            </div>

            <div className="mb-4">
              <strong>Matched Skills</strong>
              <div className="flex flex-wrap gap-2 mt-2">
                {Object.values(result.analysis.matched_skills)
                  .flat()
                  .map((skill, i) => (
                    <span
                      key={i}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
              </div>
            </div>

            <div className="mb-4">
              <strong>Missing Skills</strong>
              <div className="flex flex-wrap gap-2 mt-2">
                {Object.values(result.analysis.missing_skills)
                  .flat()
                  .map((skill, i) => (
                    <span
                      key={i}
                      className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
              </div>
            </div>

            <div className="mt-6">
              <strong>Feedback</strong>
              <ul className="list-disc list-inside mt-2 text-gray-700">
                {result.feedback.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
