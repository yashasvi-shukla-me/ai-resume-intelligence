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
    if (!resumeText || !jobDescription) {
      setError("Please upload a resume and provide a job description.");
      return;
    }

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
    <div className="min-h-screen bg-gray-950 text-slate-100 font-mono">
      <div className="max-w-6xl mx-auto p-8 space-y-10">
        {/* HEADER */}
        <div className="border border-blue-500/30 rounded-lg bg-gray-900 p-6 shadow-lg">
          <h1 className="text-3xl text-blue-400 tracking-widest">
            TALENTFORGE SYSTEM
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            AI Resume Intelligence · ATS Scoring Engine · Role Aware Matching
          </p>
        </div>

        {/* INPUT GRID */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* LEFT */}
          <div className="border border-gray-700 rounded-lg bg-gray-900 p-6 space-y-5">
            <p className="text-blue-400 text-xs tracking-widest">
              MODULE 01 - RESUME INPUT
            </p>

            <label className="flex justify-between items-center border border-gray-600 bg-gray-800 rounded px-4 py-3 cursor-pointer hover:border-blue-500">
              <span className="text-sm text-slate-300">
                Upload Resume (.pdf)
              </span>
              <span className="text-blue-400 text-xs">BROWSE</span>

              <input
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (!file) return;

                  try {
                    setLoading(true);
                    const data = await uploadResume(file);

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
            </label>

            {resumeText && (
              <p className="text-green-400 text-xs">
                Resume parsed successfully
              </p>
            )}
          </div>

          {/* RIGHT */}
          <div className="border border-gray-700 rounded-lg bg-gray-900 p-6 space-y-5">
            <p className="text-blue-400 text-xs tracking-widest">
              MODULE 02 - JOB SPECIFICATION
            </p>

            <textarea
              className="w-full h-40 bg-gray-800 border border-gray-600 rounded p-3 text-sm focus:outline-none focus:border-blue-500"
              placeholder="Paste job description..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />

            <select
              className="w-full bg-gray-800 border border-gray-600 rounded p-2 focus:outline-none focus:border-blue-500"
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
            >
              <option value="backend_engineer">Backend Engineer</option>
              <option value="ml_engineer">ML Engineer</option>
              <option value="frontend_engineer">Frontend Engineer</option>
            </select>
          </div>
        </div>

        {/* ACTION */}
        <div className="flex justify-center">
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="px-10 py-3 border border-blue-500 text-blue-400 rounded hover:bg-blue-500/10 disabled:opacity-40"
          >
            {loading ? "PROCESSING..." : "RUN ANALYSIS"}
          </button>
        </div>

        {error && <p className="text-red-400 text-center">{error}</p>}

        {/* RESULTS */}
        {result && (
          <div className="border border-gray-700 rounded-lg bg-gray-900 p-8 space-y-8">
            <p className="text-blue-400 text-xs tracking-widest">
              ANALYSIS OUTPUT
            </p>

            <div className="text-center">
              <p className="text-xs text-slate-400">ATS SCORE</p>
              <p className="text-6xl text-blue-400 font-bold">
                {result.analysis.ats_score}%
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-green-400 mb-2">Matched Skills</p>
                <div className="flex flex-wrap gap-2">
                  {Object.values(result.analysis.matched_skills)
                    .flat()
                    .map((s, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-1 border border-green-600 rounded text-green-400"
                      >
                        {s}
                      </span>
                    ))}
                </div>
              </div>

              <div>
                <p className="text-red-400 mb-2">Missing Skills</p>
                <div className="flex flex-wrap gap-2">
                  {Object.values(result.analysis.missing_skills)
                    .flat()
                    .map((s, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-1 border border-red-600 rounded text-red-400"
                      >
                        {s}
                      </span>
                    ))}
                </div>
              </div>
            </div>

            <div className="border border-gray-700 rounded bg-gray-800 p-4">
              <p className="text-slate-400 text-xs mb-2">System Feedback</p>
              <ul className="space-y-1 text-sm">
                {result.feedback.map((f, i) => (
                  <li key={i}>• {f}</li>
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
