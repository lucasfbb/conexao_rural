import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
    safeContainer: {
        backgroundColor: "#4D7E1B",
    },

    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: "#4D7E1B",
    },

    img: {
        width: 80, 
        height: 30,
        resizeMode: "contain",
        flex: 1,
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center"
    },

    toggleButton: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },
});