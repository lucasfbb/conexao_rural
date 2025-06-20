import { SettingsProvider } from "@/contexts/SettingsContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { NotificationsProvider } from "@/contexts/NotificationsContext"
import { UserProvider } from "@/contexts/UserContext";

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <UserProvider>
      <NotificationsProvider>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </NotificationsProvider>
    </UserProvider>
  );
};