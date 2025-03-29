"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import UserForm from "./components/UserForm";
import OptionSelector from "./components/OptionSelector";
import HoroscopeCard from "./components/HoroscopeCard";
import MysteryOption from "./components/MysteryOption";
import { getHoroscope } from "./api/horoscopeService";

// YouTube Background Component
const YouTubeBackground = () => {
  return (
    <div className="youtube-background">
      <iframe
        src="https://www.youtube.com/embed/FAs3nl1x2Yw?autoplay=1&mute=1&controls=0&loop=1&playlist=FAs3nl1x2Yw&showinfo=0&rel=0&disablekb=1&modestbranding=1&iv_load_policy=3"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Background Video"
      ></iframe>
    </div>
  );
};

// Main page component
export default function Home() {
  return (
    <Suspense fallback={<div className="neon-text-white">Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}

// Content component that uses hooks
function HomeContent() {
  const [userData, setUserData] = useState(null);
  const [currentView, setCurrentView] = useState("form"); // form, options, regular, mystery
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if we're returning from a character page
    const returnToOptions = sessionStorage.getItem("returnToOptions");

    // Load userData from localStorage if returning from character page
    if (returnToOptions === "true") {
      try {
        const savedUserData = localStorage.getItem("fortuneUserData");
        if (savedUserData) {
          setUserData(JSON.parse(savedUserData));
          setCurrentView("options");
        }
        // Clear the flag
        sessionStorage.removeItem("returnToOptions");
      } catch (err) {
        console.error("Error loading userData from localStorage:", err);
      }
    }

    // Check URL parameters
    const viewParam = searchParams.get("view");
    if (viewParam === "options" && userData) {
      setCurrentView("options");
    }
  }, [searchParams, userData]);

  const handleFormSubmit = (formData) => {
    setUserData(formData);
    setCurrentView("options");

    // Save to localStorage for persistence
    try {
      localStorage.setItem("fortuneUserData", JSON.stringify(formData));
    } catch (err) {
      console.error("Error saving to localStorage:", err);
    }
  };

  // Function to prefetch both character responses in the background
  const prefetchHoroscopes = async (data) => {
    if (!data || !data.sign) return;

    const { name, sign } = data;

    // Create cache keys for both character types
    const motivatorCacheKey = `fortune_motivator_${name}_${sign}`;
    const roasterCacheKey = `fortune_roaster_${name}_${sign}`;

    // Check if we already have cached responses
    const hasMotivatorCache = localStorage.getItem(motivatorCacheKey);
    const hasRoasterCache = localStorage.getItem(roasterCacheKey);

    // Make background API calls for any missing responses
    try {
      // Motivator horoscope
      if (!hasMotivatorCache) {
        console.log("Prefetching motivator horoscope in background");
        const motivatorData = await getHoroscope(sign, name);
        localStorage.setItem(motivatorCacheKey, JSON.stringify(motivatorData));
        console.log("Motivator horoscope cached successfully");
      }

      // Roaster horoscope
      if (!hasRoasterCache) {
        console.log("Prefetching roaster horoscope in background");
        const roasterData = await getHoroscope(sign, name);
        localStorage.setItem(roasterCacheKey, JSON.stringify(roasterData));
        console.log("Roaster horoscope cached successfully");
      }
    } catch (error) {
      // We don't show errors to the user for background prefetching
      console.error("Error prefetching horoscopes:", error);
    }
  };

  const handleOptionSelect = (option) => {
    setCurrentView(option);
  };

  const handleBackClick = () => {
    if (currentView === "options") {
      // When going back to form, clear localStorage
      try {
        localStorage.removeItem("fortuneUserData");
        setUserData(null);
      } catch (err) {
        console.error("Error removing userData from localStorage:", err);
      }
      setCurrentView("form");
    } else {
      setCurrentView("options");
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 cosmic-sparkle">
      {/* YouTube Background */}
      <YouTubeBackground />

      <header className="w-full max-w-7xl mx-auto mb-12 text-center">
        <h1
          className="text-5xl md:text-6xl font-bold text-white mb-6 animate-revealText neon-text-white neon-pulse"
          style={{ textShadow: "0 0 20px rgba(103, 232, 249, 0.5)" }}
        >
          Cosmic Fortune Teller
        </h1>

        <div className="flex justify-center">
          <div className="glass-card px-8 py-4 w-full max-w-xl mx-auto">
            <div className="text-lg neon-text-pink text-center">
              Discover what the stars have in store for you through mystical
              insights and cosmic wisdom
            </div>
          </div>
        </div>
      </header>

      <main className="w-full max-w-7xl mx-auto">
        {currentView === "form" && <UserForm onSubmit={handleFormSubmit} />}

        {currentView === "options" && userData && (
          <OptionSelector
            userData={userData}
            onSelectOption={handleOptionSelect}
            onBack={handleBackClick}
          />
        )}

        {currentView === "regular" && userData && (
          <HoroscopeCard userData={userData} onBack={handleBackClick} />
        )}

        {currentView === "mystery" && userData && (
          <MysteryOption userData={userData} onBack={handleBackClick} />
        )}
      </main>

      <footer className="w-full max-w-7xl mx-auto mt-20 text-center">
        <p className="glass-card inline-block px-6 py-3 neon-text-yellow">
          © {new Date().getFullYear()} Cosmic Fortune Teller | Made with ❤️ by
          Gaurav
        </p>
      </footer>
    </div>
  );
}
