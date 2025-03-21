import { Stack } from "expo-router";

export default function PerfilLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="produtorProfile" />
            <Stack.Screen name="localizacaoProdutor" />
        </Stack>
    );
}
