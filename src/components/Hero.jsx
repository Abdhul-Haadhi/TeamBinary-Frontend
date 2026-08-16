import { motion } from "framer-motion";
import {
  Camera,
  CarFront,
  ShieldCheck,
  ScanSearch,
} from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-[#C18A32]/20 bg-gradient-to-br from-[#3A0D1B] via-[#4A1022] to-[#16090D] text-white shadow-2xl">

      {/* Background Glow 1 */}
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#C18A32]/10 blur-[100px]" />

      {/* Background Glow 2 */}
      <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-[#8A1740]/20 blur-[100px]" />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative grid min-h-[500px] items-center gap-12 px-8 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:px-16">

        {/* LEFT SIDE */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 rounded-full border border-[#C18A32]/30 bg-[#C18A32]/10 px-4 py-2 text-[#E0B45A] backdrop-blur-md"
          >
            <ShieldCheck size={17} />

            <span className="text-sm font-semibold">
              AI Powered Investigation Platform
            </span>
          </motion.div>

          {/* Title */}
          <h1 className="mt-7 text-5xl font-black tracking-tight lg:text-7xl">
            <span className="bg-gradient-to-r from-[#FFF8F2] via-[#E0B45A] to-[#C18A32] bg-clip-text text-transparent">
              AUTO TRACE
            </span>
          </h1>

          {/* Subtitle */}
          <h2 className="mt-3 text-2xl font-semibold text-[#F3D7C5] lg:text-3xl">
            Vehicle Investigation System
          </h2>

          {/* Description */}
          <p className="mt-6 max-w-2xl text-base leading-8 text-[#E8CFCF] lg:text-lg">
            Search, identify and track suspected vehicles across
            multiple CCTV cameras using Artificial Intelligence,
            License Plate Recognition and Vehicle Re-Identification.
          </p>

          {/* Feature Cards */}
          <div className="mt-9 flex flex-wrap gap-4">

            {/* Card 1 */}
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              className="flex items-center gap-3 rounded-2xl border border-[#C18A32]/20 bg-gradient-to-br from-[#5A1028]/80 to-[#2B0B16]/80 px-5 py-3 shadow-lg backdrop-blur-md"
            >
              <div className="rounded-xl bg-[#C18A32]/10 p-2.5 text-[#E0B45A]">
                <Camera size={20} />
              </div>

              <div>
                <p className="text-sm font-semibold text-white">
                  Multi Camera
                </p>

                <p className="text-xs text-[#CFAFB5]">
                  CCTV Tracking
                </p>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              className="flex items-center gap-3 rounded-2xl border border-[#C18A32]/20 bg-gradient-to-br from-[#5A1028]/80 to-[#2B0B16]/80 px-5 py-3 shadow-lg backdrop-blur-md"
            >
              <div className="rounded-xl bg-[#C18A32]/10 p-2.5 text-[#E0B45A]">
                <CarFront size={20} />
              </div>

              <div>
                <p className="text-sm font-semibold text-white">
                  AI Detection
                </p>

                <p className="text-xs text-[#CFAFB5]">
                  Vehicle Recognition
                </p>
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              className="flex items-center gap-3 rounded-2xl border border-[#C18A32]/20 bg-gradient-to-br from-[#5A1028]/80 to-[#2B0B16]/80 px-5 py-3 shadow-lg backdrop-blur-md"
            >
              <div className="rounded-xl bg-[#C18A32]/10 p-2.5 text-[#E0B45A]">
                <ScanSearch size={20} />
              </div>

              <div>
                <p className="text-sm font-semibold text-white">
                  Smart Search
                </p>

                <p className="text-xs text-[#CFAFB5]">
                  Image & Text
                </p>
              </div>
            </motion.div>

          </div>
        </motion.div>


        {/* RIGHT SIDE - LOGO */}
        <motion.div
          initial={{ opacity: 0, x: 60, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{
            duration: 1,
            delay: 0.2,
            type: "spring",
            stiffness: 80,
          }}
          className="relative flex items-center justify-center"
        >

          {/* Gold Glow */}
          <motion.div
            animate={{
              scale: [1, 1.08, 1],
              opacity: [0.25, 0.4, 0.25],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute h-80 w-80 rounded-full bg-[#C18A32] blur-[90px]"
          />

          {/* Logo Circle */}
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 1, 0, -1, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative flex h-72 w-72 items-center justify-center rounded-full border border-[#C18A32]/30 bg-gradient-to-br from-[#FFF8F2] to-[#E9D9C8] p-7 shadow-[0_0_80px_rgba(193,138,50,0.2)] lg:h-[390px] lg:w-[390px]"
          >

            <img
              src="/team-binary-logo.png"
              alt="Team Binary"
              className="h-full w-full object-contain"
            />

          </motion.div>

          {/* Floating status */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
            className="absolute -bottom-3 right-5 flex items-center gap-2 rounded-full border border-[#C18A32]/30 bg-[#250A13]/90 px-4 py-2 shadow-xl backdrop-blur-md"
          >
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#D4A84A]" />

            <span className="text-xs font-semibold text-[#F3D7C5]">
              AI SYSTEM READY
            </span>
          </motion.div>

        </motion.div>

      </div>
    </section>
  );
}