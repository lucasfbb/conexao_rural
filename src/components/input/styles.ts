import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
    container: {
        width: "100%",
        alignItems: "flex-start", // 🔹 Alinha o input com o underline
        marginBottom: 20,
    },
    input: {
        fontSize: 20,
        fontStyle: "italic",
        color: "white",
        paddingVertical: 5,
        width: "100%", // 🔹 Faz o input ocupar toda a largura
    },
    underline: {
        height: 1,
        backgroundColor: "white",
        width: "100%", // 🔹 Faz a linha cobrir toda a área do input
    },
});