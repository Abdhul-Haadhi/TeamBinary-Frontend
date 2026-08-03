import { motion } from "framer-motion";
import {
  CheckCircle2,
  CarFront,
  MapPin,
  Clock3,
  Hash,
  Palette,
  Target,
  Camera,
  Route,
} from "lucide-react";

export default function VehicleResults({ result }) {
  if (!result) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mt-10"
    >
      {/* Section Heading */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#70031B]/10">
            <Target className="text-[#70031B]" size={24} />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Vehicle Search Results
            </h2>

            <p className="text-sm text-gray-500">
              AI analysis and CCTV detection results
            </p>
          </div>
        </div>
      </div>

      {/* Main Result Card */}
      <div className="overflow-hidden rounded-3xl bg-white shadow-2xl">

        {/* Result Header */}
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
                High-confidence vehicle detection
              </p>
            </div>
          </div>

          {/* Confidence */}
          <div className="rounded-2xl bg-green-50 px-5 py-3">
            <p className="text-xs font-medium text-green-700">
              AI CONFIDENCE
            </p>

            <p className="text-2xl font-bold text-green-700">
              {result.confidence}%
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="grid gap-8 p-6 lg:grid-cols-5">

          {/* Vehicle Image */}
          <div className="lg:col-span-2">
            <div className="relative overflow-hidden rounded-2xl bg-gray-100">

              <img
                src={result.image}
                alt="Detected vehicle"
                className="h-80 w-full object-contain"
              />

              {/* Detection Label */}
              <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/70 px-4 py-2 text-sm font-medium text-white backdrop-blur">
                <CarFront size={16} />
                Vehicle Detected
              </div>

            </div>
          </div>

          {/* Vehicle Information */}
          <div className="lg:col-span-3">

            <h3 className="mb-5 text-lg font-bold text-gray-900">
              Vehicle Information
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">

              {/* Vehicle Type */}
              <InfoCard
                icon={<CarFront size={20} />}
                title="Vehicle Type"
                value={result.vehicleType}
              />

              {/* Number Plate */}
              <InfoCard
                icon={<Hash size={20} />}
                title="Number Plate"
                value={result.numberPlate}
              />

              {/* Color */}
              <InfoCard
                icon={<Palette size={20} />}
                title="Color"
                value={result.color}
              />

              {/* Camera */}
              <InfoCard
                icon={<Camera size={20} />}
                title="Camera"
                value={result.camera}
              />

              {/* Location */}
              <InfoCard
                icon={<MapPin size={20} />}
                title="Location"
                value={result.location}
              />

              {/* Time */}
              <InfoCard
                icon={<Clock3 size={20} />}
                title="Detection Time"
                value={result.time}
              />

            </div>

            {/* Confidence Bar */}
            <div className="mt-7">

              <div className="mb-2 flex justify-between">
                <span className="text-sm font-semibold text-gray-700">
                  AI Match Confidence
                </span>

                <span className="text-sm font-bold text-[#70031B]">
                  {result.confidence}%
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-gray-100">

                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${result.confidence}%`,
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

        {/* Tracking Section */}
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


/* -------------------------------- */
/* Information Card */
/* -------------------------------- */

function InfoCard({ icon, title, value }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-4 transition hover:-translate-y-1 hover:shadow-md">

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