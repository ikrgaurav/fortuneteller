"use client";

export default function OptionSelector({ userData, onSelectOption, onBack }) {
  return (
    <div className="w-full max-w-lg mx-auto glass-card p-8 animate-zoomIn">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold mb-2 neon-text-white neon-pulse">
          Welcome, {userData.name}!
        </h2>
        <p className="neon-text-white">
          The stars have revealed you are a{" "}
          <span className="font-semibold neon-text-white">
            {userData.zodiacName}
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Regular Horoscope Option */}
        <button
          onClick={() => onSelectOption("regular")}
          className="glass-card p-6 rounded-xl border border-white/20 hover:border-white/50 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-2 text-center group"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-600/80 to-indigo-600/80 flex items-center justify-center neon-text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
          </div>
          <h3 className="font-medium text-lg mb-2 neon-text-white group-hover:neon-text-white">
            Daily Horoscope
          </h3>
          <p className="text-sm neon-text-white">
            View your cosmic forecast for today
          </p>
        </button>

        {/* Mystery Option */}
        <button
          onClick={() => onSelectOption("mystery")}
          className="glass-card p-6 rounded-xl border border-white/20 hover:border-white/50 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-2 text-center group"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-indigo-600/80 to-purple-600/80 flex items-center justify-center neon-text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="font-medium text-lg mb-2 neon-text-white group-hover:neon-text-white">
            Mystery Reading
          </h3>
          <p className="text-sm neon-text-white">
            Discover what mystical characters have to say
          </p>
        </button>
      </div>

      <div className="text-center">
        <button
          onClick={onBack}
          className="glass-button py-2 px-6 rounded-lg neon-text-white hover:neon-text-white transition duration-200 button-pulse"
        >
          Back
        </button>
      </div>
    </div>
  );
}
