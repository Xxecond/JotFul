export default function Button({
  children,
  type = "button",
  variant = "primary",
  className = "",
  ...props
}) {
  const base =
    "px-4 py-2 rounded-xl font-semibold transition duration-200 focus:outline-none";

  const variants = {
    primary: "bg-cyan-600 text-white hover:bg-cyan-700",
    outline:
      "border border-cyan-600 text-cyan-600 hover:bg-cyan-600 hover:text-white",
    secondary:
      "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      type={type}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
