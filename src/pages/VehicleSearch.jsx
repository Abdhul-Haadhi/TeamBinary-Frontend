import { useState } from "react";

import Hero from "../components/Hero";
import UploadCard from "../components/UploadCard";
import VehicleDescription from "../components/VehicleDescription";
import SearchPanel from "../components/SearchPanel";
import VehicleResults from "../components/VehicleResults";

export default function VehicleSearch() {

  // ============================================================
  // VEHICLE IMAGE
  // ============================================================

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // ============================================================
  // VEHICLE DESCRIPTION
  // ============================================================

  const [description, setDescription] = useState("");

  // ============================================================
  // SEARCH STATE
  // ============================================================

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // ============================================================
  // SEARCH VEHICLE
  // ============================================================

  const handleSearch = async () => {

    if (!image) {
      alert("Please upload a vehicle image.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {

      // ========================================================
      // CREATE FORM DATA
      // ========================================================

      const formData = new FormData();

      formData.append("file", image);

      // ========================================================
      // SEND IMAGE TO SPRING BOOT
      // ========================================================

      const response = await fetch(
        "http://localhost:8080/api/vehicles/search",
        {
          method: "POST",
          body: formData,
        }
      );

      // ========================================================
      // CHECK RESPONSE
      // ========================================================

      if (!response.ok) {
        throw new Error(
          `Server returned ${response.status}`
        );
      }

      // ========================================================
      // READ RESPONSE
      // ========================================================

      const data = await response.json();

      console.log(
        "Vehicle search response:",
        data
      );

      // ========================================================
      // HANDLE AI FAILURE
      // ========================================================

      if (!data.success) {

        alert(
          data.message ||
          "No vehicle match found."
        );

        return;
      }

      // ========================================================
      // GET MATCHES
      // ========================================================

      const matches = Array.isArray(data.matches)
        ? data.matches
        : [];

      // ========================================================
      // BEST MATCH
      // ========================================================

      const bestMatch =
        matches.length > 0
          ? matches[0]
          : null;

      // ========================================================
      // VEHICLE TYPE
      //
      // Sometimes YOLO doesn't return vehicleType at
      // top level, but the best similarity match does.
      // ========================================================

      const vehicleType =
        data.vehicleType ||
        bestMatch?.vehicleType ||
        "Unknown";

      // ========================================================
      // VEHICLE COLOR
      // ========================================================

      const vehicleColor =
        data.color ||
        "Unknown";

      // ========================================================
      // BEST MATCH SIMILARITY
      // ========================================================

      const bestSimilarity =
        bestMatch
          ? Number(bestMatch.similarity || 0)
          : 0;

      // Convert 0.658 -> 65.8
      const matchConfidence =
        Math.round(
          bestSimilarity * 1000
        ) / 10;

      // ========================================================
      // BUILD FRONTEND RESULT
      // ========================================================

      const formattedResult = {

        // Uploaded image preview
        image: preview,

        // Vehicle information
        vehicleType: vehicleType,

        color: vehicleColor,

        // YOLO confidence
        detectionConfidence:
          Number(
            data.detectionConfidence || 0
          ),

        // Best similarity
        confidence:
          matchConfidence,

        // All matches
        matches: matches,

        // Original API response
        rawData: data,
      };

      console.log(
        "Formatted frontend result:",
        formattedResult
      );

      // ========================================================
      // SAVE RESULT
      // ========================================================

      setResult(formattedResult);

    } catch (error) {

      console.error(
        "Vehicle search error:",
        error
      );

      alert(
        "Unable to connect to the vehicle AI service. Please make sure Spring Boot and FastAPI are running."
      );

    } finally {

      setLoading(false);

    }
  };

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <div className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">

      {/* ======================================================
          HERO
      ====================================================== */}

      <Hero />

      {/* ======================================================
          IMAGE + DESCRIPTION
      ====================================================== */}

      <div className="mt-10 grid gap-8 lg:grid-cols-2">

        <UploadCard
          image={image}
          preview={preview}
          setImage={setImage}
          setPreview={setPreview}
        />

        <VehicleDescription
          description={description}
          setDescription={setDescription}
        />

      </div>

      {/* ======================================================
          SEARCH
      ====================================================== */}

      <SearchPanel
        loading={loading}
        onSearch={handleSearch}
      />

      {/* ======================================================
          RESULTS
      ====================================================== */}

      <VehicleResults
        result={result}
        preview={preview}
      />

    </div>
  );
}
