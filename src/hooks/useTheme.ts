import { useTheme as useNextTheme } from "next-themes";

export function useTheme() {
  const { theme, setTheme, resolvedTheme } = useNextTheme();

  const toggle = () => {
    // If theme is 'system', use resolvedTheme to skip to the opposite
    const current = theme === "system" ? resolvedTheme : theme;
    setTheme(current === "dark" ? "light" : "dark");
  };

  return { theme: resolvedTheme || theme, setTheme, toggle };
}
