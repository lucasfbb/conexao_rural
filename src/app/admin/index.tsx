import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Image, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { api } from "../../../services/api";
import { useTema } from "@/contexts/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AdminBanners() {
  const { colors } = useTema();
  const [banners, setBanners] = useState<string[]>([]);
  const [produto, setProduto] = useState("");
  const [produtosSazonais, setProdutosSazonais] = useState<string[]>([]);

  useEffect(() => {
    fetchBanners();
    fetchProdutos();
  }, []);

  async function fetchBanners() {
    try {
      const res = await api.get("/banners");
      setBanners(res.data); // deve ser um array de URLs
    } catch {
      Alert.alert("Erro ao buscar banners");
    }
  }

  async function fetchProdutos() {
    try {
      const res = await api.get("/produtos-sazonais");
      setProdutosSazonais(res.data); // array de strings
    } catch {
      Alert.alert("Erro ao buscar produtos sazonais");
    }
  }

  async function handleAddProduto() {
    if (!produto.trim()) return;

    try {
      const res = await api.post("/produtos-sazonais", { nome: produto });
      setProdutosSazonais([...produtosSazonais, produto]);
      setProduto("");
    } catch {
      Alert.alert("Erro ao adicionar produto");
    }
  }

  async function handleUpload() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      const formData = new FormData();
      const file = result.assets[0];

      formData.append("file", {
        uri: file.uri,
        name: "banner.jpg",
        type: "image/jpeg",
      } as any);

      try {
        await api.post("/banners", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Alert.alert("Banner enviado!");
        fetchBanners();
      } catch {
        Alert.alert("Erro ao enviar imagem");
      }
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, padding: 20 }}>
      <Text style={[styles.title, { color: colors.title }]}>Painel Administrativo</Text>

      <TouchableOpacity onPress={handleUpload} style={styles.button}>
        <Text style={styles.buttonText}>Upload de Banner</Text>
      </TouchableOpacity>

      <FlatList
        data={banners}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        style={{ marginVertical: 10 }}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.banner} />
        )}
      />

      <TextInput
        value={produto}
        onChangeText={setProduto}
        placeholder="Produto sazonal"
        style={[styles.input, { borderColor: colors.text, color: colors.text }]}
        placeholderTextColor={colors.text}
      />

      <TouchableOpacity onPress={handleAddProduto} style={styles.button}>
        <Text style={styles.buttonText}>Adicionar Produto Sazonal</Text>
      </TouchableOpacity>

      <FlatList
        data={produtosSazonais}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text style={[styles.item, { color: colors.text }]}>{item}</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  input: { borderWidth: 1, padding: 10, borderRadius: 8, marginBottom: 10 },
  button: {
    backgroundColor: "#4D7E1B",
    padding: 10,
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 15,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  banner: { width: 200, height: 120, marginRight: 10, borderRadius: 10 },
  item: { fontSize: 16, paddingVertical: 5 },
});
