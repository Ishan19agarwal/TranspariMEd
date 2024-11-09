import React, { useState, useRef } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [image, setImage] = useState(null);
  const [resultText, setResultText] = useState("");
  const [limeImage, setLimeImage] = useState(null);
  const [shapImage, setShapImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  const handleImageUpload = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!image) return alert("Please upload an image first.");

    setLoading(true);
    setTimeout(() => {
      setResultText("Cancer detected");
      setLimeImage("https://via.placeholder.com/300?text=LIME+Explanation");
      setShapImage("https://via.placeholder.com/300?text=SHAP+Explanation");
      setLoading(false);
    }, 2000);
  };

  const handleReset = () => {
    setImage(null);
    setResultText("");
    setLimeImage(null);
    setShapImage(null);
    setLoading(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className='App'>
      <h1>TranspariMed - Melanoma Detection</h1>
      <form onSubmit={handleSubmit}>
        <input
          type='file'
          accept='image/*'
          onChange={handleImageUpload}
          ref={fileInputRef}
        />
        <button type='submit' disabled={loading}>
          {loading ? "Processing..." : "Upload and Predict"}
        </button>
      </form>
      <button onClick={handleReset}>Reset</button>

      {resultText && (
        <div className='result-section'>
          <h2>Diagnosis Result:</h2>
          <p>{resultText}</p>
        </div>
      )}

      {limeImage && shapImage && (
        <div className='explanation-section'>
          <h2>XAI Explanations</h2>
          <div className='explanation-section1'>
            <div className='explanation'>
              <img src={limeImage} alt='LIME Explanation' />
            </div>
            <div className='explanation'>
              <img src={shapImage} alt='SHAP Explanation' />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
