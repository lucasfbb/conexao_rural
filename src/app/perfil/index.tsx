import { View, Text, Image, TouchableOpacity, ScrollView, FlatList, Dimensions, StyleSheet } from "react-native";
import { router } from "expo-router";
import Header from '@/components/header'
import Card from "@/components/card"; 
import { AntDesign, Feather } from '@expo/vector-icons'

const { width, height } = Dimensions.get("window");

export default function PerfilHome() {

    const Cliente = Array(5).fill({
        nome: "Teste da Silva Junior",
        email: "teste@gmail.com",
        categoria: "Comprador",
        primeiroTelefone: "(21) 99999-9999",
        segundoTelefone: "(21) 99999-9988",
    });

    const enderecos = [
        { title: "Nome Endereço 1", subtitle: "Rua teste 134", details: ["Endereço", "000000-000", "bloco H"] },
        { title: "Nome Endereço 2", subtitle: "Rua teste 134", details: ["Endereço", "000000-000", "bloco H"] },
        { addNew: true }
    ];
    
    const pagamentos = [
        { title: "Cartão 1", subtitle: "Crédito", details: ["●●●● 9999"] },
        { title: "Cartão 2", subtitle: "Crédito", details: ["●●●● 9999"] },
        { addNew: true }
    ];

    const produtos = ["Tomate", "Alface", "Laranja", "Maçã", "Uva"];
    const ultimosPedidos = ["Tomate", "Alface", "Laranja", "Maçã", "Uva"];
    const agricultoresFavoritos = ["Tomate", "Alface", "Laranja", "Maçã", "Uva"];

    const renderItem = ({ item }: { item: any }) => (
        <Card title={item.title} subtitle={item.subtitle} details={item.details} isPayment={item.isPayment} />
    );

    return (
        <View style={styles.container}>
            <Header />

            <ScrollView contentContainerStyle={{  padding: 20 }} showsVerticalScrollIndicator={true}>
                
                {/* 🔹 Perfil do Cliente */}
                <View style={styles.profile}>
                    <View style={styles.profileContent}>
                        <View style={styles.profileInfo}>
                            <Text style={styles.informacao}>{Cliente[0].categoria}</Text>
                            <Text style={styles.label}>Categoria</Text>
                            <Image 
                                source={require("../../../assets/images/perfil-de-usuario.png")}
                                style={styles.profileImage}
                            />
                        </View>
                        <View>
                            <Text style={styles.informacao}>{Cliente[0].nome}</Text>
                            <Text style={styles.label}>Nome Completo</Text>
                            <Text style={styles.informacao}>{Cliente[0].email}</Text>
                            <Text style={styles.label}>E-mail de contato</Text>
                            <Text style={styles.informacao}>{Cliente[0].primeiroTelefone}</Text>
                            <Text style={styles.label}>Primeiro Telefone</Text>
                            <Text style={styles.informacao}>{Cliente[0].segundoTelefone}</Text>
                            <Text style={styles.label}>Segundo telefone</Text>
                        </View>
                        <TouchableOpacity style={styles.editIcon}>
                            <AntDesign name="edit" size={16} color={'black'} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* 🔹 Endereços */}
                <Text style={styles.sectionTitle}>Endereços</Text>
                <FlatList
                    data={enderecos} 
                    renderItem={({ item }) =>
                        item.addNew ? (
                            <TouchableOpacity style={styles.addCard}>
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
                <Text style={styles.sectionTitle}>Pagamentos</Text>
                <FlatList
                    data={pagamentos} 
                    renderItem={({ item }) =>
                        item.addNew ? (
                            <TouchableOpacity style={styles.addCard}>
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
                <Text style={styles.sectionTitle}>Produtos favoritos</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productScroll}>
                    {produtos.map((produto, index) => (
                        <TouchableOpacity key={index} style={styles.productItem}>
                            <Text style={styles.productText}>{produto}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
                
                {/* 🔹 Últimos pedidos */}
                <Text style={[styles.sectionTitle, { marginBottom: height * 0.005, color: '#4D7E1B' }]}>Últimos pedidos</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productScroll}>
                    {ultimosPedidos.map((produto, index) => (
                        <TouchableOpacity key={index} style={styles.productItem}>
                            <Text style={styles.productText}>{produto}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
                
                {/* 🔹 Agricultores favoritos */}
                <Text style={[styles.sectionTitle, { marginBottom: height * 0.005, color: '#4D7E1B' }]}>Agricultores favoritos</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productScroll}>
                    {agricultoresFavoritos.map((produto, index) => (
                        <TouchableOpacity key={index} style={styles.productItem}>
                            <Text style={styles.productText}>{produto}</Text>
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
        borderColor: '#4D7E1B', 
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
