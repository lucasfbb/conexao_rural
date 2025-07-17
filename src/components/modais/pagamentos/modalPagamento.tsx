import { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Platform
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTema } from "@/contexts/ThemeContext";
import { Picker } from "@react-native-picker/picker";
import { formatarNumeroCartao } from "../../../../services/utils";

const { width, height } = Dimensions.get("window");

interface ModalPagamentoProps {
  visible: boolean;
  onClose: () => void;
  onSave: (pagamento: {
    nome_impresso: string;
    nome_cartao: string;
    bandeira: string;
    final_cartao: string;
    token_gateway: string;
    gateway: string;
  }) => void;
}

export default function ModalPagamento({ visible, onClose, onSave }: ModalPagamentoProps) {
  const [nomeCartao, setNomeCartao] = useState("");
  const [nomeNoCartao, setNomeNoCartao] = useState("");
  const [bandeira, setBandeira] = useState("Visa");
  const [numeroCartao, setNumeroCartao] = useState("");

  const { colors } = useTema();

  const salvar = () => {
    const numeroLimpo = numeroCartao.replace(/\D/g, "");

    if (numeroLimpo.length < 4) {
      alert("Digite ao menos os 4 últimos dígitos do cartão.");
      return;
    }

    onSave({
      nome_impresso: nomeNoCartao.trim(),
      nome_cartao: nomeCartao.trim(),
      bandeira,
      final_cartao: numeroLimpo.slice(-4),
      token_gateway: "mock-token-" + Date.now(),
      gateway: "manual"
    });

    // Limpar campos e fechar modal
    setNomeCartao("");
    setNomeNoCartao("");
    setBandeira("Visa");
    setNumeroCartao("");
    onClose();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalBackground}>
        <View style={[styles.modalContainer, { backgroundColor: colors.modalBackground }]}>
          {/* Botão Fechar */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Feather name="x" size={24} color="#4D7E1B" />
          </TouchableOpacity>

          {/* Inputs */}
          <View style={{ width: "100%" }}>
            <Text style={styles.label}>Nome do Cartão:</Text>
            <TextInput
              placeholder="Insira o nome do cartão"
              style={styles.input}
              value={nomeCartao}
              onChangeText={setNomeCartao}
              placeholderTextColor="#4D7E1B"
            />
          </View>

          <View style={{ width: "100%" }}>
            <Text style={styles.label}>Nome impresso no Cartão:</Text>
            <TextInput
              placeholder="Insira o nome"
              style={styles.input}
              value={nomeNoCartao}
              onChangeText={setNomeNoCartao}
              placeholderTextColor="#4D7E1B"
            />
          </View>

          <Text style={styles.label}>Bandeira:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={bandeira}
              onValueChange={(itemValue) => setBandeira(itemValue)}
              style={Platform.OS === 'android' ? undefined : { height: 100 }}
              dropdownIconColor="#4D7E1B"
            >
              <Picker.Item label="Visa" value="Visa" />
              <Picker.Item label="Mastercard" value="Mastercard" />
              <Picker.Item label="Elo" value="Elo" />
              <Picker.Item label="American Express" value="Amex" />
              <Picker.Item label="Hipercard" value="Hipercard" />
              <Picker.Item label="Outro" value="Outro" />
            </Picker>
          </View>

          <View style={{ width: "100%" }}>
            <Text style={styles.label}>Número impresso no Cartão:</Text>
            <TextInput
              placeholder="Insira o número"
              style={styles.input}
              value={numeroCartao}
              onChangeText={(text) => setNumeroCartao(formatarNumeroCartao(text))}
              placeholderTextColor="#4D7E1B"
              keyboardType="numeric"
            />
          </View>

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
  label: {
    alignSelf: "flex-start",
    fontSize: 14,
    fontWeight: "600",
    color: "#4D7E1B",
    marginBottom: 5
  },
  pickerContainer: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#4D7E1B",
    borderRadius: 8,
    marginBottom: 20,
    overflow: "hidden"
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
    right: 10
  }
});
