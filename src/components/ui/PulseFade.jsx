"use client";

export default function PulseFade({ size = "md", color = "bg-cyan-600 dark:bg-cyan-400" }) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  return (
    <div className="relative flex items-center justify-center" role="status" aria-label="loading">
      <div
        className={`absolute ${sizeClasses[size]} ${color} rounded-full opacity-75 animate-ping`}
      />
      <div
        className={`relative ${sizeClasses[size]} ${color} rounded-full animate-pulse`}
      />
    </div>
  );
}
