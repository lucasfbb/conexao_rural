import { Stack } from "expo-router";

export default function HomeLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{ animation: 'fade' }}/>
            <Stack.Screen name="localizacaoProdutor" options={{ animation: 'fade' }}/>
            <Stack.Screen name="produtorProfile" options={{ animation: 'fade' }}/>
        </Stack>
    );
}