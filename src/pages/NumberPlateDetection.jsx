import React, { useState } from "react";
import "../css/NumberPlateDetection.css";

const NumberPlateDetection = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [resultImage, setResultImage] = useState(null);
    const [detections, setDetections] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        if (!file) return;

        setSelectedFile(file);
        setError("");
        setResultImage(null);
        setDetections([]);

        const imageUrl = URL.createObjectURL(file);
        setPreview(imageUrl);
    };

    const handleDetect = async () => {

        if (!selectedFile) {
            setError("Please select an image first.");
            return;
        }

        setLoading(true);
        setError("");
        setResultImage(null);
        setDetections([]);

        try {

            const formData = new FormData();

            formData.append("file", selectedFile);

            const response = await fetch(
                "http://localhost:8080/api/number-plate/detect",
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (!response.ok) {

                const errorText = await response.text();

                console.error(
                    "Backend error:",
                    errorText
                );

                throw new Error(
                    "Number plate detection failed."
                );
            }

            const data = await response.json();
            console.log("Backend response:", data);
            setDetections(data.detections || []);
            console.log("Saved Detection Session ID:", data.sessionId);

            setResultImage(
                data.image || null
            );

            setDetections(
                data.detections || []
            );

        } catch (err) {

            console.error(
                "Detection error:",
                err
            );

            setError(
                "Unable to process the image. Something went wrong..."
            );

        } finally {

            setLoading(false);

        }
    };

    const handleClear = () => {
        setSelectedFile(null);
        setPreview(null);
        setResultImage(null);
        setDetections([]);
        setError("");

        const fileInput = document.getElementById("numberPlateImage");
        if (fileInput) {
            fileInput.value = "";
        }
    };

    return (
        <div className="number-plate-page">

            <div className="number-plate-container">

                <div className="page-header">
                    <h1>Number Plate Detection</h1>
                    <p>
                        Upload a vehicle image to detect by the number plate.
                    </p>
                </div>

                {/* Upload Section */}
                <div className="upload-card">

                    <label htmlFor="numberPlateImage" className="upload-area">

                        <div className="upload-icon">
                            📷
                        </div>

                        <h3>Select Vehicle Image</h3>

                        <p>
                            Click here to select an image containing a vehicle
                        </p>

                        <span className="supported-formats">
                            JPG, JPEG, PNG
                        </span>

                        <input
                            id="numberPlateImage"
                            type="file"
                            accept="image/png,image/jpeg,image/jpg"
                            onChange={handleFileChange}
                        />

                    </label>

                    {selectedFile && (
                        <div className="selected-file">
                            <span>
                                Selected: <strong>{selectedFile.name}</strong>
                            </span>
                        </div>
                    )}

                    <div className="button-container">

                        <button
                            className="detect-button"
                            onClick={handleDetect}
                            disabled={!selectedFile || loading}
                        >
                            {loading ? "Detecting..." : "Detect Number Plate"}
                        </button>

                        <button
                            className="clear-button"
                            onClick={handleClear}
                            disabled={loading}
                        >
                            Clear
                        </button>

                    </div>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                </div>

                {/* Image Results */}
                {(preview || resultImage) && (
                    <div className="results-section">

                        <div className="image-card">

                            <h2>Detection Result</h2>

                            <div className="image-container">

                                <img
                                    src={resultImage || preview}
                                    alt="Number plate detection result"
                                />

                            </div>

                        </div>

                        {/* Detection Information */}
                        <div className="detection-card">

                            <h2>Detected Objects</h2>

                            {detections.length === 0 ? (

                                <div className="no-detection">
                                    <div className="no-detection-icon">
                                        🔍
                                    </div>

                                    <p>No number plate detected.</p>
                                </div>

                            ) : (

                                <div className="detection-list">

                                    {detections.map((detection, index) => (

                                        <div
                                            className="detection-item"
                                            key={index}
                                        >

                                            <div className="detection-title">
                                                <span className="status-dot"></span>

                                                <strong>
                                                    {detection.className || "Number Plate"}
                                                </strong>
                                            </div>

                                            <div className="detection-details">

                                                {/* YOLO Confidence */}
                                                <div>
                                                    <span>Detection Confidence</span>

                                                    <strong>
                                                        {(detection.confidence * 100).toFixed(2)}%
                                                    </strong>
                                                </div>


                                                {/* OCR Result */}
                                                <div>
                                                    <span>Number Plate</span>

                                                    <strong className="plate-number">
                                                        {detection.recognizedText
                                                            ? detection.recognizedText
                                                            : "Not recognized"}
                                                    </strong>
                                                </div>


                                                {/* OCR Confidence */}
                                                <div>
                                                    <span>OCR Confidence</span>

                                                    <strong>
                                                        {detection.ocrConfidence !== undefined
                                                            ? (detection.ocrConfidence * 100).toFixed(2) + "%"
                                                            : "N/A"}
                                                    </strong>
                                                </div>


                                                {/* Position */}
                                                <div>
                                                    <span>Position</span>

                                                    <strong>
                                                        {detection.x1}, {detection.y1}
                                                    </strong>
                                                </div>

                                            </div>

                                        </div>

                                    ))}

                                </div>

                            )}

                        </div>

                    </div>
                )}

            </div>

        </div>
    );
};

export default NumberPlateDetection;