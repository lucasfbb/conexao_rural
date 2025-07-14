import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { View, Text, Image, TouchableOpacity, ScrollView, FlatList, StyleSheet, Dimensions, ActivityIndicator, Alert } from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";

import Header from "@/components/header";
import ModalProduto from "@/components/modais/produtos/modalProduto";

import { useTema } from "@/contexts/ThemeContext";
import { useFavoritos } from "@/contexts/FavoritosContext";
import { useCarrinho } from "@/contexts/CarrinhoContext";

import { SafeAreaView } from "react-native-safe-area-context";
import { api, baseURL } from "../../../services/api";
import { Produtor } from "@/types/types";
import { parsePreco } from "../../../services/utils";

const { width, height } = Dimensions.get("window");

// Fatores dinâmicos
const fontSizeTitulo = width * 0.047;
const fontSizePromoNome = width * 0.03;
const fontSizePrecoRiscado = width * 0.028;
const fontSizePromocao = width * 0.036;
const fontSizePreco = width * 0.035;
const fontSizeDescricao = width * 0.03;

type Produto = {
  id: string;
  nome: string;
  descricao?: string;
  preco: string;
  preco_promocional?: string;
  imagem: any;
};

export default function ProdutorScreen() {
  const params = useLocalSearchParams();
  const { cpf_cnpj } = params;
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

  useEffect(() => {
    async function buscarDados() {
      setCarregando(true);
      try {
        // Dados do produtor
        const resProdutor = await api.get(`/produtores/${cpf_cnpj}`);
        setProdutor(resProdutor.data);

        // Produtos desse produtor
        const resProdutos = await api.get(`/produtores/${cpf_cnpj}/produtos`);
        const produtosTratados: Produto[] = resProdutos.data.map((produto: any) => ({
          id: produto.id?.toString() ?? Math.random().toString(),
          nome: produto.nome,
          descricao: produto.descricao || "",
          preco: produto.preco ? produto.preco.toString() : "",
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
    if (cpf_cnpj) buscarDados();
  }, [cpf_cnpj, base]);

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
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["left", "right" ]}>
        <Header showFavoriteicon={true} showGoBack={true} cpf_cnpj={String(cpf_cnpj)} />

        <ScrollView style={[styles.container, { backgroundColor: colors.background }]} bounces={false}> 

          {/* Modal Produto */}
          {produtoSelecionado && (
            <ModalProduto
              visible={modalProdutoVisivel}
              onClose={() => {
                setModalProdutoVisivel(false);
                setProdutoSelecionado(null);
              }}
              produto={produtoSelecionado}
              onAddToCart={(qtd) => {
                const precoFinal = produtoSelecionado?.preco_promocional
                  ? parsePreco(produtoSelecionado.preco_promocional)
                  : parsePreco(produtoSelecionado.preco);
                
                // console.log(produtoSelecionado.preco)
                // console.log("💰 precoFinal calculado:", precoFinal);

                adicionarItem({
                  id_listagem: Number(produtoSelecionado?.id),
                  nome: produtoSelecionado?.nome,
                  preco: precoFinal,
                  qtd,
                  imagem: produtoSelecionado?.imagem,
                });

                Alert.alert(
                  'Adicionado ao carrinho',
                  `${produtoSelecionado.nome} (x${qtd}) adicionado com sucesso!`
                );

                setModalProdutoVisivel(false);
                setProdutoSelecionado(null);
              }}
            />
          )}

          {/* Banner */}
          <Image source={{
            uri: produtor?.banner ? `${base}${produtor?.banner}` : undefined
          }} style={styles.banner} />

          {/* Informações do Produtor */}
          <View style={styles.produtorInfo}>
            <Image source={{
              uri: produtor?.foto ? `${base}${produtor?.foto}` : undefined
            }} style={styles.logo} />
            <Text style={[styles.produtorNome, { color: colors.text }]}>{produtor?.nome || "Nome não disponível"}</Text>
            <TouchableOpacity style={styles.localizacao} onPress={() => router.push('/home/localizacaoProdutor')}>
              <Feather name="map-pin" size={fontSizePrecoRiscado} color={colors.text} />
              <Text style={[styles.localizacaoText, { color: colors.text }]}> Localização</Text>
            </TouchableOpacity>
            <View style={styles.produtorDetalhes}>
              <Text style={styles.avaliacao}><MaterialIcons name="star" size={fontSizePrecoRiscado} color="gold" /> 4.7</Text>
              <Text style={styles.categoria}>- Legumes -</Text>
              <Text style={styles.distancia}>10km</Text>
            </View>
          </View>

          {/* Seção Promoções */}
          <Text style={[styles.sectionTitle, { color: colors.title, fontSize: fontSizeTitulo }]}>Promoções</Text>
          <View style={{ paddingLeft: 15, paddingRight: 15 }}>
            {produtosPromocao.length === 0 ? (
              <Text style={{ textAlign: "center", color: "#888", fontStyle: "italic", fontSize: fontSizePromoNome }}>
                Nenhuma promoção disponível
              </Text>
            ) : (
              <FlatList
                data={produtosPromocao}
                renderItem={({ item }) => (
                  <View style={styles.promoCard}>
                    <TouchableOpacity
                      style={{ flexDirection: "row", flex: 1, alignItems: "center" }}
                      onPress={() => {
                        setProdutoSelecionado({
                          ...item,
                          preco: `R$ ${Number(item.preco_promocional).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                        });
                        setModalProdutoVisivel(true);
                      }}
                    >
                      <Image source={item.imagem} style={styles.produtoImagem} />
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.produtoNome, { color: colors.text, fontSize: fontSizePromoNome }]}>{item.nome}</Text>
                        {Number(item.preco) > Number(item.preco_promocional) && (
                          <Text style={{
                            color: '#B00020',
                            textDecorationLine: 'line-through',
                            fontSize: fontSizePrecoRiscado,
                            marginBottom: 2,
                          }}>
                            R$ {Number(item.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </Text>
                        )}
                        <Text style={{
                          color: '#388e3c',
                          fontWeight: 'bold',
                          fontSize: fontSizePromocao
                        }}>
                          R$ {Number(item.preco_promocional).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </Text>
                      </View>
                    </TouchableOpacity>

                    {/* Botão de favoritar fora do Touchable principal */}
                    <TouchableOpacity
                      onPress={() => {
                        isProdutoFavorito(Number(item.id))
                          ? desfavoritarProduto(Number(item.id))
                          : favoritarProduto(Number(item.id));
                      }}
                      style={{ padding: 5 }}
                    >
                      <Feather
                        name="heart"
                        size={20}
                        color={isProdutoFavorito(Number(item.id)) ? "#E15610" : "#999"}
                      />
                    </TouchableOpacity>
                  </View>
                )}
                keyExtractor={item => item.id}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: "space-between" }}
                scrollEnabled={false}
              />
            )}
          </View>

          {/* Seção Produtos Principais */}
          <Text style={[styles.sectionTitle, { fontSize: fontSizeTitulo }]}>Principais</Text>
          <View style={{ paddingLeft: 15, paddingRight: 15 }}>
            <FlatList
              data={produtosNormais}
              renderItem={({ item }) => (
                <View style={[styles.principalCard, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
                  
                  {/* TOCAR NO CARD ABRE O MODAL */}
                  <TouchableOpacity
                    style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}
                    onPress={() => {
                      setProdutoSelecionado({
                        ...item,
                        preco: `R$ ${Number(item.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                      });
                      setModalProdutoVisivel(true);
                    }}
                  >
                    <Image source={item.imagem} style={styles.produtoImagem} />
                    <View style={styles.produtoInfo}>
                      <Text style={[styles.produtoNome, { color: colors.text, fontSize: fontSizePromoNome }]}>{item.nome}</Text>
                      <Text style={[styles.produtoDescricao, { fontSize: fontSizeDescricao }]}>{item.descricao}</Text>
                      <Text style={[styles.produtoPreco, { fontSize: fontSizePreco }]}>
                        R$ {Number(item.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  {/* BOTÃO DE FAVORITAR */}
                  <TouchableOpacity
                    onPress={() => {
                      isProdutoFavorito(Number(item.id))
                        ? desfavoritarProduto(Number(item.id))
                        : favoritarProduto(Number(item.id));
                    }}
                  >
                    <Feather
                      name={isProdutoFavorito(Number(item.id)) ? "heart" : "heart"}
                      size={20}
                      color={isProdutoFavorito(Number(item.id)) ? "#E15610" : "#999"}
                    />
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={item => item.id}
              scrollEnabled={false}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  banner: {
    width: "100%",
    height: 100,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  produtorInfo: { alignItems: "center", padding: 15, borderBottomWidth: 1, borderColor: "#ddd" },
  logo: { width: 90, height: 90, borderRadius: 20, marginBottom: 5 },
  produtorNome: { fontWeight: "bold" }, // fontSize é dinâmico!
  localizacao: { flexDirection: "row", alignItems: "center", marginVertical: 8 },
  localizacaoText: { fontSize: fontSizePrecoRiscado, color: "black" },
  produtorDetalhes: { flexDirection: "row", alignItems: "center", gap: 5 },
  avaliacao: { fontWeight: "bold", color: "#4D7E1B", fontSize: fontSizePrecoRiscado },
  categoria: { fontSize: fontSizePrecoRiscado, fontStyle: "italic", color: "#777" },
  distancia: { fontSize: fontSizePrecoRiscado, color: "#777" },
  sectionTitle: { fontWeight: "bold", fontStyle: "italic", marginVertical: 10, marginLeft: 10, color: '#4D7E1B', textAlign: 'center'},
  promoCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderWidth: 1,
    borderColor: "#4D7E1B",
    borderRadius: 10,
    width: "100%", // use 100% no FlatList horizontal ou 48% no grid
    marginBottom: 10,
  },
  produtoImagem: { width: 40, height: 40, marginRight: 10 },
  produtoNome: { fontWeight: "bold", fontStyle: "italic" }, // fontSize é dinâmico!
  produtoPreco: { color: "#4D7E1B" }, // fontSize é dinâmico!
  principalCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: "#4D7E1B",
    borderRadius: 10,
    marginBottom: 10,
  },
  produtoInfo: { flex: 1 },
  produtoDescricao: { color: "#777" }, // fontSize é dinâmico!
});
