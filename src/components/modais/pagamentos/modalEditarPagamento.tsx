import { useState, useEffect, useRef } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { TextInputMask } from "react-native-masked-text";
import { useTema } from "@/contexts/ThemeContext";

const { width, height } = Dimensions.get("window");

interface ModalEditarPagamentoProps {
  visible: boolean;
  onClose: () => void;
  onSave: (dados: {
    id: number;
    nome_impresso: string;
    nome_cartao: string;
    bandeira: string;
    final_cartao: string;
    token_gateway: string;
    gateway: string;
  }) => void;
  onExcluir: () => void;
  dadosIniciais: {
    id: number;
    nome_impresso: string;
    nome_cartao: string;
    bandeira: string;
    final_cartao: string;
    token_gateway: string;
    gateway: string;
  };
}

export default function ModalEditarPagamento({
  visible,
  onClose,
  onSave,
  onExcluir,
  dadosIniciais
}: ModalEditarPagamentoProps) {
  const { colors } = useTema();

  const [modoEdicaoNumero, setModoEdicaoNumero] = useState(false);

  const [nomeCartao, setNomeCartao] = useState("");
  const [nomeNoCartao, setNomeNoCartao] = useState("");
  const [bandeira, setBandeira] = useState("Visa");
  const [numeroCartao, setNumeroCartao] = useState("");

  const inputNumeroRef = useRef<any>(null);

  useEffect(() => {
    // console.log("Dados iniciais recebidos:", dadosIniciais);
    if (dadosIniciais) {
        setNomeNoCartao(dadosIniciais.nome_impresso || "");
        setNomeCartao(dadosIniciais.nome_cartao || "");
        setBandeira(dadosIniciais.bandeira || "Visa");
        setNumeroCartao(`●●●● ${dadosIniciais.final_cartao}`);
    }
  }, [dadosIniciais]);

  const salvar = () => {
    const numeroLimpo = numeroCartao.replace(/\D/g, "");
    if (numeroLimpo.length < 4) {
      alert("Digite ao menos os 4 últimos dígitos do cartão.");
      return;
    }

    onSave({
      id: dadosIniciais.id,
      nome_impresso: nomeNoCartao.trim(),
      nome_cartao: nomeCartao.trim(),
      bandeira,
      final_cartao: numeroLimpo.slice(-4),
      token_gateway: "mock-token-edit-" + Date.now(), // TODO: substituir por lógica real
      gateway: "manual"
    });

    onClose();
  };

  const fecharModal = () => {
    setNomeCartao("");
    setNomeNoCartao("");
    setBandeira("Visa");
    setNumeroCartao("");
    setModoEdicaoNumero(false);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalBackground}>
        <View style={[styles.modalContainer, { backgroundColor: colors.modalBackground }]}>

          {/* Botão Fechar */}
          <TouchableOpacity style={styles.closeButton} onPress={fecharModal}>
            <Feather name="x" size={24} color={colors.title} />
          </TouchableOpacity>

          {/* Formulário */}

          <View style={{ width: "100%" }}>

            <Text style={styles.label}>Nome do Cartão:</Text>
            <TextInput
              placeholder="Insira o nome do cartão"
              style={styles.input}
              value={nomeCartao}
              onChangeText={setNomeCartao}
              placeholderTextColor="#4D7E1B"
            />

            <Text style={styles.label}>Nome impresso no Cartão:</Text>
            <TextInput
              placeholder="Insira o nome"
              style={styles.input}
              value={nomeNoCartao}
              onChangeText={setNomeNoCartao}
              placeholderTextColor="#4D7E1B"
            />

            <Text style={styles.label}>Bandeira:</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={bandeira}
                onValueChange={(value) => setBandeira(value)}
                dropdownIconColor="#4D7E1B"
              >
                <Picker.Item label="Visa" value="Visa" />
                <Picker.Item label="Mastercard" value="Mastercard" />
                <Picker.Item label="Elo" value="Elo" />
                <Picker.Item label="Amex" value="Amex" />
                <Picker.Item label="Hipercard" value="Hipercard" />
                <Picker.Item label="Outro" value="Outro" />
              </Picker>
            </View>

            <Text style={styles.label}>Número do Cartão:</Text>
            {modoEdicaoNumero ? (
              <TextInputMask
                ref={inputNumeroRef}
                type={"custom"}
                options={{ mask: "9999 9999 9999 9999" }}
                value={numeroCartao}
                onChangeText={(text: string) => setNumeroCartao(text)}
                placeholder="Digite o número do cartão"
                placeholderTextColor="#4D7E1B"
                keyboardType="numeric"
                style={styles.input}
              />
            ) : (
              <TouchableOpacity
                onPress={() => {
                  setNumeroCartao(""); // Limpa o campo ao entrar em modo edição
                  setModoEdicaoNumero(true);

                      // Aguarda o próximo ciclo de renderização e foca o campo
                      setTimeout(() => {
                        inputNumeroRef.current?.getElement().focus(); // para TextInputMask
                      }, 50);
                }}
              >
                <Text style={[styles.input, { color: "#4D7E1B", paddingVertical: 12 }]}>
                  ●●●● ●●●● ●●●● {dadosIniciais.final_cartao}  {" "}
                  <Text style={{ fontSize: 12, color: "#888" }}>(tocar para editar)</Text>
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Botões */}
          <View style={styles.footerButtons}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: "#4D7E1B" }]}
              onPress={salvar}
            >
              <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: "#F44336" }]}
              onPress={onExcluir}
            >
              <Text style={styles.buttonText}>Excluir</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  label: {
    fontWeight: "bold",
    color: "#4D7E1B",
    marginBottom: 2,
    marginTop: 10,
    fontSize: 15
  },
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
    maxHeight: height * 0.9,
    alignItems: "center"
  },
  input: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#4D7E1B",
    marginBottom: 15,
    fontStyle: "italic",
    fontSize: 16,
    color: "#4D7E1B"
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#4D7E1B",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 10
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10
  },
  footerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 5,
    alignItems: "center"
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold"
  }
});
