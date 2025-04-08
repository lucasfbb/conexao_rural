import { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTema } from "@/contexts/ThemeContext";

const { width } = Dimensions.get("window");

interface ModalEditarPerfilProps {
  visible: boolean;
  onClose: () => void;
  onSave: (dados: {
    nome: string;
    email: string;
    categoria: string,
    primeiroTelefone: string;
    segundoTelefone: string;
  }) => void;
  dadosIniciais: {
    nome: string;
    email: string;
    categoria: string;
    primeiroTelefone: string;
    segundoTelefone: string;
  };
}

export default function ModalEditarPerfil({ visible, onClose, onSave, dadosIniciais }: ModalEditarPerfilProps) {

  const [nome, setNome] = useState(dadosIniciais.nome);
  const [email, setEmail] = useState(dadosIniciais.email);
  const [categoria, setCategoria] = useState(dadosIniciais.email);
  const [telefone1, setTelefone1] = useState(dadosIniciais.primeiroTelefone);
  const [telefone2, setTelefone2] = useState(dadosIniciais.segundoTelefone);

  const { colors } = useTema()

  const salvar = () => {
    onSave({
      nome: nome,
      email: email,
      categoria: categoria,
      primeiroTelefone: telefone1,
      segundoTelefone: telefone2,
    });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalBackground}>
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Feather name="x" size={24} color={colors.title} />
          </TouchableOpacity>

          <TextInput
            placeholder="Nome"
            value={nome}
            onChangeText={setNome}
            style={[styles.input, { color: colors.title }]}
            placeholderTextColor={colors.title}
          />
          <TextInput
            placeholder="E-mail"
            value={email}
            onChangeText={setEmail}
            style={[styles.input, { color: colors.title }]}
            placeholderTextColor={colors.title}
          />
          <TextInput
            placeholder="Telefone 1"
            value={telefone1}
            onChangeText={setTelefone1}
            style={[styles.input, { color: colors.title }]}
            placeholderTextColor={colors.title}
          />
          <TextInput
            placeholder="Telefone 2"
            value={telefone2}
            onChangeText={setTelefone2}
            style={[styles.input, { color: colors.title }]}
            placeholderTextColor={colors.title}
          />

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
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    width: width * 0.9,
    padding: 20,
    paddingTop: 40,
    alignItems: "center",
    position: "relative",
  },
  input: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#4D7E1B",
    marginBottom: 20,
    fontStyle: "italic",
    fontSize: 16,
    color: "#4D7E1B",
  },
  saveButton: {
    backgroundColor: "#4D7E1B",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginTop: 10,
  },
  saveText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
});
