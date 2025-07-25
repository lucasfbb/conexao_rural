import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useTema } from "@/contexts/ThemeContext";
import VoiceInput from "@/components/voiceInput";

const { width, height } = Dimensions.get("window");

interface ProdutoGlobal {
  id: number;
  nome: string;
  categoria?: string;
}

interface ModalAddProdutoProps {
  visible: boolean;
  nome: string;
  preco: string;
  precoPromocional?: string;
  quantidade: string;
  unidade: string;
  descricao?: string;
  imagemProduto: string | null;
  produtosGlobais: ProdutoGlobal[];
  loadingSugestoes: boolean;
  modoEdicao?: boolean;
  textBotao?: string;
  nomeSugerido?:string;
  carregandoSugestao?: boolean;
  buscarProdutosGlobais: (termo: string) => void;
  onNomeChange: (nome: string) => void;
  onPrecoChange: (preco: string) => void;
  onPrecoPromocionalChange: (precoPromocional: string) => void;
  onQuantidadeChange: (qtd: string) => void;
  onUnidadeChange: (unidade: string) => void;
  onDescricaoChange: (desc: string) => void;
  onEscolherImagem: () => void;
  onSave: () => void;
  onClose: () => void;
}

export default function ModalAddProduto({
  visible,
  nome,
  descricao,
  preco,
  precoPromocional,
  quantidade,
  unidade,
  imagemProduto,
  produtosGlobais,
  loadingSugestoes,
  modoEdicao,
  textBotao,
  nomeSugerido,
  carregandoSugestao,
  buscarProdutosGlobais,
  onNomeChange,
  onPrecoChange,
  onPrecoPromocionalChange,
  onQuantidadeChange,
  onUnidadeChange,
  onEscolherImagem,
  onDescricaoChange,
  onSave,
  onClose,
}: ModalAddProdutoProps) {
  const { colors } = useTema();
  const [showSugestoes, setShowSugestoes] = useState(false);
  const [focused, setFocused] = useState(false);

  function handleBlur() {
    setTimeout(() => {
      setFocused(false);
      setShowSugestoes(false);
    }, 120);
  }

  useEffect(() => {
    if (nomeSugerido && nome.trim() === "") {
      onNomeChange(nomeSugerido);
    }
  }, [nomeSugerido]);

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalBackground}>
        <View style={styles.modalWrapper}>
          {/* Cabeçalho */}
          <View style={styles.header}>
            <Text style={[styles.modalTitle, { color: colors.title }]}>
              {modoEdicao ? "Editar Produto" : "Novo Produto"}
            </Text>
          </View>

          {/* Conteúdo rolável */}
          <ScrollView
            style={styles.scrollContent}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Nome do Produto com Autocomplete */}
            <View style={{ width: "100%" }}>
              <Text style={[styles.label, { color: colors.title }]}>Nome do Produto</Text>
              
              {/* <TextInput
                placeholder="Digite o nome do produto"
                style={[styles.input, { color: colors.title }]}
                value={nome}
                onChangeText={(text) => {
                  onNomeChange(text);
                  buscarProdutosGlobais(text);
                  setShowSugestoes(true);
                }}
                onFocus={() => {
                  setFocused(true);
                  setShowSugestoes(true);
                }}
                onBlur={handleBlur}
                autoCapitalize="sentences"
              /> */}

              <VoiceInput
                placeholder="Digite o nome do produto"
                value={nome}
                onChangeText={(text) => {
                  onNomeChange(text);
                  buscarProdutosGlobais(text);
                  setShowSugestoes(true);
                }}
                onFocus={() => {
                  setFocused(true);
                  setShowSugestoes(true);
                }}
                onBlur={handleBlur}
                inputStyle={[styles.input, { color: colors.title }]}
                autoCapitalize="sentences"
              />

              
              {showSugestoes && focused && nome.length >= 2 && (
                <View style={styles.sugestoesBox}>
                  {loadingSugestoes && <Text style={{ padding: 10 }}>Carregando...</Text>}
                  {!loadingSugestoes && produtosGlobais.length === 0 && (
                    <Text style={{ padding: 10, color: "#888" }}>Nenhum produto encontrado</Text>
                  )}
                  {produtosGlobais.map((produto) => (
                    <TouchableOpacity
                      key={produto.id}
                      onPress={() => {
                        onNomeChange(produto.nome);
                        setFocused(false);
                        setShowSugestoes(false);
                      }}
                      style={{ padding: 12 }}
                    >
                      <Text>{produto.nome}</Text>
                      {produto.categoria && (
                        <Text style={{ fontSize: 12, color: "#aaa" }}>{produto.categoria}</Text>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Descrição */}
            <View style={{ width: "100%" }}>
              <Text style={styles.label}>Descrição</Text>
              <TextInput
                placeholder="Digite uma descrição para o produto"
                style={[styles.input, { minHeight: 60, textAlignVertical: "top" }]}
                value={descricao}
                onChangeText={onDescricaoChange}
                multiline
                maxLength={200}
              />
            </View>

            {/* Preço */}
            <View style={{ width: "100%" }}>
              <Text style={styles.label}>Preço</Text>
              <TextInput
                placeholder="Preço"
                style={styles.input}
                value={preco}
                onChangeText={onPrecoChange}
                keyboardType="decimal-pad"
                inputMode="decimal"
              />
            </View>

            {/* Preço Promocional */}
            <View style={{ width: "100%" }}>
              <Text style={styles.label}>Preço promocional</Text>
              <TextInput
                placeholder="Preço promocional (opcional)"
                style={styles.input}
                value={precoPromocional}
                onChangeText={onPrecoPromocionalChange}
                keyboardType="decimal-pad"
              />
            </View>

            {/* Quantidade */}
            <View style={{ width: "100%" }}>
              <Text style={styles.label}>Quantidade</Text>
              <TextInput
                placeholder="Quantidade"
                style={styles.input}
                value={quantidade}
                onChangeText={onQuantidadeChange}
                keyboardType="numeric"
                inputMode="numeric"
              />
            </View>

            {/* Unidade */}
            <View
              style={{
                width: "100%",
                borderBottomWidth: 1,
                borderBottomColor: "#4D7E1B",
                marginBottom: 20,
              }}
            >
              <Text style={styles.label}>Unidade</Text>
              <Picker
                selectedValue={unidade}
                style={{ color: "#4D7E1B" }}
                onValueChange={onUnidadeChange}
                dropdownIconColor="#4D7E1B"
              >
                <Picker.Item label="unid." value="unidade" />
                <Picker.Item label="g" value="g" />
                <Picker.Item label="kg" value="kg" />
                <Picker.Item label="ton" value="ton" />
              </Picker>
            </View>
          </ScrollView>

          {/* Rodapé */}
          <View style={styles.footer}>
            <TouchableOpacity onPress={onEscolherImagem}>
              {carregandoSugestao ? (
                <View>
                  <ActivityIndicator size="small" color="#4D7E1B" />
                  <Text style={{ marginTop: 6, fontSize: 12, color: "#4D7E1B" }}>
                    Sugerindo nome...
                  </Text>
                </View>
              ) : imagemProduto ? (
                <Image source={{ uri: imagemProduto }} style={styles.produtoImagemPreview} />
              ) : (
                <View style={styles.placeholderImagem}>
                  <Text>Imagem</Text>
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={onClose}>
                <Text style={{ color: "#B00020" }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onSave}>
                <Text style={{ color: "#4CAF50" }}>
                  {textBotao || (modoEdicao ? "Salvar alterações" : "Salvar")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
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
  modalWrapper: {
    width: width * 0.9,
    height: height * 0.85,
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "#FFF",
    justifyContent: "space-between",
  },
  header: {
    paddingTop: 20,
    paddingBottom: 10,
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#FFF",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: width * 0.047,
    fontWeight: "bold",
  },
  label: {
    fontWeight: "bold",
    color: "#4D7E1B",
    marginBottom: 2,
    marginTop: 10,
    fontSize: 15,
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
  sugestoesBox: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#4D7E1B",
    borderRadius: 8,
    maxHeight: 140,
    width: "100%",
    position: "absolute",
    top: 54,
    zIndex: 10,
  },
  produtoImagemPreview: {
    width: width * 0.22,
    height: width * 0.22,
    borderRadius: width * 0.04,
    marginVertical: 14,
  },
  placeholderImagem: {
    backgroundColor: "#EEE",
    borderRadius: width * 0.04,
    justifyContent: "center",
    alignItems: "center",
    width: width * 0.22,
    height: width * 0.22,
    marginVertical: 5,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});
