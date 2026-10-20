
export default function TextSearchResults({
    data,
    loading,
    error,
}) {
    // Convert confidence values to percentages.
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

        return `${(number <= 1 ? number * 100 : number).toFixed(1)}%`;
    };

    // Support either "results" or "matches" from the backend.
    const matches = Array.isArray(data?.results)
        ? data.results
        : Array.isArray(data?.matches)
            ? data.matches
            : [];

    // Don't display this section before a text search starts.
    if (!data && !loading && !error) {
        return null;
    }

    return (
        <section className="mt-10 rounded-2xl border border-gray-200 bg-white p-5 shadow-lg sm:p-7">

            {/* Header */}

            <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-widest text-[#70031B]">
                    Description Search
                </span>

                <h2 className="mt-2 text-2xl font-bold text-gray-900">
                    CCTV Frame Matches
                </h2>

                {data?.query && (
                    <p className="mt-2 text-sm text-gray-600">
                        Search description: {data.query}
                    </p>
                )}
            </div>

            {/* Loading */}

            {loading && (
                <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-5">
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-[#70031B]" />

                    <p className="text-sm text-gray-700">
                        Searching processed CCTV frames...
                    </p>
                </div>
            )}

            {/* Error */}

            {error && (
                <div
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                >
                    {error}
                </div>
            )}

            {/* Search results */}

            {data && !loading && (
                <>
                    <div className="mb-5 rounded-xl bg-gray-50 p-4">
                        <p className="text-sm text-gray-500">
                            Potential matches
                        </p>

                        <p className="mt-1 text-2xl font-bold text-gray-900">
                            {matches.length}
                        </p>
                    </div>

                    {matches.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
                            <div className="mb-3 text-3xl">
                                📹
                            </div>

                            <h3 className="font-semibold text-gray-800">
                                No Matching Frames Found
                            </h3>

                            <p className="mt-2 text-sm text-gray-600">
                                No matching CCTV frames were returned
                                for this description.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-5 md:grid-cols-2">
                            {matches.map((match, index) => {
                                const frameImage =
                                    match.frameImage ||
                                    match.imageUrl ||
                                    match.thumbnailUrl ||
                                    null;

                                return (
                                    <article
                                        key={
                                            match.id ||
                                            match.frameId ||
                                            `${match.cameraId || "camera"}-${match.timestamp || index}`
                                        }
                                        className="overflow-hidden rounded-xl border border-gray-200"
                                    >
                                        {/* Optional CCTV frame image */}

                                        {frameImage && (
                                            <img
                                                src={frameImage}
                                                alt={`CCTV frame match ${index + 1}`}
                                                className="max-h-72 w-full bg-gray-100 object-contain"
                                            />
                                        )}

                                        {/* Match header */}

                                        <div className="border-b border-gray-200 p-4">
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">
                                                        {match.cameraName ||
                                                            "Unknown Camera"}
                                                    </h3>

                                                    <p className="mt-1 text-sm text-gray-500">
                                                        📍{" "}
                                                        {match.cameraLocation ||
                                                            match.location ||
                                                            "Location unavailable"}
                                                    </p>
                                                </div>

                                                <span className="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                                                    Match {index + 1}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Vehicle details */}

                                        <div className="grid grid-cols-2 gap-4 p-4">
                                            <div>
                                                <p className="text-xs text-gray-500">
                                                    Vehicle Type
                                                </p>

                                                <p className="mt-1 font-medium text-gray-900">
                                                    {match.vehicleType ||
                                                        match.className ||
                                                        "N/A"}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs text-gray-500">
                                                    Color
                                                </p>

                                                <p className="mt-1 font-medium text-gray-900">
                                                    {match.color ||
                                                        match.vehicleColor ||
                                                        "N/A"}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs text-gray-500">
                                                    Number Plate
                                                </p>

                                                <p className="mt-1 break-words font-mono font-semibold text-gray-900">
                                                    {match.detectedPlate ||
                                                        match.plate ||
                                                        match.recognizedText ||
                                                        "N/A"}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs text-gray-500">
                                                    Timestamp
                                                </p>

                                                <p className="mt-1 font-medium text-gray-900">
                                                    {(match.timestamp || match.timestampSeconds) ?? "N/A"}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs text-gray-500">
                                                    Match Confidence
                                                </p>

                                                <p className="mt-1 font-semibold text-[#70031B]">
                                                    {formatConfidence(
                                                        match.matchConfidence ??
                                                        match.similarity ??
                                                        match.confidence
                                                    )}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs text-gray-500">
                                                    Video
                                                </p>

                                                <p className="mt-1 break-words text-sm font-medium text-gray-900">
                                                    {match.videoFileName ||
                                                        match.fileName ||
                                                        "N/A"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Additional match information */}

                                        {match.frameNumber != null && (
                                            <div className="border-t border-gray-200 px-4 py-3 text-sm text-gray-600">
                                                Frame number: {match.frameNumber}
                                            </div>
                                        )}
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </>
            )}
        </section>
    );
}
