import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window"); // 🔹 Obtém tamanho da tela

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        position: "absolute",
        width: width,
        height: height,
    },
    image: {
        position: "absolute", // 🔹 Faz a imagem cobrir toda a tela
        width: width, // 🔹 Usa a largura total da tela
        height: height, // 🔹 Usa a altura total da tela
    },
    loader: {
        position: "absolute", // 🔹 Sobrepõe a imagem
        bottom: 50, // 🔹 Mantém o loader próximo à parte inferior
    }
});