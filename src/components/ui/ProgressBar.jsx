"use client";

export default function ProgressBar({ 
  height = "h-1", 
  color = "bg-cyan-800 dark:bg-cyan-300",
  bgColor = "bg-gray-200 dark:bg-gray-700",
  className = ""
}) {
  return (
    <div 
      className={`w-full ${bgColor} rounded-full overflow-hidden ${height} ${className}`}
      role="status"
      aria-label="loading"
    >
      <div
        className={`${height} ${color} rounded-full animate-[progress_1.5s_ease-in-out_infinite]`}
        style={{
          animation: "progress 1.5s ease-in-out infinite",
        }}
      />
      <style jsx>{`
        @keyframes progress {
          0% { width: 0%; margin-left: 0%; }
          50% { width: 50%; margin-left: 25%; }
          100% { width: 0%; margin-left: 100%; }
        }
      `}</style>
    </div>
  );
}
