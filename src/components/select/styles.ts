import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
    container: {
        width: "60%",
        marginBottom: 20,
        alignItems: "flex-start",
    },
    text: {
        fontSize: 16,
        fontStyle: "italic",
        color: "white",
        backgroundColor: "#4D7E1B",
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        width: "100%",
        textAlign: "left",
    },
    underline: {
        height: 1,
        backgroundColor: "white",
        width: "100%",
        marginTop: 5,
    },
    dropdown: {
        backgroundColor: "white",
        borderRadius: 8,
        width: "100%",
    },
    dropdownText: {
        color: "white",
        fontSize: 14,
        padding: 10,
    },
});