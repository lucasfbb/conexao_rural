import React, { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { View, Text, Image, TouchableOpacity, ScrollView, FlatList, StyleSheet, Dimensions } from "react-native";
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";

import Header from "@/components/header";
import ModalProduto from "@/components/modais/modalProduto";
import { useTema } from "@/contexts/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

export default function ProdutorScreen() {

    const params = useLocalSearchParams();

    const [modalProdutoVisivel, setModalProdutoVisivel] = useState(false);

    const { colors } = useTema()

    const [produtoSelecionado, setProdutoSelecionado] = useState<{
        nome: string;
        descricao?: string;
        preco: string;
        imagem: any;
    } | null>(null);

    const imagens = {
        maca: require("../../../assets/images/promocoes/maca.png"),
        alface: require("../../../assets/images/principais/alface.png"),
    } as const;
    
    type ImagemKeys = keyof typeof imagens;

    const produtosPromocao: { id: string; nome: string; preco: string; foto: ImagemKeys }[] = [
        { id: "1", nome: "Produto 01", preco: "R$ 10,00/KG", foto: 'maca'},
        { id: "2", nome: "Produto 02", preco: "R$ 10,00/KG", foto: 'maca' },
        { id: "3", nome: "Produto 03", preco: "R$ 10,00/KG", foto: 'maca' },
        { id: "4", nome: "Produto 04", preco: "R$ 10,00/KG", foto: 'maca' },
    ];

    const produtosPrincipais: { id: string; nome: string; descricao: string; preco: string; foto: ImagemKeys }[] = [
        { id: "5", nome: "Produto 05", descricao: "Lorem ipsum is simply dummy text of the printing industry.", preco: "R$ 10,00/KG", foto: 'alface' },
        { id: "6", nome: "Produto 06", descricao: "Lorem ipsum is simply dummy text of the printing industry.", preco: "R$ 10,00/KG", foto: 'alface'  },
        { id: "7", nome: "Produto 07", descricao: "Lorem ipsum is simply dummy text of the printing industry.", preco: "R$ 10,00/KG", foto: 'alface'  },
        { id: "8", nome: "Produto 08", descricao: "Lorem ipsum is simply dummy text of the printing industry.", preco: "R$ 10,00/KG", foto: 'alface'  },
    ];
    
    return (
        <>
            
            <SafeAreaView
                edges={["top"]}
                style={{ backgroundColor: '#4D7E1B' }} 
            />

            <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["left", "right" ]}>
                
                <Header showFavoriteicon={true} showGoBack={true} />
                
                <ScrollView style={[styles.container, { backgroundColor: colors.background }]} bounces={false}> 

                    {produtoSelecionado && (
                        <ModalProduto
                            visible={modalProdutoVisivel}
                            onClose={() => {
                            setModalProdutoVisivel(false);
                            setProdutoSelecionado(null);
                            }}
                            produto={produtoSelecionado}
                            onAddToCart={(qtd) => {
                            console.log(`Adicionar ${qtd} unidade(s) ao carrinho`);
                            setModalProdutoVisivel(false);
                            setProdutoSelecionado(null);
                            }}
                        />
                    )}

                    {/* 🔹 Banner */}
                
                    <Image source={require("../../../assets/images/banner_produtor.png")}  style={styles.banner}/>
            
                    {/* 🔹 Informações do Produtor */}
                    <View style={styles.produtorInfo}>
                        <Image source={require("../../../assets/images/perfil_agricultor.png")} style={styles.logo} />
                        <Text style={[styles.produtorNome, { color: colors.text }]}>{params?.nome || "Nome não disponível"}</Text>
                        <TouchableOpacity style={styles.localizacao} onPress={() => router.push('/home/localizacaoProdutor')}>
                            <Feather name="map-pin" size={16} color={colors.text} />
                            <Text style={[styles.localizacaoText, { color: colors.text }]}> Localização</Text>
                        </TouchableOpacity>
                        <View style={styles.produtorDetalhes}>
                            <Text style={styles.avaliacao}><MaterialIcons name="star" size={16} color="gold" /> 4.7</Text>
                            <Text style={styles.categoria}>- Legumes -</Text>
                            <Text style={styles.distancia}>10km</Text>
                        </View>
                    </View>

                    {/* 🔹 Seção Promoções */}
                    <Text style={[styles.sectionTitle, { color: colors.title }]}>Promoções</Text>
                    <View style={{ paddingLeft: 15, paddingRight: 15 }}>
                        <FlatList
                            data={produtosPromocao}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[styles.promoCard, {  }]}
                                    onPress={() => {
                                        const imagem = imagens[item.foto]; // pegar imagem baseada na chave
                                        setProdutoSelecionado({
                                        nome: item.nome,
                                        preco: item.preco,
                                        imagem,
                                        });
                                        setModalProdutoVisivel(true);
                                    }}
                                >
                                    <Image source={imagens[item.foto]} style={styles.produtoImagem} />
                                    <View>
                                        <Text style={[styles.produtoNome, { color: colors.text }]}>{item.nome}</Text>
                                        <Text style={[styles.produtoPreco]}>{item.preco}</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                            keyExtractor={(item) => item.id}
                            numColumns={2}
                            columnWrapperStyle={{ justifyContent: "space-between" }}
                            scrollEnabled={false} // 🔹 Desabilita scroll da FlatList
                        />
                    </View>

                    {/* 🔹 Seção Produtos Principais */}
                    <Text style={styles.sectionTitle}>Principais</Text>
                    <View style={{ paddingLeft: 15, paddingRight: 15 }}>
                        <FlatList
                            data={produtosPrincipais}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                style={styles.principalCard}
                                onPress={() => {
                                    // console.log("imagem selecionada:", imagens[item.foto]);
                                    const imagem = imagens[item.foto]; // pegar imagem baseada na chave
                                    setProdutoSelecionado({
                                    nome: item.nome,
                                    descricao: item.descricao,
                                    preco: item.preco,
                                    imagem,
                                    });
                                    setModalProdutoVisivel(true);
                                }}
                                >
                                    <Image source={imagens[item.foto]} style={styles.produtoImagem} />
                                    <View style={styles.produtoInfo}>
                                        <Text style={[styles.produtoNome, { color: colors.text }]}>{item.nome}</Text>
                                        <Text style={styles.produtoDescricao}>{item.descricao}</Text>
                                        <Text style={styles.produtoPreco}>{item.preco}</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                            keyExtractor={(item) => item.id}
                            scrollEnabled={false} // 🔹 Desabilita scroll da FlatList
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "white" },

    // 🔹 Header
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#4D7E1B",
        padding: 15,
    },
    headerTitle: { fontSize: 18, fontWeight: "bold", color: "white" },

    // 🔹 Banner
    banner: {
        width: "100%",
        height: 100,
        backgroundColor: "#ccc",
        justifyContent: "center",
        alignItems: "center",
    },
    bannerText: { fontSize: 16, fontStyle: "italic" },

    // 🔹 Informações do Produtor
    produtorInfo: { alignItems: "center", padding: 15, borderBottomWidth: 1, borderColor: "#ddd" },
    logo: { width: 90, height: 90, borderRadius: 30, marginBottom: 5 },
    produtorNome: { fontSize: 18, fontWeight: "bold" },
    localizacao: { flexDirection: "row", alignItems: "center", marginVertical: 8 },
    localizacaoText: { fontSize: 14, color: "black" },
    produtorDetalhes: { flexDirection: "row", alignItems: "center", gap: 5 },
    avaliacao: { fontSize: 14, fontWeight: "bold", color: "#4D7E1B" },
    categoria: { fontSize: 14, fontStyle: "italic", color: "#777" },
    distancia: { fontSize: 14, color: "#777" },

    // 🔹 Seções
    sectionTitle: { fontSize: 18, fontWeight: "bold", fontStyle: "italic", marginVertical: 10, marginLeft: 10, color: '#4D7E1B', textAlign: 'center'},

    // 🔹 Promoções
    promoCard: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        borderWidth: 1,
        borderColor: "#4D7E1B",
        borderRadius: 10,
        width: "48%",
        marginBottom: 10,
    },
    produtoImagem: { width: 40, height: 40, marginRight: 10 },
    produtoNome: { fontSize: 14, fontWeight: "bold", fontStyle: "italic" },
    produtoPreco: { fontSize: 14, color: "#4D7E1B" },

    // 🔹 Produtos Principais
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
    produtoDescricao: { fontSize: 12, color: "#777" },
});
