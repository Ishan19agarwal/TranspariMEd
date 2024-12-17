import React, { useState, useRef } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [image, setImage] = useState(null);
  const [resultText, setResultText] = useState("");
  const [textualReasons, setTextualReasons] = useState("");
  const [plotUrl, setPlotUrl] = useState(null);
  const [limeExplanationUrl, setLimeExplanationUrl] = useState(null);
  const [gradcamUrl, setGradcamUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const fileInputRef = useRef(null);

  const handleImageUpload = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!image) return alert("Please upload an image first.");

    setLoading(true);

    const formData = new FormData();
    formData.append("file", image);

    try {
      const response = await axios.post("http://127.0.0.1:5000/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { result, textual_reasons, plot_url, lime_explanation_url, gradcam_url } = response.data;

      setResultText(result);
      setTextualReasons(textual_reasons);
      setPlotUrl(`http://127.0.0.1:5000/${plot_url}`);
      setLimeExplanationUrl(`http://127.0.0.1:5000/${lime_explanation_url}`);
      setGradcamUrl(`http://127.0.0.1:5000/${gradcam_url}`);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("There was an error processing the image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImage(null);
    setResultText("");
    setTextualReasons("");
    setPlotUrl(null);
    setLimeExplanationUrl(null);
    setGradcamUrl(null);
    setLoading(false);
    fileInputRef.current.value = "";
  };

  return (
    <div className="App">
      <h1>TranspariMed - Melanoma Detection</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleImageUpload} ref={fileInputRef} />
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Upload and Predict"}
        </button>
      </form>
      <button onClick={handleReset}>Reset</button>

      {resultText && (
        <div className="result-section">
          <h2>Diagnosis Result</h2>
          <p>{resultText}</p>
          <button onClick={() => setShowModal(true)}>View Textual Reasons</button>
        </div>
      )}

{showModal && (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2>Textual Reasons</h2>
      <ul>
        {textualReasons
          .split(/Feature \d+:/) // Split based on "Feature X:"
          .filter((reason) => reason.trim() !== "") // Remove empty strings
          .map((reason, index) => (
            <li key={index}>Feature {index + 1}: {reason.trim()}</li>
          ))}
      </ul>
      <button className="close-button" onClick={() => setShowModal(false)}>
        Close
      </button>
    </div>
  </div>
)}


      <div className="plot-section">
            {(plotUrl || limeExplanationUrl || gradcamUrl) && (
          <div className="image-container">
          {plotUrl && (
            <div>
              <h2>Original Image</h2>
              <img src={plotUrl} alt="Original Image" />
            </div>
          )}
          {limeExplanationUrl && (
            <div>
              <h2>LIME Explanation</h2>
              <img src={limeExplanationUrl} alt="LIME Explanation" />
            </div>
          )}
          {gradcamUrl && (
            <div>
              <h2>Grad-CAM Heatmap</h2>
              <img src={gradcamUrl} alt="Grad-CAM Heatmap" />
            </div>
          )}
          </div>
          )}

      </div>
    </div>
  );
}

export default App;
