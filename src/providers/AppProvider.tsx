import { SettingsProvider } from "@/contexts/SettingsContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { NotificationsProvider } from "@/contexts/NotificationsContext"

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <NotificationsProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </NotificationsProvider>
  );
};