import { Stack } from "expo-router";

export default function CarrinhoLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="secundaria" />
            <Stack.Screen name="confirmacao" />
            <Stack.Screen name="finalizacao" />
        </Stack>
    );
}