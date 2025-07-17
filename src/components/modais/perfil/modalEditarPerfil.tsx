import { useEffect, useState } from "react";
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
import { TextInputMask } from 'react-native-masked-text';
import { validarCPF, validarEmail } from "../../../../services/utils";

const { width } = Dimensions.get("window");

interface ModalEditarPerfilProps {
  visible: boolean;
  onClose: () => void;
  onSave: (dados: {
    nome: string;
    email: string;
    // categoria: string,
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

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [categoria, setCategoria] = useState("");
  const [telefone1, setTelefone1] = useState("");
  const [telefone2, setTelefone2] = useState("");

  // Atualiza os estados sempre que dadosIniciais mudar
  useEffect(() => {
    setNome(dadosIniciais.nome || "");
    setEmail(dadosIniciais.email || "");
    setCategoria(dadosIniciais.categoria || "");
    setTelefone1(dadosIniciais.primeiroTelefone || "");
    setTelefone2(dadosIniciais.segundoTelefone || "");
  }, [dadosIniciais]);

  const { colors } = useTema()

  const salvar = () => {

    const tel1 = telefone1.replace(/\D/g, "");
    const tel2 = telefone2.replace(/\D/g, "");

    (tel1, tel2);

    onSave({
      nome: nome,
      email: email,
      // categoria: categoria,
      primeiroTelefone: tel1,
      segundoTelefone: tel2,
    });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalBackground}>
        <View style={[styles.modalContainer, { backgroundColor: colors.modalBackground }]}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Feather name="x" size={24} color={colors.title} />
          </TouchableOpacity>

          <View style={{ width: "100%" }}>
            <Text style={styles.label}>Nome:</Text>
            <TextInput
              placeholder="Digite seu nome completo"
              value={nome}
              onChangeText={setNome}
              style={[styles.input, { color: colors.title }]}
              placeholderTextColor={colors.title}
            />
          </View>

          <View style={{ width: "100%" }}>
            <Text style={styles.label}>Email:</Text>
            <TextInput
              placeholder="Digite seu melhor email"
              value={email}
              onChangeText={setEmail}
              style={[styles.input, { color: colors.title }]}
              placeholderTextColor={colors.title}
            />
          </View>
          
          <View style={{ width: "100%" }}>
            <Text style={styles.label}>Telefone 1:</Text>
            <TextInputMask
              type={'cel-phone'}
              options={{
                maskType: 'BRL',
                withDDD: true,
                dddMask: '(99) '
              }}
              placeholder="Primeiro telefone para contato"
              placeholderTextColor={'#4D7E1B'}
              value={telefone1}
              onChangeText={text => setTelefone1(text)}
              style={[styles.input, { color: colors.title }]}
            />
          </View>
          
          <View style={{ width: "100%" }}>
            <Text style={styles.label}>Telefone 2:</Text>
            <TextInputMask
              type={'cel-phone'}
              options={{
                maskType: 'BRL',
                withDDD: true,
                dddMask: '(99) '
              }}
              placeholder="Insira um segundo telefone para contato"
              placeholderTextColor={'#4D7E1B'}
              value={telefone2}
              onChangeText={text => setTelefone2(text)}
              style={[styles.input, { color: colors.title }]}
            />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={salvar}>
            <Text style={styles.saveText}>Salvar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  label: {
    fontWeight: 'bold',
    color: '#4D7E1B',
    marginBottom: 2,
    marginTop: 10,
    fontSize: 15
  },
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
