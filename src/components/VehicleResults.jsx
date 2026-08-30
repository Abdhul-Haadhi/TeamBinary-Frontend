import { motion } from "framer-motion";
import {
  CheckCircle2,
  CarFront,
  MapPin,
  Clock3,
  Hash,
  Palette,
  Camera,
  Route,
  Target,
} from "lucide-react";

export default function VehicleResults({ result,preview,

 }) {
  if (!result) return null;

  const vehicleType =
      result.vehicleType ||
      result.matches?.[0]?.vehicleType ||
      "Unknown";
  const color =
    result.color || "Unknown";

  const confidence =
     Number(result.confidence) > 0
    ? Number(result.confidence)
    : Number(result.matches?.[0]?.similarity || 0) * 100;

  const detectionConfidence =
    Number(result.detectionConfidence || 0);

  const matches =
    Array.isArray(result.matches)
      ? result.matches
      : [];

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mt-10"
    >
      {/* =====================================================
          HEADING
      ===================================================== */}

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Vehicle Search Results
        </h2>

        <p className="text-sm text-gray-500">
          AI analysis and CCTV detection results
        </p>
      </div>

      {/* =====================================================
          MAIN RESULT CARD
      ===================================================== */}

      <div className="overflow-hidden rounded-3xl bg-white shadow-2xl">

        {/* ===================================================
            RESULT HEADER
        =================================================== */}

        <div className="flex flex-col gap-4 border-b border-gray-100 p-6 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">

            <CheckCircle2
              size={28}
              className="text-green-600"
            />

            <div>
              <h3 className="font-bold text-gray-900">
                Vehicle Match Found
              </h3>

              <p className="text-sm text-gray-500">
                AI vehicle similarity analysis completed
              </p>
            </div>

          </div>

          {/* Confidence */}

          <div className="rounded-2xl bg-green-50 px-5 py-3">

            <p className="text-xs font-medium text-green-700">
              AI MATCH CONFIDENCE
            </p>

            <p className="text-2xl font-bold text-green-700">
              {confidence}%
            </p>

          </div>

        </div>

        {/* ===================================================
            MAIN CONTENT
        =================================================== */}

        <div className="grid gap-8 p-6 lg:grid-cols-5">

          {/* =================================================
              VEHICLE IMAGE
          ================================================= */}

          <div className="lg:col-span-2">

            <div className="relative overflow-hidden rounded-2xl bg-gray-100">

              {preview ? (
                <img
                  src={preview}
                  alt="Detected vehicle"
                  className="h-80 w-full object-contain"
                />
              ) : (
                <div className="flex h-80 items-center justify-center text-gray-400">
                  Vehicle image unavailable
                </div>
              )}

              <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/70 px-4 py-2 text-sm font-medium text-white backdrop-blur">

                <CarFront size={16} />

                Vehicle Detected

              </div>

            </div>

          </div>

          {/* =================================================
              VEHICLE INFORMATION
          ================================================= */}

          <div className="lg:col-span-3">

            <h3 className="mb-5 text-lg font-bold text-gray-900">
              Vehicle Information
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">

              {/* Vehicle Type */}

              <InfoCard
                icon={<CarFront size={20} />}
                title="Vehicle Type"
                value={vehicleType}
              />

              {/* Vehicle Colour */}

              <InfoCard
                icon={<Palette size={20} />}
                title="Vehicle Colour"
                value={color}
              />

              {/* AI Detection Confidence */}

              <InfoCard
                icon={<Target size={20} />}
                title="Detection Confidence"
                value={
                  detectionConfidence > 0
                    ? `${(
                        detectionConfidence * 100
                      ).toFixed(1)}%`
                    : "Not detected"
                }
              />

              {/* Best Match */}

              <InfoCard
                icon={<CheckCircle2 size={20} />}
                title="Best Match"
                value={
                  matches.length > 0
                    ? `${(
                        Number(
                          matches[0]?.similarity || 0
                        ) * 100
                      ).toFixed(1)}%`
                    : "No match"
                }
              />

            </div>

            {/* =================================================
                CONFIDENCE BAR
            ================================================= */}

            <div className="mt-7">

              <div className="mb-2 flex justify-between">

                <span className="text-sm font-semibold text-gray-700">
                  AI Match Confidence
                </span>

                <span className="text-sm font-bold text-[#70031B]">
                  {confidence}%
                </span>

              </div>

              <div className="h-3 overflow-hidden rounded-full bg-gray-100">

                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${confidence}%`,
                  }}
                  transition={{
                    duration: 1.2,
                    delay: 0.3,
                  }}
                  className="h-full rounded-full bg-[#70031B]"
                />

              </div>

            </div>

          </div>

        </div>

        {/* ===================================================
            MATCHES
        =================================================== */}

        <div className="border-t border-gray-100 p-6">

          <h3 className="mb-5 text-lg font-bold text-gray-900">
            Similar Vehicle Matches
          </h3>

          {matches.length === 0 ? (

            <p className="text-sm text-gray-500">
              No similar vehicles found.
            </p>

          ) : (

            <div className="space-y-3">

              {matches.map((match, index) => {

                const similarity =
                  Number(
                    match.similarity || 0
                  ) * 100;

                return (
                  <div
                    key={index}
                    className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >

                    <div className="flex items-center gap-4">

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#70031B]/10 font-bold text-[#70031B]">
                        #{index + 1}
                      </div>

                      <div>

                        <p className="font-semibold text-gray-900">
                          {match.vehicleType ||
                            "Unknown"}
                        </p>

                        <p className="max-w-xl truncate text-xs text-gray-500">
                          {match.image ||
                            "Image unavailable"}
                        </p>

                      </div>

                    </div>

                    <div className="shrink-0">

                      <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-700">
                        {similarity.toFixed(1)}%
                      </span>

                    </div>

                  </div>
                );
              })}

            </div>

          )}

        </div>

        {/* ===================================================
            TRACKING
        =================================================== */}

        <div className="border-t border-gray-100 bg-gray-50 p-6">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#70031B]/10">

                <Route
                  size={20}
                  className="text-[#70031B]"
                />

              </div>

              <div>

                <h3 className="font-bold text-gray-900">
                  Vehicle Tracking Available
                </h3>

                <p className="text-sm text-gray-500">
                  View the detected vehicle path across CCTV cameras.
                </p>

              </div>

            </div>

            <button
              type="button"
              className="rounded-xl bg-[#70031B] px-6 py-3 font-semibold text-white transition hover:bg-[#8A0B28]"
            >
              View Vehicle Path
            </button>

          </div>

        </div>

      </div>
    </motion.section>
  );
}


/* ============================================================
   INFORMATION CARD
============================================================ */

function InfoCard({
  icon,
  title,
  value,
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-4">

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#70031B]/10 text-[#70031B]">
        {icon}
      </div>

      <div className="min-w-0">

        <p className="text-xs font-medium text-gray-500">
          {title}
        </p>

        <p className="truncate font-semibold text-gray-900">
          {value}
        </p>

      </div>

    </div>
  );
}