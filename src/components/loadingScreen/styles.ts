import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFFFFF", // Cor de fundo da tela
    },
    image: {
        width: 250, // Ajuste conforme necessário
        height: 250,
        marginBottom: 20, // Espaço entre a imagem e o indicador de carregamento
        resizeMode: "contain",
    }
});
