import { useState } from "react";
import { Sparkles } from "lucide-react";

const colors = ["Red", "White", "Black", "Blue", "Silver"];

const types = [
  "Car",
  "Van",
  "Bus",
  "Truck",
  "Motorcycle",
];

export default function VehicleDescription({
  description,
  setDescription,
}) {
  const addAttribute = (attribute) => {
    const current = description.trim();

    // Don't add the same attribute twice
    if (current.toLowerCase().includes(attribute.toLowerCase())) {
      return;
    }

    if (current.length === 0) {
      setDescription(attribute);
    } else {
      setDescription(`${current}, ${attribute}`);
    }
  };

  return (
    <div className="rounded-3xl bg-white/80 p-8 shadow-2xl backdrop-blur-xl">

      {/* Heading */}
      <h2 className="mb-2 text-2xl font-bold text-gray-800">
        🚘 Vehicle Description
      </h2>

      <p className="mb-5 text-gray-500">
        Describe the suspect vehicle or select quick attributes.
      </p>

      {/* Description */}
      <textarea
        rows="6"
        maxLength={500}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Example: White sedan with black windows..."
        className="w-full resize-none rounded-2xl border border-gray-300 p-4 text-gray-800 outline-none transition focus:border-[#70031B] focus:ring-2 focus:ring-[#70031B]/20"
      />

      {/* Quick Attributes */}
      <div className="mt-6">

        <p className="mb-3 font-semibold text-gray-800">
          Quick Attributes
        </p>

        {/* Colors */}
        <p className="mb-2 text-sm text-gray-500">
          Color
        </p>

        <div className="mb-5 flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => addAttribute(color)}
              className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-[#70031B] hover:text-white active:scale-95"
            >
              {color}
            </button>
          ))}
        </div>

        {/* Vehicle Types */}
        <p className="mb-2 text-sm text-gray-500">
          Vehicle Type
        </p>

        <div className="flex flex-wrap gap-2">
          {types.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => addAttribute(type)}
              className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-[#70031B] hover:text-white active:scale-95"
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* AI Suggest */}
      <div className="mt-8 flex justify-end">
        <button
          type="button"
          className="flex items-center gap-2 rounded-xl bg-[#70031B] px-5 py-3 text-white transition hover:bg-[#8A0B28] active:scale-95"
        >
          <Sparkles size={18} />
          AI Suggest
        </button>
      </div>

      {/* Character Count */}
      <div className="mt-4 text-right text-sm text-gray-500">
        {description.length}/500 Characters
      </div>

    </div>
  );
}