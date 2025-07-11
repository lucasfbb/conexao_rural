import { View, Text, Image, TouchableOpacity, ScrollView, FlatList, Dimensions, StyleSheet, Alert } from "react-native";
import { router } from "expo-router";
import Header from '@/components/header'
import Card from "@/components/card"; 
import { AntDesign, Feather } from '@expo/vector-icons'
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import ModalEndereco from '@/components/modais/enderecos/modalEndereco'
import ModalPagamento from '@/components/modais/pagamentos/modalPagamento'
import ModalEditarPerfil from '@/components/modais/perfil/modalEditarPerfil'
import ModalEditarEndereco from "@/components/modais/enderecos/modalEditarEndereco";
import { EnderecoItem, Item } from '@/types/types'
import { useTema } from "@/contexts/ThemeContext";
import { api } from "../../../services/api";

const { width, height } = Dimensions.get("window");

export default function PerfilHome() {

    const [modalEnderecoVisible, setModalEnderecoVisible] = useState(false);
    const [modalPagamentoVisible, setModalPagamentoVisible] = useState(false);
    const [modalEditarPerfilVisible, setModalEditarPerfilVisible] = useState(false);
    const [modalEditarEnderecoVisible, setModalEditarEnderecoVisible] = useState(false);
    const [enderecoSelecionado, setEnderecoSelecionado] = useState<any>(null);

    const { colors, isNightMode } = useTema()

    const [cliente, setCliente] = useState({
        nome: "",
        email: "",
        categoria: "",
        primeiroTelefone: "",
        segundoTelefone: "",
    });

    const [enderecos, setEnderecos] = useState<EnderecoItem[]>([{ addNew: true }]);

    useEffect(() => {
        const fetchPerfil = async () => {
            try {
                const response = await api.get("/usuarios/perfil/me");
                const dados = response.data;

                setCliente({
                    nome: dados.nome,
                    email: dados.email,
                    categoria: dados.e_vendedor ? "Vendedor" : "Comprador",
                    primeiroTelefone: dados.telefone_1 || "Não informado",
                    segundoTelefone: dados.telefone_2 || "Não informado",
                });

                // Buscar endereços reais do usuário
                const resEnderecos = await api.get("/usuarios/perfil/enderecos");
                // console.log("Endereços do usuário:", resEnderecos.data);
                const enderecosFormatados = resEnderecos.data.map((e: any) => ({
                    id: e.id,
                    title: e.titulo && e.titulo.trim() !== "" ? e.titulo : `Endereço ${e.id}`,
                    subtitle: `${e.rua}`,
                    details: [
                        e.cep,
                        [e.estado, e.cidade].filter(Boolean).join(" / "),
                        e.complemento || ""
                    ].filter(item => item && item.trim() !== ""),
                }));

                const somenteEnderecos = enderecosFormatados.filter((e: any) => 'id' in e);
                const ordenados = [...somenteEnderecos].sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
                setEnderecos([...ordenados, { addNew: true }]);

            } catch (error) {
                console.error("Erro ao buscar perfil:", error);
            }
        };
        
        setEnderecoSelecionado(null); // Reseta o endereço selecionado ao carregar o perfil
        fetchPerfil();
    }, []);


    const handleSavePerfil = async (dadosAtualizados: {
        nome: string;
        email: string;
        // categoria: string;
        primeiroTelefone: string;
        segundoTelefone: string;
    }) => {
        try {
            // console.log("Dados atualizados:", dadosAtualizados);
            await api.patch("/usuarios/perfil/me", {
                nome: dadosAtualizados.nome,
                email: dadosAtualizados.email,
                telefone_1: dadosAtualizados.primeiroTelefone,
                telefone_2: dadosAtualizados.segundoTelefone.trim() === "" ? undefined : dadosAtualizados.segundoTelefone
            });

            setCliente(prev => ({ ...prev, ...dadosAtualizados }));
            setModalEditarPerfilVisible(false);
        } catch (error) {
            console.error("Erro ao atualizar perfil:", error);
        }
    };
    
    const handleSaveEndereco = async (novoEndereco: {
        cep: string;
        estado: string;
        cidade: string;
        rua: string;
        complemento?: string;
        referencia?: string;
        titulo?: string;
    }) => {
        try {
            const response = await api.post("/usuarios/perfil/enderecos", novoEndereco);
            const enderecoSalvo = response.data;

            const novo = {
                id: enderecoSalvo.id,
                title: enderecoSalvo.titulo?.trim() || `Endereço ${enderecoSalvo.id}`,
                subtitle: `${enderecoSalvo.rua}`,
                details: [
                    enderecoSalvo.cep,
                    [enderecoSalvo.estado, enderecoSalvo.cidade].filter(Boolean).join(" / "),
                    enderecoSalvo.complemento || ""
                ].filter(item => item && item.trim() !== ""),
            };

            setEnderecos(prev => {
                const enderecosSemAddNew = prev.filter(e => !('addNew' in e));
                const atualizados = [...enderecosSemAddNew, novo];

                const enderecosComId = atualizados.filter((e): e is EnderecoItem & { id: number } => 'id' in e && typeof e.id === 'number');
                const ordenados = enderecosComId.sort((a, b) => {
                    return (a.id ?? 0) - (b.id ?? 0);
                });

                return [...ordenados, { addNew: true }];
            });
            setModalEnderecoVisible(false);
        } catch (err) {
            console.error("Erro ao salvar endereço:", err);
        }
    };

    const handleUpdateEndereco = async (dadosAtualizados: {
        id: number;
        cep: string;
        estado: string;
        cidade: string;
        rua: string;
        complemento?: string;
        referencia?: string;
        titulo?: string;
        }) => {
        try {
            const response = await api.patch(`/usuarios/perfil/enderecos/${dadosAtualizados.id}`, dadosAtualizados);
            const enderecoAtualizado = response.data;

            const formatado = {
            id: enderecoAtualizado.id,
            title: enderecoAtualizado.titulo?.trim() || `Endereço ${enderecoAtualizado.id}`,
            subtitle: `${enderecoAtualizado.rua}`,
            details: [
                enderecoAtualizado.cep,
                [enderecoAtualizado.estado, enderecoAtualizado.cidade].filter(Boolean).join(" / "),
                enderecoAtualizado.complemento || ""
            ].filter((item) => item && item.trim() !== ""),
            };

            setEnderecos(prev => {
                const enderecosAtualizados = [
                    ...prev.filter(e => 'id' in e && e.id !== enderecoAtualizado.id),
                    formatado
                ];

                const ordenados = enderecosAtualizados
                    .filter((e): e is EnderecoItem & { id: number } => 'id' in e && typeof e.id === 'number')
                    .sort((a, b) => a.id - b.id);

                return [...ordenados, { addNew: true }];
            });

            setModalEditarEnderecoVisible(false);
        } catch (error) {
            console.error("Erro ao editar endereço:", error);
        }
    };

    const handleDeleteEndereco = async (id: number) => {
        try {
            await api.delete(`/usuarios/perfil/enderecos/${id}`);

            setEnderecos(prev => {
                const enderecosAtuais = prev.filter(e => 'id' in e && e.id !== id);
                const ordenados = enderecosAtuais
                    .filter((e): e is EnderecoItem & { id: number } => 'id' in e && typeof e.id === 'number')
                    .sort((a, b) => a.id - b.id);

                return [...ordenados, { addNew: true }];
            });

            setModalEditarEnderecoVisible(false);
        } catch (error) {
            console.error("Erro ao excluir endereço:", error);
        }
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
        <>
            <SafeAreaView
                edges={["top"]}
                style={{ backgroundColor: '#4D7E1B' }} 
            />

            <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["left", "right"]}>
                <View style={{ flex: 1 }}>

                    <Header />

                    {/* 🔹 Modal de Endereço */}
                    <ModalEndereco
                        visible={modalEnderecoVisible}
                        modoEdicao={!!enderecoSelecionado}
                        onClose={() => setModalEnderecoVisible(false)}
                        onSave={handleSaveEndereco}
                    />

                    {enderecoSelecionado && (
                        <ModalEditarEndereco
                            visible={modalEditarEnderecoVisible}
                            dadosIniciais={enderecoSelecionado}
                            onClose={() => setModalEditarEnderecoVisible(false)}
                            onSave={(dadosAtualizados) => {
                                if (enderecoSelecionado?.id) {
                                    handleUpdateEndereco({ ...dadosAtualizados, id: enderecoSelecionado.id });
                                }
                            }}
                            onExcluir={() => {
                            if (enderecoSelecionado?.id) {
                                Alert.alert(
                                "Confirmar exclusão",
                                "Tem certeza que deseja excluir este endereço?",
                                [
                                    { text: "Cancelar", style: "cancel" },
                                    {
                                    text: "Excluir",
                                    style: "destructive",
                                    onPress: () => handleDeleteEndereco(enderecoSelecionado.id)
                                    }
                                ]
                                );
                            }
                            }}
                        />
                    )} 

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

                    <ScrollView contentContainerStyle={{  padding: 20, backgroundColor: colors.background }} showsVerticalScrollIndicator={true} bounces={false} >
                        
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
                                'addNew' in item ? (
                                    <TouchableOpacity style={styles.addCard} onPress={() => setModalEnderecoVisible(true)}>
                                    <Feather name="plus" size={30} color="green" />
                                    </TouchableOpacity>
                                ) : (
                                    <Card
                                        title={item.title}
                                        subtitle={item.subtitle}
                                        details={item.details}
                                        id={item.id}
                                        isPayment={false}
                                        onPress={() => {
                                            setEnderecoSelecionado({
                                                id: item.id,
                                                cep: item.details?.[0] || "",
                                                estado: item.details?.[1]?.split(" / ")?.[0] || "",
                                                cidade: item.details?.[1]?.split(" / ")?.[1] || "",
                                                rua: item.subtitle || "",
                                                complemento: item.details?.[2] || "",
                                                referencia: "", // Se tiver referência, adicione no back ou ajuste aqui
                                                titulo: item.title || ""
                                            });
                                            setModalEditarEnderecoVisible(true); // novo state que você precisa controlar
                                        }}
                                    />
                                )
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
            </SafeAreaView>
        </>
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
