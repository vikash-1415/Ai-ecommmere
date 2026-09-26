import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { useUserLocation } from "../hooks/useUserLocation";
import { fetchWeather } from "../services/weatherApi";

export const POPULAR_CITIES = [
  { name: "Ahmedabad", state: "Gujarat", lat: 23.0225, lon: 72.5714 },
  { name: "Mumbai", state: "Maharashtra", lat: 19.076, lon: 72.8777 },
  { name: "Delhi", state: "Delhi", lat: 28.6139, lon: 77.209 },
  { name: "Bengaluru", state: "Karnataka", lat: 12.9716, lon: 77.5946 },
  { name: "London", state: "UK", lat: 51.5074, lon: -0.1278 },
  { name: "New York", state: "US", lat: 40.7128, lon: -74.006 },
];

const WeatherContext = createContext(null);

export function WeatherProvider({ children }) {
  const {
    location: gpsLocation,
    loading: locationLoading,
    error: locationError,
    requestLocation,
  } = useUserLocation();

  // Active coordinates (either GPS or manual city selection)
  const [activeCoords, setActiveCoords] = useState(null);
  const [selectedCityName, setSelectedCityName] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSimulated, setIsSimulated] = useState(false);

  // Sync GPS location when granted
  useEffect(() => {
    if (gpsLocation && !selectedCityName) {
      setActiveCoords({
        latitude: gpsLocation.latitude,
        longitude: gpsLocation.longitude,
      });
    } else if (locationError && !activeCoords && !selectedCityName) {
      // Default initial city when location permission is not granted
      const defaultCity = POPULAR_CITIES[0]; // Ahmedabad
      setActiveCoords({
        latitude: defaultCity.lat,
        longitude: defaultCity.lon,
      });
      setSelectedCityName(defaultCity.name);
    }
  }, [gpsLocation, locationError]);

  // Load weather whenever active coordinates change
  useEffect(() => {
    if (!activeCoords) return;

    async function loadWeather() {
      try {
        setLoading(true);
        setError(null);
        setIsSimulated(false);

        const result = await fetchWeather(
          activeCoords.latitude,
          activeCoords.longitude
        );

        setWeather(result);
      } catch (err) {
        setError(err.message || "Failed to load weather");
      } finally {
        setLoading(false);
      }
    }

    loadWeather();
  }, [activeCoords]);

  // Change city manually
  const changeCity = (cityName) => {
    const found = POPULAR_CITIES.find(
      (c) => c.name.toLowerCase() === cityName.toLowerCase()
    );
    if (found) {
      setSelectedCityName(found.name);
      setActiveCoords({
        latitude: found.lat,
        longitude: found.lon,
      });
    }
  };

  // Weather simulation toggle for instant testing of AI engine
  const simulateWeather = (conditionPreset) => {
    setIsSimulated(true);
    if (conditionPreset === "rain") {
      setWeather((prev) => ({
        ...(prev || {}),
        location: { name: selectedCityName || prev?.location?.name || "Ahmedabad" },
        temperature: 24,
        humidity: 88,
        condition: "Rain",
        description: "heavy monsoon rain showers",
        icon: "10d",
        rainProbability: 95,
      }));
    } else if (conditionPreset === "sunny") {
      setWeather((prev) => ({
        ...(prev || {}),
        location: { name: selectedCityName || prev?.location?.name || "Ahmedabad" },
        temperature: 36,
        humidity: 38,
        condition: "Clear",
        description: "hot and sunny weather",
        icon: "01d",
        rainProbability: 5,
      }));
    } else if (conditionPreset === "cold") {
      setWeather((prev) => ({
        ...(prev || {}),
        location: { name: selectedCityName || prev?.location?.name || "Ahmedabad" },
        temperature: 11,
        humidity: 50,
        condition: "Cold",
        description: "chilly winter breeze",
        icon: "13d",
        rainProbability: 10,
      }));
    } else if (conditionPreset === "humid") {
      setWeather((prev) => ({
        ...(prev || {}),
        location: { name: selectedCityName || prev?.location?.name || "Ahmedabad" },
        temperature: 31,
        humidity: 85,
        condition: "Humid",
        description: "tropical humid weather",
        icon: "50d",
        rainProbability: 60,
      }));
    }
  };

  const resetToLiveLocation = () => {
    setSelectedCityName("");
    setIsSimulated(false);
    requestLocation();
  };

  return (
    <WeatherContext.Provider
      value={{
        weather,
        location: activeCoords,
        loading: locationLoading || loading,
        error: locationError || error,
        locationError,
        selectedCityName,
        isSimulated,
        changeCity,
        simulateWeather,
        resetToLiveLocation,
        cities: POPULAR_CITIES,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  const context = useContext(WeatherContext);

  if (!context) {
    throw new Error("useWeather must be used inside WeatherProvider");
  }

  return context;
}
