import React, { useState, useEffect } from "react";
import {
  View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity,
  Image, Alert, ScrollView, ActivityIndicator, useWindowDimensions, Switch
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTema } from "@/contexts/ThemeContext";
import Header from "@/components/header";
import Button from "@/components/button";
import { api, baseURL } from "../../../services/api";
import { Ionicons } from "@expo/vector-icons";

// TIPO DE PRODUTO
type Produto = {
  id: number;
  nome: string;
  sazonal: boolean;
};

const API_URL = baseURL; // Usando a URL base definida no api.ts

export default function Admin() {
  const { colors } = useTema();
  const { width, height } = useWindowDimensions();

  const styles = getStyles(width, height, colors);

  // Banners
  const [banners, setBanners] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Produtos
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loadingProdutos, setLoadingProdutos] = useState(false);

  // Adicionar produto novo
  const [produto, setProduto] = useState("");
  const [adicionandoProduto, setAdicionandoProduto] = useState(false);

  // Buscar banners e produtos ao montar
  useEffect(() => {
    fetchBanners();
    fetchProdutos();
  }, []);

  // ---- BANNERS ----
  async function fetchBanners() {
    setLoading(true);
    try {
      const res = await api.get("/banners");
      const bannersAbs = res.data.map((url: string) =>
        url.startsWith("http") ? url : `${API_URL}${url.slice(1)}`
      );
      setBanners(bannersAbs);
    } catch (error) {
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
        const response = await fetch(`${API_URL}/banners`, {
          method: "POST",
          body: formData,
        });
        await response.json();
        Alert.alert("Banner enviado!");
        fetchBanners();
      } catch (e) {
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
              await api.delete(`/banners/${filename}`);
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

  // ---- PRODUTOS ----
  async function fetchProdutos() {
    setLoadingProdutos(true);
    try {
      const res = await api.get("/produtos");
      setProdutos(res.data); // [{ id, nome, sazonal }]
    } catch {
      Alert.alert("Erro ao buscar produtos");
    } finally {
      setLoadingProdutos(false);
    }
  }

  async function handleToggleSazonal(produtoId: number, novoValor: boolean) {
    try {
      await api.patch(`/produtos/${produtoId}`, { sazonal: novoValor });
      // Atualiza só o produto alterado no estado
      setProdutos(produtos =>
        produtos.map(p =>
          p.id === produtoId ? { ...p, sazonal: novoValor } : p
        )
      );
    } catch {
      Alert.alert("Erro ao atualizar produto");
    }
  }

  async function handleAddProduto() {
    if (!produto.trim()) return;
    setAdicionandoProduto(true);
    try {
      await api.post(`/produtos`, { nome: produto });
      setProduto("");
      fetchProdutos();
    } catch {
      Alert.alert("Erro ao adicionar produto");
    } finally {
      setAdicionandoProduto(false);
    }
  }

  async function handleDeleteProduto(produtoId: number) {
    Alert.alert(
      "Excluir produto",
      "Tem certeza que deseja excluir este produto?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            setLoadingProdutos(true);
            try {
              await api.delete(`/produtos/${produtoId}`);
              Alert.alert("Produto excluído!");
              fetchProdutos();
            } catch {
              Alert.alert("Erro ao excluir produto");
            } finally {
              setLoadingProdutos(false);
            }
          }
        }
      ]
    );
  }


  const renderProduto = ({ item }: { item: Produto }) => (
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      borderBottomWidth: 1,
      borderColor: "#e0e0e0",
      paddingVertical: 10,
      backgroundColor: item.sazonal ? "#e9fbe5" : "transparent",
      borderRadius: 8,
      marginBottom: 6,
    }}
  >
    {/* Toggle Sazonal - Clicável */}
    <TouchableOpacity
      style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
      activeOpacity={0.7}
      onPress={() => handleToggleSazonal(item.id, !item.sazonal)}
    >
      <Text style={[styles.item, { color: colors.text, fontWeight: "bold" }]}>{item.nome}</Text>
      <Ionicons
        name={item.sazonal ? "checkmark-circle" : "ellipse-outline"}
        size={22}
        color={item.sazonal ? "#4D7E1B" : "#bbb"}
        style={{ marginLeft: 8 }}
      />
      <Text style={{
        color: item.sazonal ? "#357d22" : "#bbb",
        marginLeft: 7,
        fontWeight: "bold",
        fontSize: 15
      }}>
        {item.sazonal ? "Sazonal" : "Não sazonal"}
      </Text>
    </TouchableOpacity>

    {/* Botão Lixeira bem próximo */}
    <TouchableOpacity onPress={() => handleDeleteProduto(item.id)} style={{ marginLeft: 4 }}>
      <Ionicons name="trash" size={23} color="#b82020" />
    </TouchableOpacity>
  </View>
);

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
                <Text style={styles.emptyText}>Nenhum banner cadastrado.</Text>
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
            <Text style={styles.subtitle}>Produtos do Sistema</Text>

            <TextInput
              value={produto}
              onChangeText={setProduto}
              placeholder="Digite o nome do produto"
              style={styles.input}
              placeholderTextColor={colors.text}
            />

            <Button
              title={adicionandoProduto ? "Adicionando..." : "Adicionar"}
              onPress={handleAddProduto}
              style={styles.button}
              textStyle={styles.buttonText}
              disabled={adicionandoProduto}
            />

            {loadingProdutos ? (
              <ActivityIndicator color="#4D7E1B" size="small" style={styles.produtosLoader} />
            ) : (
              <FlatList
                data={produtos}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderProduto}
                scrollEnabled={false}
                ListEmptyComponent={() => (
                  <Text style={styles.emptyProdutosText}>Nenhum produto cadastrado ainda.</Text>
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

// -------- STYLES --------
const getStyles = (width: number, height: number, colors: any) => StyleSheet.create({
  scrollContent: {
    padding: width * 0.055,
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
  bigAddButtonText: {
    color: "#4D7E1B",
    fontWeight: "bold",
    fontSize: width * 0.1,
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
  produtoLinha: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: height * 0.012,
    borderBottomWidth: 1,
    borderColor: "#e0e0e0",
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
  sazonalLabel: {
    fontSize: width * 0.04,
    marginLeft: 12,
    fontWeight: "bold",
  },
});