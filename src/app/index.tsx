import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import LoadingScreen from "@/components/loadingScreen";

import { router } from 'expo-router'
import Button from "@/components/button";

export default function Index() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 2000); // Simula um carregamento de 2 segundos
    }, []);

    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Button title="Login" onPress={() => router.push("./configuracoes")} />
        </View>
    );
}
