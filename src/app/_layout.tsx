// app/_layout.tsx
import { Slot, usePathname } from "expo-router";
import { AppProvider } from "@/providers/AppProvider";
import DrawerLayout from "@/app/layouts/DrawerLayout";

export default function RootLayout() {
  const pathname = usePathname();

  // Caso queira exibir o Drawer só em rotas específicas:
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
