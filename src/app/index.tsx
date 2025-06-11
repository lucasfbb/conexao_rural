// app/index.tsx
import { useEffect } from "react";
import { router, useRouter } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { useUser } from "@/contexts/UserContext";

export default function Index() {
  const { user, isLoading } = useUser();
  const r = useRouter();

  useEffect(() => {
    if (!isLoading) {
      // Espera o layout montar antes de navegar
      setTimeout(() => {
        if (user) {
          r.replace("/home");
        } else {
          r.replace("/login");
        }
      }, 0);
    }
  }, [isLoading, user]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#4D7E1B" />
    </View>
  );
}
