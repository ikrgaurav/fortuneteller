import { getHoroscope } from "./horoscopeService";

// Store for backend data
let horoscopeData = null;
let motivatorData = null;
let roasterData = null;
let loading = false;
let error = null;

// The initialization state
let initialized = false;

// Function to fetch all data at once
export const fetchAllHoroscopeData = async (sign, name) => {
  if (loading) return;

  loading = true;
  error = null;

  try {
    // Standard horoscope
    const horoscope = await getHoroscope(sign, name);
    horoscopeData = horoscope;

    // Cache key for motivator and roaster
    const motivatorCacheKey = `fortune_motivator_${name}_${sign}`;
    const roasterCacheKey = `fortune_roaster_${name}_${sign}`;

    // Check cache first for motivator
    const cachedMotivator = localStorage.getItem(motivatorCacheKey);
    if (cachedMotivator) {
      motivatorData = JSON.parse(cachedMotivator);
    } else {
      // Fetch and cache
      motivatorData = await getHoroscope(sign, name);
      localStorage.setItem(motivatorCacheKey, JSON.stringify(motivatorData));
    }

    // Check cache first for roaster
    const cachedRoaster = localStorage.getItem(roasterCacheKey);
    if (cachedRoaster) {
      roasterData = JSON.parse(cachedRoaster);
    } else {
      // Fetch and cache
      roasterData = await getHoroscope(sign, name);
      localStorage.setItem(roasterCacheKey, JSON.stringify(roasterData));
    }

    initialized = true;
  } catch (err) {
    error = err.message || "Failed to fetch horoscope data";
    console.error("Error fetching horoscope data:", err);
  } finally {
    loading = false;
  }
};

// Getters for the stored data
export const getStoredHoroscopeData = () => horoscopeData;
export const getStoredMotivatorData = () => motivatorData;
export const getStoredRoasterData = () => roasterData;
export const isDataLoading = () => loading;
export const getDataError = () => error;
export const isDataInitialized = () => initialized;

// Reset data (for cleanup or new user)
export const resetData = () => {
  horoscopeData = null;
  motivatorData = null;
  roasterData = null;
  loading = false;
  error = null;
  initialized = false;
};
