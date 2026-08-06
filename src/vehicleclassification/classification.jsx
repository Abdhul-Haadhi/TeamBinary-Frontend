import React, { useState } from "react";
import "./VehicleClassification.css";

const VehicleClassification = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setSelectedImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
  };

  const classifyVehicle = () => {
    if (!selectedImage) {
      alert("Please upload a vehicle image.");
      return;
    }

    setLoading(true);

    // Dummy Prediction
    setTimeout(() => {
      const predictions = [
        {
          vehicleType: "Car",
          confidence: "97.8%",
          camera: "Camera 01",
          time: "10:25 AM",
        },
        {
          vehicleType: "Bus",
          confidence: "95.4%",
          camera: "Camera 03",
          time: "11:42 AM",
        },
        {
          vehicleType: "Van",
          confidence: "96.1%",
          camera: "Camera 02",
          time: "01:15 PM",
        },
        {
          vehicleType: "Lorry",
          confidence: "94.8%",
          camera: "Camera 04",
          time: "03:20 PM",
        },
        {
          vehicleType: "Motorcycle",
          confidence: "98.2%",
          camera: "Camera 05",
          time: "05:10 PM",
        },
        {
          vehicleType: "Three Wheeler",
          confidence: "96.7%",
          camera: "Camera 06",
          time: "07:30 PM",
        },
      ];

      const randomPrediction =
        predictions[Math.floor(Math.random() * predictions.length)];

      setResult(randomPrediction);
      setLoading(false);
    }, 2500);
  };

  const resetForm = () => {
    setSelectedImage(null);
    setPreview(null);
    setResult(null);
  };

  return (
    <div className="classification-container">

      <div className="classification-card">

        <h1>Vehicle Classification</h1>

        <p className="subtitle">
          Upload a vehicle image to classify its type.
        </p>

        <div className="upload-section">

          <input
            type="file"
            accept="image/*"
            id="upload-image"
            onChange={handleImageChange}
            hidden
          />

          <label htmlFor="upload-image" className="upload-btn">
            Choose Image
          </label>

        </div>

        {preview && (
          <div className="preview-section">
            <img src={preview} alt="preview" />
          </div>
        )}

        <div className="button-group">

          <button
            className="classify-btn"
            onClick={classifyVehicle}
          >
            Classify Vehicle
          </button>

          <button
            className="reset-btn"
            onClick={resetForm}
          >
            Reset
          </button>

        </div>

        {loading && (
          <div className="loading-section">

            <div className="spinner"></div>

            <p>Classifying vehicle...</p>

          </div>
        )}

        {result && (
          <div className="result-card">

            <h2>Prediction Result</h2>

            <div className="result-row">
              <span>Vehicle Type</span>
              <strong>{result.vehicleType}</strong>
            </div>

            <div className="result-row">
              <span>Confidence</span>
              <strong>{result.confidence}</strong>
            </div>

            <div className="result-row">
              <span>Camera</span>
              <strong>{result.camera}</strong>
            </div>

            <div className="result-row">
              <span>Detected Time</span>
              <strong>{result.time}</strong>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};

export default VehicleClassification;