import { useState } from "react";
import { Modal, View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions } from "react-native";
import { Feather } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

interface ModalEnderecoProps {
  visible: boolean;
  onClose: () => void;
  onSave: (endereco: { title: string; subtitle: string; details: string[] }) => void;
}

export default function ModalEndereco({ visible, onClose, onSave }: ModalEnderecoProps) {
  const [titulo, setTitulo] = useState("");
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState("");
  const [complemento, setComplemento] = useState("");

  const salvar = () => {
    onSave({
      title: titulo,
      subtitle: endereco,
      details: [endereco, cep, complemento]
    });
  
    setTitulo(""); setCep(""); setEndereco(""); setComplemento("");
    onClose();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Feather name="x" size={24} color="#4D7E1B" />
          </TouchableOpacity>

          <TextInput placeholder="Título" style={styles.input} value={titulo} onChangeText={setTitulo} placeholderTextColor="#4D7E1B" />
          <TextInput placeholder="CEP" style={styles.input} value={cep} onChangeText={setCep} placeholderTextColor="#4D7E1B" />
          <TextInput placeholder="Digite seu endereço" style={styles.input} value={endereco} onChangeText={setEndereco} placeholderTextColor="#4D7E1B" />
          <TextInput placeholder="Complemento do endereço" style={styles.input} value={complemento} onChangeText={setComplemento} placeholderTextColor="#4D7E1B" />

          <TouchableOpacity style={styles.saveButton} onPress={salvar}>
            <Text style={styles.saveText}>Salvar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}


const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center"
  },
  modalContainer: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    width: width * 0.9,
    padding: 20,
    paddingTop: 40,
    alignItems: "center",
    position: "relative"
  },
  input: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#4D7E1B",
    marginBottom: 20,
    fontStyle: "italic",
    fontSize: 16,
    color: "#4D7E1B"
  },
  saveButton: {
    backgroundColor: "#4D7E1B",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginTop: 10
  },
  saveText: {
    color: "#FFF",
    fontWeight: "bold"
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  }
});
