import React, { useState } from "react";
import "../css/ImageSearch.css";

const ImageSearch = () => {

    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);

    const [results, setResults] = useState([]);

    const [detectedPlate, setDetectedPlate] = useState("");

    const [queryOcrConfidence, setQueryOcrConfidence] =
        useState(null);

    const [searchSessionId, setSearchSessionId] =
        useState(null);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [searched, setSearched] = useState(false);


    // ============================================================
    // FILE SELECTION
    // ============================================================

    const handleFileChange = (event) => {

        const file = event.target.files?.[0];

        if (!file) {
            return;
        }


        if (!file.type.startsWith("image/")) {

            setError(
                "Please select a valid vehicle image."
            );

            return;
        }


        setSelectedFile(file);

        setPreview(
            URL.createObjectURL(file)
        );

        setResults([]);

        setDetectedPlate("");

        setQueryOcrConfidence(null);

        setSearchSessionId(null);

        setSearched(false);

        setError("");
    };


    // ============================================================
    // VEHICLE SEARCH
    // ============================================================

    const handleSearch = async () => {

        if (!selectedFile) {

            setError(
                "Please select a vehicle image first."
            );

            return;
        }

        const storedToken = localStorage.getItem("token");

        console.log(
            "Token exists:",
            !!storedToken
        );

        if (!storedToken) {

            setError(
                "Authentication token not found. Please log in again."
            );

            return;
        }

        setLoading(true);

        setError("");

        setResults([]);

        setDetectedPlate("");

        setQueryOcrConfidence(null);

        setSearchSessionId(null);

        setSearched(false);


        try {

            const formData = new FormData();

            formData.append(
                "file",
                selectedFile
            );


            const response = await fetch(
                "http://localhost:8080/api/vehicle-search/search",
                {
                    method: "POST",

                    headers: {
                        Authorization:
                            `Bearer ${storedToken}`,
                    },

                    body: formData,
                }
            );


            const responseText =
                await response.text();


            console.log(
                "Vehicle search status:",
                response.status
            );

            console.log(
                "Vehicle search raw response:",
                responseText
            );


            if (response.status === 401) {

                throw new Error(
                    "Your session has expired. Please log in again."
                );
            }


            if (response.status === 403) {

                throw new Error(
                    "You do not have permission to perform vehicle search."
                );
            }


            if (!response.ok) {

                throw new Error(
                    responseText ||
                    "Vehicle search failed."
                );
            }


            let data;

            try {

                data = JSON.parse(
                    responseText
                );

            } catch (jsonError) {

                console.error(
                    "Invalid JSON response:",
                    jsonError
                );

                throw new Error(
                    "Backend returned invalid JSON."
                );
            }


            console.log(
                "Vehicle search response:",
                data
            );


            // =====================================================
            // DETECTED PLATE
            // =====================================================

            const plate =
                data.detectedPlate ||
                data.plate ||
                data.recognizedText ||
                "";


            setDetectedPlate(
                plate
            );


            // =====================================================
            // OCR CONFIDENCE
            // =====================================================

            setQueryOcrConfidence(

                data.queryOcrConfidence ??
                data.ocrConfidence ??
                null

            );


            // =====================================================
            // SEARCH SESSION
            // =====================================================

            setSearchSessionId(

                data.searchSessionId ??
                data.sessionId ??
                null

            );


            // =====================================================
            // RESULTS
            // =====================================================

            const backendResults =
                Array.isArray(data.results)
                    ? data.results
                    : [];


            console.log(
                "CCTV matches returned:",
                backendResults
            );


            setResults(
                backendResults
            );


            setSearched(
                true
            );


            // =====================================================
            // STATUS HANDLING
            // =====================================================

            if (
                data.status ===
                "NO_PLATE_DETECTED"
            ) {

                setError(
                    "A number plate could not be recognized from the uploaded image."
                );

            } else if (

                plate &&
                backendResults.length === 0

            ) {

                setError(
                    `Plate ${plate} was detected, but no matching CCTV occurrence was found.`
                );

            }

        } catch (error) {

            console.error(
                "Vehicle search error:",
                error
            );


            setError(
                error.message ||
                "Unable to search the CCTV footage. Please try again."
            );


            setSearched(
                true
            );

        } finally {

            setLoading(
                false
            );

        }
    };


    // ============================================================
    // CLEAR
    // ============================================================

    const handleClear = () => {

        setSelectedFile(
            null
        );

        setPreview(
            null
        );

        setResults(
            []
        );

        setDetectedPlate(
            ""
        );

        setQueryOcrConfidence(
            null
        );

        setSearchSessionId(
            null
        );

        setSearched(
            false
        );

        setError(
            ""
        );


        const input =
            document.getElementById(
                "vehicleSearchImage"
            );


        if (input) {

            input.value = "";

        }
    };


    // ============================================================
    // CONFIDENCE FORMAT
    // ============================================================

    const formatConfidence = (
        value
    ) => {

        if (
            value === null ||
            value === undefined
        ) {

            return "N/A";

        }


        return `${(
            Number(value) * 100
        ).toFixed(2)}%`;
    };


    // ============================================================
    // VIEW MATCH
    // ============================================================

    const handleViewMatch = (
        result
    ) => {

        alert(
            `Vehicle Match

Camera: ${result.cameraName || "N/A"}

Location: ${result.cameraLocation || "N/A"}

Number Plate: ${result.detectedPlate || "N/A"}

Timestamp: ${result.timestamp || "N/A"}

Video: ${result.videoFileName || "N/A"}`
        );
    };


    return (

        <div className="vehicle-search-page">

            <div className="vehicle-search-container">


                {/* ==================================================
                    HEADER
                ================================================== */}

                <div className="vehicle-search-header">

                    <div>

                        <span className="search-eyebrow">
                            CCTV Investigation
                        </span>

                        <h1>
                            Vehicle Search
                        </h1>

                        <p>
                            Upload a suspected vehicle image
                            to search processed CCTV footage
                            for matching number plates.
                        </p>

                    </div>

                </div>


                {/* ==================================================
                    SEARCH CARD
                ================================================== */}

                <div className="vehicle-search-card">


                    {/* ==================================================
                        LEFT - UPLOAD
                    ================================================== */}

                    <div className="vehicle-upload-section">

                        <h2>
                            Search Vehicle
                        </h2>

                        <p className="section-description">
                            Upload an image containing the
                            suspected vehicle.
                        </p>


                        <label
                            htmlFor="vehicleSearchImage"
                            className={`vehicle-upload-area ${selectedFile
                                ? "has-file"
                                : ""
                                }`}
                        >

                            {preview ? (

                                <img
                                    src={preview}
                                    alt="Selected vehicle"
                                    className="vehicle-preview"
                                />

                            ) : (

                                <>
                                    <div className="vehicle-upload-icon">
                                        🚗
                                    </div>

                                    <h3>
                                        Select Vehicle Image
                                    </h3>

                                    <p>
                                        Click here to upload
                                        the suspected vehicle
                                        image.
                                    </p>

                                    <span>
                                        JPG, JPEG, PNG
                                    </span>
                                </>

                            )}


                            <input
                                id="vehicleSearchImage"
                                type="file"
                                accept="image/png,image/jpeg,image/jpg"
                                onChange={
                                    handleFileChange
                                }
                            />

                        </label>


                        {selectedFile && (

                            <div className="selected-search-file">

                                <span>
                                    Selected:
                                </span>

                                <strong>
                                    {selectedFile.name}
                                </strong>

                            </div>

                        )}


                        <div className="search-button-row">

                            <button
                                className="vehicle-search-button"
                                onClick={
                                    handleSearch
                                }
                                disabled={
                                    !selectedFile ||
                                    loading
                                }
                            >

                                {loading ? (

                                    <>
                                        <span className="spinner"></span>
                                        Searching CCTV...
                                    </>

                                ) : (

                                    <>
                                        🔍 Search CCTV
                                    </>
                                )}

                            </button>


                            <button
                                className="vehicle-clear-button"
                                onClick={
                                    handleClear
                                }
                                disabled={
                                    loading
                                }
                            >
                                Clear
                            </button>

                        </div>


                        {error && (

                            <div className="vehicle-search-error">
                                ⚠ {error}
                            </div>

                        )}

                    </div>


                    {/* ==================================================
                        RIGHT - SEARCH INFORMATION
                    ================================================== */}

                    <div className="query-information-section">

                        <h2>
                            Search Information
                        </h2>

                        <p className="section-description">
                            Information extracted from the
                            uploaded vehicle image.
                        </p>


                        {!searched ? (

                            <div className="query-placeholder">

                                <div className="query-placeholder-icon">
                                    🔎
                                </div>

                                <h3>
                                    Ready to search
                                </h3>

                                <p>
                                    Upload a vehicle image
                                    and click "Search CCTV"
                                    to begin the investigation.
                                </p>

                            </div>

                        ) : (

                            <div className="query-information">


                                <div className="query-info-item">

                                    <span>
                                        Detected Number Plate
                                    </span>

                                    <strong className="query-plate">

                                        {detectedPlate ||
                                            "Not recognized"}

                                    </strong>

                                </div>


                                <div className="query-info-item">

                                    <span>
                                        OCR Confidence
                                    </span>

                                    <strong>
                                        {formatConfidence(
                                            queryOcrConfidence
                                        )}
                                    </strong>

                                </div>


                                <div className="query-info-item">

                                    <span>
                                        Search Session
                                    </span>

                                    <strong>

                                        {searchSessionId

                                            ? `#${searchSessionId}`

                                            : "N/A"}

                                    </strong>

                                </div>


                                <div className="query-info-item">

                                    <span>
                                        Matches Found
                                    </span>

                                    <strong>
                                        {results.length}
                                    </strong>

                                </div>

                            </div>

                        )}

                    </div>

                </div>


                {/* ==================================================
                    CCTV RESULTS
                ================================================== */}

                {searched && (

                    <div className="search-results-section">


                        <div className="results-header">

                            <div>

                                <span className="results-eyebrow">
                                    Investigation Results
                                </span>

                                <h2>
                                    CCTV Matches
                                </h2>

                                <p>

                                    {results.length === 0

                                        ? "No matching CCTV occurrence was found."

                                        : `${results.length} matching CCTV occurrence${results.length === 1
                                            ? ""
                                            : "s"
                                        } found.`}

                                </p>

                            </div>

                        </div>


                        {results.length === 0 ? (

                            <div className="no-search-results">

                                <div className="no-results-icon">
                                    📹
                                </div>

                                <h3>
                                    No Matching Vehicle Found
                                </h3>

                                <p>

                                    {detectedPlate

                                        ? `The detected plate ${detectedPlate} was not found in the processed CCTV footage.`

                                        : "The number plate could not be recognized from the uploaded vehicle image."}

                                </p>

                            </div>

                        ) : (

                            <div className="search-results-grid">

                                {results.map(
                                    (result, index) => (

                                        <div
                                            className="search-result-card"
                                            key={
                                                result.id ||
                                                `${result.cameraId}-${result.timestamp}-${index}`
                                            }
                                        >


                                            {/* =========================================
                                                CAMERA HEADER
                                            ========================================== */}

                                            <div className="result-card-header">

                                                <div className="result-camera-icon">
                                                    📹
                                                </div>

                                                <div>

                                                    <h3>
                                                        {
                                                            result.cameraName ||
                                                            "Unknown Camera"
                                                        }
                                                    </h3>

                                                    <p>
                                                        📍{" "}
                                                        {
                                                            result.cameraLocation ||
                                                            result.location ||
                                                            "Location unavailable"
                                                        }
                                                    </p>

                                                </div>

                                            </div>


                                            {/* =========================================
                                                DETAILS
                                            ========================================== */}

                                            <div className="result-details">


                                                <div className="result-detail">

                                                    <span>
                                                        Number Plate
                                                    </span>

                                                    <strong className="result-plate">

                                                        {
                                                            result.detectedPlate ||
                                                            result.plate ||
                                                            "N/A"
                                                        }

                                                    </strong>

                                                </div>


                                                <div className="result-detail">

                                                    <span>
                                                        Timestamp
                                                    </span>

                                                    <strong>

                                                        ⏱{" "}

                                                        {
                                                            result.timestamp ||
                                                            "N/A"
                                                        }

                                                    </strong>

                                                </div>


                                                <div className="result-detail">

                                                    <span>
                                                        Detection Confidence
                                                    </span>

                                                    <strong>

                                                        {formatConfidence(
                                                            result.plateConfidence ??
                                                            result.confidence
                                                        )}

                                                    </strong>

                                                </div>


                                                <div className="result-detail">

                                                    <span>
                                                        OCR Confidence
                                                    </span>

                                                    <strong>

                                                        {formatConfidence(
                                                            result.ocrConfidence
                                                        )}

                                                    </strong>

                                                </div>


                                                <div className="result-detail">

                                                    <span>
                                                        Match Confidence
                                                    </span>

                                                    <strong className="match-confidence">

                                                        {formatConfidence(
                                                            result.matchConfidence
                                                        )}

                                                    </strong>

                                                </div>


                                                <div className="result-detail">

                                                    <span>
                                                        Video
                                                    </span>

                                                    <strong className="video-name">

                                                        {
                                                            result.videoFileName ||
                                                            result.fileName ||
                                                            "N/A"
                                                        }

                                                    </strong>

                                                </div>

                                            </div>


                                            {/* =========================================
                                                FOOTER
                                            ========================================== */}

                                            <div className="result-card-footer">

                                                <span className="match-badge">
                                                    ✓ Plate Match
                                                </span>


                                                <button
                                                    className="view-result-button"
                                                    onClick={() =>
                                                        handleViewMatch(
                                                            result
                                                        )
                                                    }
                                                >
                                                    View Match
                                                </button>

                                            </div>


                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </div>

                )}

            </div>

        </div>

    );

};


export default ImageSearch;