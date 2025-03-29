"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function MysteryOption({ userData, onBack }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const router = useRouter();

  const handleCharacterClick = async (character) => {
    try {
      setSelectedCharacter(character);
      setLoading(true);

      // Make sure userData is saved to localStorage before navigation
      try {
        localStorage.setItem("fortuneUserData", JSON.stringify(userData));
      } catch (e) {
        console.error("Failed to save user data to localStorage", e);
      }

      // Add a small delay to show the loading animation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Navigate to the character page with user data as query params
      router.push(
        `/character/${character}?type=${character}&name=${encodeURIComponent(
          userData.name
        )}&sign=${userData.sign}`
      );
    } catch (err) {
      console.error("Character click error:", err);
      setError(
        err.message || "The cosmic energies failed to align. Please try again."
      );
      setLoading(false);
    }
  };

  // Images for characters
  const motivatorPlaceholder = "/motivator.png";
  const roasterPlaceholder = "/roaster.png";

  return (
    <div className="w-full max-w-4xl mx-auto glass-card p-6 animate-zoomIn">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold mb-2 neon-text-white neon-pulse">
          Mysterious Forces Await
        </h2>
        <p className="text-sm neon-text-white">
          Choose a cosmic guide to reveal your fortune
        </p>
      </div>

      {error && (
        <div className="mb-6 p-5 glass-card bg-red-500/10 border border-red-500/30 rounded-lg text-center">
          <p className="neon-text-white mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null);
              setSelectedCharacter(null);
            }}
            className="glass-button py-2 px-4 neon-text-white font-medium rounded-lg"
          >
            Try Again
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Motivator Character */}
        <div
          className={`relative cursor-pointer transform transition-all duration-300 ${
            loading ? "opacity-50 pointer-events-none" : ""
          } ${
            selectedCharacter === "motivator"
              ? "ring-4 ring-white ring-opacity-70 rounded-lg"
              : ""
          }`}
          onClick={() => !loading && handleCharacterClick("motivator")}
        >
          <div className="glass-card bg-gradient-to-b from-purple-600/20 to-indigo-600/20 rounded-lg overflow-hidden aspect-[3/4] relative character-hover">
            <div className="absolute inset-0 flex items-center justify-center character-float">
              <Image
                src={motivatorPlaceholder}
                alt="The Motivator"
                width={300}
                height={400}
                className="object-contain h-full w-full"
                priority
              />
            </div>

            {/* Loading overlay for motivator */}
            {loading && selectedCharacter === "motivator" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm rounded-lg">
                <div className="inline-block w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4"></div>
                <p className="neon-text-white text-center animate-pulse">
                  Connecting to cosmic forces...
                </p>
              </div>
            )}
          </div>
          <div className="mt-3 text-center">
            <h3 className="font-medium text-lg neon-text-white">
              The Motivator
            </h3>
            <p className="text-sm neon-text-white">Cosmic Encourager</p>
          </div>
        </div>

        {/* Roaster Character */}
        <div
          className={`relative cursor-pointer transform transition-all duration-300 ${
            loading ? "opacity-50 pointer-events-none" : ""
          } ${
            selectedCharacter === "roaster"
              ? "ring-4 ring-white ring-opacity-70 rounded-lg"
              : ""
          }`}
          onClick={() => !loading && handleCharacterClick("roaster")}
        >
          <div className="glass-card bg-gradient-to-b from-indigo-600/20 to-purple-600/20 rounded-lg overflow-hidden aspect-[3/4] relative character-hover">
            <div className="absolute inset-0 flex items-center justify-center character-float">
              <Image
                src={roasterPlaceholder}
                alt="The Roaster"
                width={300}
                height={400}
                className="object-contain h-full w-full"
                priority
              />
            </div>

            {/* Loading overlay for roaster */}
            {loading && selectedCharacter === "roaster" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm rounded-lg">
                <div className="inline-block w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4"></div>
                <p className="neon-text-white text-center animate-pulse">
                  Connecting to cosmic forces...
                </p>
              </div>
            )}
          </div>
          <div className="mt-3 text-center">
            <h3 className="font-medium text-lg neon-text-white">The Roaster</h3>
            <p className="text-sm neon-text-white">Cosmic Truth-Teller</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={onBack}
          className="glass-button py-2 px-6 rounded-lg neon-text-white hover:neon-text-white transition duration-200 button-pulse"
          disabled={loading}
        >
          Back
        </button>
      </div>
    </div>
  );
}
