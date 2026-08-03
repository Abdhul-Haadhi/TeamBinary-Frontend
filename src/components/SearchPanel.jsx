import { motion } from "framer-motion";
import { Search, Loader2, ShieldCheck } from "lucide-react";

export default function SearchPanel({
  loading,
  onSearch,
}) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="mt-10 rounded-3xl bg-gradient-to-r from-[#70031B] to-[#8A0B28] p-10 text-white shadow-2xl"
    >
      <div className="text-center">

        <ShieldCheck
          size={55}
          className="mx-auto mb-4"
        />

        <h2 className="text-3xl font-bold">
          Search Suspect Vehicle
        </h2>

        <p className="mt-3 opacity-90">
          AI Powered Vehicle Investigation Engine
        </p>

        <motion.button
          whileHover={{
            scale: 1.05,
          }}
          whileTap={{
            scale: 0.95,
          }}
          onClick={onSearch}
          disabled={loading}
          className="mt-8 rounded-xl bg-white px-10 py-4 font-bold text-[#70031B] shadow-xl transition"
        >
          {loading ? (
            <>
              <Loader2
                className="mr-2 inline animate-spin"
                size={20}
              />
              AI Processing...
            </>
          ) : (
            <>
              <Search
                className="mr-2 inline"
                size={20}
              />
              SEARCH VEHICLE
            </>
          )}
        </motion.button>

        <div className="mt-8 flex justify-center">

          <motion.div
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="rounded-full bg-green-500/20 px-5 py-2"
          >
            🟢 Ready for Investigation
          </motion.div>

        </div>

      </div>
    </motion.div>
  );
}