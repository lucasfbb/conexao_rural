import React, { useState } from 'react'
import { View, Text, StyleSheet, Alert, Image, TouchableOpacity, ScrollView, TextInput, FlatList, useWindowDimensions } from "react-native"
import { DrawerToggleButton } from '@react-navigation/drawer'
import Carousel from 'react-native-reanimated-carousel';
import { Feather, Ionicons, Fontisto } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from 'expo-router'

import Header from '@/components/header'
import { useTema } from '@/contexts/ThemeContext';
import ModalEditarPerfil from '@/components/modais/modalEditarPerfil';

export default function Home(){
    const { width, height } = useWindowDimensions();
    const { isNightMode, colors } = useTema();

    const imagens = {
        foto_perfil: require("../../../assets/images/perfil_agricultor.png"),
    } as const;
    
    type ImagemKeys = keyof typeof imagens; 

    interface Item {
        nome: string;
        endereco: string;
        distancia: string;
        foto: ImagemKeys
    }
    
    const produtos = ["Tomate", "Alface", "Laranja", "Maçã", "Uva"];
    
    const agricultores: Item[] = Array(5).fill({
        nome: "Raiz E Fruto",
        endereco: "R. 47 - Guaxuma",
        distancia: "10km",
        foto: 'foto_perfil', 
    });

    const renderAgricultor = ({ item } : { item: Item }) => (
        <TouchableOpacity 
            style={styles.agricultorItem} 
            onPress={() => router.push({ pathname: "/home/produtorProfile", params: { nome: String(item.nome), endereco: String(item.endereco), distancia: String(item.distancia), foto: String(item.foto)} })}
        >
            <View style={styles.logoPlaceholder}>
                <Image source={imagens[item.foto]} style={styles.produtoImagem} />
            </View>
            
            <View style={styles.agricultorInfo}>
                <Text style={[styles.nomeLoja, { color: colors.text }]}>{item.nome}</Text>
                <Text style={[styles.endereco, { color: colors.endereco }]}>{item.endereco} - {item.distancia}</Text>
            </View>
            <TouchableOpacity style={styles.bookmarkIcon}>
                <Text><Fontisto name="favorite" size={20} color={colors.title} style={styles.icon} /> </Text>{/* Ícone de salvar */}
            </TouchableOpacity>
        </TouchableOpacity>
    );

    const data = [
        require("../../../assets/images/banner_teste.png"), 
        require("../../../assets/images/banner_teste2.png"), 
        require("../../../assets/images/banner_teste.png")
    ];

    return (
            <>  

                <SafeAreaView
                    edges={["top"]}
                    style={{ backgroundColor: '#4D7E1B' }} 
                />

                <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["left", "right" ]}>
                    <View style={{ flex: 1 }}>
                        {/* 🔹 Header Fixo no Topo */}
                        <Header />

            
                        {/* 🔹 Conteúdo separado do Header */}
                        <ScrollView contentContainerStyle={{  padding: 20 }} showsVerticalScrollIndicator={false} bounces={false} >

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
                            <View style={styles.carouselContainer}>
                                <Carousel
                                    width={width * 0.85} // Largura dos itens
                                    height={height * 0.23} // Altura dos itens
                                    data={data}
                                    scrollAnimationDuration={500} // Duração da animação
                                    loop
                                    renderItem={({ item }) => (
                                        <Image
                                            source={item}
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

                            {/*  Produtos Sazonais */}
                            <Text style={[styles.sectionTitle, { marginBottom: height * 0.005, color: colors.title }]}>Produtos sazonais</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productScroll}>
                                {produtos.map((produto, index) => (
                                    <TouchableOpacity key={index} style={styles.productItem}>
                                        <Text style={[styles.productText, { color: colors.text }]}>{produto}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>

                            {/*  Agricultores por Perto */}
                            <Text style={[styles.sectionTitle, { textAlign: 'center', marginBottom: height * 0.01, color: colors.title }]}>Agricultores por perto</Text>
                                <FlatList
                                    data={agricultores}
                                    renderItem={renderAgricultor}
                                    keyExtractor={(item, index) => index.toString()}
                                    scrollEnabled={false} // Para não conflitar com ScrollView
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
    produtoImagem: { width: 40, height: 40, marginRight: 10 }
});