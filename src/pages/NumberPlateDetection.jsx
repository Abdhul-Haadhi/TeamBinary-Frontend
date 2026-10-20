import React, { useState } from "react";
import "../css/NumberPlateDetection.css";

const NumberPlateDetection = () => {

    const [selectedFile, setSelectedFile] =
        useState(null);

    const [preview, setPreview] =
        useState(null);

    const [resultImage, setResultImage] =
        useState(null);

    const [detections, setDetections] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    // =========================================================
    // FILE SELECTION
    // =========================================================

    const handleFileChange = (event) => {

        const file =
            event.target.files?.[0];

        if (!file) {
            return;
        }


        setSelectedFile(file);

        setError("");

        setResultImage(null);

        setDetections([]);


        const imageUrl =
            URL.createObjectURL(file);

        setPreview(imageUrl);
    };


    // =========================================================
    // DETECT NUMBER PLATE
    // =========================================================

    const handleDetect = async () => {

        if (!selectedFile) {

            setError(
                "Please select an image first."
            );

            return;
        }


        // -----------------------------------------------------
        // GET JWT
        // -----------------------------------------------------

        const token =
            localStorage.getItem("token");


        if (!token) {

            setError(
                "Authentication token not found. Please login again."
            );

            return;
        }


        // -----------------------------------------------------
        // START LOADING
        // -----------------------------------------------------

        setLoading(true);

        setError("");

        setResultImage(null);

        setDetections([]);


        try {

            // -------------------------------------------------
            // CREATE MULTIPART FORM
            // -------------------------------------------------

            const formData =
                new FormData();


            formData.append(
                "file",
                selectedFile
            );


            // -------------------------------------------------
            // SEND REQUEST TO SPRING BOOT
            // -------------------------------------------------

            const response =
                await fetch(
                    "http://localhost:8080/api/number-plate/detect",
                    {
                        method: "POST",

                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },

                        body: formData,
                    }
                );


            // -------------------------------------------------
            // ERROR HANDLING
            // -------------------------------------------------

            if (!response.ok) {

                const errorText =
                    await response.text();


                console.error(
                    "Backend error:",
                    response.status,
                    errorText
                );


                if (response.status === 401) {

                    throw new Error(
                        "Authentication failed. Please login again."
                    );
                }


                if (response.status === 403) {

                    throw new Error(
                        "You are not authorized to use number plate detection."
                    );
                }


                throw new Error(
                    `Number plate detection failed. Server returned ${response.status}`
                );
            }


            // -------------------------------------------------
            // READ RESPONSE
            // -------------------------------------------------

            const data =
                await response.json();


            console.log(
                "Backend response:",
                data
            );


            // -------------------------------------------------
            // APPLICATION-LEVEL ERROR
            // -------------------------------------------------

            if (!data.success) {

                throw new Error(
                    data.message ||
                    "Number plate detection failed."
                );
            }


            // -------------------------------------------------
            // SESSION ID
            // -------------------------------------------------

            console.log(
                "Saved Detection Session ID:",
                data.sessionId
            );


            // -------------------------------------------------
            // RESULT IMAGE
            // -------------------------------------------------

            setResultImage(
                data.image || null
            );


            // -------------------------------------------------
            // DETECTIONS
            // -------------------------------------------------

            setDetections(
                data.detections || []
            );


        } catch (err) {

            console.error(
                "Detection error:",
                err
            );


            setError(
                err.message ||
                "Unable to process the image. Something went wrong."
            );


        } finally {

            setLoading(false);
        }
    };


    // =========================================================
    // CLEAR
    // =========================================================

    const handleClear = () => {

        setSelectedFile(null);

        setPreview(null);

        setResultImage(null);

        setDetections([]);

        setError("");


        const fileInput =
            document.getElementById(
                "numberPlateImage"
            );


        if (fileInput) {

            fileInput.value = "";
        }
    };


    // =========================================================
    // UI
    // =========================================================

    return (

        <div className="number-plate-page">

            <div className="number-plate-container">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="page-header">

                    <h1>
                        Number Plate Detection
                    </h1>

                    <p>
                        Upload a vehicle image to detect by the number plate.
                    </p>

                </div>


                {/* =================================================
                    UPLOAD SECTION
                ================================================= */}

                <div className="upload-card">

                    <label
                        htmlFor="numberPlateImage"
                        className="upload-area"
                    >

                        <div className="upload-icon">
                            📷
                        </div>


                        <h3>
                            Select Vehicle Image
                        </h3>


                        <p>
                            Click here to select an image
                            containing a vehicle
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


                    {/* Selected file */}

                    {selectedFile && (

                        <div className="selected-file">

                            <span>
                                Selected:{" "}
                                <strong>
                                    {selectedFile.name}
                                </strong>
                            </span>

                        </div>

                    )}


                    {/* Buttons */}

                    <div className="button-container">

                        <button
                            className="detect-button"
                            onClick={handleDetect}
                            disabled={
                                !selectedFile ||
                                loading
                            }
                        >
                            {loading
                                ? "Detecting..."
                                : "Detect Number Plate"}
                        </button>


                        <button
                            className="clear-button"
                            onClick={handleClear}
                            disabled={loading}
                        >
                            Clear
                        </button>

                    </div>


                    {/* Error */}

                    {error && (

                        <div className="error-message">

                            {error}

                        </div>

                    )}

                </div>


                {/* =================================================
                    RESULTS
                ================================================= */}

                {(preview || resultImage) && (

                    <div className="results-section">


                        {/* =================================================
                            IMAGE RESULT
                        ================================================= */}

                        <div className="image-card">

                            <h2>
                                Detection Result
                            </h2>


                            <div className="image-container">

                                <img
                                    src={
                                        resultImage ||
                                        preview
                                    }
                                    alt="Number plate detection result"
                                />

                            </div>

                        </div>


                        {/* =================================================
                            DETECTION INFORMATION
                        ================================================= */}

                        <div className="detection-card">

                            <h2>
                                Detected Objects
                            </h2>


                            {detections.length === 0 ? (

                                <div className="no-detection">

                                    <div className="no-detection-icon">
                                        🔍
                                    </div>


                                    <p>
                                        No number plate detected.
                                    </p>

                                </div>

                            ) : (

                                <div className="detection-list">


                                    {detections.map(
                                        (
                                            detection,
                                            index
                                        ) => (

                                            <div
                                                className="detection-item"
                                                key={index}
                                            >


                                                {/* Title */}

                                                <div className="detection-title">

                                                    <span className="status-dot"></span>


                                                    <strong>

                                                        {
                                                            detection.className ||
                                                            "Number Plate"
                                                        }

                                                    </strong>

                                                </div>


                                                <div className="detection-details">


                                                    {/* =================================================
                                                        YOLO CONFIDENCE
                                                    ================================================= */}

                                                    <div>

                                                        <span>
                                                            Detection Confidence
                                                        </span>


                                                        <strong>

                                                            {
                                                                detection.confidence !==
                                                                    undefined
                                                                    ? (
                                                                        Number(
                                                                            detection.confidence
                                                                        ) * 100
                                                                    ).toFixed(2) + "%"
                                                                    : "N/A"
                                                            }

                                                        </strong>

                                                    </div>


                                                    {/* =================================================
                                                        NUMBER PLATE
                                                    ================================================= */}

                                                    <div>

                                                        <span>
                                                            Number Plate
                                                        </span>


                                                        <strong className="plate-number">

                                                            {
                                                                detection.recognizedText
                                                                    ? detection.recognizedText
                                                                    : "Not recognized"
                                                            }

                                                        </strong>

                                                    </div>


                                                    {/* =================================================
                                                        OCR CONFIDENCE
                                                    ================================================= */}

                                                    <div>

                                                        <span>
                                                            OCR Confidence
                                                        </span>


                                                        <strong>

                                                            {
                                                                detection.ocrConfidence !==
                                                                    undefined
                                                                    ? (
                                                                        Number(
                                                                            detection.ocrConfidence
                                                                        ) * 100
                                                                    ).toFixed(2) + "%"
                                                                    : "N/A"
                                                            }

                                                        </strong>

                                                    </div>


                                                    {/* =================================================
                                                        POSITION
                                                    ================================================= */}

                                                    <div>

                                                        <span>
                                                            Position
                                                        </span>


                                                        <strong>

                                                            {
                                                                detection.x1 ??
                                                                "N/A"
                                                            }
                                                            ,{" "}
                                                            {
                                                                detection.y1 ??
                                                                "N/A"
                                                            }

                                                        </strong>

                                                    </div>


                                                </div>

                                            </div>

                                        )
                                    )}

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