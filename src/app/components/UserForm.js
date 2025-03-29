"use client";
import { useState } from "react";
import { getZodiacSignFromDOB, getZodiacName } from "../api/horoscopeService";

export default function UserForm({ onSubmit }) {
  const [name, setName] = useState("");
  const [dobString, setDobString] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const dobDate = new Date(dobString);
    const sign = getZodiacSignFromDOB(dobDate);

    onSubmit({
      name: name.trim(),
      sign,
      zodiacName: getZodiacName(sign),
    });
  };

  return (
    <div className="w-full max-w-md mx-auto glass-card p-8 animate-zoomIn">
      <h2 className="text-2xl font-bold mb-6 text-center">
        <span className="neon-text-white neon-pulse">
          Discover Your Cosmic Destiny
        </span>
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium mb-2 neon-text-white"
          >
            Your Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
            className="w-full px-4 py-3 rounded-lg glass-input focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition duration-200"
          />
        </div>

        <div>
          <label
            htmlFor="dob"
            className="block text-sm font-medium mb-2 neon-text-white"
          >
            Date of Birth
          </label>
          <input
            id="dob"
            type="date"
            value={dobString}
            onChange={(e) => setDobString(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg glass-input focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition duration-200"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 glass-button button-primary button-pulse font-medium rounded-lg transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0 neon-text-white"
        >
          Reveal My Fortune
        </button>
      </form>
    </div>
  );
}
