import React, { useState, useEffect } from "react";
import {
  View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity,
  Image, Alert, ScrollView, ActivityIndicator, useWindowDimensions
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTema } from "@/contexts/ThemeContext";
import Header from "@/components/header";
import axios from "axios";
import Button from "@/components/button";
import { api } from "../../../services/api";

const API_URL = "http://10.0.2.2:5000";

export default function Admin() {
  const { colors } = useTema();
  const { width, height } = useWindowDimensions();

  const styles = getStyles(width, height, colors);

  const [banners, setBanners] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Produtos sazonais
  const [produto, setProduto] = useState("");
  const [produtosSazonais, setProdutosSazonais] = useState<string[]>([]);
  const [loadingProdutos, setLoadingProdutos] = useState(false);

  // Carregar banners e produtos ao montar
  useEffect(() => {
    fetchBanners();
    // fetchProdutos();
  }, []);

  // BANNERS
  async function fetchBanners() {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/banners`);
      const bannersAbs = res.data.map((url: string) =>
        url.startsWith("http") ? url : `${API_URL}${url}`
      );
      setBanners(bannersAbs);
    } catch {
      Alert.alert("Erro ao buscar banners");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload() {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 1,
  });

  if (!result.canceled && result.assets[0]) {
    setLoading(true);
    const file = result.assets[0];
    const formData = new FormData();
    formData.append("file", {
      uri: file.uri,
      name: file.fileName || `banner_${Date.now()}.jpg`,
      type: file.mimeType || "image/jpeg",
    } as any);

    try {
      // Troque Axios por fetch:
      const response = await fetch("http://10.0.2.2:5000/banners", {
        method: "POST",
        body: formData,
        // NÃO coloque Content-Type aqui!
      });
      const data = await response.json();
      Alert.alert("Banner enviado!");
      fetchBanners();
      console.log("Upload OK:", data);
    } catch (e) {
      console.log("Erro no upload:", e);
      Alert.alert("Erro ao enviar imagem");
    } finally {
      setLoading(false);
    }
  }
}

  async function handleDeleteBanner(url: string) {
    const filename = url.split('/').pop();
    if (!filename) return;

    Alert.alert(
      "Excluir banner",
      "Tem certeza que deseja excluir este banner?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              await axios.delete(`${API_URL}/banners/${filename}`);
              Alert.alert("Banner excluído!");
              fetchBanners();
            } catch {
              Alert.alert("Erro ao excluir banner");
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  }

  const renderBanner = ({ item }: { item: string }) => (
    <View style={styles.bannerWrapper}>
      <Image source={{ uri: item }} style={styles.banner} />
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteBanner(item)}
      >
        <Text style={styles.deleteButtonText}>X</Text>
      </TouchableOpacity>
    </View>
  );

  // PRODUTOS SAZONAIS
  async function fetchProdutos() {
    setLoadingProdutos(true);
    try {
      const res = await axios.get(`${API_URL}/produtos-sazonais`);
      setProdutosSazonais(res.data);
    } catch {
      Alert.alert("Erro ao buscar produtos sazonais");
    } finally {
      setLoadingProdutos(false);
    }
  }

  async function handleAddProduto() {
    if (!produto.trim()) return;
    try {
      await axios.post(`${API_URL}/produtos-sazonais`, { nome: produto });
      setProduto("");
      fetchProdutos();
    } catch {
      Alert.alert("Erro ao adicionar produto");
    }
  }

  return (
    <>
      <SafeAreaView edges={["top"]} style={{ backgroundColor: "#4D7E1B" }} />
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["left", "right", "bottom"]}>
        <View style={{ flex: 1 }}>
          <View style={{ backgroundColor: "#4D7E1B" }}>
            <Header />
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} bounces={false}>
            <Text style={styles.title}>Painel Administrativo</Text>

            <Text style={styles.infoText}>
              Gerencie os banners do app. Você pode adicionar e excluir fotos!
            </Text>

            {loading && (
              <ActivityIndicator color="#4D7E1B" size="large" style={styles.loader} />
            )}

            {/* Layout banners: vazio = centralizado, senão FlatList */}
            {banners.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  Nenhum banner cadastrado.
                </Text>
                <Button 
                  title="+"
                  onPress={handleUpload}
                  style={styles.bannerUploadButton}
                  textStyle={styles.bigAddButtonText}
                />
              </View>
            ) : (
              <View style={styles.bannerContainer}>
                <FlatList
                  data={banners}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item, index) => index.toString()}
                  style={styles.flatList}
                  renderItem={renderBanner}
                />

                <Button
                  title="+"
                  onPress={handleUpload}
                  style={styles.bannerUploadButton}
                  textStyle={styles.bigAddButtonText}
                />
              </View>
            )}

            {/* Produtos Sazonais */}
            <Text style={styles.subtitle}>Produtos Sazonais</Text>

            <TextInput
              value={produto}
              onChangeText={setProduto}
              placeholder="Digite o nome do produto"
              style={styles.input}
              placeholderTextColor={colors.text}
            />

            <Button
              title="Adicionar"
              onPress={handleAddProduto}
              style={styles.button}
              textStyle={styles.buttonText}
            />

            {loadingProdutos ? (
              <ActivityIndicator color="#4D7E1B" size="small" style={styles.produtosLoader} />
            ) : (
              <FlatList
                data={produtosSazonais}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <Text style={styles.item}>{item}</Text>
                )}
                scrollEnabled={false}
                ListEmptyComponent={() => (
                  <Text style={styles.emptyProdutosText}>Nenhum produto adicionado ainda.</Text>
                )}
                style={styles.produtosFlatList}
              />
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
}

// Função para criar estilos responsivos
const getStyles = (width: number, height: number, colors: any) => StyleSheet.create({
  scrollContent: {
    padding: width * 0.05,
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    marginBottom: height * 0.025,
    color: colors.title,
  },
  infoText: {
    marginBottom: height * 0.012,
    color: colors.text,
    fontSize: width * 0.043,
  },
  loader: {
    marginVertical: height * 0.015,
  },
  bannerContainer: {
    alignItems: 'center',
    marginBottom: height * 0.022,
  },
  flatList: {
    marginVertical: height * 0.015,
  },
  bannerWrapper: {
    position: "relative",
    marginRight: width * 0.02,
  },
  banner: {
    width: width * 0.55,
    height: height * 0.18,
    borderRadius: width * 0.025,
  },
  deleteButton: {
    position: "absolute",
    top: width * 0.02,
    right: width * 0.02,
    backgroundColor: "rgba(255,0,0,0.8)",
    borderRadius: width * 0.06,
    width: width * 0.06,
    height: width * 0.06,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: width * 0.04,
  },
  bannerUploadButton: {
    width: width * 0.30,
    height: height * 0.10,
    borderRadius: width * 0.025,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#4D7E1B",
    marginRight: width * 0.02,
    marginTop: height * 0.01,
  },
  bannerUploadButtonText: {
    color: "#4D7E1B",
    fontWeight: "bold",
    fontSize: width * 0.12,
  },
  emptyContainer: {
    alignItems: "center",
    marginVertical: height * 0.06,
    flex: 1,
    justifyContent: "center",
  },
  emptyText: {
    color: colors.text,
    marginBottom: height * 0.022,
    fontSize: width * 0.045,
    textAlign: "center",
  },
  bigAddButton: {
    width: width * 0.25,
    height: width * 0.25,
    borderRadius: width * 0.07,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#4D7E1B",
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  bigAddButtonText: {
    color: "#4D7E1B",
    fontWeight: "bold",
    fontSize: width * 0.1,
  },
  subtitle: {
    fontSize: width * 0.052,
    fontWeight: "bold",
    marginTop: height * 0.04,
    marginBottom: height * 0.012,
    color: colors.title,
  },
  input: {
    borderWidth: 1,
    padding: width * 0.035,
    borderRadius: width * 0.025,
    marginBottom: height * 0.012,
    borderColor: colors.text,
    color: colors.text,
    fontSize: width * 0.042,
  },
  button: {
    backgroundColor: "#4D7E1B",
    padding: width * 0.035,
    alignItems: "center",
    borderRadius: width * 0.025,
    marginBottom: height * 0.022,
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: width * 0.047,
  },
  produtosLoader: {
    marginVertical: height * 0.008,
  },
  produtosFlatList: {
    marginBottom: height * 0.03,
  },
  item: {
    fontSize: width * 0.042,
    paddingVertical: height * 0.008,
    color: colors.text,
  },
  emptyProdutosText: {
    textAlign: "center",
    color: colors.text,
    fontSize: width * 0.04,
  },
});
