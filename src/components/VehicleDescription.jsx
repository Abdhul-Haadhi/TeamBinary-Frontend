import { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Mic,
  Car,
  Truck,
  Bike,
} from "lucide-react";

const colors = ["Red", "White", "Black", "Blue", "Silver"];
const types = ["Car", "Van", "Bus", "Truck", "Motorcycle"];

export default function VehicleDescription() {
  const [description, setDescription] = useState("");

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="rounded-3xl bg-white/80 backdrop-blur-xl shadow-2xl p-8"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-5">
        🚘 Vehicle Description
      </h2>

      <textarea
        rows="6"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe the suspect vehicle..."
        className="w-full rounded-2xl border border-gray-300 p-4 resize-none outline-none focus:ring-2 focus:ring-[#70031B]"
      />

      <div className="mt-6">
        <p className="font-semibold mb-3">Quick Attributes</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {colors.map((color) => (
            <button
              key={color}
              className="rounded-full bg-gray-100 px-4 py-2 text-sm hover:bg-[#70031B] hover:text-white transition"
            >
              {color}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {types.map((type) => (
            <button
              key={type}
              className="rounded-full bg-gray-100 px-4 py-2 text-sm hover:bg-[#70031B] hover:text-white transition"
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 flex justify-between items-center">
        <button className="flex items-center gap-2 rounded-xl bg-gray-100 px-5 py-3 hover:bg-gray-200 transition">
          <Mic size={18} />
          Voice Input
        </button>

        <button className="flex items-center gap-2 rounded-xl bg-[#70031B] px-5 py-3 text-white hover:bg-[#8A0B28] transition">
          <Sparkles size={18} />
          AI Suggest
        </button>
      </div>

      <div className="mt-6 text-right text-sm text-gray-500">
        {description.length}/500 Characters
      </div>
    </motion.div>
  );
}