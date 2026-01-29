import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export default function Button({
  className = "",
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-slate-100 text-slate-950 hover:bg-purple-400 hover:shadow-[0_0_20px_-5px_rgba(192,132,252,0.5)]",
    secondary: "bg-slate-800 text-slate-100 hover:bg-slate-700",
    outline: "border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white",
    ghost: "text-slate-400 hover:text-white hover:bg-white/5",
  };

  const sizes = {
    sm: "h-9 px-3 text-xs",
    md: "h-11 px-6 text-sm",
    lg: "h-14 px-8 text-base",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
}
