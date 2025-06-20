import React, { useEffect, useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Dimensions, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Feather } from "@expo/vector-icons";
import { useTema } from "@/contexts/ThemeContext";

import AutocompleteProduto from "@/components/autoComplete";

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
  quantidade: string;
  unidade: string;
  descricao?: string;
  imagemProduto: string | null;
  produtosGlobais: ProdutoGlobal[];
  loadingSugestoes: boolean;
  modoEdicao?: boolean;
  textBotao?: string;
  buscarProdutosGlobais: (termo: string) => void;
  onNomeChange: (nome: string) => void;
  onPrecoChange: (preco: string) => void;
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
  quantidade,
  unidade,
  imagemProduto,
  produtosGlobais,
  loadingSugestoes,
  modoEdicao,
  textBotao,
  buscarProdutosGlobais,
  onNomeChange,
  onPrecoChange,
  onQuantidadeChange,
  onUnidadeChange,
  onEscolherImagem,
  onDescricaoChange,
  onSave,
  onClose
}: ModalAddProdutoProps) {
  const { colors } = useTema();

  // Estado só para autocomplete (local do modal)
  const [showSugestoes, setShowSugestoes] = useState(false);

  const [focused, setFocused] = useState(false);

  function handleBlur() {
    setTimeout(() => {
      setFocused(false);
      setShowSugestoes(false);
    }, 120);
  }

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalBackground}>
        <ScrollView contentContainerStyle={[styles.modalContainer, { backgroundColor: colors.modalBackground }]}>
          <Text style={styles.modalTitle}>{modoEdicao ? "Editar Produto" : "Novo Produto"}</Text>
          
          {/* Autocomplete produto */}
          <View style={{ width: "100%" }}>
            <TextInput
              placeholder="Nome do produto"
              style={styles.input}
              value={nome}
              onChangeText={text => {
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
            />
            {showSugestoes && focused && nome.length >= 2 && (
              <View style={{
                backgroundColor: "#fff",
                borderWidth: 1,
                borderColor: "#4D7E1B",
                borderRadius: 8,
                maxHeight: 140,
                width: "100%",
                position: "absolute",
                top: 54,
                zIndex: 10,
              }}>
                {loadingSugestoes && <Text style={{ padding: 10 }}>Carregando...</Text>}
                {!loadingSugestoes && produtosGlobais.length === 0 && nome.length >= 2 && (
                  <Text style={{ padding: 10, color: "#888" }}>Nenhum produto encontrado</Text>
                )}
                {produtosGlobais.map(produto => (
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
                    {produto.categoria && <Text style={{ fontSize: 12, color: "#aaa" }}>{produto.categoria}</Text>}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <TextInput
            placeholder="Descrição"
            style={[styles.input, { minHeight: 60, textAlignVertical: 'top' }]}
            value={descricao}
            onChangeText={onDescricaoChange}
            multiline
            maxLength={200}
          />
          
          <TextInput
            placeholder="Preço"
            style={styles.input}
            value={preco}
            onChangeText={onPrecoChange}
            keyboardType="decimal-pad"
            inputMode="decimal"
          />

          <View style={styles.rowInputPicker}>
            <TextInput
              placeholder="Quantidade"
              style={[styles.input, { flex: 1, marginBottom: 0, marginRight: 12 }]}
              value={quantidade}
              onChangeText={onQuantidadeChange}
              keyboardType="numeric"
              inputMode="numeric"
            />
            {/* <View style={styles.pickerBox}> */}
              <Picker
                selectedValue={unidade}
                style={{ height: height * 0.08, width: 110, color: "#4D7E1B" }}
                onValueChange={onUnidadeChange}
                dropdownIconColor="#4D7E1B"
              >
                <Picker.Item label="unid." value="unidade" />
                <Picker.Item label="g" value="g" />
                <Picker.Item label="kg" value="kg" />
                <Picker.Item label="ton" value="ton" />
              </Picker>
            {/* </View> */}
          </View>
          
          <TouchableOpacity onPress={onEscolherImagem}>
            {imagemProduto ? (
              <Image source={{ uri: imagemProduto }} style={styles.produtoImagemPreview} />
            ) : (
              <View style={[styles.placeholderImagem, { width: width * 0.22, height: width * 0.22 }]}>
                <Text>Imagem</Text>
              </View>
            )}
          </TouchableOpacity>
          
          <View style={styles.modalButtons}>
            <TouchableOpacity onPress={onClose}>
              <Text style={{ color: '#B00020' }}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onSave}>
              <Text style={{ color: '#4CAF50' }}>{textBotao || (modoEdicao ? "Salvar alterações" : "Salvar")}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
    marginTop: height * 0.15,
    borderRadius: 15,
    width: width * 0.9,
    padding: 20,
    paddingTop: 40,
    alignItems: "center",
    position: "relative"
  },
  modalTitle: {
    fontSize: width * 0.047,
    fontWeight: "bold",
    marginBottom: 18,
    color: "#4D7E1B",
    alignSelf: "center"
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
  rowInputPicker: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20
  },
  pickerBox: {
    borderBottomWidth: 1,
    borderBottomColor: "#4D7E1B",
    borderRadius: 7,
    paddingHorizontal: 0,
    marginBottom: 0
  },
  produtoImagemPreview: {
    width: width * 0.22,
    height: width * 0.22,
    borderRadius: width * 0.04,
    marginVertical: 14
  },
  placeholderImagem: {
    backgroundColor: "#EEE",
    borderRadius: width * 0.04,
    justifyContent: "center",
    alignItems: "center"
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%"
  }
});
