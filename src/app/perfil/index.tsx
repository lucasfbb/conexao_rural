import { View, Text, Image, TouchableOpacity, ScrollView, FlatList, Dimensions, StyleSheet } from "react-native";
import { router } from "expo-router";
import Header from '@/components/header'
import Card from "@/components/card"; 
import { AntDesign, Feather } from '@expo/vector-icons'
import { useState } from "react";

import ModalEndereco from '@/components/modais/modalEndereco'
import ModalPagamento from '@/components/modais/modalPagamento'
import ModalEditarPerfil from '@/components/modais/modalEditarPerfil'
import { Item } from '@/types/types'
import { useTema } from "@/contexts/ThemeContext";

const { width, height } = Dimensions.get("window");

export default function PerfilHome() {

    const [modalEnderecoVisible, setModalEnderecoVisible] = useState(false);
    const [modalPagamentoVisible, setModalPagamentoVisible] = useState(false);
    const [modalEditarPerfilVisible, setModalEditarPerfilVisible] = useState(false);

    const { colors, isNightMode } = useTema()

    const [cliente, setCliente] = useState({
        nome: "Teste da Silva Junior",
        email: "teste@gmail.com",
        categoria: "Comprador",
        primeiroTelefone: "(21) 99999-9999",
        segundoTelefone: "(21) 99999-9988",
    });

    const handleSavePerfil = (dadosAtualizados: { nome: string, email: string, categoria: string, primeiroTelefone: string, segundoTelefone: string}) => {
        setCliente(prev => ({ ...prev, ...dadosAtualizados }));
        setModalEditarPerfilVisible(false);
    };

    const [enderecos, setEnderecos] = useState([
        { title: "Nome Endereço 1", subtitle: "Rua teste 134", details: ["Endereço", "000000-000", "bloco H"] },
        { title: "Nome Endereço 2", subtitle: "Rua teste 134", details: ["Endereço", "000000-000", "bloco H"] },
        { addNew: true }
    ]);
    
    const handleSaveEndereco = (novoEndereco: { title: string; subtitle: string; details: string[] }) => {
        // Remove o último item (addNew), adiciona o novo endereço, e depois adiciona de novo o addNew
        setEnderecos(prev => [...prev.slice(0, -1), novoEndereco, { addNew: true }]);
        setModalEnderecoVisible(false);
    };

    const [pagamentos, setPagamentos] = useState([
        { title: "Cartão 1", subtitle: "Crédito", details: ["●●●● 9999"] },
        { title: "Cartão 2", subtitle: "Crédito", details: ["●●●● 9999"] },
        { addNew: true }
    ]);

    const handleSavePagamento = (novoPagamento: { title: string; subtitle: string; details: string[] }) => {
        // Remove o último item (addNew), adiciona o novo pagamento, e depois adiciona de novo o addNew
        setPagamentos(prev => [...prev.slice(0, -1), novoPagamento, { addNew: true }]);
        setModalPagamentoVisible(false);
    };

    const produtos = ["Tomate", "Alface", "Laranja", "Maçã", "Uva"];
    const ultimosPedidos = ["Tomate", "Alface", "Laranja", "Maçã", "Uva"];
    const agricultoresFavoritos = ["Tomate", "Alface", "Laranja", "Maçã", "Uva"];

    const renderItem = ({ item }: { item: any }) => (
        <Card title={item.title} subtitle={item.subtitle} details={item.details} isPayment={item.isPayment} />
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }] }>
            <Header />

            {/* 🔹 Modal de Endereço */}
            <ModalEndereco
                visible={modalEnderecoVisible}
                onClose={() => setModalEnderecoVisible(false)}
                onSave={handleSaveEndereco}
            />

            {/* 🔹 Modal de Pagamento */}
            <ModalPagamento
                visible={modalPagamentoVisible}
                onClose={() => setModalPagamentoVisible(false)}
                onSave={handleSavePagamento}
            />
            
            {/* 🔹 Modal de Editar perfil do usuuário */}
            <ModalEditarPerfil
                visible={modalEditarPerfilVisible}
                onClose={() => setModalEditarPerfilVisible(false)}
                onSave={handleSavePerfil}
                dadosIniciais={cliente}
            />

            <ScrollView contentContainerStyle={{  padding: 20 }} showsVerticalScrollIndicator={true}>
                
                {/* 🔹 Perfil do Cliente */}
                <View style={[styles.profile, { backgroundColor: colors.profileCard, borderColor: colors.borderCard }]}>
                    <View style={styles.profileContent}>
                        <View style={styles.profileInfo}>
                            <Text style={[styles.informacao, { color: colors.text }]}>{cliente.categoria}</Text>
                            <Text style={[styles.label, { color: colors.text }]}>Categoria</Text>
                            
                            { isNightMode ? 
                                <Image 
                                    source={require("../../../assets/images/perfil-de-usuario-branco.png")}
                                    style={styles.profileImage}
                                />
                            :
                                <Image 
                                    source={require("../../../assets/images/perfil-de-usuario.png")}
                                    style={styles.profileImage}
                                />
                            }
                            
                        </View>
                        <View>
                            <Text style={[styles.informacao, { color: colors.text }]}>{cliente.nome}</Text>
                            <Text style={[styles.label, { color: colors.text }]}>Nome Completo</Text>
                            <Text style={[styles.informacao, { color: colors.text }]}>{cliente.email}</Text>
                            <Text style={[styles.label, { color: colors.text }]}>E-mail de contato</Text>
                            <Text style={[styles.informacao, { color: colors.text }]}>{cliente.primeiroTelefone}</Text>
                            <Text style={[styles.label, { color: colors.text }]}>Primeiro Telefone</Text>
                            <Text style={[styles.informacao, { color: colors.text }]}>{cliente.segundoTelefone}</Text>
                            <Text style={[styles.label, { color: colors.text }]}>Segundo telefone</Text>
                        </View>
                        <TouchableOpacity style={styles.editIcon} onPress={() => setModalEditarPerfilVisible(true)}>
                            <AntDesign name="edit" size={16} color={'black'} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* 🔹 Endereços */}
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Endereços</Text>
                <FlatList
                    data={enderecos} 
                    renderItem={({ item }) =>
                        item.addNew ? (
                            <TouchableOpacity style={styles.addCard} onPress={() => setModalEnderecoVisible(true)}>
                                <Feather name="plus" size={30} color="green" />
                            </TouchableOpacity>
                        ) : (renderItem({ item }))
                    }
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={3}
                    scrollEnabled={false}
                    columnWrapperStyle={{ justifyContent: "space-between" }}
                />

                {/* 🔹 Pagamentos */}
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Pagamentos</Text>
                <FlatList
                    data={pagamentos} 
                    renderItem={({ item }) =>
                        item.addNew ? (
                            <TouchableOpacity style={styles.addCard} onPress={() => setModalPagamentoVisible(true)}>
                                <Feather name="plus" size={30} color="green" />
                            </TouchableOpacity>
                        ) : (renderItem({ item }))
                    }
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={3}
                    scrollEnabled={false}
                    columnWrapperStyle={{ justifyContent: "space-between" }}
                />

                {/* 🔹 Produtos Favoritos */}
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Produtos favoritos</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productScroll}>
                    {produtos.map((produto, index) => (
                        <TouchableOpacity key={index} style={[styles.productItem, { backgroundColor: colors.profileCard, borderColor: colors.borderCard }]}>
                            <Text style={[styles.productText, { color: colors.text }]}>{produto}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
                
                {/* 🔹 Últimos pedidos */}
                <Text style={[styles.sectionTitle, { marginBottom: height * 0.005, color: colors.text }]}>Últimos pedidos</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productScroll}>
                    {ultimosPedidos.map((produto, index) => (
                        <TouchableOpacity key={index} style={[styles.productItem, { backgroundColor: colors.profileCard, borderColor: colors.borderCard }]}>
                            <Text style={[styles.productText, { color: colors.text }]}>{produto}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
                
                {/* 🔹 Agricultores favoritos */}
                <Text style={[styles.sectionTitle, { marginBottom: height * 0.005, color: colors.text }]}>Agricultores favoritos</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productScroll}>
                    {agricultoresFavoritos.map((produto, index) => (
                        <TouchableOpacity key={index} style={[styles.productItem, { backgroundColor: colors.profileCard, borderColor: colors.borderCard }]}>
                            <Text style={[styles.productText, { color: colors.text }]}>{produto}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white' },
    
    profile: {
        alignItems: "center", 
        marginVertical: 15, 
        borderWidth: 1, 
        justifyContent: "center", 
        borderRadius: 10,
        padding: 10
    },
    
    profileContent: { flexDirection: 'row', paddingBottom: 10, width: '100%', justifyContent: 'space-around' },
    
    profileInfo: { justifyContent: 'flex-start', marginRight: 15, marginLeft: 20 },

    profileImage: { height: 80, width: 80, marginTop: height * 0.03 },

    editIcon: { marginTop: height * 0.006 },

    informacao: { borderBottomWidth: 1, borderBottomColor: '#4D7E1B', padding: 5 },

    label: { fontSize: 12, marginBottom: 8 },

    sectionTitle: { fontSize: 18, fontWeight: "bold", fontStyle: "italic", marginTop: height * 0.02, marginLeft: 7, color: '#4D7E1B' },

    addCard: {
        flex: 1,
        borderWidth: 1.5,
        borderColor: "green",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        width: "48%",
        minHeight: 120,
        margin: width * 0.013,
    },

    productScroll: { flexDirection: "row", marginVertical: 10 },

    productItem: { padding: 10, borderWidth: 1, borderRadius: 10, marginHorizontal: 5, borderColor: '#4D7E1B' },

    productText: { fontSize: 14 },
});
