import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get('window')

export const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: "#4D7E1B",
    borderRadius: 10,
    padding: 10,
    width: "40%", 
    minHeight: 80,
    justifyContent: "center",
    margin: width * 0.013,
    position: "relative",
  },
  editIcon: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  title: {
    fontSize: height * 0.013,
    fontWeight: "bold",
    color: "green",
    textAlign: "center",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 3,
  },
  detail: {
    fontSize: 10,
    textAlign: "center",
    fontStyle: "italic",
  },
});
