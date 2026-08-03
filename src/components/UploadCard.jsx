import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import {
  UploadCloud,
  CarFront,
  Camera,
  X,
  CheckCircle2,
} from "lucide-react";

export default function UploadCard({
  image,
  preview,
  setImage,
  setPreview,
}) {
  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
  });

  // ==========================
  // PREVIEW CARD
  // ==========================
  if (preview) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative rounded-3xl bg-white p-6 shadow-2xl"
      >
        {/* Remove Button */}
        <button
          onClick={() => {
            setImage(null);
            setPreview(null);
          }}
          className="absolute right-5 top-5 rounded-full bg-red-100 p-2 hover:bg-red-200 transition"
        >
          <X size={18} />
        </button>

        {/* Image + Scanner */}
        <div className="relative overflow-hidden rounded-2xl">
          <motion.div
            animate={{
              y: [0, 280, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute left-0 right-0 h-1 bg-red-500 shadow-[0_0_20px_red] z-10"
          />

          <img
            src={preview}
            alt="Vehicle Preview"
            className="h-72 w-full rounded-2xl object-contain bg-gray-50"
          />
        </div>

        {/* Success */}
        <div className="mt-5 flex items-center gap-3">
          <CheckCircle2 className="text-green-600" />

          <div>
            <h3 className="font-semibold">{image.name}</h3>

            <p className="text-sm text-gray-500">
              Ready for AI Vehicle Search
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  // ==========================
  // UPLOAD CARD
  // ==========================

  return (
    <motion.div
      {...getRootProps()}
      whileHover={{ scale: 1.02 }}
      className={`relative overflow-hidden cursor-pointer rounded-3xl border-2 border-dashed p-10 backdrop-blur-xl bg-white/80 shadow-2xl transition-all duration-300

      ${
        isDragActive
          ? "border-[#70031B] bg-red-50 scale-[1.02]"
          : "border-gray-300"
      }`}
    >
      {/* Animated Background Light */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [-300, 500],
            opacity: [0.15, 0.4, 0.15],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-0 h-full w-36 rotate-12 bg-gradient-to-r from-transparent via-red-300/20 to-transparent"
        />
      </div>

      <input {...getInputProps()} />

      {/* Floating Car */}
      <div className="flex justify-center">
        <motion.div
          animate={{
            x: [-15, 15, -15],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
          className="flex h-28 w-28 items-center justify-center rounded-full bg-[#70031B]/10"
        >
          <CarFront size={60} className="text-[#70031B]" />
        </motion.div>
      </div>

      {/* CCTV Cameras */}
      <div className="mt-6 flex justify-center gap-8">
        <Camera className="text-gray-400" />
        <Camera className="text-[#70031B]" />
        <Camera className="text-gray-400" />
      </div>

      {/* Title */}
      <h2 className="mt-8 text-center text-2xl font-bold text-gray-800">
        Drag & Drop Vehicle Image
      </h2>

      <p className="mt-3 text-center text-gray-500">
        PNG • JPG • JPEG
      </p>

      {/* Upload Button */}
      <button
        type="button"
        className="mt-8 w-full rounded-xl bg-[#70031B] py-4 font-semibold text-white transition hover:bg-[#8A0B28]"
      >
        <UploadCloud className="mr-2 inline" size={20} />
        Choose Image
      </button>

      {/* AI Badge */}
      <div className="mt-6 flex justify-center">
        <motion.span
          animate={{
            scale: [1, 0.95, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          className="rounded-full bg-green-100 px-5 py-2 font-semibold text-green-700"
        >
          🤖 AI Ready
        </motion.span>
      </div>
    </motion.div>
  );
}