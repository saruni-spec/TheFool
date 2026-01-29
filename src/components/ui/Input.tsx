import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export default function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      className={`flex h-11 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm ring-offset-slate-950 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-slate-100 ${className}`}
      {...props}
    />
  );
}
