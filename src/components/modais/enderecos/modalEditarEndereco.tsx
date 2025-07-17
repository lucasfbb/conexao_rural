import { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTema } from "@/contexts/ThemeContext";
import { TextInputMask } from 'react-native-masked-text';
import { validarCPF, validarEmail } from "../../../../services/utils";
import { Picker } from "@react-native-picker/picker";
import { estados } from "./modalEndereco";

const { width, height } = Dimensions.get("window");

interface ModalEditarEnderecoProps {
  visible: boolean;
  onClose: () => void;
  onSave: (dados: {
    cep: string;
    estado: string;
    cidade: string;
    rua: string;
    complemento: string;
    referencia: string;
    titulo: string;
  }) => void;
  dadosIniciais: {
    cep: string;
    estado: string;
    cidade: string;
    rua: string;
    complemento: string;
    referencia: string;
    titulo: string;
  };
  onExcluir: () => void; // Adicionado para corrigir o erro
}
export default function ModalEditarPerfil({ visible, onClose, onSave, dadosIniciais, onExcluir }: ModalEditarEnderecoProps) {
  const { colors } = useTema();

  const [cep, setCep] = useState(dadosIniciais.cep || "");
  const [estado, setEstado] = useState(dadosIniciais.estado || "");
  const [cidade, setCidade] = useState(dadosIniciais.cidade || "");
  const [endereco, setEndereco] = useState(dadosIniciais.rua || "");
  const [complemento, setComplemento] = useState(dadosIniciais.complemento || "");
  const [referencia, setReferencia] = useState(dadosIniciais.referencia || "");
  const [titulo, setTitulo] = useState(dadosIniciais.titulo || "");
  const [cidades, setCidades] = useState<string[]>([]);

  // Atualiza os estados sempre que dadosIniciais mudar
  useEffect(() => {
    if (!dadosIniciais) return; 

    setCep(dadosIniciais.cep || "");
    setEstado(dadosIniciais.estado || "");
    setCidade(dadosIniciais.cidade || "");
    setEndereco(dadosIniciais.rua || "");
    setComplemento(dadosIniciais.complemento || "");
    setReferencia(dadosIniciais.referencia || "");
    setTitulo(dadosIniciais.titulo || "");

    // busca cidades se já tiver estado
    if (dadosIniciais.estado) {
      fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${dadosIniciais.estado}/municipios`)
        .then(res => res.json())
        .then(data => {
          const nomes = data.map((c: any) => c.nome);
          setCidades(nomes);
        })
        .catch(err => console.error("Erro ao buscar cidades:", err));
    }
  }, [dadosIniciais]);

  const salvar = () => {
    onSave({
      cep,
      estado,
      cidade,
      rua: endereco,
      complemento,
      referencia,
      titulo,
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
          
          <ScrollView 
            style={{ width: "100%" }}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
          >

            <View style={{ width: "100%" }}>
              <Text style={styles.label}>Título:</Text>
              <TextInput placeholder="Insira um título para o endereço" style={styles.input} value={titulo} onChangeText={setTitulo} placeholderTextColor="#4D7E1B" />
            </View>

            <View style={{ width: "100%" }}>
              <Text style={styles.label}>Estado:</Text>
              <Picker
                selectedValue={estado}
                onValueChange={(value) => setEstado(value)}
                style={[styles.input, { paddingVertical: 5 }]}
              >
                <Picker.Item label="Selecione um estado" value={estado} />
                {estados.map((e) => (
                  <Picker.Item key={e.sigla} label={e.nome} value={e.sigla} />
                ))}
              </Picker>
            </View>

            {estado !== "" && (
              <View style={{ width: "100%" }}>
                <Text style={styles.label}>Município:</Text>
                <Picker
                  selectedValue={cidade}
                  onValueChange={(value) => setCidade(value)}
                  style={[styles.input, { paddingVertical: 5 }]}
                >
                  <Picker.Item label="Selecione um município" value="" />
                  {cidades.map((nome) => (
                    <Picker.Item key={nome} label={nome} value={nome} />
                  ))}
                </Picker>
              </View>
            )}

            <View style={{ width: "100%" }}>
              <Text style={styles.label}>CEP:</Text>
              {/* <TextInput placeholder="Insira seu CEP" style={styles.input} value={cep} onChangeText={setCep} placeholderTextColor="#4D7E1B" /> */}
              <TextInputMask
                type={'custom'}
                options={{ mask: '99999-999' }}
                value={cep}
                onChangeText={text => setCep(text)}
                placeholder="Digite seu CEP"
                placeholderTextColor={"#4D7E1B"}
                style={styles.input}
              />
            </View>
            <View style={{ width: "100%" }}>
              <Text style={styles.label}>Endereço completo (rua, número):</Text>
              <TextInput placeholder="Digite seu endereço completo" style={styles.input} value={endereco} onChangeText={setEndereco} placeholderTextColor="#4D7E1B" />
            </View>
            <View style={{ width: "100%" }}>
              <Text style={styles.label}>Complemento:</Text>
              <TextInput placeholder="Digite o complemento do endereço" style={styles.input} value={complemento} onChangeText={setComplemento} placeholderTextColor="#4D7E1B" />
            </View>
            <View style={{ width: "100%" }}>
              <Text style={styles.label}>Referência:</Text>
              <TextInput placeholder="Digite uma referência do endereço" style={styles.input} value={referencia} onChangeText={setReferencia} placeholderTextColor="#4D7E1B" />
            </View>

          </ScrollView>

          <View style={styles.footerButtons}>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: "#4D7E1B" }]} onPress={salvar}>
              <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionButton, { backgroundColor: "#F44336" }]} onPress={onExcluir}>
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
    maxHeight: height * 0.90,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    alignItems: "center",
  },
  scrollContent: {
    // paddingBottom: 10,
    // paddingTop: 10,
    alignItems: "center",
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
  footerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 5,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    textAlign: "center",
  },
});
