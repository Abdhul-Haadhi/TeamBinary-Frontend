import React, { useState } from "react";
import "../css/TextVehicleSearch.css";

function TextVehicleSearch() {
    const [formData, setFormData] = useState({
        color: "",
        numberPlate: "",
        vehicleType: "",
        model: "",
    });

    const [searchResults, setSearchResults] = useState([]);
    const [searched, setSearched] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();

        setSearched(true);

        // Temporary mock data.
        // This will be replaced with a Spring Boot API call later.
        const mockResults = [
            {
                id: 1,
                image: "/images/car1.jpg",
                type: "Car",
                model: "Toyota Prius",
                color: "White",
                numberPlate: "CAB-1234",
                confidence: "94%",
            },
            {
                id: 2,
                image: "/images/car2.jpg",
                type: "Car",
                model: "Toyota Aqua",
                color: "White",
                numberPlate: "CAX-5678",
                confidence: "89%",
            },
        ];

        setSearchResults(mockResults);
    };

    const handleClear = () => {
        setFormData({
            color: "",
            numberPlate: "",
            vehicleType: "",
            model: "",
        });

        setSearchResults([]);
        setSearched(false);
    };

    return (
        <div className="text-search-page">

            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1>Text-Based Vehicle Identification</h1>
                    <p>
                        Search for a vehicle using its attributes
                    </p>
                </div>
            </div>

            {/* Search Card */}
            <div className="search-card">

                <div className="card-title">
                    <h2>Vehicle Search</h2>
                    <p>
                        Enter one or more vehicle attributes to find matching vehicles.
                    </p>
                </div>

                <form onSubmit={handleSearch}>

                    <div className="form-grid">

                        {/* Color */}
                        <div className="form-group">
                            <label htmlFor="color">
                                Vehicle Color
                            </label>

                            <select
                                id="color"
                                name="color"
                                value={formData.color}
                                onChange={handleChange}
                            >
                                <option value="">Select color</option>
                                <option value="Black">Black</option>
                                <option value="White">White</option>
                                <option value="Red">Red</option>
                                <option value="Blue">Blue</option>
                                <option value="Silver">Silver</option>
                                <option value="Grey">Grey</option>
                                <option value="Green">Green</option>
                                <option value="Yellow">Yellow</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {/* Number Plate */}
                        <div className="form-group">
                            <label htmlFor="numberPlate">
                                Number Plate
                            </label>

                            <input
                                type="text"
                                id="numberPlate"
                                name="numberPlate"
                                value={formData.numberPlate}
                                onChange={handleChange}
                                placeholder="Example: CAB-1234"
                            />
                        </div>

                        {/* Vehicle Type */}
                        <div className="form-group">
                            <label htmlFor="vehicleType">
                                Vehicle Type
                            </label>

                            <select
                                id="vehicleType"
                                name="vehicleType"
                                value={formData.vehicleType}
                                onChange={handleChange}
                            >
                                <option value="">Select vehicle type</option>
                                <option value="Car">Car</option>
                                <option value="Bus">Bus</option>
                                <option value="Van">Van</option>
                                <option value="Bike">Bike</option>
                                <option value="Three-wheeler">Three-wheeler</option>
                                <option value="Truck">Truck</option>
                            </select>
                        </div>

                        {/* Model */}
                        <div className="form-group">
                            <label htmlFor="model">
                                Vehicle Model
                            </label>

                            <input
                                type="text"
                                id="model"
                                name="model"
                                value={formData.model}
                                onChange={handleChange}
                                placeholder="Example: Toyota Prius"
                            />
                        </div>

                    </div>

                    {/* Buttons */}
                    <div className="button-container">

                        <button
                            type="button"
                            className="clear-button"
                            onClick={handleClear}
                        >
                            Clear
                        </button>

                        <button
                            type="submit"
                            className="search-button"
                        >
                            Search Vehicle
                        </button>

                    </div>

                </form>
            </div>

            {/* Results */}
            {searched && (
                <div className="results-section">

                    <div className="results-header">
                        <div>
                            <h2>Search Results</h2>
                            <p>
                                Matching vehicles found: {searchResults.length}
                            </p>
                        </div>
                    </div>

                    {searchResults.length > 0 ? (

                        <div className="results-grid">

                            {searchResults.map((vehicle) => (

                                <div className="vehicle-card" key={vehicle.id}>

                                    <div className="vehicle-image-container">
                                        <img
                                            src={vehicle.image}
                                            alt={vehicle.model}
                                            className="vehicle-image"
                                        />
                                    </div>

                                    <div className="vehicle-details">

                                        <div className="vehicle-title">
                                            <h3>{vehicle.model}</h3>

                                            <span className="confidence">
                                                {vehicle.confidence}
                                            </span>
                                        </div>

                                        <div className="vehicle-info">

                                            <div className="info-item">
                                                <span className="info-label">
                                                    Type
                                                </span>
                                                <span className="info-value">
                                                    {vehicle.type}
                                                </span>
                                            </div>

                                            <div className="info-item">
                                                <span className="info-label">
                                                    Color
                                                </span>
                                                <span className="info-value">
                                                    {vehicle.color}
                                                </span>
                                            </div>

                                            <div className="info-item">
                                                <span className="info-label">
                                                    Number Plate
                                                </span>
                                                <span className="info-value">
                                                    {vehicle.numberPlate}
                                                </span>
                                            </div>

                                        </div>

                                        <button className="view-button">
                                            View Details
                                        </button>

                                    </div>

                                </div>

                            ))}

                        </div>

                    ) : (

                        <div className="no-results">
                            <h3>No Matching Vehicles</h3>
                            <p>
                                No vehicles were found matching your search criteria.
                            </p>
                        </div>

                    )}

                </div>
            )}

        </div>
    );
}

export default TextVehicleSearch;