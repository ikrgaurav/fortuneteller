"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getStoredMotivatorData,
  getStoredRoasterData,
  isDataInitialized,
  fetchAllHoroscopeData,
} from "../../api/dataStore";

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

export default function CharacterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "motivator";
  const name = searchParams.get("name") || "";
  const sign = parseInt(searchParams.get("sign") || "1", 10);

  const [horoscope, setHoroscope] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleText, setVisibleText] = useState("");
  const [animationDone, setAnimationDone] = useState(false);
  const contentRef = useRef(null);
  const timerRef = useRef(null);

  // Get character info based on type
  const isMotivator = type === "motivator";
  const characterImage = isMotivator ? "/motivator.png" : "/roaster.png";
  const characterTitle = isMotivator ? "The Motivator" : "The Roaster";
  const characterColor = isMotivator ? "neon-text-purple" : "neon-text-blue";
  const buttonGradient = isMotivator
    ? "from-purple-600/80 to-indigo-600/80"
    : "from-indigo-600/80 to-purple-600/80";

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Check if data is already initialized in the store
        if (isDataInitialized()) {
          // Get data from the store based on character type
          const data = isMotivator
            ? getStoredMotivatorData()
            : getStoredRoasterData();
          if (data) {
            setHoroscope(data);
            setLoading(false);
            return;
          }
        }

        // If we don't have data, fetch it
        await fetchAllHoroscopeData(sign, name);

        // Try again to get from store after fetching
        const data = isMotivator
          ? getStoredMotivatorData()
          : getStoredRoasterData();
        if (data) {
          setHoroscope(data);
        } else {
          throw new Error("Failed to load character data");
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching horoscope:", err);
        setError(err.message || "Failed to load your cosmic message");
        setLoading(false);
      }
    }

    fetchData();

    // Clear any existing animation timers when component unmounts or dependencies change
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [sign, name, isMotivator]);

  // Simple text typing animation without any complex DOM manipulations
  useEffect(() => {
    if (loading || !horoscope) return;

    // Clear any existing animation
    if (timerRef.current) clearTimeout(timerRef.current);

    // Reset visible text
    setVisibleText("");
    setAnimationDone(false);

    // Get the text content
    const fullText = isMotivator ? horoscope.motivation : horoscope.roast;
    if (!fullText) return;

    let index = 0;
    const typingSpeed = 30; // ms per character

    function typeNextChar() {
      if (index < fullText.length) {
        setVisibleText(fullText.substring(0, index + 1));
        index++;
        timerRef.current = setTimeout(typeNextChar, typingSpeed);
      } else {
        setAnimationDone(true);
      }
    }

    // Start typing animation
    timerRef.current = setTimeout(typeNextChar, 500); // Small delay before starting

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [horoscope, loading, isMotivator]);

  // Handle scrolling when text changes
  useEffect(() => {
    if (contentRef.current && visibleText) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [visibleText]);

  const handleGoBack = () => {
    // Store a flag in sessionStorage to indicate we're coming back from character view
    sessionStorage.setItem("returnToOptions", "true");
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen cosmic-sparkle flex items-center justify-center p-4">
        {/* YouTube Background */}
        <YouTubeBackground />

        <div className="glass-card p-8 w-full max-w-lg text-center">
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="w-20 h-20 relative mb-6">
              {/* Spinning cosmic loader */}
              <div className="absolute inset-0 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
              <div className="absolute inset-3 border-4 border-white/30 border-b-white rounded-full animate-spin-reverse"></div>
              <div className="absolute inset-6 bg-white/10 rounded-full animate-pulse"></div>
            </div>
            <h2 className="text-2xl font-bold mb-4 neon-text-white animate-pulse">
              Cosmic Connection
            </h2>
          </div>
          <p className="neon-text-white animate-pulse text-center">
            {characterTitle} is reading your stars...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen cosmic-sparkle flex items-center justify-center p-4">
        <div className="glass-card p-8 w-full max-w-lg text-center">
          <h2 className="text-2xl font-bold mb-4 neon-text-white">
            Cosmic Disruption
          </h2>
          <p className="mb-6 neon-text-white">{error}</p>
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

  return (
    <div className="min-h-screen cosmic-sparkle flex items-center justify-center p-4">
      {/* YouTube Background */}
      <YouTubeBackground />

      <div className="w-full max-w-6xl animate-cosmicEntrance">
        <div className="flex flex-col md:flex-row items-center justify-center">
          {/* Character Image */}
          <div className="w-full md:w-1/3 flex justify-center animate-slideRight">
            <div className="w-64 h-64 md:w-80 md:h-auto glass-card p-4 rounded-2xl overflow-hidden">
              <Image
                src={characterImage}
                alt={characterTitle}
                width={320}
                height={450}
                className="object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                priority
              />
            </div>
          </div>

          {/* Text Content */}
          <div className="w-full md:w-2/3 p-6">
            <h2 className="text-3xl font-bold mb-6 animate-revealText neon-text-white neon-pulse">
              {characterTitle}
            </h2>

            <div
              ref={contentRef}
              className="glass-card p-6 rounded-xl overflow-y-auto max-h-[40vh] md:max-h-[50vh] animate-revealText"
              style={{ animationDelay: "0.3s" }}
            >
              <p className="text-lg leading-relaxed plain-white-text">
                {visibleText}
                {!animationDone && <span className="typing-cursor">|</span>}
              </p>
            </div>

            <div className="flex justify-between">
              <button
                onClick={handleGoBack}
                className="glass-button mt-8 px-6 py-3 rounded-lg neon-text-white hover:neon-text-white transition duration-200 button-pulse"
                style={{
                  animationDelay: "0.6s",
                }}
              >
                Return to Cosmic Selection
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
