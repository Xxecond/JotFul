"use client";

export default function DotWave({ size = "md", color = "bg-cyan-600 dark:bg-cyan-400" }) {
  const sizeClasses = {
    sm: "h-1.5 w-1.5",
    md: "h-2 w-2",
    lg: "h-3 w-3",
  };

  return (
    <div className="flex items-center gap-1" role="status" aria-label="loading">
      <div
        className={`${sizeClasses[size]} ${color} rounded-full animate-bounce`}
        style={{ animationDelay: "0ms" }}
      />
      <div
        className={`${sizeClasses[size]} ${color} rounded-full animate-bounce`}
        style={{ animationDelay: "150ms" }}
      />
      <div
        className={`${sizeClasses[size]} ${color} rounded-full animate-bounce`}
        style={{ animationDelay: "300ms" }}
      />
    </div>
  );
}
