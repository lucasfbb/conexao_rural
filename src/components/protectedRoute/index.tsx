import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { router } from "expo-router";
import { useUser } from "@/contexts/UserContext";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, user]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#4D7E1B" />
      </View>
    );
  }

  if (!user) return null; // Evita renderizar conteúdo indevido

  return <>{children}</>;
}