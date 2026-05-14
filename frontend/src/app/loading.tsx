'use client';

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#0a0f1c]">
      <div className="relative w-24 h-24 mb-6">
        <div className="absolute inset-0 rounded-full border-t-2 border-indigo-500 animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-r-2 border-cyan-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        <div className="absolute inset-4 rounded-full border-b-2 border-purple-500 animate-spin" style={{ animationDuration: '2s' }}></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl">🧬</span>
        </div>
      </div>
      <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400 animate-pulse">
        Loading...
      </h2>
      <p className="text-gray-500 mt-2">Preparing your workspace</p>
    </div>
  );
}
