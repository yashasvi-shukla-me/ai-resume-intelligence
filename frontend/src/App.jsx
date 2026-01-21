import { useState } from "react";
import { atsMatch } from "./api/atsApi";

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleTest() {
    setLoading(true);
    setError(null);

    try {
      const data = await atsMatch({
        resumeText: "Python, SQL, Machine Learning",
        jobDescription: "Python, Java, SQL, Docker",
        jobRole: "backend_engineer",
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
      <h1 className="text-2xl font-bold mb-4">
        AI Resume Intelligence - API Test
      </h1>

      <button
        onClick={handleTest}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Test ATS Match API
      </button>

      {loading && <p className="mt-4">Loading...</p>}

      {error && <p className="mt-4 text-red-600">Error: {error}</p>}

      {result && (
        <pre className="mt-4 bg-white p-4 rounded text-sm overflow-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default App;
