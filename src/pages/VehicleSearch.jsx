import { useState } from "react";

import Hero from "../components/Hero";
import UploadCard from "../components/UploadCard";
import VehicleDescription from "../components/VehicleDescription";
import SearchPanel from "../components/SearchPanel";
import VehicleResults from "../components/VehicleResults";

export default function VehicleSearch() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState(null);

  const handleSearch = async () => {
    if (!image) {
      alert("Please upload a vehicle image first.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      /*
       * Temporary mock AI processing.
       *
       * Later we will replace this section
       * with the Spring Boot API request.
       */

      await new Promise((resolve) =>
        setTimeout(resolve, 2500)
      );

      const mockResult = {
        image: preview,

        confidence: 97,

        vehicleType: "Sedan",

        numberPlate: "CAA-1234",

        color: "White",

        camera: "Camera 04",

        location: "Galle Road - Camera Zone 04",

        time: "09:42 PM",
      };

      setResult(mockResult);

    } catch (error) {
      console.error(error);

      alert("Vehicle search failed.");

    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F5F7FA]">

      <div className="mx-auto max-w-7xl px-6 py-8">

        {/* Hero */}
        <Hero />

        {/* Upload + Description */}
        <div className="mt-10 grid gap-8 lg:grid-cols-2">

          <UploadCard
            image={image}
            preview={preview}
            setImage={setImage}
            setPreview={setPreview}
          />

          <VehicleDescription />

        </div>

        {/* Search */}
        <SearchPanel
          loading={loading}
          onSearch={handleSearch}
        />

        {/* Results */}
        <VehicleResults result={result} />

      </div>

    </main>
  );
}