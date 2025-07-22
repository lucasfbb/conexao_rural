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
  vendedor: string;
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
              vendedor: produto.vendedor,
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

        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Header showGoBack={true} />
            <Text style={[styles.title]}>Buscando: {alvo}</Text>

            {produtos.length === 0 ? (
            <View style={styles.vazioContainer}>
                <Image
                source={{ uri: 'https://static.vecteezy.com/system/resources/previews/007/104/553/non_2x/search-no-result-not-found-concept-illustration-flat-design-eps10-modern-graphic-element-for-landing-page-empty-state-ui-infographic-icon-vector.jpg' }}
                style={styles.imagemVazia}
                resizeMode="contain"
                />
                <Text style={styles.mensagemVazio}>Sentimos muito, mas não encontramos nenhum resultado</Text>
            </View>
            ) : (
            <ScrollView contentContainerStyle={{ padding: 15 }}>
                    {/* {produtos.map((produto) => (
                    <TouchableOpacity key={produto.id}>
                        <View style={[styles.produtoContainer]}>
                            <Image source={item} style={styles.img} />
                            <View style={{ flex: 1 }}>
                            <Text style={[styles.nome]}>{produto.nome}</Text>
                            <Text style={[styles.nome]}>{produto.vendedor}</Text>
                            <Text style={styles.preco}>
                                R$ {typeof produto.preco === "number" ? produto.preco : "0,00"}
                            </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    ))} */}
                          {/* Modal Produto */}
                          {produtoSelecionado && (
                            <ModalProduto
                              visible={modalProdutoVisivel}
                              onClose={() => {
                                setModalProdutoVisivel(false);
                                setProdutoSelecionado(null);
                              }}
                              produto={produtoSelecionado}
                              onAddToCart={async (qtd) => {
                                const precoFinal = produtoSelecionado?.preco_promocional
                                  ? parsePreco(produtoSelecionado.preco_promocional)
                                  : parsePreco(produtoSelecionado.preco);
                                
                                // console.log(produtoSelecionado.preco)
                                // console.log("💰 precoFinal calculado:", precoFinal);
                
                                const enderecoTexto = `${produtor?.rua ?? ''}, ${produtor?.numero ?? ''}, ${produtor?.bairro ?? ''}`;
                                const coords = await geocodeEndereco(enderecoTexto);
                                  
                                // // Se não encontrou, tenta só com o bairro
                                // if (!coords && produtor?.bairro) {
                                //   console.warn("Endereço completo falhou. Tentando com apenas o bairro...");
                                //   coords = await geocodeEndereco(produtor.bairro);
                                // }
                
                                // // Se ainda falhar, aborta
                                // if (!coords) {
                                //   console.error("Não foi possível geocodificar o endereço do cliente.");
                                //   return;
                                // }
                
                                adicionarItem({
                                  id_listagem: Number(produtoSelecionado?.id),
                                  nome: produtoSelecionado?.nome,
                                  preco: precoFinal,
                                  qtd,
                                  produtor_id: produtor?.id || 0,
                                  nome_produtor: produtor?.nome,
                                  imagem: produtoSelecionado?.imagem,
                                  endereco_produtor: {
                                    texto: enderecoTexto,
                                    rua: produtor?.rua,
                                    numero: produtor?.numero,
                                    bairro: produtor?.bairro,
                                    complemento: produtor?.complemento,
                                    latitude: coords?.latitude,
                                    longitude: coords?.longitude,
                                  }
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
                                        <Text style={[styles.nome]}>{item.nome}</Text>
                                        <Text style={[styles.produtoNome, { color: colors.text, fontSize: fontSizePromoNome }]}>Vendido por: {item.vendedor}</Text>
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
                
                          {/* Seção Resultados */}
                          <Text style={[styles.sectionTitle, { color: colors.title, fontSize: fontSizeTitulo }]}>Resultados</Text>
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
                                      <Text style={[styles.nome]}>{item.nome}</Text>
                                      <Text style={[styles.produtoNome, { color: colors.text, fontSize: fontSizePromoNome }]}>Vendido por: {item.vendedor}</Text>
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
  },
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
