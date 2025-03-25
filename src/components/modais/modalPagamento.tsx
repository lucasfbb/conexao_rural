import { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

interface ModalPagamentoProps {
  visible: boolean;
  onClose: () => void;
  onSave: (pagamento: { title: string; subtitle: string; details: string[] }) => void;
}

export default function ModalPagamento({ visible, onClose, onSave }: ModalPagamentoProps) {
  
  const [titulo, setTitulo] = useState("");
  const [tipo, setTipo] = useState("");
  const [numero, setNumero] = useState("");

  const salvar = () => {
    onSave({
      title: titulo,
      subtitle: tipo,
      details: [numero]
    });
  
    setTitulo(""); setTipo(""); setNumero("");
    onClose();
  };
  
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          {/* Botão Fechar */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Feather name="x" size={24} color="#4D7E1B" />
          </TouchableOpacity>

          {/* Inputs */}
          <TextInput placeholder="Título (Ex: Cartão 1)" style={styles.input} onChangeText={setTitulo} placeholderTextColor="#4D7E1B" />
          <TextInput placeholder="Tipo" style={styles.input} onChangeText={setTipo} placeholderTextColor="#4D7E1B" />
          <TextInput placeholder="Número do cartão" style={styles.input} onChangeText={setNumero} placeholderTextColor="#4D7E1B" keyboardType="numeric" />

          {/* Botão salvar */}
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
