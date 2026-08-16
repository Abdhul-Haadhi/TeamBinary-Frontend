import { motion } from "framer-motion";
import {
  Search,
  Loader2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function SearchPanel({
  loading,
  onSearch,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.5 }}
      className="relative mt-10 overflow-hidden rounded-[2rem] border border-[#C18A32]/20 bg-gradient-to-br from-[#3A0D1B] via-[#4A1022] to-[#16090D] p-8 text-white shadow-2xl lg:p-10"
    >

      {/* Background Glow */}
      <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[#C18A32]/10 blur-[90px]" />

      <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-[#8A1740]/20 blur-[90px]" />

      {/* Content */}
      <div className="relative flex flex-col items-center text-center">

        {/* Icon */}
        <motion.div
          animate={{
            y: [0, -6, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl border border-[#C18A32]/30 bg-[#C18A32]/10 shadow-lg"
        >
          <ShieldCheck
            size={42}
            className="text-[#E0B45A]"
          />
        </motion.div>

        {/* Small Badge */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#C18A32]/20 bg-white/5 px-4 py-2 backdrop-blur-md">

          <Sparkles
            size={15}
            className="text-[#E0B45A]"
          />

          <span className="text-xs font-semibold uppercase tracking-wider text-[#F3D7C5]">
            AI Investigation Engine
          </span>

        </div>

        {/* Heading */}
        <h2 className="text-3xl font-extrabold tracking-tight lg:text-4xl">
          Search Suspect Vehicle
        </h2>

        {/* Description */}
        <p className="mt-3 max-w-xl text-sm leading-6 text-[#E8CFCF] lg:text-base">
          Analyze the uploaded vehicle image or description
          and search across multiple CCTV cameras.
        </p>

        {/* Search Button */}
        <motion.button
          whileHover={{
            scale: 1.04,
            boxShadow: "0 15px 35px rgba(193, 138, 50, 0.25)",
          }}
          whileTap={{
            scale: 0.96,
          }}
          onClick={onSearch}
          disabled={loading}
          className="mt-8 inline-flex min-w-[230px] items-center justify-center rounded-2xl bg-gradient-to-r from-[#8A1740] to-[#C18A32] px-8 py-4 font-bold text-white shadow-xl transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60"
        >

          {loading ? (
            <>
              <Loader2
                className="mr-3 animate-spin"
                size={21}
              />

              AI Processing...
            </>
          ) : (
            <>
              <Search
                className="mr-3"
                size={21}
              />

              SEARCH VEHICLE
            </>
          )}

        </motion.button>

        {/* Status */}
        <motion.div
          animate={{
            opacity: [0.65, 1, 0.65],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          className="mt-7 inline-flex items-center gap-2 rounded-full border border-green-400/20 bg-green-400/10 px-5 py-2"
        >
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-green-400" />

          <span className="text-sm font-medium text-green-200">
            Ready for Investigation
          </span>

        </motion.div>

      </div>

    </motion.div>
  );
}