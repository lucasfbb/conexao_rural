import React, { useState } from 'react'
import { View, Text, StyleSheet, Alert, Image, TouchableOpacity, ScrollView, TextInput, FlatList, useWindowDimensions } from "react-native"
import { DrawerToggleButton } from '@react-navigation/drawer'
import Carousel from 'react-native-reanimated-carousel';
import { Feather, Ionicons, Fontisto } from "@expo/vector-icons";

import { router } from 'expo-router'

import Button from "@/components/button"
import Input from "@/components/input"
import Header from '@/components/header'

export default function Home(){
    const { width, height } = useWindowDimensions();

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
                <Text style={styles.nomeLoja}>{item.nome}</Text>
                <Text style={styles.endereco}>{item.endereco} - {item.distancia}</Text>
            </View>
            <TouchableOpacity style={styles.bookmarkIcon}>
                <Text><Fontisto name="favorite" size={20} color={"#4D7E1B"} style={styles.icon} /> </Text>{/* Ícone de salvar */}
            </TouchableOpacity>
        </TouchableOpacity>
    );

    const data = ["Aviso 1", "Promoção 2", "Anúncio 3"];

    return (
            <View style={styles.container}>
                {/* 🔹 Header Fixo no Topo */}
                <Header />
    
                {/* 🔹 Conteúdo separado do Header */}
                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

                    {/*  Barra de Pesquisa e Localização */}
                    <View style={styles.searchContainer}>
                        <Feather name="search" size={20} color={"#4D7E1B"} style={styles.icon} />
                        <TextInput style={styles.searchInput} placeholder='O que você procura hoje ?'/>
                        <TouchableOpacity style={[styles.locationButton, { marginTop: height * 0.01 }]}>
                            <Ionicons name="location-outline" size={20} color={"#4D7E1B"} />
                            <Text style={styles.locationText}>Minha Localização</Text>
                        </TouchableOpacity>
                    </View>

                    {/*  Carrossel de Avisos/Promoções */}
                    <View style={styles.carouselContainer}>
                        <Carousel
                            width={width * 0.8} // Largura dos itens
                            height={150} // Altura dos itens
                            data={data}
                            scrollAnimationDuration={500} // Duração da animação
                            loop
                            renderItem={({ item }) => (
                                <View style={styles.card}>
                                    <Text style={styles.text}>{item}</Text>
                                </View>
                            )}
                        />
                    </View>

                    {/*  Produtos Sazonais */}
                    <Text style={[styles.sectionTitle, { marginBottom: height * 0.005, color: '#4D7E1B' }]}>Produtos sazonais</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productScroll}>
                        {produtos.map((produto, index) => (
                            <TouchableOpacity key={index} style={styles.productItem}>
                                <Text style={styles.productText}>{produto}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/*  Agricultores por Perto */}
                    <Text style={[styles.sectionTitle, { textAlign: 'center', marginBottom: height * 0.01, color: '#4D7E1B' }]}>Agricultores por perto</Text>
                        <FlatList
                            data={agricultores}
                            renderItem={renderAgricultor}
                            keyExtractor={(item, index) => index.toString()}
                            scrollEnabled={false} // Para não conflitar com ScrollView
                        />
                </ScrollView>
            </View>
        );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white' },
    content: { flex: 1, padding: 15 },
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
    endereco: { fontSize: 12, color: "#777" },
    bookmarkIcon: { padding: 5 },
    card: { width: "100%", height: "100%", backgroundColor: "#ddd", justifyContent: "center", alignItems: "center", borderRadius: 10 },
    text: { fontSize: 18, fontWeight: "bold" },
    icon: { marginLeft: 10 },
    produtoImagem: { width: 40, height: 40, marginRight: 10 }
});