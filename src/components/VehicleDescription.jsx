
import { Sparkles } from "lucide-react";

const colors = [
  "Red",
  "White",
  "Black",
  "Blue",
  "Silver",
  "Gray",
  "Green",
  "Yellow",
  "Brown",
];

const types = [
  "Car",
  "Cab",
  "Van",
  "Bus",
  "Lorry",
  "Motor cycle",
  "Three wheel",
  "SUV"
];

export default function VehicleDescription({
  description,
  setDescription,
}) {
  // Add a quick attribute without adding the same attribute twice.
  const addAttribute = (attribute) => {
    const current = description.trim();

    const escapedAttribute = attribute.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

    const attributeExists = new RegExp(
      `(^|[^\\w-])${escapedAttribute}($|[^\\w-])`,
      "i"
    ).test(current);

    if (attributeExists) {
      return;
    }

    if (!current) {
      setDescription(attribute);
    } else {
      setDescription(`${current}, ${attribute}`);
    }
  };

  // Clear the description.
  const clearDescription = () => {
    setDescription("");
  };

  return (
    <div className="rounded-3xl bg-white/80 p-8 shadow-2xl backdrop-blur-xl">

      {/* Heading */}

      <div className="mb-2 flex items-center gap-3">
        <span className="text-2xl">🚘</span>

        <h2 className="text-2xl font-bold text-gray-800">
          Vehicle Description
        </h2>
      </div>

      <p className="mb-5 text-gray-500">
        Describe the suspect vehicle using its appearance,
        color, or vehicle type.
      </p>

      {/* Description input */}

      <textarea
        rows={6}
        maxLength={500}
        value={description}
        onChange={(event) =>
          setDescription(event.target.value)
        }
        placeholder="Example: White car with black windows, travelling near the entrance..."
        aria-label="Suspect vehicle description"
        className="w-full resize-y rounded-2xl border border-gray-300 p-4 text-gray-800 outline-none transition focus:border-[#70031B] focus:ring-2 focus:ring-[#70031B]/20"
      />

      {/* Quick attributes */}

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

        {/* Vehicle types */}

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

      {/* Description actions */}

      <div className="mt-5 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={clearDescription}
          disabled={!description}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Clear description
        </button>

        <span className="text-sm text-gray-500">
          {description.length}/500
        </span>
      </div>

      {/* Search hint */}

      <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4">
        <div className="flex items-start gap-3">
          <Sparkles
            size={18}
            className="mt-0.5 shrink-0 text-[#70031B]"
          />

          <p className="text-sm leading-6 text-gray-600">
            Enter the vehicle details and click
            {" "}Search. You can search using a description
            alone or combine it with an uploaded image.
          </p>
        </div>
      </div>
    </div>
  );
}
