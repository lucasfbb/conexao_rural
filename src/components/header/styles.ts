import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },

    header: {
        width: "100%",
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "space-between", // Mantém os itens espaçados corretamente
        paddingHorizontal: 10, // Adiciona um espaçamento nas laterais
        paddingVertical: 10,
        backgroundColor: '#4D7E1B'
    },

    img: {
        width: 60, // Aumenta um pouco o tamanho da imagem
        height: 30,
        resizeMode: 'contain',
        flex: 1, // Ocupa o espaço restante e permite alinhamento correto
        textAlign: "center"
    },

    toggleButton: {
        width: 40, // Define um tamanho para o botão
        height: 40,
        justifyContent: "center",
        alignItems: "center"
    },

    // content: {
    //     flex: 1, // Faz o conteúdo ocupar o espaço abaixo do Header
    //     padding: 20,
    // },
});