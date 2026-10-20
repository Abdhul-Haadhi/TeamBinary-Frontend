import React, {
    useRef,
    useState,
    useEffect,
} from "react";

import "../css/RegisteredCameras.css";


// ============================================================
// API CONFIGURATION
// ============================================================

const API_BASE = "http://localhost:8080/api";

const CAMERA_API = `${API_BASE}/cameras`;


// ============================================================
// AUTH HELPERS
// ============================================================

const getToken = () => {

    return localStorage.getItem("token");

};


const getAuthHeaders = () => {

    const token = getToken();

    if (!token) {

        throw new Error(
            "Authentication token not found. Please log in again."
        );

    }

    return {

        Authorization:
            `Bearer ${token}`,

    };

};


const getJsonAuthHeaders = () => {

    const token = getToken();

    if (!token) {

        throw new Error(
            "Authentication token not found. Please log in again."
        );

    }

    return {

        "Content-Type":
            "application/json",

        Authorization:
            `Bearer ${token}`,

    };

};


// ============================================================
// CAMERA / RESPONSE HELPERS
// ============================================================

const getCameraId = (
    camera
) => {

    return (
        camera?.cameraId
        ??
        camera?.id
    );

};


const getCameraName = (
    camera
) => {

    return (
        camera?.cameraName
        ??
        camera?.name
        ??
        "Unnamed Camera"
    );

};


const getCameraLocation = (
    camera
) => {

    return (
        camera?.location
        ??
        camera?.cameraLocation
        ??
        "Location not specified"
    );

};


const getCameraStatus = (
    camera
) => {

    return (
        camera?.status
        ??
        "OFFLINE"
    );

};


// ============================================================
// DISPLAY STATUS
//
// Some backend camera APIs may use ACTIVE / INACTIVE / OFFLINE
// while this page previously displayed ONLINE / OFFLINE.
//
// We normalize only the UI display here.
// ============================================================

const getCameraDisplayStatus = (
    camera
) => {

    const status = String(
        getCameraStatus(camera)
    ).toUpperCase();


    if (
        status === "ONLINE"
        ||
        status === "ACTIVE"
    ) {

        return "ONLINE";

    }


    return "OFFLINE";

};


const getCameraDescription = (
    camera
) => {

    return (
        camera?.description
        ??
        "No description"
    );

};


// ============================================================
// COMPONENT
// ============================================================

const RegisteredCameras = () => {

    const fileInputRef =
        useRef(null);


    // ========================================================
    // STATE
    // ========================================================

    const [
        showAddCamera,
        setShowAddCamera
    ] = useState(false);


    const [
        selectedCamera,
        setSelectedCamera
    ] = useState(null);


    const [
        selectedVideo,
        setSelectedVideo
    ] = useState(null);


    const [
        cameraForm,
        setCameraForm
    ] = useState({

        cameraName: "",

        location: "",

        cameraType: "CCTV",

        description: "",

    });


    const [
        cameras,
        setCameras
    ] = useState([]);


    const [
        videoFootage,
        setVideoFootage
    ] = useState([]);


    const [
        loadingCameras,
        setLoadingCameras
    ] = useState(false);


    const [
        uploadingVideo,
        setUploadingVideo
    ] = useState(false);


    const [
        loadingFootage,
        setLoadingFootage
    ] = useState(false);


    // ============================================================
    // LOAD CAMERAS
    // ============================================================

    useEffect(() => {

        const loadCameras = async () => {

            setLoadingCameras(true);


            try {

                const response =
                    await fetch(
                        CAMERA_API,
                        {
                            method: "GET",

                            headers:
                                getAuthHeaders(),
                        }
                    );


                // ------------------------------------------------
                // AUTH ERRORS
                // ------------------------------------------------

                if (
                    response.status === 401
                ) {

                    throw new Error(
                        "Your session has expired. Please log in again."
                    );

                }


                if (
                    response.status === 403
                ) {

                    throw new Error(
                        "You are not authorized to view registered cameras."
                    );

                }


                // ------------------------------------------------
                // OTHER SERVER ERRORS
                // ------------------------------------------------

                if (!response.ok) {

                    const errorText =
                        await response.text();


                    console.error(
                        "Camera API error:",
                        response.status,
                        errorText
                    );


                    throw new Error(
                        errorText
                        ||
                        `Failed to load cameras. Server returned ${response.status}.`
                    );

                }


                // ------------------------------------------------
                // RESPONSE
                // ------------------------------------------------

                const data =
                    await response.json();


                console.log(
                    "Cameras API response:",
                    data
                );


                // ------------------------------------------------
                // SUPPORT MULTIPLE RESPONSE SHAPES
                // ------------------------------------------------

                const cameraList =

                    Array.isArray(data)

                        ? data

                        : Array.isArray(
                            data?.cameras
                        )

                            ? data.cameras

                            : Array.isArray(
                                data?.data
                            )

                                ? data.data

                                : [];


                setCameras(
                    cameraList
                );


            } catch (error) {

                console.error(
                    "Camera loading error:",
                    error
                );


                setCameras(
                    []
                );


                alert(
                    error.message
                    ||
                    "Unable to load registered cameras."
                );


            } finally {

                setLoadingCameras(
                    false
                );

            }

        };


        loadCameras();


    }, []);


    // ============================================================
    // CAMERA FORM
    // ============================================================

    const handleCameraFormChange = (
        event
    ) => {

        const {
            name,
            value
        } = event.target;


        setCameraForm(
            (previous) => ({

                ...previous,

                [name]:
                    value,

            })
        );

    };


    // ============================================================
    // ADD CAMERA
    // ============================================================

    const handleAddCamera = async (
        event
    ) => {

        event.preventDefault();


        if (
            !cameraForm.cameraName.trim()
        ) {

            alert(
                "Please enter a camera name."
            );

            return;

        }


        try {

            const response =
                await fetch(
                    CAMERA_API,
                    {
                        method: "POST",

                        headers:
                            getJsonAuthHeaders(),

                        body:
                            JSON.stringify({

                                cameraName:
                                    cameraForm.cameraName.trim(),

                                location:
                                    cameraForm.location.trim(),

                                cameraType:
                                    cameraForm.cameraType,

                                description:
                                    cameraForm.description.trim(),

                                cameraUrl:
                                    "",

                            }),

                    }
                );


            // ------------------------------------------------
            // AUTH ERRORS
            // ------------------------------------------------

            if (
                response.status === 401
            ) {

                throw new Error(
                    "Your session has expired. Please log in again."
                );

            }


            if (
                response.status === 403
            ) {

                throw new Error(
                    "You do not have permission to create a camera."
                );

            }


            // ------------------------------------------------
            // SERVER ERROR
            // ------------------------------------------------

            if (!response.ok) {

                const errorText =
                    await response.text();


                console.error(
                    "Add camera error:",
                    response.status,
                    errorText
                );


                throw new Error(
                    errorText
                    ||
                    "Failed to create camera."
                );

            }


            // ------------------------------------------------
            // RESPONSE
            // ------------------------------------------------

            const savedCamera =
                await response.json();


            console.log(
                "Saved camera:",
                savedCamera
            );


            setCameras(
                (previous) => [

                    ...previous,

                    savedCamera,

                ]
            );


            setCameraForm({

                cameraName: "",

                location: "",

                cameraType: "CCTV",

                description: "",

            });


            setShowAddCamera(
                false
            );


            alert(
                "Camera added successfully."
            );


        } catch (error) {

            console.error(
                "Add camera error:",
                error
            );


            alert(
                error.message
                ||
                "Unable to create camera."
            );

        }

    };


    // ============================================================
    // DELETE CAMERA
    // ============================================================

    const handleDeleteCamera = async (
        cameraId
    ) => {

        if (
            cameraId === undefined
            ||
            cameraId === null
        ) {

            alert(
                "Invalid camera ID."
            );

            return;

        }


        const confirmed =
            window.confirm(
                "Are you sure you want to remove this camera?"
            );


        if (!confirmed) {

            return;

        }


        try {

            const response =
                await fetch(

                    `${CAMERA_API}/${cameraId}`,

                    {
                        method: "DELETE",

                        headers:
                            getAuthHeaders(),
                    }

                );


            if (
                response.status === 401
            ) {

                throw new Error(
                    "Your session has expired. Please log in again."
                );

            }


            if (
                response.status === 403
            ) {

                throw new Error(
                    "You do not have permission to delete cameras."
                );

            }


            if (!response.ok) {

                const errorText =
                    await response.text();


                console.error(
                    "Delete camera error:",
                    response.status,
                    errorText
                );


                throw new Error(
                    errorText
                    ||
                    "Failed to delete camera."
                );

            }


            // ------------------------------------------------
            // REMOVE FROM CAMERA LIST
            // ------------------------------------------------

            setCameras(
                (previous) =>
                    previous.filter(
                        (camera) =>

                            String(
                                getCameraId(camera)
                            )
                            !==
                            String(cameraId)
                    )
            );


            // ------------------------------------------------
            // REMOVE FOOTAGE BELONGING TO CAMERA
            // ------------------------------------------------

            setVideoFootage(
                (previous) =>
                    previous.filter(
                        (video) =>

                            String(
                                video.cameraId
                            )
                            !==
                            String(cameraId)
                    )
            );


            // ------------------------------------------------
            // CLEAR SELECTED CAMERA
            // ------------------------------------------------

            if (

                selectedCamera
                &&
                String(
                    getCameraId(
                        selectedCamera
                    )
                )
                ===
                String(cameraId)

            ) {

                setSelectedCamera(
                    null
                );

                setSelectedVideo(
                    null
                );

                setVideoFootage(
                    []
                );

            }


            alert(
                "Camera removed successfully."
            );


        } catch (error) {

            console.error(
                "Delete camera error:",
                error
            );


            alert(
                error.message
                ||
                "Unable to delete camera."
            );

        }

    };


    // ============================================================
    // SELECT CAMERA
    // ============================================================

    const handleSelectCamera = async (
        camera
    ) => {

        const cameraId =
            getCameraId(
                camera
            );


        if (
            cameraId === undefined
            ||
            cameraId === null
        ) {

            alert(
                "Invalid camera ID."
            );

            return;

        }


        setSelectedCamera(
            camera
        );


        setSelectedVideo(
            null
        );


        setVideoFootage(
            []
        );


        setLoadingFootage(
            true
        );


        try {

            const response =
                await fetch(

                    `${CAMERA_API}/${cameraId}/footage`,

                    {
                        method: "GET",

                        headers:
                            getAuthHeaders(),
                    }

                );


            if (
                response.status === 401
            ) {

                throw new Error(
                    "Your session has expired. Please log in again."
                );

            }


            if (
                response.status === 403
            ) {

                throw new Error(
                    "You do not have permission to view this camera's footage."
                );

            }


            if (!response.ok) {

                const errorText =
                    await response.text();


                console.error(
                    "Footage API error:",
                    response.status,
                    errorText
                );


                throw new Error(
                    errorText
                    ||
                    "Failed to load CCTV footage."
                );

            }


            const data =
                await response.json();


            console.log(
                "Footage API response:",
                data
            );


            // ------------------------------------------------
            // SUPPORT MULTIPLE RESPONSE SHAPES
            // ------------------------------------------------

            const footageList =

                Array.isArray(data)

                    ? data

                    : Array.isArray(
                        data?.footage
                    )

                        ? data.footage

                        : Array.isArray(
                            data?.data
                        )

                            ? data.data

                            : [];


            // ------------------------------------------------
            // FORMAT FOOTAGE FOR UI
            // ------------------------------------------------

            const formattedFootage =
                footageList.map(
                    (video) => ({

                        id:
                            video?.id
                            ??
                            video?.footageId,

                        cameraId:
                            video?.cameraId
                            ??
                            cameraId,

                        fileName:
                            video?.fileName
                            ??
                            video?.originalFileName
                            ??
                            video?.filename
                            ??
                            "Unnamed footage",

                        date:
                            video?.uploadedAt
                                ?.split("T")[0]
                            ??
                            "--",

                        startTime:
                            video?.startTime
                            ??
                            "--",

                        endTime:
                            video?.endTime
                            ??
                            "--",

                        duration:
                            video?.duration
                            ??
                            "--",

                        status:
                            video?.processingStatus
                            ??
                            video?.status
                            ??
                            "UPLOADED",

                    })
                );


            setVideoFootage(
                formattedFootage
            );


        } catch (error) {

            console.error(
                "Footage loading error:",
                error
            );


            setVideoFootage(
                []
            );


            alert(
                error.message
                ||
                "Unable to load CCTV footage."
            );


        } finally {

            setLoadingFootage(
                false
            );

        }

    };


    // ============================================================
    // VIDEO SELECT
    // ============================================================

    const handleVideoSelect = (
        event
    ) => {

        const file =
            event.target.files?.[0];


        if (!file) {

            return;

        }


        if (
            !file.type.startsWith(
                "video/"
            )
        ) {

            alert(
                "Please select a valid video file."
            );


            event.target.value =
                "";


            return;

        }


        setSelectedVideo(
            file
        );

    };


    // ============================================================
    // UPLOAD VIDEO
    // ============================================================

    const handleUploadVideo =
        async () => {

            if (!selectedCamera) {

                alert(
                    "Please select a camera first."
                );

                return;

            }


            if (!selectedVideo) {

                alert(
                    "Please select a video file first."
                );

                return;

            }


            const cameraId =
                getCameraId(
                    selectedCamera
                );


            if (
                cameraId === undefined
                ||
                cameraId === null
            ) {

                alert(
                    "Invalid camera ID."
                );

                return;

            }


            setUploadingVideo(
                true
            );


            try {

                const formData =
                    new FormData();


                formData.append(
                    "file",
                    selectedVideo
                );


                const response =
                    await fetch(

                        `${CAMERA_API}/${cameraId}/footage`,

                        {
                            method: "POST",

                            headers:
                                getAuthHeaders(),

                            // IMPORTANT:
                            // Do NOT manually set Content-Type here.
                            // Browser sets multipart/form-data boundary.

                            body:
                                formData,

                        }

                    );


                if (
                    response.status === 401
                ) {

                    throw new Error(
                        "Your session has expired. Please log in again."
                    );

                }


                if (
                    response.status === 403
                ) {

                    throw new Error(
                        "You do not have permission to upload CCTV footage."
                    );

                }


                if (!response.ok) {

                    const errorText =
                        await response.text();


                    console.error(
                        "Upload error:",
                        response.status,
                        errorText
                    );


                    throw new Error(
                        errorText
                        ||
                        "Failed to upload CCTV footage."
                    );

                }


                const savedFootage =
                    await response.json();


                console.log(
                    "Saved footage:",
                    savedFootage
                );


                const newFootage = {

                    id:
                        savedFootage?.id
                        ??
                        savedFootage?.footageId,

                    cameraId:
                        savedFootage?.cameraId
                        ??
                        cameraId,

                    fileName:
                        savedFootage?.fileName
                        ??
                        savedFootage?.originalFileName
                        ??
                        savedFootage?.filename
                        ??
                        selectedVideo.name,

                    date:
                        savedFootage?.uploadedAt
                            ?.split("T")[0]
                        ??
                        new Date()
                            .toISOString()
                            .split("T")[0],

                    startTime:
                        savedFootage?.startTime
                        ??
                        "--",

                    endTime:
                        savedFootage?.endTime
                        ??
                        "--",

                    duration:
                        savedFootage?.duration
                        ??
                        "--",

                    status:
                        savedFootage?.processingStatus
                        ??
                        savedFootage?.status
                        ??
                        "UPLOADED",

                };


                setVideoFootage(
                    (previous) => [

                        newFootage,

                        ...previous,

                    ]
                );


                setSelectedVideo(
                    null
                );


                if (
                    fileInputRef.current
                ) {

                    fileInputRef.current.value =
                        "";

                }


                alert(
                    "CCTV footage uploaded and saved successfully."
                );


            } catch (error) {

                console.error(
                    "Upload error:",
                    error
                );


                alert(
                    error.message
                    ||
                    "Unable to upload CCTV footage."
                );


            } finally {

                setUploadingVideo(
                    false
                );

            }

        };


    // ============================================================
    // PROCESS FOOTAGE
    // ============================================================

    const handleProcessFootage =
        async (
            footageId
        ) => {

            if (
                footageId === undefined
                ||
                footageId === null
            ) {

                alert(
                    "Invalid footage ID."
                );

                return;

            }


            try {

                // ----------------------------------------------
                // UPDATE UI IMMEDIATELY
                // ----------------------------------------------

                setVideoFootage(
                    (previous) =>
                        previous.map(
                            (video) =>

                                String(
                                    video.id
                                )
                                    ===
                                    String(footageId)

                                    ? {

                                        ...video,

                                        status:
                                            "PROCESSING",

                                    }

                                    : video
                        )
                );


                const response =
                    await fetch(

                        `${CAMERA_API}/footage/${footageId}/process`,

                        {
                            method: "POST",

                            headers:
                                getAuthHeaders(),
                        }

                    );


                if (
                    response.status === 401
                ) {

                    throw new Error(
                        "Your session has expired. Please log in again."
                    );

                }


                if (
                    response.status === 403
                ) {

                    throw new Error(
                        "You do not have permission to process CCTV footage."
                    );

                }


                if (!response.ok) {

                    const errorText =
                        await response.text();


                    console.error(
                        "Processing error:",
                        response.status,
                        errorText
                    );


                    throw new Error(
                        errorText
                        ||
                        "Video processing failed."
                    );

                }


                const data =
                    await response.json();


                console.log(
                    "Video processing response:",
                    data
                );


                // ------------------------------------------------
                // UPDATE STATUS
                // ------------------------------------------------

                setVideoFootage(
                    (previous) =>
                        previous.map(
                            (video) =>

                                String(
                                    video.id
                                )
                                    ===
                                    String(footageId)

                                    ? {

                                        ...video,

                                        status:
                                            "COMPLETED",

                                    }

                                    : video
                        )
                );


                alert(

                    `Processing completed.\n\n`
                    +

                    `Frames processed: ${data?.framesProcessed
                    ??
                    0
                    }\n`

                    +

                    `Detections found: ${data?.detections?.length
                    ??
                    0
                    }`

                );


            } catch (error) {

                console.error(
                    "Processing error:",
                    error
                );


                setVideoFootage(
                    (previous) =>
                        previous.map(
                            (video) =>

                                String(
                                    video.id
                                )
                                    ===
                                    String(footageId)

                                    ? {

                                        ...video,

                                        status:
                                            "FAILED",

                                    }

                                    : video
                        )
                );


                alert(
                    error.message
                    ||
                    "Unable to process the CCTV footage."
                );

            }

        };


    // ============================================================
    // DELETE FOOTAGE
    // ============================================================

    const handleRemoveVideo =
        async (
            videoId
        ) => {

            const confirmed =
                window.confirm(
                    "Are you sure you want to remove this footage?"
                );


            if (!confirmed) {

                return;

            }


            try {

                const response =
                    await fetch(

                        `${CAMERA_API}/footage/${videoId}`,

                        {
                            method: "DELETE",

                            headers:
                                getAuthHeaders(),
                        }

                    );


                if (
                    response.status === 401
                ) {

                    throw new Error(
                        "Your session has expired. Please log in again."
                    );

                }


                if (
                    response.status === 403
                ) {

                    throw new Error(
                        "You do not have permission to delete CCTV footage."
                    );

                }


                if (!response.ok) {

                    const errorText =
                        await response.text();


                    console.error(
                        "Delete footage error:",
                        response.status,
                        errorText
                    );


                    throw new Error(
                        errorText
                        ||
                        "Failed to delete footage."
                    );

                }


                setVideoFootage(
                    (previous) =>
                        previous.filter(
                            (video) =>

                                String(
                                    video.id
                                )
                                !==
                                String(videoId)
                        )
                );


            } catch (error) {

                console.error(
                    "Delete footage error:",
                    error
                );


                alert(
                    error.message
                    ||
                    "Unable to delete the footage."
                );

            }

        };


    // ============================================================
    // GET VIDEOS FOR SELECTED CAMERA
    // ============================================================

    const getCameraVideos = () => {

        if (!selectedCamera) {

            return [];

        }


        const selectedCameraId =
            getCameraId(
                selectedCamera
            );


        return videoFootage.filter(
            (video) =>

                String(
                    video.cameraId
                )
                ===
                String(selectedCameraId)

        );

    };


    // ============================================================
    // SUMMARY COUNTS
    // ============================================================

    const onlineCount =
        cameras.filter(
            (camera) =>

                getCameraDisplayStatus(
                    camera
                )
                ===
                "ONLINE"

        ).length;


    const offlineCount =
        cameras.filter(
            (camera) =>

                getCameraDisplayStatus(
                    camera
                )
                ===
                "OFFLINE"

        ).length;


    // ============================================================
    // RETURN
    // ============================================================

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
                        Registered Cameras
                    </h1>


                    <p>
                        Manage connected CCTV cameras and
                        upload recorded footage for vehicle
                        analysis.
                    </p>

                </div>


                {/* ==================================================
                    ADD CAMERA
                ================================================== */}

                {/*
                <button
                    className="add-camera-button"
                    onClick={() =>
                        setShowAddCamera(true)
                    }
                >
                    <span className="button-icon">
                        +
                    </span>
                    Add Camera
                </button>
                */}

            </div>


            {/* ==================================================
                SUMMARY CARDS
            ================================================== */}

            <div className="camera-summary-grid">


                {/* TOTAL */}

                <div className="summary-card">

                    <div className="summary-icon camera-icon">
                        📹
                    </div>


                    <div>

                        <span className="summary-label">
                            Total Cameras
                        </span>


                        <strong className="summary-value">
                            {
                                cameras.length
                            }
                        </strong>

                    </div>

                </div>


                {/* ONLINE */}

                <div className="summary-card">

                    <div className="summary-icon online-icon">
                        ●
                    </div>


                    <div>

                        <span className="summary-label">
                            Online
                        </span>


                        <strong className="summary-value">
                            {
                                onlineCount
                            }
                        </strong>

                    </div>

                </div>


                {/* OFFLINE */}

                <div className="summary-card">

                    <div className="summary-icon offline-icon">
                        ●
                    </div>


                    <div>

                        <span className="summary-label">
                            Offline
                        </span>


                        <strong className="summary-value">
                            {
                                offlineCount
                            }
                        </strong>

                    </div>

                </div>


                {/* FOOTAGE */}

                <div className="summary-card">

                    <div className="summary-icon footage-icon">
                        🎞️
                    </div>


                    <div>

                        <span className="summary-label">
                            Recorded Footage
                        </span>


                        <strong className="summary-value">
                            {
                                videoFootage.length
                            }
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


                        {loadingCameras ? (

                            <div className="empty-state">

                                <div className="empty-icon">
                                    ⏳
                                </div>


                                <h3>
                                    Loading cameras...
                                </h3>


                                <p>
                                    Please wait while the
                                    registered cameras are loaded.
                                </p>

                            </div>

                        ) : cameras.length === 0 ? (

                            <div className="empty-state">

                                <div className="empty-icon">
                                    📹
                                </div>


                                <h3>
                                    No cameras connected
                                </h3>


                                <p>
                                    Add a camera to begin
                                    managing CCTV footage.
                                </p>

                            </div>

                        ) : (

                            cameras.map(
                                (camera) => {

                                    const cameraId =
                                        getCameraId(
                                            camera
                                        );


                                    const cameraStatus =
                                        getCameraDisplayStatus(
                                            camera
                                        );


                                    return (

                                        <div
                                            key={
                                                cameraId
                                            }

                                            className={`
                                                camera-item
                                                ${String(
                                                getCameraId(
                                                    selectedCamera
                                                )
                                            )
                                                    ===
                                                    String(cameraId)
                                                    ? "selected"
                                                    : ""
                                                }
                                            `}

                                            onClick={() =>
                                                handleSelectCamera(
                                                    camera
                                                )
                                            }
                                        >


                                            <div className="camera-item-icon">
                                                📹
                                            </div>


                                            <div className="camera-item-info">


                                                <div className="camera-name-row">

                                                    <h3>
                                                        {
                                                            getCameraName(
                                                                camera
                                                            )
                                                        }
                                                    </h3>


                                                    <span
                                                        className={`
                                                            status-badge
                                                            ${cameraStatus
                                                                ===
                                                                "ONLINE"
                                                                ? "online"
                                                                : "offline"
                                                            }
                                                        `}
                                                    >

                                                        <span className="status-dot"></span>

                                                        {
                                                            cameraStatus
                                                        }

                                                    </span>

                                                </div>


                                                <p>
                                                    📍{" "}
                                                    {
                                                        getCameraLocation(
                                                            camera
                                                        )
                                                    }
                                                </p>


                                                <span className="camera-description">

                                                    {
                                                        getCameraDescription(
                                                            camera
                                                        )
                                                    }

                                                </span>

                                            </div>


                                            <div className="camera-item-actions">

                                                <button

                                                    className="delete-camera-button"

                                                    onClick={
                                                        (event) => {

                                                            event.stopPropagation();


                                                            handleDeleteCamera(
                                                                cameraId
                                                            );

                                                        }
                                                    }

                                                    title="Remove camera"

                                                >
                                                    🗑
                                                </button>

                                            </div>

                                        </div>

                                    );

                                }
                            )

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


                            {/* ==================================================
                                SELECTED CAMERA HEADER
                            ================================================== */}

                            <div className="selected-camera-header">


                                <div className="selected-camera-title">


                                    <div className="selected-camera-icon">
                                        📹
                                    </div>


                                    <div>

                                        <h2>
                                            {
                                                getCameraName(
                                                    selectedCamera
                                                )
                                            }
                                        </h2>


                                        <p>
                                            📍{" "}
                                            {
                                                getCameraLocation(
                                                    selectedCamera
                                                )
                                            }
                                        </p>

                                    </div>

                                </div>


                                <span
                                    className={`
                                        large-status-badge
                                        ${getCameraDisplayStatus(
                                        selectedCamera
                                    )
                                            ===
                                            "ONLINE"
                                            ? "online"
                                            : "offline"
                                        }
                                    `}
                                >

                                    <span className="status-dot"></span>

                                    {
                                        getCameraDisplayStatus(
                                            selectedCamera
                                        )
                                    }

                                </span>

                            </div>


                            {/* ==================================================
                                UPLOAD SECTION
                            ================================================== */}

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
                                    className={`
                                        video-drop-zone
                                        ${selectedVideo
                                            ? "has-file"
                                            : ""
                                        }
                                    `}
                                >


                                    <div className="video-upload-icon">
                                        🎞️
                                    </div>


                                    {selectedVideo ? (

                                        <>

                                            <h4>
                                                {
                                                    selectedVideo.name
                                                }
                                            </h4>


                                            <p>

                                                {
                                                    (
                                                        selectedVideo.size
                                                        /
                                                        (
                                                            1024 *
                                                            1024
                                                        )
                                                    ).toFixed(2)
                                                }{" "}
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

                                        onChange={
                                            handleVideoSelect
                                        }

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

                                            ||

                                            uploadingVideo

                                        }

                                    >

                                        {
                                            uploadingVideo
                                                ? "Uploading..."
                                                : "🎬 Upload Footage"
                                        }

                                    </button>


                                    {selectedVideo && (

                                        <button

                                            className="cancel-upload-button"

                                            onClick={() => {

                                                setSelectedVideo(
                                                    null
                                                );


                                                if (
                                                    fileInputRef.current
                                                ) {

                                                    fileInputRef.current.value =
                                                        "";

                                                }

                                            }}

                                            disabled={
                                                uploadingVideo
                                            }

                                        >

                                            Cancel

                                        </button>

                                    )}

                                </div>


                            </div>


                            {/* ==================================================
                                RECORDED FOOTAGE
                            ================================================== */}

                            <div className="footage-list-section">


                                <div className="section-header">

                                    <div>

                                        <h3>
                                            Recorded Footage
                                        </h3>


                                        <p>

                                            {
                                                getCameraVideos()
                                                    .length
                                            }{" "}

                                            footage file
                                            {
                                                getCameraVideos()
                                                    .length
                                                    ===
                                                    1
                                                    ? ""
                                                    : "s"
                                            }{" "}
                                            available

                                        </p>

                                    </div>

                                </div>


                                {loadingFootage ? (

                                    <div className="no-footage">

                                        <div>
                                            ⏳
                                        </div>


                                        <h4>
                                            Loading footage...
                                        </h4>


                                        <p>
                                            Please wait while the
                                            camera footage is loaded.
                                        </p>

                                    </div>

                                ) : getCameraVideos().length === 0 ? (

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
                                            (video) => {

                                                const status =
                                                    String(
                                                        video.status
                                                        ??
                                                        "UPLOADED"
                                                    ).toUpperCase();


                                                return (

                                                    <div

                                                        className="footage-item"

                                                        key={
                                                            video.id
                                                        }

                                                    >


                                                        <div className="footage-file-icon">
                                                            🎬
                                                        </div>


                                                        <div className="footage-info">


                                                            <h4>
                                                                {
                                                                    video.fileName
                                                                }
                                                            </h4>


                                                            <div className="footage-meta">


                                                                <span>
                                                                    📅{" "}
                                                                    {
                                                                        video.date
                                                                    }
                                                                </span>


                                                                <span>
                                                                    🕐{" "}
                                                                    {
                                                                        video.startTime
                                                                    }
                                                                    {" - "}
                                                                    {
                                                                        video.endTime
                                                                    }
                                                                </span>


                                                                <span>
                                                                    ⏱{" "}
                                                                    {
                                                                        video.duration
                                                                    }
                                                                </span>

                                                            </div>

                                                        </div>


                                                        <span

                                                            className={`
                                                                footage-status
                                                                ${status.toLowerCase()}
                                                            `}

                                                        >

                                                            {
                                                                status
                                                            }

                                                        </span>


                                                        {status ===
                                                            "UPLOADED" && (

                                                                <button

                                                                    className="process-footage-button"

                                                                    onClick={() =>
                                                                        handleProcessFootage(
                                                                            video.id
                                                                        )
                                                                    }

                                                                >

                                                                    ⚙ Process

                                                                </button>

                                                            )}


                                                        {status ===
                                                            "PROCESSING" && (

                                                                <span className="processing-label">

                                                                    Processing...

                                                                </span>

                                                            )}


                                                        {status ===
                                                            "COMPLETED" && (

                                                                <span className="completed-label">

                                                                    ✓ Processed

                                                                </span>

                                                            )}


                                                        {status ===
                                                            "FAILED" && (

                                                                <span className="processing-label">

                                                                    Processing failed

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

                                                );

                                            }
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
                        setShowAddCamera(
                            false
                        )
                    }

                >


                    <div

                        className="add-camera-modal"

                        onClick={
                            (event) =>
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
                                    setShowAddCamera(
                                        false
                                    )
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
                                        setShowAddCamera(
                                            false
                                        )
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