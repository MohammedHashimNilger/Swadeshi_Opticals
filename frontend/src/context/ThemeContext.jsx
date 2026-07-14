import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

/**
 * Provides dark mode state to the whole app, persisted in memory for the
 * session. Toggling adds/removes the `.dark` class on <html>, which the
 * `@custom-variant dark` rule in index.css hooks into.
 */
export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(
    () => localStorage.getItem("swadeshi-theme") === "dark"
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("swadeshi-theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
