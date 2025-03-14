import { useEffect, useState } from "react";
import { View } from "react-native";
import { router } from 'expo-router'

import LoadingScreen from "@/components/loadingScreen";
import Button from "@/components/button";

export default function Index() {
    const [isLoading, setIsLoading] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setFadeOut(true); // 🔹 Ativa a animação de saída
            setTimeout(() => setIsLoading(false), 1000); // 🔹 Aguarda a animação antes de remover
        }, 2000); // Simula um carregamento de 2 segundos
    }, []);

    if (isLoading) {
        return <LoadingScreen fadeOut={fadeOut} />;
    }

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Button title="Login" onPress={() => router.push("./configuracoes")} />
        </View>
    );
}
