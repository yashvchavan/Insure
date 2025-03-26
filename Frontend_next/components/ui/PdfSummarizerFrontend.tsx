import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e:any) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a PDF file first.");
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post("http://localhost:5000/api/policy/upload", formData);
      setResponse(res.data);
    } catch (error) {
      alert("Error uploading file");
    } finally {
      setLoading(false);
    }
  };

  // const handleQuery = async () => {
  //   if (!question) return alert("Please enter a question.");
  //   setLoading(true);
  //   try {
  //     const res = await axios.post("http://localhost:5000/api/policy/query", { question });
  //     setResponse(res.data);
  //   } catch (error) {
  //     alert("Error fetching insights");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleAnalyze = async () => {
    // console.log(formData);
    if (!file) return alert("Please select a PDF file first.");
    setLoading(true);
    const formData = new FormData();
    console.log("form data")
    formData.append("file", file);
    try {
      const res = await axios.post("http://localhost:4000/api/v1/ai-policy/analyze", formData,{
        withCredentials:true
      });
      console.log("Response : ",res);
      setResponse(res.data.data);
    } catch (error) {
      alert("Error analyzing file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-black-100">
      <h1 className="text-2xl font-bold mb-4">Policy Analyzer</h1>
      <input type="file" accept="application/pdf" onChange={handleFileChange} className="mb-4" />
      {/* <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 rounded mb-4" disabled={loading}>
        {loading ? "Uploading..." : "Upload Policy"}
      </button> */}
      {/* <textarea
        placeholder="Ask a question about the policy..."
        className="border p-2 w-full max-w-md mb-4"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      /> */}
      {/* <button onClick={handleQuery} className="bg-green-500 text-white px-4 py-2 rounded mb-4" disabled={loading}>
        {loading ? "Fetching insights..." : "Query Policy"}
      </button> */}
      <button onClick={handleAnalyze} className="bg-purple-500 text-white px-4 py-2 rounded mb-4" disabled={loading}>
        {loading ? "Analyzing..." : "Analyze Policy"}
      </button>
      {response && (
        <pre className="bg-white p-4 border rounded w-full max-w-2xl overflow-auto">
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
    </div>
  );
}
