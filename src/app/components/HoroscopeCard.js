"use client";
import { useState, useEffect } from "react";
import { getHoroscope } from "../api/horoscopeService";

export default function HoroscopeCard({ userData, onBack }) {
  const [horoscope, setHoroscope] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [show, setShow] = useState(true);

  const fetchHoroscope = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getHoroscope(userData.sign, userData.name);
      setHoroscope(data);
    } catch (err) {
      setError("Failed to fetch your horoscope. " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (show) {
      fetchHoroscope();
    }
  }, [show, fetchHoroscope]);

  if (loading) {
    return (
      <div className="w-full max-w-md mx-auto glass-card p-8 text-center animate-zoomIn">
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <div className="h-10 w-3/4 bg-white/10 rounded"></div>
          <div className="h-24 w-full bg-white/10 rounded"></div>
          <div className="h-16 w-5/6 bg-white/10 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-md mx-auto glass-card p-8 text-center animate-zoomIn">
        <h2 className="text-xl font-bold mb-4 neon-text-pink">
          Cosmic Disturbance!
        </h2>
        <p className="mb-6 neon-text-blue">{error}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={fetchHoroscope}
            className="glass-button py-2 px-4 neon-text-cyan font-medium rounded-lg"
          >
            Try Again
          </button>
          <button
            onClick={onBack}
            className="glass-button py-2 px-4 rounded-lg neon-text-yellow hover:neon-text-pink transition duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto glass-card p-8 animate-zoomIn">
      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold neon-text-green">
          {userData.name}&apos;s Daily Horoscope
        </h2>
        <p className="text-sm neon-text-yellow">{userData.zodiacName}</p>
      </div>

      <div className="space-y-6">
        <div className="glass-card p-4 rounded-lg">
          <h3 className="font-medium mb-2 neon-text-purple">Horoscope</h3>
          <p className="text-sm text-white">{horoscope?.horoscope}</p>
        </div>

        <div className="glass-card p-4 rounded-lg">
          <h3 className="font-medium mb-2 neon-text-blue">Behavior</h3>
          <p className="text-sm text-white">{horoscope?.behavior}</p>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <button
          onClick={onBack}
          className="glass-button py-2 px-4 rounded-lg neon-text-yellow hover:neon-text-pink transition duration-200"
        >
          Back
        </button>
      </div>
    </div>
  );
}
