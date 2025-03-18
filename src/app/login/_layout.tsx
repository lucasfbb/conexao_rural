import { Stack } from "expo-router";

export default function LoginLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="loginPage" />
            <Stack.Screen name="cadastroPage" />
            <Stack.Screen name="forgotPassword" />
            <Stack.Screen name="forgotPasswordCode" />
            <Stack.Screen name="forgotPasswordSMS" />
            <Stack.Screen name="forgotPasswordTel" />
            <Stack.Screen name="passwordChange" />
        </Stack>
    );
}