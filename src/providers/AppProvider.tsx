import { SettingsProvider } from "@/contexts/SettingsContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    // <SettingsProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    // </SettingsProvider>
  );
};