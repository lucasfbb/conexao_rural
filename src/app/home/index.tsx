import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, StyleSheet, Alert, Image, TouchableOpacity, ScrollView, TextInput, FlatList, useWindowDimensions } from "react-native"
import Carousel from 'react-native-reanimated-carousel';
import { Feather, Ionicons, Fontisto } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useFocusEffect } from 'expo-router'

import { useTema } from '@/contexts/ThemeContext';
import Header from '@/components/header'
import { api, baseURL } from '../../../services/api';
import { ItemHome } from '@/types/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '@/contexts/UserContext';

export default function Home(){
    const { width, height } = useWindowDimensions();
    const { isNightMode, colors } = useTema();
    const [cpf_cnpj_user, setCpfCnpjUser] = useState('');
    const [agricultores, setAgricultores] = useState([]);
    const [banners, setBanners] = useState<string[]>([]);
    const [produtosSazonais, setProdutosSazonais] = useState<string[]>([]);

    const base = baseURL.slice(0, -1);

    const { user } = useUser();
    
    const imagens = {
        foto_perfil: require("../../../assets/images/perfil_agricultor.png"),
    } as const;

    
    const buscarAgricultores = async () => {
        try {
            const response = await api.get(`/home/agricultores?exclude_cpf_cnpj=${cpf_cnpj_user}&limit=10`);
            // console.log("Agricultores:", response.data);
            setAgricultores(response.data);
            // console.log(agricultores)
        } catch (error) {
            console.error("Erro ao buscar agricultores:", error);
            Alert.alert("Erro", "Não foi possível carregar os agricultores.");
        }
    };
    
    const fetchBanners = async () => {
        try {
            const res = await api.get("/banners");
            const API_URL = "http://10.0.2.2:5000";
            const bannersAbs = res.data.map((url: string) =>
                url.startsWith("http") ? url : `${API_URL}${url}`
        );
        setBanners(bannersAbs);
        const token = await AsyncStorage.getItem("token");
        // console.log("Token atual:", token);
        } catch (error) {
            console.error("Erro ao buscar banners:", error);
        }
    };

    const fetchProdutosSazonais = async () => {
        try {
            const res = await api.get("/produtos");
            // Filtra só os produtos que são sazonais
            const sazonais = res.data.filter((p: any) => p.sazonal).map((p: any) => p.nome);
            setProdutosSazonais(sazonais);
        } catch (error) {
            console.error("Erro ao buscar produtos sazonais:", error);
        }
    };

    useFocusEffect(
        useCallback(() => {
        // Função que você quer rodar sempre que a tela volta pro foco
            if (user?.cpf_cnpj) {
                setCpfCnpjUser(user.cpf_cnpj);
            }
            fetchBanners();
            buscarAgricultores();
            fetchProdutosSazonais();
        }, [])
    );

const renderAgricultor = ({ item } : { item: ItemHome }) => (
    <TouchableOpacity 
            style={styles.agricultorItem} 
            onPress={() => router.push({ pathname: "/home/produtorProfile", params: { cpf_cnpj: String(item.cpf_cnpj) }})}
        >
            <View style={styles.logoPlaceholder}>
                <Image source={{
                    uri: item.foto ? `${base}${item.foto}` : undefined
                }} style={styles.perfilImagem} />
                {/* <Image source={imagens[item.foto]} style={styles.produtoImagem} /> */}
            </View>
            
            <View style={styles.agricultorInfo}>
                <Text style={[styles.nomeLoja, { color: colors.text }]}>{item.nome}</Text>
                { item.endereco &&
                    <Text style={[styles.endereco, { color: colors.endereco }]}>{item.endereco} - {item.distancia} km</Text>
                }
            </View>
            <TouchableOpacity style={styles.bookmarkIcon}>
                <Text><Fontisto name="favorite" size={20} color={colors.title} style={styles.icon} /> </Text>{/* Ícone de salvar */}
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <>  
            <SafeAreaView
                edges={["top"]}
                style={{ backgroundColor: '#4D7E1B' }} 
            />

            <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["left", "right", 'bottom']}>
                <View style={{ flex: 1}}>
                    {/* 🔹 Header Fixo no Topo */}
                    <View style={{ backgroundColor: "#4D7E1B" }}>
                        <Header />
                    </View>

                    {/* 🔹 Conteúdo separado do Header */}
                    <ScrollView contentContainerStyle={{  padding: 15 }} showsVerticalScrollIndicator={false} bounces={false} >

                        {/*  Barra de Pesquisa e Localização */}
                        <View style={styles.searchContainer}>
                            <Feather name="search" size={20} color={"#4D7E1B"} style={styles.icon} />
                            <TextInput style={[styles.searchInput, { color: colors.text, borderBottomColor: colors.text }]} placeholder='O que você procura hoje ?' placeholderTextColor={colors.text}/>
                            <TouchableOpacity style={[styles.locationButton, { marginTop: height * 0.01 }]}>
                                <Ionicons name="location-outline" size={20} color={"#4D7E1B"} />
                                <Text style={[styles.locationText, { color: colors.text }]}>Minha Localização</Text>
                            </TouchableOpacity>
                        </View>

                        {/*  Carrossel de Avisos/Promoções */}
                        {banners.length === 0 ? (
                            <View style={[styles.carouselContainer, { height: height * 0.23, justifyContent: 'center', alignItems: 'center' }]}>
                                <Text style={{ color: colors.text }}>Nenhum banner para exibir.</Text>
                            </View>
                        ) : (
                            <View style={styles.carouselContainer}>
                                <Carousel
                                    width={width * 0.85}
                                    height={height * 0.23}
                                    data={banners}
                                    defaultIndex={0}
                                    scrollAnimationDuration={500}
                                    loop
                                    autoPlay={true}
                                    autoPlayInterval={5000}
                                    renderItem={({ item }) => (
                                        <Image
                                            source={{ uri: item }}
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                borderRadius: 10,
                                            }}
                                            resizeMode="cover"
                                        />
                                    )}
                                />
                            </View>
                        )}

                        {/*  Produtos Sazonais */}
                        <Text style={[styles.sectionTitle, { marginBottom: height * 0.005, color: colors.title }]}>Produtos sazonais</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productScroll}>
                            {produtosSazonais.map((produto, index) => (
                                <TouchableOpacity key={index} style={styles.productItem}>
                                    <Text style={[styles.productText, { color: colors.text }]}>{produto}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        {/*  Agricultores por Perto */}
                        <Text style={[styles.sectionTitle, { textAlign: 'center', marginBottom: height * 0.01, color: colors.title }]}>Agricultores por perto</Text>
                            <FlatList
                                data={agricultores} // seu array de produtores
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={renderAgricultor}
                                scrollEnabled={false} // Para não conflitar com ScrollView
                                ListEmptyComponent={() => (
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 40 }}>
                                        <Text style={{ color: colors.text }}>Nenhum agricultor encontrado.</Text>
                                    </View>
                                )}
                            />
                    </ScrollView>
                </View>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white' },
    title: { fontSize: 24,fontWeight: 'bold',marginBottom: 20 },
    searchContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
    searchInput: { flex: 1, borderBottomWidth: 1, padding: 8, marginRight: 10 },
    locationButton: { padding: 8, borderWidth: 1, borderRadius: 10, marginRight: 5, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flex: 0.7},
    locationText: { fontSize: 12, color: '4D7E1B' },
    carouselContainer: { alignItems: "center", marginVertical: 15 },
    carouselItem: { width: 250, height: 100, backgroundColor: "#ddd", justifyContent: "center", alignItems: "center", borderRadius: 10 },
    carouselText: { fontSize: 16, fontWeight: "bold" },
    sectionTitle: { fontSize: 18, fontWeight: "bold", fontStyle: "italic", marginTop: 20, marginLeft: 10 },
    productScroll: { flexDirection: "row", marginVertical: 10 },
    productItem: { padding: 10, borderWidth: 1, borderRadius: 10, marginHorizontal: 5, borderColor: '#4D7E1B' },
    productText: { fontSize: 14 },
    agricultorItem: { flexDirection: "row", alignItems: "center", padding: 10, borderBottomWidth: 1 },
    logoPlaceholder: { width: 40, height: 40, marginRight: 10 },
    agricultorInfo: { flex: 1 },
    nomeLoja: { fontWeight: "bold" },
    endereco: { fontSize: 12 },
    bookmarkIcon: { padding: 5 },
    card: { width: "100%", height: "100%", backgroundColor: "#ddd", justifyContent: "center", alignItems: "center", borderRadius: 10 },
    text: { fontSize: 18, fontWeight: "bold" },
    icon: { marginLeft: 10 },
    produtoImagem: { width: 40, height: 40, marginRight: 10 },
    perfilImagem: { width: 40, height: 40, borderRadius: 10 },
});