// src/hooks/useTheme.ts
import { useSettings } from "@/contexts/SettingsContext";

export const useTheme = () => {
  const { settings } = useSettings();

  const getThemeClasses = () => {
    const { theme } = settings;

    return {
      // Background Classes
      primaryBg:
        theme === "dark"
          ? "bg-gray-900"
          : theme === "light"
          ? "bg-white"
          : "bg-yellow-300",
      secondaryBg:
        theme === "dark"
          ? "bg-gray-800"
          : theme === "light"
          ? "bg-gray-50"
          : "bg-white",
      cardBg:
        theme === "dark"
          ? "bg-gray-800"
          : theme === "light"
          ? "bg-white"
          : "bg-white",

      // Text Classes
      primaryText:
        theme === "dark"
          ? "text-white"
          : theme === "light"
          ? "text-gray-900"
          : "text-black",
      secondaryText:
        theme === "dark"
          ? "text-gray-300"
          : theme === "light"
          ? "text-gray-600"
          : "text-gray-700",

      // Border Classes
      border:
        theme === "dark"
          ? "border-gray-600"
          : theme === "light"
          ? "border-gray-200"
          : "border-black",
      borderThick:
        theme === "dark"
          ? "border-4 border-gray-600"
          : theme === "light"
          ? "border-4 border-gray-300"
          : "border-4 border-black",

      // Button Classes
      primaryButton:
        theme === "dark"
          ? "bg-blue-600 hover:bg-blue-700 text-white border-gray-600"
          : theme === "light"
          ? "bg-blue-500 hover:bg-blue-600 text-white border-gray-300"
          : "bg-red-500 hover:bg-red-600 text-white border-black",

      secondaryButton:
        theme === "dark"
          ? "bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
          : theme === "light"
          ? "bg-gray-100 hover:bg-gray-200 text-gray-900 border-gray-300"
          : "bg-white hover:bg-gray-100 text-black border-black",

      // Shadow Classes
      shadow:
        theme === "dark"
          ? "shadow-[4px_4px_0px_0px_#374151]"
          : theme === "light"
          ? "shadow-[4px_4px_0px_0px_#e5e7eb]"
          : "shadow-[4px_4px_0px_0px_#000]",

      shadowLarge:
        theme === "dark"
          ? "shadow-[8px_8px_0px_0px_#374151]"
          : theme === "light"
          ? "shadow-[8px_8px_0px_0px_#e5e7eb]"
          : "shadow-[8px_8px_0px_0px_#000]",

      // Hover Effects
      hoverShadow:
        theme === "dark"
          ? "hover:shadow-[2px_2px_0px_0px_#374151]"
          : theme === "light"
          ? "hover:shadow-[2px_2px_0px_0px_#e5e7eb]"
          : "hover:shadow-[2px_2px_0px_0px_#000]",

      // Page Background
      pageGradient:
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : theme === "light"
          ? "bg-gradient-to-br from-gray-50 via-white to-gray-100"
          : "bg-gradient-to-br from-pink-200 via-yellow-200 to-blue-200",
    };
  };

  return {
    theme: settings.theme,
    classes: getThemeClasses(),
  };
};
