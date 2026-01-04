import { useState } from "react";
import { AppSettings, loadSettings, saveSettings } from "../settings";
import { THEMES } from "../themes";

export default function SettingsView() {
  const [settings, setSettings] = useState<AppSettings>(loadSettings());

  const toggleOverlay = () => {
    const newS = { ...settings, overlayEnabled: !settings.overlayEnabled };
    setSettings(newS);
    saveSettings(newS);
  };

  const toggleSound = () => {
    const newS = { ...settings, soundEnabled: !settings.soundEnabled };
    setSettings(newS);
    saveSettings(newS);
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const news = { ...settings, theme: e.target.value };

    setSettings(news);
    saveSettings(news);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center pb-2 border-b border-gray-700">
        <h3 className="text-gray-300 font-bold uppercase tracking-widest text-xs">
          Configuration
        </h3>
      </div>

      {/* Toggle: Meme Overlay */}
      <div className="flex justify-between items-center">
        <div>
          <div className="text-sm font-bold text-gray-200">
            Celebration Mode
          </div>
          <div className="text-xs text-gray-500">
            Show GTA banner on submission
          </div>
        </div>
        <button
          onClick={toggleOverlay}
          role="switch"
          aria-checked={settings.overlayEnabled}
          className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-green-500/40
    ${settings.overlayEnabled ? "bg-green-600" : "bg-gray-700"}`}
        >
          <span
            className={`absolute left-1 top-auto h-4 w-4 rounded-full bg-white
          transition-transform duration-200
      ${settings.overlayEnabled ? "translate-x-5" : "translate-x-0"}`}
          />
        </button>
      </div>

      {/* Toggle: Sound */}
      <div className="flex justify-between items-center">
        <div>
          <div className="text-sm font-bold text-gray-200">Sound Effects</div>
          <div className="text-xs text-gray-500">
            Play Wasted/Mission Passed
          </div>
        </div>
        <button
          onClick={toggleSound}
          role="switch"
          aria-checked={settings.soundEnabled}
          className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-green-500/40
    ${settings.soundEnabled ? "bg-green-600" : "bg-gray-700"}`}
        >
          <span
            className={`absolute left-1 top-auto h-4 w-4 rounded-full bg-white
          transition-transform duration-200
      ${settings.soundEnabled ? "translate-x-5" : "translate-x-0"}`}
          />
        </button>
      </div>

      <div>
        <div className="text-sm font-bold text-gray-200 mb-1">Visual Theme</div>
        <select
          value={settings.theme}
          onChange={handleThemeChange}
          className="w-full bg-gray-800 text-white border border-gray-600 rounded p-2 text-sm focus:border-green-500 outline-none transition-colors"
        >
          {Object.entries(THEMES).map(([key, theme]) => (
            <option key={key} value={key}>
              {theme.name}
            </option>
          ))}
        </select>
        <div className="text-xs text-gray-500 mt-1">
          Sets the banner style and sound effects.
        </div>
      </div>

      {/* Info */}
      <div className="bg-gray-800 p-3 rounded text-[10px] text-gray-400 mt-4 border border-gray-700">
        Note: Settings are saved automatically to your browser.
      </div>
    </div>
  );
}
