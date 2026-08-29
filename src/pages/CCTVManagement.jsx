import React, { useEffect, useState } from "react";
import "./CCTVManagement.css";

function CCTVManagement() {
  // =====================================================
  // BACKEND
  // =====================================================

  const API_BASE = "https://192.168.8.154:8443";
  const CAMERAS_API = `${API_BASE}/api/cameras`;

  // =====================================================
  // STATE
  // =====================================================

  const [cameras, setCameras] = useState([]);
  const [loadingCameras, setLoadingCameras] = useState(true);
  const [cameraError, setCameraError] = useState("");

  const [showAddCamera, setShowAddCamera] = useState(false);
  const [addingCamera, setAddingCamera] = useState(false);

  const [newCamera, setNewCamera] = useState({
    cameraId: "",
    name: "",
    location: "",
    ipAddress: "",
    port: 8080,
    webCameraUrl: "",
    cameraType: "IP WEBCAM",
  });

  // GPS information for every camera
  const [gpsData, setGpsData] = useState({});

  const [locationStatus, setLocationStatus] = useState({});
  const [locationError, setLocationError] = useState({});
  const [lastFetch, setLastFetch] = useState({});
  const [feedErrors, setFeedErrors] = useState({});

  // =====================================================
  // LOAD CAMERAS
  // =====================================================

  const fetchCameras = async () => {
    try {
      setLoadingCameras(true);
      setCameraError("");

      const response = await fetch(CAMERAS_API);

      if (!response.ok) {
        throw new Error(
          `Server returned ${response.status}`
        );
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid camera data received");
      }

      setCameras(data);

      // Initialize status
      const initialStatus = {};

      data.forEach((camera) => {
        initialStatus[camera.cameraId] = "CONNECTING";
      });

      setLocationStatus(initialStatus);

      // IMPORTANT:
      // Read GPS directly from camera records.
      data.forEach((camera) => {
        updateGpsFromCamera(camera);
      });

    } catch (error) {
      console.error(
        "Unable to load cameras:",
        error
      );

      setCameraError(
        "Unable to connect to the camera service."
      );
    } finally {
      setLoadingCameras(false);
    }
  };

  // =====================================================
  // CONVERT CAMERA GPS DATA INTO REACT STATE
  // =====================================================

  const updateGpsFromCamera = (camera) => {
    if (!camera || !camera.cameraId) {
      return;
    }

    const latitude =
      camera.latitude != null
        ? Number(camera.latitude)
        : null;

    const longitude =
      camera.longitude != null
        ? Number(camera.longitude)
        : null;

    const accuracy =
      camera.accuracy != null
        ? Number(camera.accuracy)
        : null;

    // No GPS yet
    if (
      latitude == null ||
      longitude == null ||
      Number.isNaN(latitude) ||
      Number.isNaN(longitude)
    ) {
      setLocationStatus((previous) => ({
        ...previous,
        [camera.cameraId]: "WAITING FOR GPS",
      }));

      return;
    }

    const timestamp =
      camera.locationUpdatedAt
        ? new Date(camera.locationUpdatedAt)
        : new Date();

    setGpsData((previous) => ({
      ...previous,
      [camera.cameraId]: {
        latitude,
        longitude,
        accuracy,
        timestamp,
      },
    }));

    setLocationStatus((previous) => ({
      ...previous,
      [camera.cameraId]: "LOCATION LIVE",
    }));

    setLocationError((previous) => ({
      ...previous,
      [camera.cameraId]: "",
    }));
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchCameras();
  }, []);

  // =====================================================
  // FETCH GPS FOR ONE CAMERA
  //
  // IMPORTANT:
  // DO NOT CALL:
  // /api/cameras/{id}/location
  //
  // We now use:
  // /api/cameras/{id}
  // =====================================================

  const fetchCameraLocation = async (cameraId) => {
    try {
      setLocationStatus((previous) => ({
        ...previous,
        [cameraId]: "UPDATING...",
      }));

      setLocationError((previous) => ({
        ...previous,
        [cameraId]: "",
      }));

      const response = await fetch(
        `${CAMERAS_API}/${encodeURIComponent(cameraId)}`
      );

      if (!response.ok) {
        throw new Error(
          `Server returned ${response.status}`
        );
      }

      const camera = await response.json();

      console.log(
        `GPS response for ${cameraId}:`,
        camera
      );

      if (!camera) {
        throw new Error(
          "Camera data was empty."
        );
      }

      // Update camera in cameras array
      setCameras((previous) =>
        previous.map((item) =>
          item.cameraId === cameraId
            ? camera
            : item
        )
      );

      const latitude =
        camera.latitude != null
          ? Number(camera.latitude)
          : null;

      const longitude =
        camera.longitude != null
          ? Number(camera.longitude)
          : null;

      const accuracy =
        camera.accuracy != null
          ? Number(camera.accuracy)
          : null;

      // GPS has not been uploaded yet
      if (
        latitude == null ||
        longitude == null ||
        Number.isNaN(latitude) ||
        Number.isNaN(longitude)
      ) {
        setLocationStatus((previous) => ({
          ...previous,
          [cameraId]: "WAITING FOR GPS",
        }));

        setLocationError((previous) => ({
          ...previous,
          [cameraId]:
            "Camera location has not been received yet.",
        }));

        setLastFetch((previous) => ({
          ...previous,
          [cameraId]: new Date(),
        }));

        return;
      }

      // GPS exists
      const timestamp =
        camera.locationUpdatedAt
          ? new Date(camera.locationUpdatedAt)
          : new Date();

      setGpsData((previous) => ({
        ...previous,
        [cameraId]: {
          latitude,
          longitude,
          accuracy,
          timestamp,
        },
      }));

      setLastFetch((previous) => ({
        ...previous,
        [cameraId]: new Date(),
      }));

      setLocationStatus((previous) => ({
        ...previous,
        [cameraId]: "LOCATION LIVE",
      }));

      setLocationError((previous) => ({
        ...previous,
        [cameraId]: "",
      }));

    } catch (error) {
      console.error(
        `Unable to fetch GPS for ${cameraId}:`,
        error
      );

      setLocationStatus((previous) => ({
        ...previous,
        [cameraId]: "LOCATION UNAVAILABLE",
      }));

      setLocationError((previous) => ({
        ...previous,
        [cameraId]:
          error.message ||
          "Unable to connect to the camera service.",
      }));
    }
  };

  // =====================================================
  // AUTOMATIC GPS REFRESH
  // =====================================================

  useEffect(() => {
    if (cameras.length === 0) {
      return;
    }

    // Initial GPS fetch
    cameras.forEach((camera) => {
      fetchCameraLocation(camera.cameraId);
    });

    // Refresh every 3 seconds
    const interval = setInterval(() => {
      cameras.forEach((camera) => {
        fetchCameraLocation(camera.cameraId);
      });
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [cameras.length]);

  // =====================================================
  // ADD CAMERA FORM
  // =====================================================

  const handleNewCameraChange = (event) => {
    const { name, value } = event.target;

    setNewCamera((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // AUTO CREATE VIDEO URL
  // =====================================================

  const handleIpChange = (event) => {
    const value = event.target.value;

    setNewCamera((previous) => ({
      ...previous,
      ipAddress: value,

      webCameraUrl:
        value.trim() !== ""
          ? `http://${value.trim()}:8080/video`
          : "",
    }));
  };

  // =====================================================
  // ADD CAMERA
  // =====================================================

  const handleAddCamera = async (event) => {
    event.preventDefault();

    if (!newCamera.cameraId.trim()) {
      alert("Please enter Camera ID.");
      return;
    }

    if (!newCamera.name.trim()) {
      alert("Please enter camera name.");
      return;
    }

    if (!newCamera.ipAddress.trim()) {
      alert("Please enter camera IP address.");
      return;
    }

    if (!newCamera.webCameraUrl.trim()) {
      alert("Please enter Web Camera URL.");
      return;
    }

    try {
      setAddingCamera(true);

      const payload = {
        cameraId: newCamera.cameraId.trim(),
        name: newCamera.name.trim(),
        location: newCamera.location.trim(),
        ipAddress: newCamera.ipAddress.trim(),
        port: Number(newCamera.port),
        webCameraUrl:
          newCamera.webCameraUrl.trim(),
        cameraType:
          newCamera.cameraType.trim() ||
          "IP WEBCAM",
        active: true,
      };

      const response = await fetch(
        CAMERAS_API,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorText =
          await response.text();

        throw new Error(
          errorText ||
          `Server returned ${response.status}`
        );
      }

      await response.json();

      alert(
        "Camera added successfully."
      );

      setNewCamera({
        cameraId: "",
        name: "",
        location: "",
        ipAddress: "",
        port: 8080,
        webCameraUrl: "",
        cameraType: "IP WEBCAM",
      });

      setShowAddCamera(false);

      await fetchCameras();

    } catch (error) {
      console.error(
        "Unable to add camera:",
        error
      );

      alert(
        `Unable to add camera.\n\n${error.message}`
      );

    } finally {
      setAddingCamera(false);
    }
  };

  // =====================================================
  // DELETE CAMERA
  // =====================================================

  const handleDeleteCamera = async (camera) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${camera.name} (${camera.cameraId})?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${CAMERAS_API}/${encodeURIComponent(
          camera.cameraId
        )}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorText =
          await response.text();

        throw new Error(
          errorText ||
          `Server returned ${response.status}`
        );
      }

      alert(
        "Camera deleted successfully."
      );

      setGpsData((previous) => {
        const updated = {
          ...previous,
        };

        delete updated[camera.cameraId];

        return updated;
      });

      setLocationStatus((previous) => {
        const updated = {
          ...previous,
        };

        delete updated[camera.cameraId];

        return updated;
      });

      setLocationError((previous) => {
        const updated = {
          ...previous,
        };

        delete updated[camera.cameraId];

        return updated;
      });

      await fetchCameras();

    } catch (error) {
      console.error(
        "Unable to delete camera:",
        error
      );

      alert(
        `Unable to delete camera.\n\n${error.message}`
      );
    }
  };

  // =====================================================
  // CAMERA FEED
  // =====================================================

  const handleFeedError = (cameraId) => {
    console.error(
      `Camera feed failed: ${cameraId}`
    );

    setFeedErrors((previous) => ({
      ...previous,
      [cameraId]: true,
    }));
  };

  const handleFeedLoad = (cameraId) => {
    setFeedErrors((previous) => ({
      ...previous,
      [cameraId]: false,
    }));
  };

  // =====================================================
  // REFRESH EVERYTHING
  // =====================================================

  const refreshAll = async () => {
    await fetchCameras();
  };

  // =====================================================
  // GPS FORMATTERS
  // =====================================================

  const getLatitude = (cameraId) => {
    const gps = gpsData[cameraId];

    return gps?.latitude != null
      ? gps.latitude.toFixed(6)
      : "--";
  };

  const getLongitude = (cameraId) => {
    const gps = gpsData[cameraId];

    return gps?.longitude != null
      ? gps.longitude.toFixed(6)
      : "--";
  };

  const getAccuracy = (cameraId) => {
    const gps = gpsData[cameraId];

    return gps?.accuracy != null
      ? `${gps.accuracy.toFixed(2)} m`
      : "--";
  };

  const getLastUpdated = (cameraId) => {
    const gps = gpsData[cameraId];

    if (!gps?.timestamp) {
      return "--";
    }

    return gps.timestamp.toLocaleTimeString();
  };

  // =====================================================
  // GOOGLE MAP
  // =====================================================

  const getMapUrl = (cameraId) => {
    const gps = gpsData[cameraId];

    if (
      !gps ||
      gps.latitude == null ||
      gps.longitude == null
    ) {
      return null;
    }

    return `https://www.google.com/maps?q=${gps.latitude},${gps.longitude}`;
  };

  const openMap = (cameraId) => {
    const mapUrl =
      getMapUrl(cameraId);

    if (!mapUrl) {
      return;
    }

    window.open(
      mapUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // =====================================================
  // OPENSTREETMAP
  // =====================================================

  const getMapEmbedUrl = (cameraId) => {
    const gps = gpsData[cameraId];

    if (
      !gps ||
      gps.latitude == null ||
      gps.longitude == null
    ) {
      return null;
    }

    const delta = 0.01;

    const left =
      gps.longitude - delta;

    const bottom =
      gps.latitude - delta;

    const right =
      gps.longitude + delta;

    const top =
      gps.latitude + delta;

    return (
      "https://www.openstreetmap.org/export/embed.html" +
      `?bbox=${left},${bottom},${right},${top}` +
      `&layer=mapnik` +
      `&marker=${gps.latitude},${gps.longitude}`
    );
  };

  // =====================================================
  // ACTIVE CAMERA COUNT
  // =====================================================

  const activeCameraCount =
    cameras.filter(
      (camera) => camera.active
    ).length;

  // =====================================================
  // GPS COUNT
  // =====================================================

  const gpsCameraCount =
    Object.keys(gpsData).length;

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="cctv-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="cctv-header">

        <div>

          <div className="cctv-eyebrow">
            SURVEILLANCE NETWORK
          </div>

          <h1>
            CCTV Management
          </h1>

          <p>
            Monitor connected investigation
            cameras and live locations
          </p>

        </div>

        <div className="cctv-network-status">

          <span className="status-dot"></span>

          SYSTEM ONLINE

        </div>

      </div>


      {/* =================================================
          SUMMARY
      ================================================= */}

      <div className="cctv-summary">

        <div className="summary-card">

          <span className="summary-label">
            ACTIVE CAMERAS
          </span>

          <strong>
            {activeCameraCount
              .toString()
              .padStart(2, "0")}
          </strong>

          <span className="summary-small">
            of 5 planned
          </span>

        </div>


        <div className="summary-card">

          <span className="summary-label">
            CAMERA STATUS
          </span>

          <strong className="green-text">
            {cameras.length > 0
              ? "ONLINE"
              : "WAITING"}
          </strong>

          <span className="summary-small">
            {cameras.length} camera
            {cameras.length !== 1
              ? "s"
              : ""} registered
          </span>

        </div>


        <div className="summary-card">

          <span className="summary-label">
            GPS STATUS
          </span>

          <strong className="green-text">
            {gpsCameraCount > 0
              ? "LIVE"
              : "WAITING"}
          </strong>

          <span className="summary-small">
            {gpsCameraCount} camera
            {gpsCameraCount !== 1
              ? "s"
              : ""} with GPS
          </span>

        </div>

      </div>


      {/* =================================================
          CAMERA SECTION
      ================================================= */}

      <div className="camera-section">

        <div className="section-header">

          <div>

            <h2>
              Connected Cameras
            </h2>

            <p>
              Live surveillance feeds
            </p>

          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >

            <button
              type="button"
              className="map-button"
              style={{
                width: "auto",
                marginTop: 0,
              }}
              onClick={refreshAll}
            >
              ↻
              <span>
                Refresh
              </span>
            </button>

            <button
              type="button"
              className="map-button"
              style={{
                width: "auto",
                marginTop: 0,
              }}
              onClick={() =>
                setShowAddCamera(
                  !showAddCamera
                )
              }
            >
              +
              <span>
                Add Camera
              </span>
            </button>

            <span className="camera-count">
              {cameras.length
                .toString()
                .padStart(2, "0")}{" "}
              CAMERA
              {cameras.length !== 1
                ? "S"
                : ""}
            </span>

          </div>

        </div>


        {/* =================================================
            ADD CAMERA
        ================================================= */}

        {showAddCamera && (

          <form
            onSubmit={handleAddCamera}
            style={{
              marginBottom: "22px",
              padding: "20px",
              border: "1px solid #e5e7eb",
              borderRadius: "14px",
              background: "#fafafa",
            }}
          >

            <h3
              style={{
                marginTop: 0,
                marginBottom: "18px",
              }}
            >
              Add New Camera
            </h3>


            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(2, minmax(0, 1fr))",
                gap: "14px",
              }}
            >

              <div>

                <label>
                  CAMERA ID
                </label>

                <input
                  type="text"
                  name="cameraId"
                  placeholder="CAM-002"
                  value={
                    newCamera.cameraId
                  }
                  onChange={
                    handleNewCameraChange
                  }
                  required
                  style={{
                    width: "100%",
                    boxSizing:
                      "border-box",
                    padding: "11px",
                    marginTop: "6px",
                    border:
                      "1px solid #ddd",
                    borderRadius: "8px",
                  }}
                />

              </div>


              <div>

                <label>
                  CAMERA NAME
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="Camera 02"
                  value={
                    newCamera.name
                  }
                  onChange={
                    handleNewCameraChange
                  }
                  required
                  style={{
                    width: "100%",
                    boxSizing:
                      "border-box",
                    padding: "11px",
                    marginTop: "6px",
                    border:
                      "1px solid #ddd",
                    borderRadius: "8px",
                  }}
                />

              </div>


              <div>

                <label>
                  LOCATION
                </label>

                <input
                  type="text"
                  name="location"
                  placeholder="Main Road"
                  value={
                    newCamera.location
                  }
                  onChange={
                    handleNewCameraChange
                  }
                  style={{
                    width: "100%",
                    boxSizing:
                      "border-box",
                    padding: "11px",
                    marginTop: "6px",
                    border:
                      "1px solid #ddd",
                    borderRadius: "8px",
                  }}
                />

              </div>


              <div>

                <label>
                  IP ADDRESS
                </label>

                <input
                  type="text"
                  name="ipAddress"
                  placeholder="192.168.8.194"
                  value={
                    newCamera.ipAddress
                  }
                  onChange={handleIpChange}
                  required
                  style={{
                    width: "100%",
                    boxSizing:
                      "border-box",
                    padding: "11px",
                    marginTop: "6px",
                    border:
                      "1px solid #ddd",
                    borderRadius: "8px",
                  }}
                />

              </div>


              <div>

                <label>
                  PORT
                </label>

                <input
                  type="number"
                  name="port"
                  value={
                    newCamera.port
                  }
                  onChange={
                    handleNewCameraChange
                  }
                  required
                  style={{
                    width: "100%",
                    boxSizing:
                      "border-box",
                    padding: "11px",
                    marginTop: "6px",
                    border:
                      "1px solid #ddd",
                    borderRadius: "8px",
                  }}
                />

              </div>


              <div>

                <label>
                  CAMERA TYPE
                </label>

                <input
                  type="text"
                  name="cameraType"
                  value={
                    newCamera.cameraType
                  }
                  onChange={
                    handleNewCameraChange
                  }
                  style={{
                    width: "100%",
                    boxSizing:
                      "border-box",
                    padding: "11px",
                    marginTop: "6px",
                    border:
                      "1px solid #ddd",
                    borderRadius: "8px",
                  }}
                />

              </div>


              <div
                style={{
                  gridColumn:
                    "1 / -1",
                }}
              >

                <label>
                  WEB CAMERA URL
                </label>

                <input
                  type="text"
                  name="webCameraUrl"
                  placeholder="http://192.168.8.194:8080/video"
                  value={
                    newCamera.webCameraUrl
                  }
                  onChange={
                    handleNewCameraChange
                  }
                  required
                  style={{
                    width: "100%",
                    boxSizing:
                      "border-box",
                    padding: "11px",
                    marginTop: "6px",
                    border:
                      "1px solid #ddd",
                    borderRadius: "8px",
                  }}
                />

              </div>

            </div>


            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "18px",
              }}
            >

              <button
                type="submit"
                className="map-button"
                style={{
                  width: "auto",
                  marginTop: 0,
                }}
                disabled={
                  addingCamera
                }
              >
                {addingCamera
                  ? "Adding..."
                  : "Add Camera"}
              </button>


              <button
                type="button"
                className="map-button"
                style={{
                  width: "auto",
                  marginTop: 0,
                }}
                onClick={() =>
                  setShowAddCamera(false)
                }
              >
                Cancel
              </button>

            </div>

          </form>

        )}


        {/* =================================================
            ERROR
        ================================================= */}

        {cameraError && (

          <div className="location-error">
            {cameraError}
          </div>

        )}


        {/* =================================================
            LOADING
        ================================================= */}

        {loadingCameras && (

          <div
            className="map-loading"
            style={{
              height: "220px",
            }}
          >

            <div className="map-loading-icon">
              ◎
            </div>

            <strong>
              Loading cameras...
            </strong>

            <span>
              Connecting to the
              Spring Boot camera service.
            </span>

          </div>

        )}


        {/* =================================================
            NO CAMERAS
        ================================================= */}

        {!loadingCameras &&
          cameras.length === 0 && (

            <div
              className="map-loading"
              style={{
                height: "220px",
              }}
            >

              <div className="map-loading-icon">
                +
              </div>

              <strong>
                No cameras registered
              </strong>

              <span>
                Click "Add Camera" to
                connect your first CCTV
                camera.
              </span>

            </div>

          )}


        {/* =================================================
            CAMERA CARDS
        ================================================= */}

        {!loadingCameras &&
          cameras.map((camera) => {

            const cameraGps =
              gpsData[camera.cameraId];

            const hasLocation =
              cameraGps?.latitude != null &&
              cameraGps?.longitude != null;

            const mapEmbedUrl =
              getMapEmbedUrl(
                camera.cameraId
              );

            const mapUrl =
              getMapUrl(
                camera.cameraId
              );

            const currentLocationStatus =
              locationStatus[
                camera.cameraId
              ] || "CONNECTING";

            const currentLocationError =
              locationError[
                camera.cameraId
              ] || "";

            const feedError =
              feedErrors[
                camera.cameraId
              ];

            return (

              <div
                className="camera-card"
                key={camera.cameraId}
                style={{
                  marginBottom: "20px",
                }}
              >

                {/* =================================================
                    VIDEO
                ================================================= */}

                <div className="camera-video">

                  {!feedError ? (

                    <img
                      src={
                        camera.webCameraUrl
                      }
                      alt={`${camera.name} live feed`}
                      onError={() =>
                        handleFeedError(
                          camera.cameraId
                        )
                      }
                      onLoad={() =>
                        handleFeedLoad(
                          camera.cameraId
                        )
                      }
                    />

                  ) : (

                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems:
                          "center",
                        justifyContent:
                          "center",
                        flexDirection:
                          "column",
                        gap: "10px",
                        color: "white",
                        background: "#111",
                        textAlign: "center",
                        padding: "20px",
                        boxSizing:
                          "border-box",
                      }}
                    >

                      <div
                        style={{
                          fontSize: "34px",
                        }}
                      >
                        ⚠
                      </div>

                      <strong>
                        Camera feed unavailable
                      </strong>

                      <span
                        style={{
                          fontSize: "12px",
                          color: "#aaa",
                        }}
                      >
                        {camera.webCameraUrl}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          setFeedErrors(
                            (previous) => ({
                              ...previous,
                              [camera.cameraId]:
                                false,
                            })
                          )
                        }
                        style={{
                          marginTop: "8px",
                          padding: "8px 14px",
                          border: 0,
                          borderRadius: "7px",
                          cursor: "pointer",
                        }}
                      >
                        Retry Feed
                      </button>

                    </div>

                  )}


                  <div className="live-badge">
                    <span></span>
                    LIVE
                  </div>


                  <div className="camera-id">
                    {camera.cameraId}
                  </div>

                </div>


                {/* =================================================
                    CAMERA INFO
                ================================================= */}

                <div className="camera-info">

                  <div className="camera-title">

                    <div>

                      <h3>
                        {camera.name}
                      </h3>

                      <p>
                        {camera.location ||
                          "Location not specified"}
                      </p>

                    </div>


                    <div
                      style={{
                        display: "flex",
                        alignItems:
                          "center",
                        gap: "14px",
                      }}
                    >

                      <div className="online-status">

                        <span></span>

                        {camera.active
                          ? "ONLINE"
                          : "OFFLINE"}

                      </div>


                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteCamera(
                            camera
                          )
                        }
                        style={{
                          border:
                            "1px solid #f0caca",
                          background:
                            "#fff5f5",
                          color:
                            "#c0392b",
                          padding:
                            "8px 12px",
                          borderRadius:
                            "8px",
                          cursor:
                            "pointer",
                          fontSize:
                            "11px",
                          fontWeight:
                            "600",
                        }}
                      >
                        Delete
                      </button>

                    </div>

                  </div>


                  <div className="camera-details">

                    <div>

                      <span>
                        IP ADDRESS
                      </span>

                      <strong>
                        {camera.ipAddress}
                      </strong>

                    </div>


                    <div>

                      <span>
                        PORT
                      </span>

                      <strong>
                        {camera.port}
                      </strong>

                    </div>


                    <div>

                      <span>
                        CAMERA TYPE
                      </span>

                      <strong>
                        {camera.cameraType ||
                          "IP WEBCAM"}
                      </strong>

                    </div>


                    <div>

                      <span>
                        WEB CAMERA URL
                      </span>

                      <strong
                        style={{
                          wordBreak:
                            "break-all",
                        }}
                      >
                        {camera.webCameraUrl}
                      </strong>

                    </div>

                  </div>

                </div>


                {/* =================================================
                    GPS LOCATION
                ================================================= */}

                <div
                  style={{
                    padding:
                      "0 20px 20px",
                  }}
                >

                  <div
                    className="location-section"
                    style={{
                      marginBottom: "0",
                      padding: "20px",
                    }}
                  >

                    <div className="location-header">

                      <div>

                        <div className="location-eyebrow">
                          CAMERA LOCATION
                        </div>

                        <h2>
                          Live GPS Position
                        </h2>

                        <p>
                          GPS location received
                          from {camera.name}
                        </p>

                      </div>


                      <div
                        className={`location-status ${
                          hasLocation
                            ? "location-live"
                            : ""
                        }`}
                      >

                        <span></span>

                        {currentLocationStatus}

                      </div>

                    </div>


                    <div className="location-content">

                      {/* =================================================
                          MAP
                      ================================================= */}

                      <div className="map-container">

                        {hasLocation &&
                        mapEmbedUrl ? (

                          <div className="real-map">

                            <iframe
                              title={`${camera.name} GPS Location`}
                              src={
                                mapEmbedUrl
                              }
                              loading="lazy"
                              style={{
                                width: "100%",
                                height: "100%",
                                border: 0,
                              }}
                            />

                            <div className="map-camera-label">

                              <strong>
                                📍 {camera.name}
                              </strong>

                              <span>
                                {getLatitude(
                                  camera.cameraId
                                )}
                                ,{" "}
                                {getLongitude(
                                  camera.cameraId
                                )}
                              </span>

                            </div>

                          </div>

                        ) : (

                          <div className="map-loading">

                            <div className="map-loading-icon">
                              ◎
                            </div>

                            <strong>
                              Waiting for GPS
                            </strong>

                            <span>
                              Waiting for{" "}
                              {camera.name}{" "}
                              to send its
                              phone location.
                            </span>

                          </div>

                        )}

                      </div>


                      {/* =================================================
                          GPS DATA
                      ================================================= */}

                      <div className="location-data">

                        <div className="location-data-header">

                          <div className="location-icon">
                            ◎
                          </div>

                          <div>

                            <h3>
                              {camera.name}
                            </h3>

                            <p>
                              GPS information
                            </p>

                          </div>

                        </div>


                        {/* COORDINATES */}

                        <div className="coordinates">

                          <div className="coordinate-box">

                            <span>
                              LATITUDE
                            </span>

                            <strong>
                              {getLatitude(
                                camera.cameraId
                              )}
                            </strong>

                          </div>


                          <div className="coordinate-box">

                            <span>
                              LONGITUDE
                            </span>

                            <strong>
                              {getLongitude(
                                camera.cameraId
                              )}
                            </strong>

                          </div>

                        </div>


                        {/* METADATA */}

                        <div className="location-metadata">

                          <div>

                            <span>
                              GPS ACCURACY
                            </span>

                            <strong>
                              {getAccuracy(
                                camera.cameraId
                              )}
                            </strong>

                          </div>


                          <div>

                            <span>
                              LAST GPS UPDATE
                            </span>

                            <strong>
                              {getLastUpdated(
                                camera.cameraId
                              )}
                            </strong>

                          </div>

                        </div>


                        {/* SERVER STATUS */}

                        <div className="location-server-status">

                          <span className="server-dot"></span>

                          <div>

                            <strong>
                              Spring Boot GPS
                              Service
                            </strong>

                            <small>
                              {lastFetch[
                                camera.cameraId
                              ]
                                ? `Last server check: ${lastFetch[
                                    camera.cameraId
                                  ].toLocaleTimeString()}`
                                : "Connecting to server..."}
                            </small>

                          </div>

                        </div>


                        {/* ERROR */}

                        {currentLocationError && (

                          <div className="location-error">
                            {
                              currentLocationError
                            }
                          </div>

                        )}


                        {/* REFRESH */}

                        <button
                          type="button"
                          className="map-button"
                          onClick={() =>
                            fetchCameraLocation(
                              camera.cameraId
                            )
                          }
                        >
                          ↻
                          <span>
                            Refresh GPS Location
                          </span>
                          <span className="button-arrow">
                            →
                          </span>
                        </button>


                        {/* GOOGLE MAP */}

                        <button
                          type="button"
                          className="map-button secondary-map-button"
                          onClick={() =>
                            openMap(
                              camera.cameraId
                            )
                          }
                          disabled={!mapUrl}
                        >
                          ◎
                          <span>
                            Open in Google Maps
                          </span>
                          <span className="button-arrow">
                            ↗
                          </span>
                        </button>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            );
          })}

      </div>


      {/* =================================================
          FUTURE CAMERAS
      ================================================= */}

      <div className="future-cameras">

        <div className="future-icon">
          +
        </div>

        <div>

          <h3>
            Additional cameras
          </h3>

          <p>
            Cameras{" "}
            {Math.max(
              0,
              5 - cameras.length
            )}{" "}
            more can be connected.
            Add them using the Add Camera
            option above.
          </p>

        </div>

      </div>

    </div>
  );
}

export default CCTVManagement;