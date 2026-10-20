
import { useEffect, useState } from "react";

// ============================================================
// NUMBER-PLATE RESULTS
// ============================================================

export default function NumberPlateResults({
    data,
    loading,
    error,
    sourceImage,
}) {
    const [plateCrops, setPlateCrops] = useState({});

    // ========================================================
    // FORMAT CONFIDENCE
    // ========================================================

    const formatConfidence = (value) => {
        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return "N/A";
        }

        const number = Number(value);

        if (!Number.isFinite(number)) {
            return "N/A";
        }

        return `${(number * 100).toFixed(1)}%`;
    };

    // ========================================================
    // CROP AND ENLARGE PLATES FROM THE ORIGINAL IMAGE
    //
    // The Spring Boot DTO provides bounding-box coordinates,
    // but does not provide plateImage. Crop in the browser.
    // ========================================================

    useEffect(() => {
        let cancelled = false;

        setPlateCrops({});

        const detections = Array.isArray(data?.detections)
            ? data.detections
            : [];

        if (!sourceImage || detections.length === 0) {
            return () => {
                cancelled = true;
            };
        }

        const originalImage = new Image();

        originalImage.onload = () => {
            if (cancelled) {
                return;
            }

            const generatedCrops = {};

            detections.forEach((detection, index) => {
                const coordinates = [
                    detection.x1,
                    detection.y1,
                    detection.x2,
                    detection.y2,
                ];

                // Skip invalid or missing bounding boxes.
                const validCoordinates = coordinates.every(
                    (coordinate) =>
                        coordinate !== null &&
                        coordinate !== undefined &&
                        Number.isFinite(Number(coordinate))
                );

                if (!validCoordinates) {
                    return;
                }

                const imageWidth = originalImage.naturalWidth;
                const imageHeight = originalImage.naturalHeight;

                const rawX1 = Number(detection.x1);
                const rawY1 = Number(detection.y1);
                const rawX2 = Number(detection.x2);
                const rawY2 = Number(detection.y2);

                const boxWidth = rawX2 - rawX1;
                const boxHeight = rawY2 - rawY1;

                if (boxWidth <= 0 || boxHeight <= 0) {
                    return;
                }

                // Add padding so the crop includes the plate edges.
                const paddingX = Math.max(
                    2,
                    Math.round(boxWidth * 0.08)
                );

                const paddingY = Math.max(
                    2,
                    Math.round(boxHeight * 0.18)
                );

                const cropX1 = Math.max(
                    0,
                    Math.floor(rawX1 - paddingX)
                );

                const cropY1 = Math.max(
                    0,
                    Math.floor(rawY1 - paddingY)
                );

                const cropX2 = Math.min(
                    imageWidth,
                    Math.ceil(rawX2 + paddingX)
                );

                const cropY2 = Math.min(
                    imageHeight,
                    Math.ceil(rawY2 + paddingY)
                );

                const cropWidth = cropX2 - cropX1;
                const cropHeight = cropY2 - cropY1;

                if (cropWidth <= 0 || cropHeight <= 0) {
                    return;
                }

                // Enlarge small plates, up to a maximum scale of 10x.
                const scale = Math.min(
                    10,
                    Math.max(1, 800 / cropWidth)
                );

                const canvas = document.createElement("canvas");

                canvas.width = Math.max(
                    1,
                    Math.round(cropWidth * scale)
                );

                canvas.height = Math.max(
                    1,
                    Math.round(cropHeight * scale)
                );

                const context = canvas.getContext("2d");

                if (!context) {
                    return;
                }

                context.imageSmoothingEnabled = true;
                context.imageSmoothingQuality = "high";

                context.drawImage(
                    originalImage,
                    cropX1,
                    cropY1,
                    cropWidth,
                    cropHeight,
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );

                generatedCrops[index] = canvas.toDataURL(
                    "image/jpeg",
                    0.92
                );
            });

            if (!cancelled) {
                setPlateCrops(generatedCrops);
            }
        };

        originalImage.onerror = () => {
            if (!cancelled) {
                setPlateCrops({});
            }
        };

        originalImage.src = sourceImage;

        return () => {
            cancelled = true;
        };
    }, [data, sourceImage]);

    // ========================================================
    // HIDE THIS SECTION BEFORE A SEARCH
    // ========================================================

    if (!data && !loading && !error) {
        return null;
    }

    const detections = Array.isArray(data?.detections)
        ? data.detections
        : [];

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">

            {/* HEADER */}

            <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
                    AI Analysis
                </span>

                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                    Number Plate Detection
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                    Detected plate locations, enlarged plate crops,
                    and OCR readings from the uploaded image.
                </p>
            </div>

            {/* LOADING */}

            {loading && (
                <div className="mb-5 flex items-center gap-3 rounded-xl bg-indigo-50 p-4 text-indigo-800">
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-700" />

                    <span className="text-sm font-medium">
                        Detecting number plates...
                    </span>
                </div>
            )}

            {/* ERROR */}

            {error && (
                <div
                    role="alert"
                    className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                >
                    {error}
                </div>
            )}

            {/* RESULTS */}

            {data && (
                <>
                    {/* SESSION DETAILS */}

                    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 p-4">
                        <div>
                            <p className="text-sm text-slate-500">
                                Detection session
                            </p>

                            <p className="mt-1 font-semibold text-slate-900">
                                {data.sessionId != null
                                    ? `#${data.sessionId}`
                                    : "N/A"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-slate-500">
                                Plates detected
                            </p>

                            <p className="mt-1 font-semibold text-slate-900">
                                {detections.length}
                            </p>
                        </div>
                    </div>

                    {/* ANNOTATED FULL IMAGE */}

                    {data.image && (
                        <div className="mb-8">
                            <h3 className="mb-3 text-lg font-semibold text-slate-900">
                                Annotated Vehicle Image
                            </h3>

                            <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-2">
                                <img
                                    src={data.image}
                                    alt="Vehicle with number-plate detections marked"
                                    className="mx-auto block h-auto max-h-[550px] max-w-full rounded-lg object-contain"
                                />
                            </div>

                            <p className="mt-2 text-xs text-slate-500">
                                The bounding boxes show where the detector
                                located number plates in the full image.
                            </p>
                        </div>
                    )}

                    {/* NO PLATES */}

                    {detections.length === 0 && (
                        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center">
                            <h3 className="font-semibold text-slate-800">
                                No Number Plate Detected
                            </h3>

                            <p className="mt-2 text-sm text-slate-600">
                                No number-plate bounding boxes were returned
                                for this image.
                            </p>
                        </div>
                    )}

                    {/* DETECTED PLATE CARDS */}

                    {detections.length > 0 && (
                        <div>
                            <h3 className="mb-4 text-lg font-semibold text-slate-900">
                                Enlarged Number Plates
                            </h3>

                            <div className="grid gap-5 md:grid-cols-2">

                                {detections.map((detection, index) => {
                                    const plateText =
                                        detection.recognizedText?.trim();

                                    return (
                                        <article
                                            key={`${data.sessionId ?? "plate"}-${index}`}
                                            className="overflow-hidden rounded-xl border border-slate-200 bg-white"
                                        >
                                            {/* CARD HEADER */}

                                            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
                                                <h4 className="font-semibold text-slate-900">
                                                    Plate {index + 1}
                                                </h4>

                                                <span className="rounded-md bg-slate-100 px-3 py-1 font-mono text-sm font-bold text-slate-800">
                                                    {plateText || "Unreadable"}
                                                </span>
                                            </div>

                                            {/* CROPPED / ZOOMED PLATE */}

                                            <div className="flex min-h-36 items-center justify-center bg-slate-100 p-4">
                                                {plateCrops[index] ? (
                                                    <img
                                                        src={plateCrops[index]}
                                                        alt={`Enlarged crop of number plate ${index + 1}`}
                                                        className="block max-h-64 max-w-full rounded-md border border-slate-300 bg-white object-contain shadow-sm"
                                                    />
                                                ) : sourceImage ? (
                                                    <p className="text-sm text-slate-500">
                                                        Preparing enlarged crop...
                                                    </p>
                                                ) : (
                                                    <p className="text-sm text-slate-500">
                                                        Original image is unavailable.
                                                    </p>
                                                )}
                                            </div>

                                            {/* CONFIDENCE DETAILS */}

                                            <div className="grid grid-cols-2 gap-4 p-4">
                                                <div>
                                                    <p className="text-xs text-slate-500">
                                                        Detection confidence
                                                    </p>

                                                    <p className="mt-1 font-semibold text-slate-900">
                                                        {formatConfidence(
                                                            detection.confidence
                                                        )}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-xs text-slate-500">
                                                        OCR confidence
                                                    </p>

                                                    <p className="mt-1 font-semibold text-slate-900">
                                                        {formatConfidence(
                                                            detection.ocrConfidence
                                                        )}
                                                    </p>
                                                </div>

                                                <div className="col-span-2">
                                                    <p className="text-xs text-slate-500">
                                                        Detector class
                                                    </p>

                                                    <p className="mt-1 font-medium text-slate-800">
                                                        {detection.className || "N/A"}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* BOUNDING BOX */}

                                            <details className="border-t border-slate-200 px-4 py-3">
                                                <summary className="cursor-pointer text-sm font-medium text-slate-700">
                                                    View bounding-box coordinates
                                                </summary>

                                                <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-slate-600">
                                                    <p>
                                                        X1: {detection.x1 ?? "N/A"}
                                                    </p>

                                                    <p>
                                                        Y1: {detection.y1 ?? "N/A"}
                                                    </p>

                                                    <p>
                                                        X2: {detection.x2 ?? "N/A"}
                                                    </p>

                                                    <p>
                                                        Y2: {detection.y2 ?? "N/A"}
                                                    </p>
                                                </div>
                                            </details>

                                            {/* OCR NOTE */}

                                            <div className="border-t border-amber-200 bg-amber-50 px-4 py-3">
                                                <p className="text-xs leading-5 text-amber-800">
                                                    OCR text is a candidate
                                                    reading. Visually verify
                                                    the plate before treating
                                                    it as evidence.
                                                </p>
                                            </div>
                                        </article>
                                    );
                                })}

                            </div>
                        </div>
                    )}
                </>
            )}
        </section>
    );
}
