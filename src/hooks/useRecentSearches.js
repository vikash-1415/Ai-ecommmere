import { useState, useEffect } from "react";

const STORAGE_KEY = "weathercart_recent_searches";
const MAX_SEARCHES = 8;

export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : ["rain jacket", "waterproof shoes", "sunglasses", "hoodie"];
    } catch {
      return ["rain jacket", "waterproof shoes", "sunglasses"];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recentSearches));
    } catch (e) {
      console.warn("Failed to save recent searches", e);
    }
  }, [recentSearches]);

  const addSearch = (term) => {
    if (!term || !term.trim()) return;
    const clean = term.trim();
    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== clean.toLowerCase());
      return [clean, ...filtered].slice(0, MAX_SEARCHES);
    });
  };

  const removeSearch = (term) => {
    setRecentSearches((prev) => prev.filter((item) => item !== term));
  };

  const clearAll = () => {
    setRecentSearches([]);
  };

  return {
    recentSearches,
    addSearch,
    removeSearch,
    clearAll,
  };
}
