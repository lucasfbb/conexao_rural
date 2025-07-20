import { Stack } from "expo-router";

export default function BuscaLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            {/* <Stack.Screen name="resultados" /> */}
        </Stack>
    );
}