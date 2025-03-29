import axios from "axios";

const API_URL = "https://fortune-teller-api-kgm-114b9adacc3a.herokuapp.com";

// Helper function to retry requests with delay
const retryRequest = async (fn, retriesLeft = 2, interval = 1500) => {
  try {
    return await fn();
  } catch (error) {
    if (retriesLeft === 0) {
      throw error;
    }
    console.log(`Request failed, retrying... (${retriesLeft} attempts left)`);
    await new Promise((resolve) => setTimeout(resolve, interval));
    return retryRequest(fn, retriesLeft - 1, interval);
  }
};

/**
 * Get horoscope data for a specific zodiac sign and optional name
 * @param {number} sign - Zodiac sign (1-12)
 * @param {string} name - Optional name
 * @returns {Promise} - Promise with horoscope data
 */
export const getHoroscope = async (sign, name) => {
  try {
    const url = name
      ? `${API_URL}/get-horoscope?sign=${sign}&name=${encodeURIComponent(name)}`
      : `${API_URL}/get-horoscope?sign=${sign}`;

    console.log("Fetching horoscope from:", url);

    // First make a ping request to wake up the server
    try {
      console.log("Pinging API to wake up the server...");
      await axios.get(`${API_URL}/`, { timeout: 5000 });
      console.log("Server is awake!");
    } catch (pingError) {
      console.log("Ping failed, server might be waking up:", pingError.message);
    }

    // Use retry mechanism for the actual request
    const response = await retryRequest(() =>
      axios.get(url, {
        timeout: 20000, // Increased timeout to 20 seconds
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
    );

    console.log("API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching horoscope:", error);

    // Provide more helpful error messages for debugging
    if (error.code === "ECONNABORTED") {
      throw new Error(
        "Request timed out. The Heroku server might be slow to wake up. Please try again in a moment."
      );
    } else if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw new Error(
        `API error: ${error.response.status} - ${error.response.data}`
      );
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error(
        "Network error: No response received from API server. The server may be starting up. Please try again."
      );
    } else {
      // Something happened in setting up the request that triggered an Error
      throw error;
    }
  }
};

/**
 * Map date of birth to zodiac sign (1-12)
 * @param {Date} dob - Date of birth
 * @returns {number} - Zodiac sign number (1-12)
 */
export const getZodiacSignFromDOB = (dob) => {
  const month = dob.getMonth() + 1; // JavaScript months are 0-indexed
  const day = dob.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 1; // Aries
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 2; // Taurus
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 3; // Gemini
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 4; // Cancer
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 5; // Leo
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 6; // Virgo
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 7; // Libra
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 8; // Scorpio
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 9; // Sagittarius
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 10; // Capricorn
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 11; // Aquarius
  return 12; // Pisces (Feb 19 - Mar 20)
};

/**
 * Get zodiac sign name from number
 * @param {number} sign - Zodiac sign number (1-12)
 * @returns {string} - Zodiac sign name
 */
export const getZodiacName = (sign) => {
  const signs = [
    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Leo",
    "Virgo",
    "Libra",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
    "Aquarius",
    "Pisces",
  ];
  return signs[sign - 1];
};
