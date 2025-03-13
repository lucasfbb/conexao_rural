import { Stack } from "expo-router";

export default function ConfiguracoesLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            {/* <Stack.Screen name="detalhes" /> */}
        </Stack>
    );
}
