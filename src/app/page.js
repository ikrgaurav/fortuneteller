"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import UserForm from "./components/UserForm";
import OptionSelector from "./components/OptionSelector";
import HoroscopeCard from "./components/HoroscopeCard";
import MysteryOption from "./components/MysteryOption";
import {
  fetchAllHoroscopeData,
  resetData,
  isDataLoading,
  getDataError,
  isDataInitialized,
} from "./api/dataStore";

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
  const [fetchingInitialData, setFetchingInitialData] = useState(false);
  const [dataFetchError, setDataFetchError] = useState(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if we're returning from a character page
    const returnToOptions = sessionStorage.getItem("returnToOptions");

    // Load userData from localStorage if returning from character page
    if (returnToOptions === "true") {
      try {
        const savedUserData = localStorage.getItem("fortuneUserData");
        if (savedUserData) {
          const parsedUserData = JSON.parse(savedUserData);
          setUserData(parsedUserData);
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

  // Handle form submission and data fetching
  const handleFormSubmit = async (formData) => {
    setFetchingInitialData(true);
    setDataFetchError(null);
    setUserData(formData);

    try {
      // Save to localStorage for persistence
      localStorage.setItem("fortuneUserData", JSON.stringify(formData));

      // Fetch all data at once
      await fetchAllHoroscopeData(formData.sign, formData.name);

      // Move to options view after data is fetched
      setCurrentView("options");
    } catch (err) {
      console.error("Error fetching initial data:", err);
      setDataFetchError("Failed to fetch your cosmic data. Please try again.");
    } finally {
      setFetchingInitialData(false);
    }
  };

  const handleOptionSelect = (option) => {
    setCurrentView(option);
  };

  const handleBackClick = () => {
    if (currentView === "options") {
      // When going back to form, clear localStorage and reset data store
      try {
        localStorage.removeItem("fortuneUserData");
        resetData();
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
        {currentView === "form" && (
          <>
            {dataFetchError && (
              <div className="mb-6 p-5 glass-card bg-red-500/10 border border-red-500/30 rounded-lg text-center">
                <p className="neon-text-white mb-4">{dataFetchError}</p>
              </div>
            )}
            <UserForm
              onSubmit={handleFormSubmit}
              isLoading={fetchingInitialData}
            />
          </>
        )}

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
