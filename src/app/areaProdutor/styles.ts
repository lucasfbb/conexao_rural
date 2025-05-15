import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    // 🔸 Botões padrões
    button: {
        width: "100%",
        height: 52,
        backgroundColor: '#E15610',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },

    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white'
    },

    // 🔸 Botão de excluir (pode ser aplicado por sobrescrição)
    buttonExcluir: {
        backgroundColor: '#B00020'
    },

    // 🔸 Estilo de imagem de perfil
    imagemPerfil: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },

    placeholderImagem: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center'
    },

    // 🔸 Título da lista
    titulo: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 20,
        marginTop: 10
    },

    // 🔸 Produto na lista
    produtoItem: {
        borderBottomWidth: 1,
        borderColor: '#ccc',
        paddingVertical: 10,
        flexDirection: 'column',
        gap: 10
    },

    produtoNome: {
        fontSize: 16,
        fontWeight: 'bold'
    },

    produtoPreco: {
        fontSize: 14,
        color: '#555'
    },

    // 🔸 Botões de ação lado a lado
    botoesContainer: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 5
    }
});
