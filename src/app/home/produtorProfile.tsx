import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { View, Text, Image, TouchableOpacity, ScrollView, FlatList, StyleSheet, Dimensions, ActivityIndicator, Alert } from "react-native";
import { Feather, MaterialIcons, Fontisto } from "@expo/vector-icons";
import Entypo from '@expo/vector-icons/Entypo';
import AwesomeAlert from 'react-native-awesome-alerts';

import Header from "@/components/header";
import ModalProduto from "@/components/modais/produtos/modalProduto";

import { useTema } from "@/contexts/ThemeContext";
import { useFavoritos } from "@/contexts/FavoritosContext";
import { useCarrinho } from "@/contexts/CarrinhoContext";

import { SafeAreaView } from "react-native-safe-area-context";
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
  produto_id: string;
  id: string;
  nome: string;
  descricao?: string;
  preco: string;
  preco_promocional?: string;
  imagem: any;
  vendedor?: string; // Adicionando vendedor para compatibilidade com busca
};

export default function ProdutorScreen() {
  const params = useLocalSearchParams();
  const { usuario_id, cpf_cnpj } = params;
  const { colors } = useTema();
  const { favoritarProduto, desfavoritarProduto, isProdutoFavorito } = useFavoritos();
  const { adicionarItem } = useCarrinho();
  const { isFavorito, adicionarFavorito, removerFavorito } = useFavoritos();

  const toggleFavorito = () => {
        isFavorito(String(cpf_cnpj)) ? removerFavorito(String(cpf_cnpj)) : adicionarFavorito(String(cpf_cnpj));
    };

  const base = baseURL.slice(0, -1);

  const [alertCarrinho, setAlertCarrinho] = useState(false);
  const [alertProduto, setAlertProduto] = useState<{ nome: string; qtd: number } | null>(null);
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
        const resProdutor = await api.get(`/produtores/${usuario_id}`);

        // console.log("Dados do produtor:", resProdutor.data);
        setProdutor(resProdutor.data);
        
        // console.log("Dados do produtor:", resProdutor.data);

        // Produtos desse produtor
        const resProdutos = await api.get(`/produtores/${usuario_id}/produtos`);
        // console.log(resProdutos.data)
        const produtosTratados: Produto[] = resProdutos.data.map((produto: any) => ({
          produto_id: produto.id.toString(),
          id: produto.listagem_id.toString(),
          nome: produto.nome,
          descricao: produto.descricao || "",
          preco: produto.preco ? produto.preco.toString() : "",
          preco_promocional: produto.preco_promocional ? produto.preco_promocional.toString() : "",
          imagem: produto.foto
            ? { uri: produto.foto }
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
    if (usuario_id) buscarDados();
  }, [usuario_id, base]);

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
                });

                setAlertProduto({ nome: produtoSelecionado.nome, qtd });
                setAlertCarrinho(true);

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
            <TouchableOpacity style={styles.localizacao} onPress={() => router.push({ pathname: '/home/localizacaoProdutor', params: { usuario_id: usuario_id, cpf_cnpj: cpf_cnpj} })}>
              <Feather name="map-pin" size={fontSizePrecoRiscado} color={colors.text} />
              <Text style={[styles.localizacaoText, { color: colors.text }]}> Localização</Text>
            </TouchableOpacity>
            <View style={styles.produtorDetalhes}>
              <Text style={styles.avaliacao}><MaterialIcons name="star" size={fontSizePrecoRiscado} color="gold" /> 4.7</Text>
              <Text style={styles.categoria}>- Legumes -</Text>
              <Text style={styles.distancia}>10km</Text>
            </View>
            {/* Ícone de favorito */}
            <TouchableOpacity style={styles.save} onPress={toggleFavorito}>
                {isFavorito(String(cpf_cnpj)) ? (
                    <Fontisto name="favorite" size={20} color={'black'} />
                ) : (
                    <Fontisto name="bookmark" size={20} color={'black'}/>
                )}
            </TouchableOpacity>
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
                        isProdutoFavorito(Number(item.produto_id))
                          ? desfavoritarProduto(Number(item.produto_id))
                          : favoritarProduto(Number(item.produto_id));
                      }}
                      style={{ padding: 5 }}
                    >
                      <Entypo
                        name={isProdutoFavorito(Number(item.produto_id)) ? "heart" : "heart-outlined"}
                        size={20}
                        color={isProdutoFavorito(Number(item.produto_id)) ? "#E15610" : "#999"}
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
                      isProdutoFavorito(Number(item.produto_id))
                        ? desfavoritarProduto(Number(item.produto_id))
                        : favoritarProduto(Number(item.produto_id));
                    }}
                  >
                    <Entypo
                      name={isProdutoFavorito(Number(item.produto_id)) ? "heart" : "heart-outlined"}
                      size={20}
                      color={isProdutoFavorito(Number(item.produto_id)) ? "#E15610" : "#999"}
                    />
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={item => item.id}
              scrollEnabled={false}
            />
          </View>
        </ScrollView>

        <AwesomeAlert
          show={alertCarrinho}
          showConfirmButton={true}
          showCancelButton={true}
          title="Produto adicionado!"
          message={`${alertProduto?.nome} (x${alertProduto?.qtd}) foi adicionado ao carrinho com sucesso.`}
          confirmText="OK"
          cancelText="Ir para Carrinho"
          confirmButtonColor="#4D7E1B"
          cancelButtonColor="gray"
          onConfirmPressed={() => {
            setAlertCarrinho(false);
            setAlertProduto(null);
          }}
          onCancelPressed={() => {
            setAlertCarrinho(false);
            setAlertProduto(null);
            router.push('/carrinho')
          }}
          titleStyle={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}
          messageStyle={{ fontSize: 16, textAlign: 'center' }}
          contentStyle={{
            padding: 20,
            borderRadius: 10,
            width: 300,
            backgroundColor: '#fff'
          }}
        />

      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  save:{
    position: "absolute",
    right: 20,
    top: 10,
  },
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
  localizacao: { flexDirection: "row", alignItems: "center", marginVertical: 8, "borderColor": "black", borderWidth: 1, padding: 5, borderRadius: 5 },
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
