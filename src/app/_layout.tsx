// app/_layout.tsx
import { Slot, usePathname } from "expo-router";
import { AppProvider } from "@/providers/AppProvider";
import DrawerLayout from "@/app/layouts/DrawerLayout";
import { useEffect } from "react";
import { setAuthHandler } from "../../services/api";
import { useAuth } from "@/contexts/AuthContext";

export default function RootLayout() {
  const pathname = usePathname();
  const { setAuthenticated } = useAuth();

  useEffect(() => {
    setAuthHandler(setAuthenticated); // conecta interceptor ao contexto
  }, []);

  const isDrawerPage =
    pathname.startsWith("/home") ||
    pathname.startsWith("/perfil") ||
    pathname.startsWith("/notificacoes") ||
    pathname.startsWith("/configuracoes") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/carrinho") ||
    pathname.startsWith("/areaProdutor");

  return (
    <AppProvider>
      {isDrawerPage ? <DrawerLayout /> : <Slot />}
    </AppProvider>
  );
}
