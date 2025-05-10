// src/hooks/useSubscription.ts
import { useState, useEffect } from "react";
import { fetchMySubscription } from "../lib/api";
import type { Subscription } from "../lib/types";

export function useSubscription(): Subscription | null | undefined {
  // undefined = loading, null = no sub, Subscription = active/trialing
  const [sub, setSub] = useState<Subscription | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;

    fetchMySubscription()
      .then((data) => {
        if (cancelled) return;
        setSub(data.status === "active" || data.status === "trialing" ? data : null);
      })
      .catch(() => {
        if (!cancelled) setSub(null);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return sub;
}
