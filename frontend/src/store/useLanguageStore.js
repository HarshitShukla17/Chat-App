import { create } from "zustand";

export const useLanguageStore = create((set, get) => ({
  language: localStorage.getItem("chat-language") || "en",
  
  setLanguage: (language) => {
    localStorage.setItem("chat-language", language);
    set({ language });
  },
  
  // Get current language
  getCurrentLanguage: () => get().language,
  
  // Initialize language from localStorage
  initializeLanguage: () => {
    const savedLanguage = localStorage.getItem("chat-language");
    if (savedLanguage) {
      set({ language: savedLanguage });
    }
  },
}));