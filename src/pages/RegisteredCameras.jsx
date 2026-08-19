import React, { useRef, useState, useEffect } from "react";
import "../css/RegisteredCameras.css";


const RegisteredCameras = () => {
    const fileInputRef = useRef(null);

    const [showAddCamera, setShowAddCamera] = useState(false);

    const [selectedCamera, setSelectedCamera] = useState(null);

    const [selectedVideo, setSelectedVideo] = useState(null);

    const [cameraForm, setCameraForm] = useState({
        cameraName: "",
        location: "",
        cameraType: "CCTV",
        description: "",
    });


    const [cameras, setCameras] = useState([]);

    const [videoFootage, setVideoFootage] = useState([]);

    useEffect(() => {

        const loadCameras = async () => {

            try {

                const response = await fetch(
                    "http://localhost:8080/api/cameras"
                );

                if (!response.ok) {
                    throw new Error(
                        "Failed to load cameras"
                    );
                }

                const data =
                    await response.json();

                setCameras(data);

            } catch (error) {

                console.error(
                    "Camera loading error:",
                    error
                );

            }
        };


        loadCameras();

    }, []);


    // ============================================================
    // CAMERA FORM
    // ============================================================

    const handleCameraFormChange = (event) => {
        const { name, value } = event.target;

        setCameraForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };


    const handleAddCamera = async (event) => {
        event.preventDefault();

        if (!cameraForm.cameraName.trim()) {
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:8080/api/cameras",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        cameraName: cameraForm.cameraName,
                        location: cameraForm.location,
                        cameraType: cameraForm.cameraType,
                        description: cameraForm.description,
                        cameraUrl: "",
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to create camera");
            }

            const savedCamera = await response.json();

            setCameras((previous) => [
                ...previous,
                savedCamera,
            ]);

            setCameraForm({
                cameraName: "",
                location: "",
                cameraType: "CCTV",
                description: "",
            });

            setShowAddCamera(false);

        } catch (error) {

            console.error(error);

            alert(
                "Unable to create camera."
            );
        }
    };


    const handleDeleteCamera = async (cameraId) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to remove this camera?"
            );


        if (!confirmed) {
            return;
        }


        try {

            const response = await fetch(
                `http://localhost:8080/api/cameras/${cameraId}`,
                {
                    method: "DELETE",
                }
            );


            if (!response.ok) {
                throw new Error(
                    "Failed to delete camera"
                );
            }


            setCameras((previous) =>
                previous.filter(
                    (camera) =>
                        camera.id !== cameraId
                )
            );


            setVideoFootage((previous) =>
                previous.filter(
                    (video) =>
                        video.cameraId !== cameraId
                )
            );


            if (
                selectedCamera?.id === cameraId
            ) {
                setSelectedCamera(null);
            }


        } catch (error) {

            console.error(error);

            alert(
                "Unable to delete camera."
            );
        }
    };


    const handleSelectCamera = async (camera) => {

        setSelectedCamera(camera);

        setSelectedVideo(null);

        setVideoFootage([]);


        try {

            const response = await fetch(
                `http://localhost:8080/api/cameras/${camera.id}/footage`
            );


            if (!response.ok) {
                throw new Error(
                    "Failed to load footage"
                );
            }


            const data =
                await response.json();


            const formattedFootage =
                data.map((video) => ({

                    id: video.id,

                    cameraId:
                        video.cameraId,

                    fileName:
                        video.fileName,

                    date:
                        video.uploadedAt
                            ?.split("T")[0] || "--",

                    startTime: "--",

                    endTime: "--",

                    duration: "--",

                    status:
                        video.processingStatus,

                }));


            setVideoFootage(
                formattedFootage
            );


        } catch (error) {

            console.error(
                "Footage loading error:",
                error
            );
        }
    };


    // ============================================================
    // VIDEO UPLOAD
    // ============================================================

    const handleVideoSelect = (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith("video/")) {
            alert("Please select a valid video file.");

            event.target.value = "";
            return;
        }

        setSelectedVideo(file);
    };


    const handleUploadVideo = async () => {

        if (!selectedCamera) {
            alert("Please select a camera first.");
            return;
        }

        if (!selectedVideo) {
            alert("Please select a video file first.");
            return;
        }


        try {

            const formData = new FormData();

            formData.append(
                "file",
                selectedVideo
            );


            const response = await fetch(
                `http://localhost:8080/api/cameras/${selectedCamera.id}/footage`,
                {
                    method: "POST",
                    body: formData,
                }
            );


            if (!response.ok) {

                const errorText =
                    await response.text();

                console.error(
                    "Upload error:",
                    errorText
                );

                throw new Error(
                    "Failed to upload footage"
                );
            }


            const savedFootage =
                await response.json();


            console.log(
                "Saved footage:",
                savedFootage
            );


            setVideoFootage((previous) => [
                {
                    id: savedFootage.id,
                    cameraId:
                        savedFootage.cameraId,
                    fileName:
                        savedFootage.fileName,
                    date:
                        savedFootage.uploadedAt
                            ?.split("T")[0] || "--",
                    startTime: "--",
                    endTime: "--",
                    duration: "--",
                    status:
                        savedFootage.processingStatus,
                },
                ...previous,
            ]);


            setSelectedVideo(null);


            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }


            alert(
                "CCTV footage uploaded and saved successfully."
            );


        } catch (error) {

            console.error(error);

            alert(
                "Unable to upload CCTV footage."
            );
        }
    };

    const handleProcessFootage = async (footageId) => {

        try {

            // Immediately update UI
            setVideoFootage((previous) =>
                previous.map((video) =>
                    video.id === footageId
                        ? {
                            ...video,
                            status: "PROCESSING",
                        }
                        : video
                )
            );


            const response = await fetch(
                `http://localhost:8080/api/cameras/footage/${footageId}/process`,
                {
                    method: "POST",
                }
            );


            if (!response.ok) {

                const errorText =
                    await response.text();

                console.error(
                    "Processing error:",
                    errorText
                );

                throw new Error(
                    "Video processing failed"
                );
            }


            const data =
                await response.json();


            console.log(
                "Video processing response:",
                data
            );


            setVideoFootage((previous) =>
                previous.map((video) =>
                    video.id === footageId
                        ? {
                            ...video,
                            status: "COMPLETED",
                        }
                        : video
                )
            );


            alert(
                `Processing completed.\n\nFrames processed: ${data.framesProcessed || 0
                }\nDetections found: ${data.detections?.length || 0
                }`
            );


        } catch (error) {

            console.error(
                "Processing error:",
                error
            );


            setVideoFootage((previous) =>
                previous.map((video) =>
                    video.id === footageId
                        ? {
                            ...video,
                            status: "FAILED",
                        }
                        : video
                )
            );


            alert(
                "Unable to process the CCTV footage."
            );
        }
    };


    const handleRemoveVideo = async (videoId) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to remove this footage?"
            );


        if (!confirmed) {
            return;
        }


        try {

            const response = await fetch(
                `http://localhost:8080/api/cameras/footage/${videoId}`,
                {
                    method: "DELETE",
                }
            );


            if (!response.ok) {

                throw new Error(
                    "Failed to delete footage"
                );
            }


            setVideoFootage((previous) =>
                previous.filter(
                    (video) =>
                        video.id !== videoId
                )
            );


        } catch (error) {

            console.error(
                "Delete footage error:",
                error
            );

            alert(
                "Unable to delete the footage."
            );
        }
    };


    // ============================================================
    // HELPERS
    // ============================================================

    const getCameraVideos = () => {
        if (!selectedCamera) {
            return [];
        }

        return videoFootage.filter(
            (video) =>
                video.cameraId === selectedCamera.id
        );
    };


    const onlineCount = cameras.filter(
        (camera) => camera.status === "ONLINE"
    ).length;


    const offlineCount = cameras.filter(
        (camera) => camera.status === "OFFLINE"
    ).length;


    return (
        <div className="camera-management-page">

            {/* ==================================================
                PAGE HEADER
            ================================================== */}

            <div className="camera-page-header">

                <div>
                    <span className="page-eyebrow">
                        Surveillance Management
                    </span>

                    <h1>
                        Camera Management
                    </h1>

                    <p>
                        Manage connected CCTV cameras and
                        upload recorded footage for vehicle
                        analysis.
                    </p>
                </div>

                <button
                    className="add-camera-button"
                    onClick={() => setShowAddCamera(true)}
                >
                    <span className="button-icon">+</span>
                    Add Camera
                </button>

            </div>


            {/* ==================================================
                SUMMARY CARDS
            ================================================== */}

            <div className="camera-summary-grid">

                <div className="summary-card">

                    <div className="summary-icon camera-icon">
                        📹
                    </div>

                    <div>
                        <span className="summary-label">
                            Total Cameras
                        </span>

                        <strong className="summary-value">
                            {cameras.length}
                        </strong>
                    </div>

                </div>


                <div className="summary-card">

                    <div className="summary-icon online-icon">
                        ●
                    </div>

                    <div>
                        <span className="summary-label">
                            Online
                        </span>

                        <strong className="summary-value">
                            {onlineCount}
                        </strong>
                    </div>

                </div>


                <div className="summary-card">

                    <div className="summary-icon offline-icon">
                        ●
                    </div>

                    <div>
                        <span className="summary-label">
                            Offline
                        </span>

                        <strong className="summary-value">
                            {offlineCount}
                        </strong>
                    </div>

                </div>


                <div className="summary-card">

                    <div className="summary-icon footage-icon">
                        🎞️
                    </div>

                    <div>
                        <span className="summary-label">
                            Recorded Footage
                        </span>

                        <strong className="summary-value">
                            {videoFootage.length}
                        </strong>
                    </div>

                </div>

            </div>


            {/* ==================================================
                MAIN CONTENT
            ================================================== */}

            <div className="camera-content-grid">


                {/* ==================================================
                    CAMERA LIST
                ================================================== */}

                <div className="camera-list-card">

                    <div className="section-header">

                        <div>
                            <h2>
                                Connected Cameras
                            </h2>

                            <p>
                                Select a camera to manage its
                                recorded footage.
                            </p>
                        </div>

                    </div>


                    <div className="camera-list">

                        {cameras.length === 0 ? (

                            <div className="empty-state">
                                <div className="empty-icon">
                                    📹
                                </div>

                                <h3>
                                    No cameras connected
                                </h3>

                                <p>
                                    Add a camera to begin managing
                                    CCTV footage.
                                </p>
                            </div>

                        ) : (

                            cameras.map((camera) => (

                                <div
                                    key={camera.id}
                                    className={`camera-item ${selectedCamera?.id === camera.id
                                        ? "selected"
                                        : ""
                                        }`}
                                    onClick={() =>
                                        handleSelectCamera(camera)
                                    }
                                >

                                    <div className="camera-item-icon">
                                        📹
                                    </div>


                                    <div className="camera-item-info">

                                        <div className="camera-name-row">

                                            <h3>
                                                {camera.cameraName}
                                            </h3>

                                            <span
                                                className={`status-badge ${camera.status === "ONLINE"
                                                    ? "online"
                                                    : "offline"
                                                    }`}
                                            >
                                                <span className="status-dot"></span>
                                                {camera.status}
                                            </span>

                                        </div>


                                        <p>
                                            📍 {camera.location || "Location not specified"}
                                        </p>

                                        <span className="camera-description">
                                            {camera.description ||
                                                "No description"}
                                        </span>

                                    </div>


                                    <div className="camera-item-actions">

                                        <button
                                            className="delete-camera-button"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                handleDeleteCamera(
                                                    camera.id
                                                );
                                            }}
                                            title="Remove camera"
                                        >
                                            🗑
                                        </button>

                                    </div>

                                </div>

                            ))

                        )}

                    </div>

                </div>


                {/* ==================================================
                    FOOTAGE PANEL
                ================================================== */}

                <div className="footage-card">

                    {!selectedCamera ? (

                        <div className="footage-empty-state">

                            <div className="footage-empty-icon">
                                🎥
                            </div>

                            <h2>
                                Select a Camera
                            </h2>

                            <p>
                                Select a camera from the list to
                                view and manage its CCTV footage.
                            </p>

                        </div>

                    ) : (

                        <>

                            {/* Selected camera header */}

                            <div className="selected-camera-header">

                                <div className="selected-camera-title">

                                    <div className="selected-camera-icon">
                                        📹
                                    </div>

                                    <div>

                                        <h2>
                                            {selectedCamera.cameraName}
                                        </h2>

                                        <p>
                                            📍{" "}
                                            {selectedCamera.location ||
                                                "Location not specified"}
                                        </p>

                                    </div>

                                </div>


                                <span
                                    className={`large-status-badge ${selectedCamera.status === "ONLINE"
                                        ? "online"
                                        : "offline"
                                        }`}
                                >
                                    <span className="status-dot"></span>

                                    {selectedCamera.status}
                                </span>

                            </div>


                            {/* Upload section */}

                            <div className="footage-upload-section">

                                <div className="upload-section-header">

                                    <div>

                                        <h3>
                                            Upload CCTV Footage
                                        </h3>

                                        <p>
                                            Upload recorded footage
                                            from this camera for
                                            vehicle analysis.
                                        </p>

                                    </div>

                                </div>


                                <label
                                    className={`video-drop-zone ${selectedVideo
                                        ? "has-file"
                                        : ""
                                        }`}
                                >

                                    <div className="video-upload-icon">
                                        🎞️
                                    </div>


                                    {selectedVideo ? (

                                        <>
                                            <h4>
                                                {selectedVideo.name}
                                            </h4>

                                            <p>
                                                {(
                                                    selectedVideo.size /
                                                    (1024 * 1024)
                                                ).toFixed(2)}{" "}
                                                MB
                                            </p>

                                            <span className="change-video-text">
                                                Click to choose another
                                                video
                                            </span>
                                        </>

                                    ) : (

                                        <>
                                            <h4>
                                                Select CCTV Video
                                            </h4>

                                            <p>
                                                Drag and drop your video
                                                here or click to browse
                                            </p>

                                            <span className="supported-video-formats">
                                                MP4, AVI, MOV, MKV
                                            </span>
                                        </>

                                    )}


                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="video/*"
                                        onChange={handleVideoSelect}
                                    />

                                </label>


                                <div className="upload-actions">

                                    <button
                                        className="upload-footage-button"
                                        onClick={
                                            handleUploadVideo
                                        }
                                        disabled={
                                            !selectedVideo
                                        }
                                    >
                                        🎬 Upload Footage
                                    </button>

                                    {selectedVideo && (
                                        <button
                                            className="cancel-upload-button"
                                            onClick={() => {
                                                setSelectedVideo(null);

                                                if (
                                                    fileInputRef.current
                                                ) {
                                                    fileInputRef.current.value =
                                                        "";
                                                }
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    )}

                                </div>

                            </div>


                            {/* Existing footage */}

                            <div className="footage-list-section">

                                <div className="section-header">

                                    <div>

                                        <h3>
                                            Recorded Footage
                                        </h3>

                                        <p>
                                            {getCameraVideos().length}{" "}
                                            footage file
                                            {getCameraVideos().length === 1
                                                ? ""
                                                : "s"}{" "}
                                            available
                                        </p>

                                    </div>

                                </div>


                                {getCameraVideos().length === 0 ? (

                                    <div className="no-footage">

                                        <div>
                                            🎞️
                                        </div>

                                        <h4>
                                            No recorded footage
                                        </h4>

                                        <p>
                                            Upload a CCTV video to
                                            begin processing vehicle
                                            detections.
                                        </p>

                                    </div>

                                ) : (

                                    <div className="footage-list">

                                        {getCameraVideos().map(
                                            (video) => (

                                                <div
                                                    className="footage-item"
                                                    key={video.id}
                                                >

                                                    <div className="footage-file-icon">
                                                        🎬
                                                    </div>


                                                    <div className="footage-info">

                                                        <h4>
                                                            {video.fileName}
                                                        </h4>

                                                        <div className="footage-meta">

                                                            <span>
                                                                📅{" "}
                                                                {video.date}
                                                            </span>

                                                            <span>
                                                                🕐{" "}
                                                                {video.startTime}
                                                                {" - "}
                                                                {video.endTime}
                                                            </span>

                                                            <span>
                                                                ⏱{" "}
                                                                {video.duration}
                                                            </span>

                                                        </div>

                                                    </div>


                                                    <span
                                                        className={`footage-status ${video.status.toLowerCase()}`}
                                                    >
                                                        {video.status}
                                                    </span>

                                                    {video.status === "UPLOADED" && (
                                                        <button
                                                            className="process-footage-button"
                                                            onClick={() =>
                                                                handleProcessFootage(video.id)
                                                            }
                                                        >
                                                            ⚙ Process
                                                        </button>
                                                    )}

                                                    {video.status === "PROCESSING" && (
                                                        <span className="processing-label">
                                                            Processing...
                                                        </span>
                                                    )}

                                                    {video.status === "COMPLETED" && (
                                                        <span className="completed-label">
                                                            ✓ Processed
                                                        </span>
                                                    )}


                                                    <button
                                                        className="remove-footage-button"
                                                        onClick={() =>
                                                            handleRemoveVideo(
                                                                video.id
                                                            )
                                                        }
                                                        title="Remove footage"
                                                    >
                                                        🗑
                                                    </button>

                                                </div>

                                            )
                                        )}

                                    </div>

                                )}

                            </div>

                        </>

                    )}

                </div>

            </div>


            {/* ==================================================
                ADD CAMERA MODAL
            ================================================== */}

            {showAddCamera && (

                <div
                    className="modal-overlay"
                    onClick={() =>
                        setShowAddCamera(false)
                    }
                >

                    <div
                        className="add-camera-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <div className="modal-header">

                            <div>
                                <span className="modal-eyebrow">
                                    Camera Configuration
                                </span>

                                <h2>
                                    Add New Camera
                                </h2>
                            </div>

                            <button
                                className="modal-close"
                                onClick={() =>
                                    setShowAddCamera(false)
                                }
                            >
                                ×
                            </button>

                        </div>


                        <form
                            onSubmit={
                                handleAddCamera
                            }
                        >

                            <div className="form-group">

                                <label>
                                    Camera Name
                                </label>

                                <input
                                    type="text"
                                    name="cameraName"
                                    value={
                                        cameraForm.cameraName
                                    }
                                    onChange={
                                        handleCameraFormChange
                                    }
                                    placeholder="e.g. Main Gate Camera"
                                    required
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Location
                                </label>

                                <input
                                    type="text"
                                    name="location"
                                    value={
                                        cameraForm.location
                                    }
                                    onChange={
                                        handleCameraFormChange
                                    }
                                    placeholder="e.g. Main Entrance"
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Camera Type
                                </label>

                                <select
                                    name="cameraType"
                                    value={
                                        cameraForm.cameraType
                                    }
                                    onChange={
                                        handleCameraFormChange
                                    }
                                >

                                    <option value="CCTV">
                                        CCTV Camera
                                    </option>

                                    <option value="IP_CAMERA">
                                        IP Camera
                                    </option>

                                    <option value="NETWORK_CAMERA">
                                        Network Camera
                                    </option>

                                </select>

                            </div>


                            <div className="form-group">

                                <label>
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={
                                        cameraForm.description
                                    }
                                    onChange={
                                        handleCameraFormChange
                                    }
                                    placeholder="Optional camera description"
                                    rows="3"
                                />

                            </div>


                            <div className="modal-actions">

                                <button
                                    type="button"
                                    className="modal-cancel-button"
                                    onClick={() =>
                                        setShowAddCamera(false)
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="modal-save-button"
                                >
                                    Add Camera
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
};

export default RegisteredCameras;