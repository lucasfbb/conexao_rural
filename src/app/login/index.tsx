import { View, Text, StyleSheet, Button } from "react-native";
import { router } from "expo-router";

import Header from "@/components/header";

export default function Login() {
    return (
        <View style={styles.container}>
            <Header />
            <View style={styles.content}>
                <Text style={styles.title}>Dashboard</Text>
                <Button title="Voltar" onPress={() => router.back()} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    content: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
});
