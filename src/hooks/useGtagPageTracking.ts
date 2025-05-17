// src/hooks/useGtagPageTracking.ts
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useGtagPageTracking() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window.gtag === 'function') {
      window.gtag('config', 'AW-17086379635', {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);
}
