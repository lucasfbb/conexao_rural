import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

// Tipagem do contexto
interface NotificationsContextData {
  notificacoesAtivas: boolean;
  toggleNotificacoes: () => Promise<void>;
}

// Criação do contexto
const NotificationsContext = createContext<NotificationsContextData | undefined>(undefined);

// Provider
export const NotificationsProvider = ({ children }: { children: React.ReactNode }) => {
  const [notificacoesAtivas, setNotificacoesAtivas] = useState(false);

  useEffect(() => {
    const loadStorage = async () => {
      const saved = await AsyncStorage.getItem("notificacoesAtivas");
      if (saved !== null) {
        setNotificacoesAtivas(saved === "true");
      }
    };
    loadStorage();
  }, []);

  const toggleNotificacoes = async () => {
    if (!notificacoesAtivas) {
      // Solicita permissão para notificações
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== "granted") {
        const { status: novoStatus } = await Notifications.requestPermissionsAsync();
        if (novoStatus !== "granted") {
          alert("Você precisa permitir notificações nas configurações do sistema.");
          return;
        }
      }
    }

    const novoEstado = !notificacoesAtivas;
    setNotificacoesAtivas(novoEstado);
    await AsyncStorage.setItem("notificacoesAtivas", String(novoEstado));
  };

  return (
    <NotificationsContext.Provider value={{ notificacoesAtivas, toggleNotificacoes }}>
      {children}
    </NotificationsContext.Provider>
  );
};

// Hook personalizado para usar o contexto
export const useNotificacoes = () => {
  const context = useContext(NotificationsContext);
  if (!context) throw new Error("useNotificacoes precisa estar dentro de NotificationsProvider");
  return context;
};
