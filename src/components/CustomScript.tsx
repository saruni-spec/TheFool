"use client";

import { useEffect } from "react";

export default function CustomScript({ script }: { script: string }) {
  useEffect(() => {
    if (!script) return;

    try {
      // Execute only if explicitly provided
      // Safely wrap in a function to avoid polluting global scope excessively
      const runScript = new Function(script);
      runScript();
    } catch (error) {
      console.error("Failed to execute custom article script:", error);
    }
  }, [script]);

  return null;
}
