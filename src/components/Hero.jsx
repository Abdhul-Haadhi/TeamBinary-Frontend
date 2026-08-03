import { motion } from "framer-motion";
import { Camera, CarFront, ShieldCheck } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#70031B] via-[#8A0B28] to-[#B3133D] text-white shadow-2xl">

      {/* Background circles */}
      <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl"></div>

      <div className="absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-white/10 blur-3xl"></div>

      <div className="relative px-8 py-16 lg:px-16">

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .8 }}
        >

          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur">

            <ShieldCheck size={18} />

            <span className="text-sm font-medium">

              AI Powered Investigation Platform

            </span>

          </div>

          <h1 className="mt-6 text-5xl font-bold">

            AUTO TRACE

          </h1>

          <h2 className="mt-2 text-3xl text-red-100">

            Vehicle Investigation System

          </h2>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-red-100">

            Search, identify and track suspected vehicles across
            multiple CCTV cameras using Artificial Intelligence,
            License Plate Recognition and Vehicle Re-Identification.

          </p>

          <div className="mt-10 flex flex-wrap gap-4">

            <div className="flex items-center gap-2 rounded-xl bg-white/10 px-5 py-3 backdrop-blur">

              <Camera size={20} />

              Multi Camera Tracking

            </div>

            <div className="flex items-center gap-2 rounded-xl bg-white/10 px-5 py-3 backdrop-blur">

              <CarFront size={20} />

              AI Vehicle Detection

            </div>

          </div>

        </motion.div>

      </div>

    </section>
  );
}