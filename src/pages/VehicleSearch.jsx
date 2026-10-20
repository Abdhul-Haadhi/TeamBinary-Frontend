import { useState } from "react";

import Hero from "../components/Hero";
import UploadCard from "../components/UploadCard";
import VehicleDescription from "../components/VehicleDescription";
import SearchPanel from "../components/SearchPanel";
import VehicleResults from "../components/VehicleResults";
import NumberPlateResults from "../components/NumberPlateResults";
import TextSearchResults from "../components/TextSearchResults";

// ============================================================
// API URLS
// ============================================================

const VEHICLE_IMAGE_SEARCH_URL =
  "http://localhost:8080/api/vehicles/search";

const NUMBER_PLATE_URL =
  "http://localhost:8080/api/number-plate/detect";

// This endpoint will be implemented in the backend next.
const TEXT_SEARCH_URL =
  "http://localhost:8080/api/vehicles/text-search";

// ============================================================
// READ JSON RESPONSE AND REPORT SERVER ERRORS
// ============================================================

async function readApiResponse(response, defaultError) {
  const text = await response.text();

  let data;

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { message: text };
  }

  if (!response.ok) {
    throw new Error(
      data.message ||
      data.error ||
      `${defaultError} (HTTP ${response.status})`
    );
  }

  return data;
}

// ============================================================
// NUMBER-PLATE DETECTION
// ============================================================

async function detectNumberPlate(file, token) {
  const formData = new FormData();
  formData.append("file", file);

  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(NUMBER_PLATE_URL, {
    method: "POST",
    headers,
    body: formData,
  });

  return readApiResponse(
    response,
    "Number-plate detection failed"
  );
}

// ============================================================
// VEHICLE IMAGE SEARCH
// ============================================================


async function searchVehicleByImage(file, token) {
  // Require the logged-in user's JWT.
  if (!token) {
    throw new Error("Please log in again. Authentication token is missing.");
  }

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(VEHICLE_IMAGE_SEARCH_URL, {
    method: "POST",

    // Add authentication. Let the browser set multipart Content-Type.
    headers: {
      Authorization: `Bearer ${token}`,
    },

    body: formData,
  });

  return readApiResponse(
    response,
    "Vehicle image search failed"
  );
}


// ============================================================
// TEXT-BASED CCTV SEARCH
// Request contract: { "description": "white car..." }
// The backend endpoint will be developed next.
// ============================================================


async function searchVehicleByText(description, token) {
  if (!token) {
    throw new Error("Please log in again. Authentication token is missing.");
  }

  const response = await fetch(TEXT_SEARCH_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      description,
    }),
  });

  return readApiResponse(
    response,
    "Text-based vehicle search failed"
  );
}


// ============================================================
// MAIN VEHICLE SEARCH PAGE
// ============================================================

export default function VehicleSearch() {
  // Uploaded image and preview.
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // Text description.
  const [description, setDescription] = useState("");

  // Image-search result.
  const [result, setResult] = useState(null);
  const [vehicleSearchError, setVehicleSearchError] = useState("");

  // Number-plate result.
  const [plateResult, setPlateResult] = useState(null);
  const [plateLoading, setPlateLoading] = useState(false);
  const [plateError, setPlateError] = useState("");

  // Text-search result.
  const [textSearchResult, setTextSearchResult] = useState(null);
  const [textSearchLoading, setTextSearchLoading] = useState(false);
  const [textSearchError, setTextSearchError] = useState("");

  // Overall search state for the main SearchPanel button.
  const [loading, setLoading] = useState(false);

  // ========================================================
  // SEARCH
  // Runs the requests required by the supplied inputs.
  // ========================================================

  const handleSearch = async () => {
    const query = description.trim();
    const hasImage = Boolean(image);
    const hasDescription = Boolean(query);

    // Require at least one search input.
    if (!hasImage && !hasDescription) {
      alert(
        "Please upload a vehicle image or enter a vehicle description."
      );
      return;
    }

    // Reset results from the previous search.
    setResult(null);
    setVehicleSearchError("");

    setPlateResult(null);
    setPlateError("");
    setPlateLoading(hasImage);

    setTextSearchResult(null);
    setTextSearchError("");
    setTextSearchLoading(hasDescription);

    setLoading(true);

    const token = localStorage.getItem("token");
    const tasks = [];

    // ----------------------------------------------------
    // 1. IMAGE-BASED VEHICLE SEARCH
    // ----------------------------------------------------

    if (hasImage) {
      tasks.push(
        (async () => {
          try {
            const data = await searchVehicleByImage(image, token);

            console.log(
              "Vehicle image search response:",
              data
            );

            if (data.success === false) {
              throw new Error(
                data.message ||
                "Vehicle image search was unsuccessful."
              );
            }

            const matches = Array.isArray(data.matches)
              ? data.matches
              : [];

            const bestMatch = matches[0] || null;

            const vehicleType =
              data.vehicleType ||
              bestMatch?.vehicleType ||
              "Unknown";

            const vehicleColor =
              data.color ||
              bestMatch?.color ||
              "Unknown";

            const bestSimilarity = bestMatch
              ? Number(
                bestMatch.similarity ??
                bestMatch.matchConfidence ??
                0
              )
              : 0;

            const matchConfidence =
              Math.round(bestSimilarity * 1000) / 10;

            setResult({
              image: preview,
              vehicleType,
              color: vehicleColor,
              detectionConfidence: Number(
                data.detectionConfidence || 0
              ),
              confidence: matchConfidence,
              matches,
              rawData: data,
            });
          } catch (error) {
            console.error(
              "Vehicle image search error:",
              error
            );

            setVehicleSearchError(
              error.message ||
              "Unable to search vehicles by image."
            );
          }
        })()
      );

      // ------------------------------------------------
      // 2. NUMBER-PLATE DETECTION
      // ------------------------------------------------

      tasks.push(
        (async () => {
          try {
            const data = await detectNumberPlate(
              image,
              token
            );

            console.log(
              "Number-plate detection response:",
              data
            );

            setPlateResult(data);

            if (data.success === false) {
              setPlateError(
                data.message ||
                "Number-plate detection was unsuccessful."
              );
            }
          } catch (error) {
            console.error(
              "Number-plate detection error:",
              error
            );

            setPlateError(
              error.message ||
              "Unable to detect the number plate."
            );
          } finally {
            setPlateLoading(false);
          }
        })()
      );
    }

    // ----------------------------------------------------
    // 3. TEXT-BASED VEHICLE SEARCH
    // ----------------------------------------------------

    if (hasDescription) {
      tasks.push(
        (async () => {
          try {
            const data = await searchVehicleByText(
              query,
              token
            );

            console.log(
              "Text vehicle search response:",
              data
            );

            if (data.success === false) {
              throw new Error(
                data.message ||
                "Text-based vehicle search was unsuccessful."
              );
            }

            // Accept "results" or "matches" response arrays.
            const matches = Array.isArray(data.results)
              ? data.results
              : Array.isArray(data.matches)
                ? data.matches
                : [];

            setTextSearchResult({
              ...data,
              query: data.query || query,
              results: matches,
            });
          } catch (error) {
            console.error(
              "Text vehicle search error:",
              error
            );

            setTextSearchError(
              error.message ||
              "Unable to search vehicles by description."
            );
          } finally {
            setTextSearchLoading(false);
          }
        })()
      );
    }

    // Wait for all requested searches to finish.
    // Each request handles its own error so the other searches
    // can still display their results.
    await Promise.allSettled(tasks);

    setLoading(false);
  };

  // ========================================================
  // PAGE
  // ========================================================

  return (
    <div className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">

      {/* Header */}

      <Hero />

      {/* Image upload and text description */}

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

      {/* One search button for all selected inputs */}

      <SearchPanel
        loading={loading}
        onSearch={handleSearch}
      />

      {/* Image-search errors */}

      {vehicleSearchError && (
        <div
          role="alert"
          className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {vehicleSearchError}
        </div>
      )}

      {/* Number-plate results appear when an image was provided */}

      <NumberPlateResults
        data={plateResult}
        loading={plateLoading}
        error={plateError}
        sourceImage={preview}
      />

      {/* Vehicle image similarity results */}

      <VehicleResults
        result={result}
        preview={preview}
      />

      {/* Text-based CCTV frame matches */}

      <TextSearchResults
        data={textSearchResult}
        loading={textSearchLoading}
        error={textSearchError}
      />

    </div>
  );
}
