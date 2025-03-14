import { Stack } from "expo-router";

export default function CarrinhoLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="secundaria" />
        </Stack>
    );
}