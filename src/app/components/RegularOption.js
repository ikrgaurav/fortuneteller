"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function RegularOption({ userData, onBack }) {
  const [horoscope, setHoroscope] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const cacheKey = `regular_fortune_${userData.sign}`;

  const fetchHoroscope = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Check cache first
      const cachedResponse = localStorage.getItem(cacheKey);
      if (cachedResponse) {
        console.log("Using cached response for regular horoscope");
        setHoroscope(JSON.parse(cachedResponse));
        setIsLoading(false);
        return;
      }

      // No cache, fetch from API
      console.log("Fetching regular horoscope from API");
      const response = await fetch(
        `https://awanfortune.herokuapp.com/fortune/${userData.sign}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch horoscope");
      }

      const data = await response.json();
      setHoroscope(data.fortune);

      // Cache the response
      localStorage.setItem(cacheKey, JSON.stringify(data.fortune));
    } catch (err) {
      console.error("Error fetching horoscope:", err);
      setError("Could not retrieve your horoscope at this time.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    onBack();
  };

  return (
    <div className="w-full max-w-lg mx-auto glass-card p-8 animate-fadeIn">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2 neon-text-white neon-pulse">
          Daily Horoscope
        </h2>
        <p className="neon-text-white">
          For {userData.name}, {userData.zodiacName}
        </p>
      </div>

      <div className="text-center mb-8">
        <div className="relative w-48 h-48 mx-auto mb-4">
          <Image
            src={`/images/zodiac/${userData.sign}.png`}
            alt={userData.zodiacName}
            fill
            className="object-contain"
          />
        </div>
      </div>

      {!horoscope && !isLoading && !error && (
        <div className="text-center">
          <button
            onClick={fetchHoroscope}
            className="glass-button py-2 px-6 rounded-lg neon-text-white hover:neon-text-white transition duration-200 button-pulse"
          >
            Reveal Your Horoscope
          </button>
        </div>
      )}

      {isLoading && (
        <div className="text-center">
          <div className="w-16 h-16 relative mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
            <div className="absolute inset-3 border-4 border-white/30 border-b-white rounded-full animate-spin-reverse"></div>
            <div className="absolute inset-6 bg-white/10 rounded-full animate-pulse"></div>
          </div>
          <p className="mt-4 neon-text-white animate-pulse">
            Consulting the stars...
          </p>
        </div>
      )}

      {error && (
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchHoroscope}
            className="glass-button py-2 px-6 rounded-lg neon-text-white hover:neon-text-white transition duration-200 button-pulse"
          >
            Try Again
          </button>
        </div>
      )}

      {horoscope && (
        <div className="animate-fadeIn">
          <p className="text-lg mb-6 plain-white-text leading-relaxed text-center">
            {horoscope}
          </p>
          <div className="text-center">
            <button
              onClick={fetchHoroscope}
              className="glass-button py-2 px-6 rounded-lg neon-text-white hover:neon-text-white transition duration-200 button-pulse mr-4"
            >
              New Reading
            </button>
          </div>
        </div>
      )}

      <div className="text-center mt-8">
        <button
          onClick={handleGoBack}
          className="glass-button py-2 px-6 rounded-lg neon-text-white hover:neon-text-white transition duration-200 button-pulse"
        >
          Return to Cosmic Selection
        </button>
      </div>
    </div>
  );
}
