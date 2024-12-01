import { useState, useEffect } from "react";
import WeatherApp from "./weatherForecast.jsx";
import Swal from "sweetalert2";
import { localPhrases } from "./regionalLanguages";

const UserLocation = () => {
  const [location, setLocation] = useState(null);
  const [city, setCity] = useState(null);
  const [userCity, setUserCity] = useState(""); // State for user input
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const OPENCAGE_API_KEY = "d09be71f59114b5ea7ac9a7dd7d4968e";

  console.log(location);

  const findNearestCity = (address) => {
    const cityNames = Object.keys(localPhrases);
    for (const city of cityNames) {
      if (address.toLowerCase().includes(city.toLowerCase())) {
        return city;
      }
    }
    return "Bangalore"; // Default to Bangalore if no match found
  };

  const showPhraseAlert = (city) => {
    if (!city || !localPhrases[city]) return;

    const cityPhrases = localPhrases[city];
    const phraseTypes = Object.keys(cityPhrases);
    const randomType =
      phraseTypes[Math.floor(Math.random() * phraseTypes.length)];
    const consistentType = phraseTypes[0]; // Assuming the first type in the array is the consistent type

    Swal.fire({
      title: `Learn ${city}'s Local Phrase`,
      html: `
      <div class="text-lg">
        <p class="mb-2"><strong>${consistentType}:</strong></p>
        <p class="text-xl font-bold">${cityPhrases[consistentType]}</p>
      </div>
      `,
      icon: "info",
      confirmButtonText: "Got it!",
      confirmButtonColor: "#3085d6",
      timer: 5000,
      timerProgressBar: true,
    });

    Swal.fire({
      title: `Learn ${city}'s Local Phrase`,
      html: `
        <div class="text-lg">
          <p class="mb-2"><strong>${randomType}:</strong></p>
          <p class="text-xl font-bold">${cityPhrases[randomType]}</p>
        </div>
      `,
      icon: "info",
      confirmButtonText: "Got it!",
      confirmButtonColor: "#3085d6",
      timer: 5000,
      timerProgressBar: true,
    });
  };

  const handleCityChange = (e) => {
    setUserCity(e.target.value);
  };

  const handleCitySubmit = () => {
    const cityInput = userCity.trim().toLowerCase(); // Convert input to lowercase for comparison
    const foundCity = Object.keys(localPhrases).find(
      (city) => city.toLowerCase() === cityInput
    );

    if (!foundCity) {
      // If city not found in localPhrases, show a "Try another city!" message
      Swal.fire({
        title: "City Not Found",
        text: "Try another city!",
        icon: "warning",
        confirmButtonText: "Okay",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    setCity(foundCity); // Set the city based on user input
    showPhraseAlert(foundCity); // Show phrases for the input city
  };

  useEffect(() => {
    let intervalId;

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          // Get address using OpenCage Geocoding API
          const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${OPENCAGE_API_KEY}`
          );

          const data = await response.json();

          if (data.results && data.results.length > 0) {
            const address = data.results[0].formatted;
            const nearestCity = findNearestCity(address);

            setLocation({
              coords: { latitude, longitude },
              address: address,
              city: nearestCity,
            });

            setCity(nearestCity);
          }

          setLoading(false);
        } catch (e) {
          console.error("Error fetching location details:", e);
          setError(`Error fetching location details: ${e.message}`);
          setLoading(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setError(`Error getting location: ${error.message}`);
        setLoading(false);
      }
    );

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []); // Empty dependency array since we only want this to run once

  if (loading) {
    return <div>Loading location...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  return (
    <div className="p-4">
      {error && <div className="text-red-500">{error}</div>}
      <div className="text-center">
        <h3 className="text-xl font-bold mb-2">
          Your Current Location is: {city || "Unknown"}!
        </h3>
        <hr />
        <br />
        <input
          type="text"
          placeholder="Enter city"
          value={userCity}
          onChange={handleCityChange}
          className="mb-4 p-2 border border-gray-300 rounded"
        />
        <button
          onClick={handleCitySubmit}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Show Local Phrase
        </button>
      </div>
      <WeatherApp />
    </div>
  );
};

export default UserLocation;
