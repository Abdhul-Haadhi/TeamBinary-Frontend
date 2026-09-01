import React, { useState } from "react";
import "../css/VehicleClassification.css";
import axios from "axios";

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

    const classifyVehicle = async () => {

        if (!selectedImage) {
            alert("Please upload a vehicle image.");
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append("image", selectedImage);

        try {

            const response = await axios.post(
                "http://localhost:8080/api/vehicle/classify",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            setResult(response.data);

        } catch (error) {

            console.error(error);

            alert("Vehicle classification failed.");

        } finally {

            setLoading(false);

        }

    };

    const resetForm = () => {

        setSelectedImage(null);
        setPreview(null);
        setResult(null);

        document.getElementById("upload-image").value = "";

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
                            <strong>{result.detectedTime}</strong>
                        </div>

                    </div>
                )}

            </div>

        </div>
    );
};

export default VehicleClassification;