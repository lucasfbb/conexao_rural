import { useEffect, useState } from "react";
import { Modal, View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTema } from "@/contexts/ThemeContext";
import { TextInputMask } from 'react-native-masked-text';
import { Picker } from "@react-native-picker/picker";

const { width, height } = Dimensions.get("window");

export const estados = [
  { sigla: "AC", nome: "Acre" }, { sigla: "AL", nome: "Alagoas" }, { sigla: "AM", nome: "Amazonas" }, 
  { sigla: "BA", nome: "Bahia" }, { sigla: "CE", nome: "Ceará" }, { sigla: "DF", nome: "Distrito Federal" },
  { sigla: "ES", nome: "Espírito Santo" }, { sigla: "GO", nome: "Goiás" }, { sigla: "MA", nome: "Maranhão" },
  { sigla: "MG", nome: "Minas Gerais" }, { sigla: "MS", nome: "Mato Grosso do Sul" }, { sigla: "MT", nome: "Mato Grosso" },
  { sigla: "PA", nome: "Pará" }, { sigla: "PB", nome: "Paraíba" }, { sigla: "PE", nome: "Pernambuco" },
  { sigla: "PI", nome: "Piauí" }, { sigla: "PR", nome: "Paraná" }, { sigla: "RJ", nome: "Rio de Janeiro" },
  { sigla: "RN", nome: "Rio Grande do Norte" }, { sigla: "RO", nome: "Rondônia" }, { sigla: "RR", nome: "Roraima" },
  { sigla: "RS", nome: "Rio Grande do Sul" }, { sigla: "SC", nome: "Santa Catarina" }, { sigla: "SE", nome: "Sergipe" },
  { sigla: "SP", nome: "São Paulo" }, { sigla: "TO", nome: "Tocantins" }
];

interface ModalEnderecoProps {
  visible: boolean;
  modoEdicao?: boolean;
  dadosIniciais?: {
    id?: number;
    cep: string;
    estado: string;
    cidade: string;
    rua: string;
    complemento?: string;
    referencia?: string;
    titulo?: string;
  };
  onClose: () => void;
  onSave: (endereco: any) => void;
  onExcluir?: () => void;
}

export default function ModalEndereco({ visible, dadosIniciais, modoEdicao, onClose, onSave, onExcluir }: ModalEnderecoProps) {
  const [titulo, setTitulo] = useState("");
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState("");
  const [complemento, setComplemento] = useState("");
  const [referencia, setReferencia] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [cidades, setCidades] = useState<string[]>([]);
  
  const { colors } = useTema()

  // useEffect(() => {
  //   if (modoEdicao && dadosIniciais) {
  //     setTitulo(dadosIniciais.titulo || "");
  //     setCep(dadosIniciais.cep || "");
  //     setEndereco(dadosIniciais.rua || "");
  //     setComplemento(dadosIniciais.complemento || "");
  //     setReferencia(dadosIniciais.referencia || "");
  //     setEstado(dadosIniciais.estado || "");
  //     setCidade(dadosIniciais.cidade || "");
  //   }

  // }, [modoEdicao, dadosIniciais]);

  // Busca cidades da UF selecionada
  useEffect(() => {
    if (estado) {
      fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado}/municipios`)
        .then(res => res.json())
        .then(data => {
          setCidades(data.map((c: any) => c.nome));
          setCidade(""); // limpa cidade anterior
        })
        .catch(err => console.error("Erro ao buscar cidades:", err));
    }
  }, [estado]);

  async function limparCampos() {
    setTitulo("");
    setCep("");
    setEndereco("");
    setComplemento("");
    setReferencia("");
    setCidade("");
    setEstado("");
  }

  useEffect(() => {
    limparCampos();
  }, []);

  const salvar = () => {
    onSave({
      cep,
      estado,
      cidade,
      rua: endereco,
      complemento,
      referencia,
      titulo
    });

    limparCampos();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalBackground}>
        <View style={[styles.modalContainer, { backgroundColor: colors.modalBackground }]}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Feather name="x" size={24} color="#4D7E1B" />
          </TouchableOpacity>

          <View style={{ width: "100%" }}>
            <Text style={styles.label}>Título:</Text>
            <TextInput placeholder="Insira um título para o endereço" style={styles.input} value={titulo} onChangeText={setTitulo} placeholderTextColor="#4D7E1B" />
          </View>
          <View style={{ width: "100%" }}>
            <Text style={styles.label}>Estado:</Text>
            <Picker
              selectedValue={estado}
              onValueChange={(value) => setEstado(value)}
              selectionColor={"#4D7E1B"}
              style={[{ color: "#4D7E1B" }]}
            >
              <Picker.Item label="Selecione um estado" value="" />
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
                selectionColor={"#4D7E1B"}
                style={[{ color: "#4D7E1B" }]}
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
  },
  // pickerWrapper: {
  //   width: "100%",
  //   borderBottomWidth: 1,
  //   borderBottomColor: "#4D7E1B",
  //   marginBottom: 20,
  // },
  // picker: {
  //   height: 40,
  //   color: "#4D7E1B",
  // },
});
