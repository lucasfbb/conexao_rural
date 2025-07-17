import { SettingsProvider } from "@/contexts/SettingsContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { NotificationsProvider } from "@/contexts/NotificationsContext"
import { UserProvider } from "@/contexts/UserContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { FavoritosProvider } from "@/contexts/FavoritosContext";

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <UserProvider>
        <NotificationsProvider>
          <FavoritosProvider>
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </FavoritosProvider>
        </NotificationsProvider>
      </UserProvider>
    </AuthProvider>
  );
};