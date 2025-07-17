import { SettingsProvider } from "@/contexts/SettingsContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { NotificationsProvider } from "@/contexts/NotificationsContext"
import { UserProvider } from "@/contexts/UserContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { FavoritosProvider } from "@/contexts/FavoritosContext";
import { CarrinhoProvider } from '@/contexts/CarrinhoContext';

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <UserProvider>
        <CarrinhoProvider>
          <NotificationsProvider>
            <FavoritosProvider>
              <ThemeProvider>
                {children}
              </ThemeProvider>
            </FavoritosProvider>
          </NotificationsProvider>
        </CarrinhoProvider>
      </UserProvider>
    </AuthProvider>
  );
};