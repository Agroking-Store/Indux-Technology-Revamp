"use client";

import { useEffect, useRef } from "react";
import { getVisitorCount } from "@/lib/api";

export default function VisitorTracker() {
  const hasTracked = useRef(false);

  useEffect(() => {
    if (!hasTracked.current) {
      hasTracked.current = true;
      getVisitorCount(true).catch((err) => {
        console.error("Failed to track visitor session:", err);
      });
    }
  }, []);

  return null;
}
