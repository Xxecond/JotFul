"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui";
import { useSettings } from "@/contexts/SettingsContext";
import { useNotifications } from "@/contexts/NotificationContext";
import Modal from "@/components/Modal";

export default function Settings() {
  const { settings, updateSettings, resetSettings } = useSettings();
  const { addNotification } = useNotifications();
  const [showModal, setShowModal] = useState(false);

  const saveSettings = () => {
    setShowModal(true);
  };

  const handleResetSettings = () => {
    if (confirm("Are you sure you want to reset all settings to default?")) {
      resetSettings();
      addNotification("Settings reset to default!", "success");
    }
  };

  const exportData = () => {
    const posts = JSON.parse(localStorage.getItem("posts") || "[]");
    
    // Create a readable text format
    let textContent = `JotFul Backup - ${new Date().toLocaleDateString()}\n`;
    textContent += `=====================================\n\n`;
    
    posts.forEach((post, index) => {
      textContent += `Post ${index + 1}: ${post.title}\n`;
      textContent += `Date: ${new Date(post.createdAt).toLocaleDateString()}\n`;
      textContent += `Content:\n${post.content}\n`;
      if (post.image) textContent += `Image: ${post.image}\n`;
      textContent += `\n---\n\n`;
    });
    
    const blob = new Blob([textContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `JotFul-Backup-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    addNotification("Backup downloaded successfully!", "success");
  };

  return (
    <>
      <div className="bg-white dark:bg-black min-h-screen">
        <Header />
        <section className="max-w-4xl mx-auto p-6 pt-20">
          <div className="bg-gray-50 dark:bg-gray-950 rounded-xl shadow-lg p-8">
            
            {/* Appearance Settings */}
            <div className="mb-8">
              <h2 className="text-xl md:text-2xl xl:3xl font-bold text-black dark:text-white mb-4 flex items-center gap-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm0 2h12v11H4V4z" clipRule="evenodd" />
                </svg>
                Appearance
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm lg:text-base font-medium text-gray-800 dark:text-gray-300 mb-2">Theme</label>
                  <select 
                    value={settings.theme} 
                    onChange={(e) => updateSettings({ theme: e.target.value })}
                    className="text-base w-full px-3 py-1 md:p-2 xl:p-3 mb-5 border border-cyan-700 dark:border-cyan-950 dark:bg-gray-850 dark:text-white rounded-lg focus:ring-2 focus:ring-cyan-700 dark:ring-cyan-950 outline-none"
                  >
                    <option value="light" className="text-white bg-black/70 dark:text-black dark:bg-white/70">Light</option>
                    <option value="dark" className="text-white bg-black/70 dark:text-black dark:bg-white/70">Dark</option>
                    <option value="auto" className="text-white bg-black/70 dark:text-black dark:bg-white/70">Auto</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm lg:text-base font-medium text-gray-800 dark:text-gray-300 mb-2">Font Size</label>
                  <select 
                    value={settings.fontSize} 
                    onChange={(e) => updateSettings({ fontSize: e.target.value })}
               className="text-base  w-full px-3 py-1 md:p-2 xl:p-3 mb-5 border border-cyan-700 dark:border-cyan-950 dark:bg-gray-850 dark:text-white rounded-lg focus:ring-2 focus:ring-cyan-700 dark:ring-cyan-950 outline-none"
                  >
                    <option value="small" className="text-white bg-black/70 dark:text-black dark:bg-white/70">Small</option>
                    <option value="medium" className="text-white bg-black/70 dark:text-black dark:bg-white/70">Medium</option>
                    <option value="large" className="text-white bg-black/70 dark:text-black dark:bg-white/70">Large</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={settings.showTimestamps} 
                    onChange={(e) => updateSettings({ showTimestamps: e.target.checked })}
                    className="w-4 h-4 text-cyan-600 rounded focus:ring-cyan-500"
                  />
                  <span className="text-sm lg:text-base text-gray-800 dark:text-gray-300">Show timestamps on posts</span>
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={settings.compactView} 
                    onChange={(e) => updateSettings({ compactView: e.target.checked })}
                    className="w-4 h-4 text-cyan-600 rounded focus:ring-cyan-500"
                  />
                  <span className="text-sm lg:text-base text-gray-800 dark:text-gray-300">Compact view</span>
                </label>
              </div>
            </div>

            {/* Content Settings */}
            <div className="mb-8">
              <h2 className="text-xl md:text-2xl xl:3xl font-bold text-black dark:text-white mb-4 flex items-center gap-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                Content & Editor
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm lg:text-base font-medium text-gray-800 dark:text-gray-300 mb-2">Image Quality</label>
                  <select 
                    value={settings.imageQuality} 
                    onChange={(e) => updateSettings({ imageQuality: e.target.value })}
                    className="text-base w-full px-3 py-1 md:p-2 xl:p-3 mb-5 border border-cyan-700 dark:border-cyan-950 dark:bg-gray-850 dark:text-white rounded-lg focus:ring-2 focus:ring-cyan-700 dark:ring-cyan-950 outline-none"
                  >
                    <option value="low" className="text-white bg-black/70 dark:text-black dark:bg-white/70">Low (Faster upload)</option>
                    <option value="medium" className="text-white bg-black/70 dark:text-black dark:bg-white/70">Medium</option>
                    <option value="high" className="text-white bg-black/70 dark:text-black dark:bg-white/70">High (Best quality)</option>
                  </select>
                </div>
                
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={settings.autoSave} 
                      onChange={(e) => updateSettings({ autoSave: e.target.checked })}
                      className="w-4 h-4 text-cyan-600 rounded focus:ring-cyan-500"
                    />
                    <span className="text-sm lg:text-base text-gray-800 dark:text-gray-300">Auto-save drafts</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="mb-8">
              <h2 className="text-xl md:text-2xl xl:3xl font-bold text-black dark:text-white mb-4 flex items-center gap-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
                Notifications
              </h2>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={settings.notifications} 
                  onChange={(e) => updateSettings({ notifications: e.target.checked })}
                  className="w-4 h-4 text-cyan-600 rounded focus:ring-cyan-500"
                />
                <span className="text-sm lg:text-base text-gray-800 dark:text-gray-300">Enable notifications</span>
              </label>
            </div>

            {/* Data Management */}
            <div className="mb-8">
              <h2 className="text-xl md:text-2xl xl:3xl font-bold text-black dark:text-white mb-4 flex items-center gap-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Data Management
              </h2>
              
              <div className="flex gap-4">
                <Button 
                  onClick={exportData}
                  variant="special"
                  className="flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Export Data
                </Button>
              </div>
              <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400 mt-2">Download a readable text backup of all your posts</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-cyan-950">
              <Button 
                onClick={saveSettings}
                variant="special"
                className="flex-1"
              >
                Save Settings
              </Button>
              
              <Button 
                onClick={handleResetSettings}
                variant="destructive"
                className="flex-1 bg-red-700 dark:bg-red-850"
              >
                Reset to Default
              </Button>
            </div>

            {/* App Info */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-600 text-center">
              <h3 className="text-lg lg:text-xl font-semibold text-gray-800 dark:text-white mb-2">JotFul</h3>
              <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400">Version 1.0.0</p>
              <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400 mt-2">Your personal blogging companion</p>
            </div>
          </div>
        </section>
        
        <Modal 
          open={showModal}
          message="Settings saved successfully!"
          onConfirm={() => setShowModal(false)}
          singleButton={true}
        />
      </div>
    </>
  );
}