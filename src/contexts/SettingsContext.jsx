"use client";

import { createContext, useContext, useState, useEffect } from "react";

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    theme: "light",
    autoSave: true,
    notifications: true,
    fontSize: "medium",
    imageQuality: "high",
    showTimestamps: true,
    compactView: false,
  });

  useEffect(() => {
    // Load settings from localStorage on mount
    const savedSettings = localStorage.getItem("jotful-settings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  const updateSettings = (newSettings) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem("jotful-settings", JSON.stringify(updatedSettings));
  };

  const resetSettings = () => {
    const defaultSettings = {
      theme: "light",
      autoSave: true,
      notifications: true,
      fontSize: "medium",
      imageQuality: "high",
      showTimestamps: true,
      compactView: false,
    };
    setSettings(defaultSettings);
    localStorage.removeItem("jotful-settings");
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      <div className={settings.theme === 'dark' ? 'dark' : ''}>
        {children}
      </div>
    </SettingsContext.Provider>
  );
};