import React, { useEffect, useState } from "react";
import { IoSearch, IoLocationSharp, IoCloseCircle } from "react-icons/io5";
import { WiHumidity } from "react-icons/wi";
import { FaWind } from "react-icons/fa";

import Signup from "../Signup";

const WeatherApp = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState("celsius");
  const [recentCities, setRecentCities] = useState(() => {
    return JSON.parse(localStorage.getItem("recentCities") || "[]");
  });

  const fetchWeatherData = async (searchCity) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&units=metric&appid=${
          import.meta.env.VITE_WEATHER_API
        }`
      );

      if (!response.ok) throw new Error("City not found");

      const data = await response.json();
      const newWeatherData = {
        temp: Math.round(data.main.temp),
        location: data.name,
        country: data.sys.country,
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed),
        description: data.weather[0].description,
      };

      // Update recent cities
      const updatedRecentCities = [
        ...new Set([searchCity, ...recentCities].slice(0, 5)),
      ];
      setRecentCities(updatedRecentCities);
      localStorage.setItem("recentCities", JSON.stringify(updatedRecentCities));

      setWeatherData(newWeatherData);
      setCity(searchCity);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch default city or first recent city
    const defaultCity = "Meerut";
    fetchWeatherData(defaultCity);
  }, []);

  const convertTemperature = (temp) => {
    return unit === "celsius"
      ? `${temp}°C`
      : `${Math.round((temp * 9) / 5 + 32)}°F`;
  };

  const removeRecentCity = (cityToRemove) => {
    const updatedCities = recentCities.filter((c) => c !== cityToRemove);
    setRecentCities(updatedCities);
    localStorage.setItem("recentCities", JSON.stringify(updatedCities));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 ">
      <div className="bg-white shadow-xl rounded-3xl w-full max-w-md p-6 space-y-6">
        {/* Search and Unit Toggle */}
        <div className="flex items-center space-x-2">
          <div className="relative flex-grow">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchWeatherData(city)}
              className="w-full px-4 py-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
              placeholder="Enter city name"
            />
            <IoSearch
              onClick={() => fetchWeatherData(city)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer hover:text-blue-500"
            />
          </div>
          <button
            onClick={() =>
              setUnit(unit === "celsius" ? "fahrenheit" : "celsius")
            }
            className="px-3 py-2 bg-gray-100 rounded-md text-sm"
          >
            {unit === "celsius" ? "°F" : "°C"}
          </button>
        </div>

        {/* Weather Details */}
        <div className="min-h-[300px] flex flex-col justify-center">
          {loading ? (
            <div className="text-center text-gray-400">
              <div className="animate-pulse">Loading...</div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : weatherData ? (
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <IoLocationSharp className="text-2xl text-gray-600" />
                <h2 className="text-2xl font-light">
                  {weatherData.location}, {weatherData.country}
                </h2>
              </div>

              <div className="text-6xl font-thin">
                {convertTemperature(weatherData.temp)}
              </div>

              <p className="text-gray-500 capitalize">
                {weatherData.description}
              </p>

              <div className="flex justify-center gap-8 text-gray-600">
                <div className="flex items-center gap-2">
                  <WiHumidity className="text-2xl" />
                  <span>{weatherData.humidity}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaWind className="text-2xl" />
                  <span>{weatherData.windSpeed} km/h</span>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Recent Cities */}
        {recentCities.length > 0 && (
          <div className="border-t pt-4">
            <h3 className="text-sm text-gray-500 mb-2">Recent Cities</h3>
            <div className="flex flex-wrap gap-2">
              {recentCities.map((recentCity) => (
                <div
                  key={recentCity}
                  className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm"
                >
                  <span
                    onClick={() => fetchWeatherData(recentCity)}
                    className="mr-2 cursor-pointer"
                  >
                    {recentCity}
                  </span>
                  <IoCloseCircle
                    onClick={() => removeRecentCity(recentCity)}
                    className="text-gray-400 cursor-pointer hover:text-red-500"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="flex justify-end">
          <Signup />
        </div>
      </div>
    </div>
  );
};

export default WeatherApp;
