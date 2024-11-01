import { useEffect, useState } from "react";
import { DarkModeSwitch } from "react-toggle-dark-mode";

function ThemeToggle() {
  const [theme, setTheme] = useState(
    document.documentElement.classList.contains("dark") ? "dark" : "light"
  );

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <DarkModeSwitch
      checked={theme === "dark"}
      onChange={toggleTheme}
      size={22}
    />
  );
}

export default ThemeToggle;
