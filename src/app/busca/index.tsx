import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, FlatList, StyleSheet, Dimensions, ActivityIndicator, Alert } from "react-native";
import Header from '@/components/header';
import { router, useLocalSearchParams } from 'expo-router';
import { useTema } from '@/contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialIcons } from "@expo/vector-icons";

import ModalProduto from "@/components/modais/produtos/modalProduto";

import { useFavoritos } from "@/contexts/FavoritosContext";
import { useCarrinho } from "@/contexts/CarrinhoContext";

import { api, baseURL } from "../../../services/api";
import { Produtor } from "@/types/types";
import { geocodeEndereco, parsePreco } from "../../../services/utils";


const { width, height } = Dimensions.get("window");

type Produto = {
  id: string;
  nome: string;
  descricao?: string;
  preco: string;
  preco_promocional?: string;
  imagem: any;
};

export default function Busca() {
    const itens = ['item1', 'item2', 'item3'];
    const params = useLocalSearchParams();
    const { usuario_id, cpf_cnpj } = params;
    const { colors } = useTema();
    const { favoritarProduto, desfavoritarProduto, isProdutoFavorito } = useFavoritos();
    const { adicionarItem } = useCarrinho();

    const base = baseURL.slice(0, -1);

    const [produtor, setProdutor] = useState<Produtor | null>(null);
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [produtosPromocao, setProdutosPromocao] = useState<Produto[]>([]);
    const [produtosNormais, setProdutosNormais] = useState<Produto[]>([]);
    const [carregando, setCarregando] = useState(true);

    const [modalProdutoVisivel, setModalProdutoVisivel] = useState(false);
    const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);
    const alvo = params.alvo

    
      useEffect(() => {
        async function buscarDados() {
          setCarregando(true);
          try {
    
            // Dados do produtor
            // const resProdutor = await api.get(`/listagens/${alvo}`);
    
            // setProdutor(resProdutor.data);

            // Produtos desse produtor
            const resProdutos = await api.get(`/listagens/${alvo}`);
            const produtosTratados: Produto[] = resProdutos.data.map((produto: any) => ({
              // id: produto.id?.toString() ?? Math.random().toString(),
              id: produto.listagem_id.toString(),
              nome: produto.nome,
              descricao: produto.descricao || "",
              preco: produto.preco,
              preco_promocional: produto.preco_promocional ? produto.preco_promocional.toString() : "",
              imagem: produto.foto
                ? { uri: base + produto.foto }
                : require('../../../assets/images/principais/alface.png'),
            }));
    
            setProdutos(produtosTratados);
    
            setProdutosPromocao(produtosTratados.filter(
              (p) => !!p.preco_promocional && Number(p.preco_promocional) > 0
            ));
            setProdutosNormais(produtosTratados.filter(
              (p) => !p.preco_promocional || Number(p.preco_promocional) === 0
            ));
    
          } catch (e) {
            console.error("Erro ao buscar dados do produtor:", e);
          } finally {
            setCarregando(false);
          }
        }
        buscarDados();
      }, [alvo]);
    
      if (carregando) {
        return (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <ActivityIndicator size="large" color="#4D7E1B" />
          </View>
        );
      }

    return (
        <>
        <SafeAreaView edges={["top"]} style={{ backgroundColor: '#4D7E1B' }} />

        <View style={[styles.container]}>
            <Header />
            <Text style={[styles.title]}>{alvo}</Text>

            {produtos.length === 0 ? (
            <View style={styles.vazioContainer}>
                <Image
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2038/2038854.png' }}
                style={styles.imagemVazia}
                resizeMode="contain"
                />
                <Text style={styles.mensagemVazio}>Sentimos muito, mas não encontramos nenhum resultado</Text>
            </View>
            ) : (
            <ScrollView contentContainerStyle={{ padding: 15 }}>
                    {produtos.map((produto) => (
                    <TouchableOpacity key={produto.id}>
                        <View style={[styles.produtoContainer]}>
                            {/* <Image source={item} style={styles.img} /> */}
                            <View style={{ flex: 1 }}>
                            <Text style={[styles.nome]}>{produto.nome}</Text>
                            <Text style={styles.preco}>
                                R$ {typeof produto.preco === "number" ? produto.preco : "0,00"}
                            </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    ))}
            </ScrollView>

            )}
        </View>
        </>
    );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  title: {
    fontSize: 22, fontWeight: 'bold', color: '#4D7E1B', fontStyle: 'italic',
    marginTop: height * 0.03, marginLeft: 20, marginBottom: height * 0.005
  },
  produtoContainer: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 10,
    padding: 10, marginBottom: height * 0.015, gap: 10,
  },
  img: { width: 60, height: 60, borderRadius: 8, backgroundColor: '#ddd' },
  nome: { fontSize: 16, fontWeight: 'bold', color: '#4D7E1B' },
  preco: { fontSize: 14, color: '#4D7E1B', marginTop: 5 },
  qtdContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#E6F2D8',
    borderRadius: 5, paddingHorizontal: 8, paddingVertical: 4, gap: 8
  },
  qtd: { fontSize: 16, fontWeight: 'bold', color: '#4D7E1B' },
  footer: {
    borderTopWidth: 1, borderTopColor: '#eee',
    padding: 25, paddingBottom: 40, alignItems: 'center', justifyContent: 'center',
  },
  total: { fontSize: 16, fontWeight: 'bold', color: '#4D7E1B', marginBottom: height * 0.025 },
  continuar: { backgroundColor: '#4D7E1B', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 25 },
  continuarText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  vazioContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40
  },
  imagemVazia: {
    width: 180,
    height: 180,
    marginBottom: 20
  },
  mensagemVazio: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginBottom: 5
  }
});
