import { View, Text, Image, TouchableOpacity, ScrollView, FlatList, Dimensions, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { router, useRouter } from "expo-router";
import Header from '@/components/header'
import Card from "@/components/card"; 
import * as ImagePicker from 'expo-image-picker';
import { AntDesign, Feather } from '@expo/vector-icons'
import { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

import ModalEndereco from '@/components/modais/enderecos/modalEndereco'
import ModalPagamento from '@/components/modais/pagamentos/modalPagamento'
import ModalEditarPerfil from '@/components/modais/perfil/modalEditarPerfil'
import ModalEditarEndereco from "@/components/modais/enderecos/modalEditarEndereco";
import { EnderecoItem, Item } from '@/types/types'
import { useTema } from "@/contexts/ThemeContext";
import { api, baseURL } from "../../../services/api";
import ModalEditarPagamento from "@/components/modais/pagamentos/modalEditarPagamento";
import ModalDetalhesProduto from "@/components/modais/produtos/modalDetalhesProduto";

const { width, height } = Dimensions.get("window");

export default function PerfilHome() {
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    const base = baseURL.slice(0, -1);

    const [modalEnderecoVisible, setModalEnderecoVisible] = useState(false);
    const [modalPagamentoVisible, setModalPagamentoVisible] = useState(false);
    const [modalEditarPerfilVisible, setModalEditarPerfilVisible] = useState(false);
    const [modalEditarEnderecoVisible, setModalEditarEnderecoVisible] = useState(false);
    const [enderecoSelecionado, setEnderecoSelecionado] = useState<any>(null);
    const [modalEditarPagamentoVisible, setModalEditarPagamentoVisible] = useState(false);
    const [pagamentoSelecionado, setPagamentoSelecionado] = useState<any>(null);
    const [pagamentos, setPagamentos] = useState<any[]>([{ addNew: true }]);
    const [enderecos, setEnderecos] = useState<EnderecoItem[]>([{ addNew: true }]);
    const [produtoSelecionado, setProdutoSelecionado] = useState<any | null>(null);
    const [modalProdutoVisivel, setModalProdutoVisivel] = useState(false);

    const [produtosFavoritos, setProdutosFavoritos] = useState<any[]>([]);
    const [agricultoresFavoritos, setAgricultoresFavoritos] = useState<any[]>([]);
    const [ultimosPedidos, setUltimosPedidos] = useState<any[]>([]);

    const [imagemUsuario, setImagemUsuario] = useState<string | null>(null);

    const { colors, isNightMode } = useTema()

    const [usuario, setUsuario] = useState({
        nome: "",
        email: "",
        categoria: "",
        primeiroTelefone: "",
        segundoTelefone: "",
        foto_perfil: "",
    });

    const escolherImagemUsuario = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.8,
        });

        if (!result.canceled) {
            const asset = result.assets[0];
            const localUri = asset.uri;
            const filename = localUri.split('/').pop() || "foto.jpg";
            const match = /\.(\w+)$/.exec(filename.toLowerCase());
            const ext = match?.[1];

            // Definir tipo MIME corretamente
            let mimeType = "image/jpeg"; // fallback
            if (ext === "png") mimeType = "image/png";
            else if (ext === "jpg" || ext === "jpeg") mimeType = "image/jpeg";
            else if (ext === "webp") mimeType = "image/webp";

            const formData = new FormData();
            formData.append("file", {
                uri: localUri,
                name: filename,
                type: mimeType,
            } as any);

            try {
                const response = await api.post("usuarios/perfil/foto/upload", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                setImagemUsuario(response.data.foto);
                Alert.alert("Sucesso", "Foto de perfil atualizada com sucesso!");
                } catch (err: any) {
                    console.error("Erro no upload:", JSON.stringify(err, null, 2));

                    if (err.response) {
                        // Requisição foi feita e o servidor respondeu com um status diferente de 2xx
                        console.log("❗Erro de resposta:", err.response.data);
                        console.log("Status:", err.response.status);
                        console.log("Headers:", err.response.headers);
                        Alert.alert("Erro", `Erro ${err.response.status}: ${err.response.data.detail || 'Servidor retornou erro.'}`);
                    } else if (err.request) {
                        // Requisição foi feita mas não houve resposta
                        console.log("❗Erro de requisição:", err.request);
                        Alert.alert("Erro", "O servidor não respondeu. Verifique sua conexão ou se o backend está online.");
                    } else {
                        // Algo deu errado ao montar a requisição
                        console.log("❗Erro desconhecido:", err.message);
                        Alert.alert("Erro", `Erro inesperado: ${err.message}`);
                    }
                }
        }
    };

    useFocusEffect(
        useCallback(() => {
            const fetchPerfil = async () => {
                try {
                    const response = await api.get("/usuarios/perfil/me");
                    const dados = response.data;
                    // console.log("Dados do perfil:", dados);

                    setUsuario({
                        nome: dados.nome,
                        email: dados.email,
                        categoria: dados.e_vendedor ? "Vendedor" : "Comprador",
                        primeiroTelefone: dados.telefone_1 || "Não informado",
                        segundoTelefone: dados.telefone_2 || "Não informado",
                        foto_perfil: dados.foto_perfil || "",
                    });

                    setImagemUsuario(dados.foto_perfil || null);

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
                    
                    setLoading(true); // loading para dados que podem mudar na tela

                    // Buscar agricultores favoritos do usuário
                    const resProdutoresFavoritos = await api.get("/usuarios/perfil/produtores-favoritos");
                    setAgricultoresFavoritos(resProdutoresFavoritos.data);

                    // Buscar produtos favoritos do usuário
                    const resProdutosFavoritos = await api.get(`/favoritos/produto?id_usuario=${dados.id}`);
                    setProdutosFavoritos(resProdutosFavoritos.data);

                    const resUltimosPedidos = await api.get(`/usuarios/perfil/ultimos-pedidos?usuario_id=${dados.id}`);
                    // console.log("Últimos pedidos:", resUltimosPedidos.data);
                    setUltimosPedidos(resUltimosPedidos.data);
                    
                    // TODO: outros dados

                    setLoading(false); // fechamento do laoding após buscar os dados

                } catch (error) {
                    console.error("Erro ao buscar perfil:", error);
                } finally {
                    setLoading(false);
                }
                
            };
            
            setEnderecoSelecionado(null); // Reseta o endereço selecionado ao carregar o perfil
            fetchPerfil();
        }, [])
    );


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

            setUsuario(prev => ({ ...prev, ...dadosAtualizados }));
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

    const handleDeletePagamento = async (id: number) => {
        Alert.alert(
            "Confirmar exclusão",
            "Tem certeza que deseja excluir esta forma de pagamento?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await api.delete(`usuarios/perfil/pagamentos/${id}`);

                            setPagamentos(prev => {
                                const atualizados = prev.filter(p => 'id' in p && p.id !== id);
                                const ordenados = atualizados
                                    .filter(p => 'id' in p && typeof p.id === 'number')
                                    .sort((a, b) => a.id - b.id);

                                return [...ordenados, { addNew: true }];
                            });

                            setModalEditarPagamentoVisible(false);
                        } catch (error) {
                            console.error("Erro ao remover pagamento:", error);
                        }
                    }
                }
            ]
        );
    };

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
                    
                    {/* 🔹 Modal de Editar perfil do usuuário */}
                    <ModalEditarPerfil
                        visible={modalEditarPerfilVisible}
                        onClose={() => setModalEditarPerfilVisible(false)}
                        onSave={handleSavePerfil}
                        dadosIniciais={usuario}
                    />

                    {/* 🔹 Modal de detalhes do produto */}
                    {modalProdutoVisivel && (
                        <ModalDetalhesProduto
                            visible={modalProdutoVisivel}
                            onClose={() => setModalProdutoVisivel(false)}
                            produto={produtoSelecionado}
                        />
                    )}

                    <ScrollView contentContainerStyle={{  padding: 20, backgroundColor: colors.background }} showsVerticalScrollIndicator={true} bounces={false} >
                        
                        {/* 🔹 Perfil do Cliente */}
                        <View style={[styles.profile, { backgroundColor: colors.profileCard, borderColor: colors.borderCard }]}>
                            <View style={styles.profileContent}>
                                <View style={styles.profileInfo}>
                                    <Text style={[styles.informacao, { color: colors.text }]}>{usuario.categoria}</Text>
                                    <Text style={[styles.label, { color: colors.text }]}>Categoria</Text>
                                    
                                    {/* 
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
                                    */}

                                <TouchableOpacity onPress={escolherImagemUsuario}>
                                    {imagemUsuario ? (
                                        <Image 
                                            source={{ uri: `${base}${imagemUsuario}` }}
                                            style={styles.profilePhoto}
                                            resizeMode="cover"
                                        />
                                    ) : (
                                        <Image 
                                            source={
                                                isNightMode 
                                                ? require("../../../assets/images/perfil-de-usuario-branco.png")
                                                : require("../../../assets/images/perfil-de-usuario.png")
                                            }
                                            style={styles.profilePhoto}
                                            resizeMode="contain"
                                        />
                                    )}
                                </TouchableOpacity>
                                    
                                </View>
                                <View>
                                    <Text style={[styles.informacao, { color: colors.text }]}>{usuario.nome}</Text>
                                    <Text style={[styles.label, { color: colors.text }]}>Nome Completo</Text>
                                    <Text style={[styles.informacao, { color: colors.text }]}>{usuario.email}</Text>
                                    <Text style={[styles.label, { color: colors.text }]}>E-mail de contato</Text>
                                    <Text style={[styles.informacao, { color: colors.text }]}>{usuario.primeiroTelefone}</Text>
                                    <Text style={[styles.label, { color: colors.text }]}>Primeiro Telefone</Text>
                                    <Text style={[styles.informacao, { color: colors.text }]}>{usuario.segundoTelefone}</Text>
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

                        {/* 🔹 Produtos Favoritos */}
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Produtos favoritos</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productScroll}>
                            {loading ? (
                                <View style={{ marginLeft: 10, paddingVertical: 10 }}>
                                <ActivityIndicator size="small" color="#4D7E1B" />
                                {/* <Text style={{ color: colors.text, marginTop: 5 }}>Carregando...</Text> */}
                                </View>
                            ) : produtosFavoritos.length === 0 ? (
                                <Text style={[styles.productText, { marginLeft: 10, color: colors.text }]}>
                                    Você ainda não adicionou nenhum produto aos favoritos.
                                </Text>
                            ) : (
                                produtosFavoritos.map((produto, index) => (
                                <TouchableOpacity
                                    key={produto.id || index}
                                    style={[styles.productItem, { backgroundColor: colors.profileCard, borderColor: colors.borderCard, padding: 10 }]}
                                    onPress={() => {
                                        setProdutoSelecionado({
                                            ...produto,
                                            preco: produto.preco_promocional
                                            ? `R$ ${Number(produto.preco_promocional).toFixed(2)}`
                                            : `R$ ${Number(produto.preco).toFixed(2)}`
                                        });
                                        setModalProdutoVisivel(true);
                                    }}
                                >
                                    <Text style={[styles.productText, { color: colors.text, fontWeight: "bold" }]}>
                                        {produto.nome}
                                    </Text>
                                    <Text style={[styles.productText, { color:'gray', fontSize: 12 }]}>
                                        {produto.produtor?.nome || "Produtor desconhecido"}
                                    </Text>
                                </TouchableOpacity>
                                ))
                            )}
                        </ScrollView>
                        
                        {/* 🔹 Últimos pedidos */}
                        <Text style={[styles.sectionTitle, { marginBottom: height * 0.005, color: colors.text }]}>Últimos pedidos</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productScroll}>
                            {ultimosPedidos.length === 0 ? (
                                <Text style={[styles.productText, { marginLeft: 10, color: colors.text }]}>
                                    Você ainda não fez nenhum pedido.
                                </Text>
                            ) : (
                                ultimosPedidos.map((pedido, index) => (
                                    <TouchableOpacity
                                    key={pedido.id || index}
                                    style={[styles.productItem, { backgroundColor: colors.profileCard, borderColor: colors.borderCard }]}
                                    onPress={() => {
                                        // Exibir detalhes do pedido? Navegar para tela de pedido?
                                    }}
                                    >
                                        <Text style={[styles.productText, { color: colors.text }]}>
                                            {pedido.produto?.nome || "Produto"} - {pedido.quantidade}x
                                        </Text>
                                        <Text style={[styles.productText, { fontSize: 12, color: "gray" }]}>
                                            {new Date(pedido.momento_compra).toLocaleDateString("pt-BR")}
                                        </Text>
                                    </TouchableOpacity>
                                ))
                            )}
                        </ScrollView>
                        
                        {/* 🔹 Agricultores favoritos */}
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Agricultores favoritos</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productScroll}>
                        {loading ? (
                            <View style={{ marginLeft: 10, paddingVertical: 6 }}>
                                <ActivityIndicator size="small" color="#4D7E1B" />
                                {/* <Text style={{ color: colors.text, marginTop: 5 }}>Carregando favoritos...</Text> */}
                            </View>
                        ) : (
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productScroll}>
                                {agricultoresFavoritos.length === 0 ? (
                                    <Text style={[styles.productText, { marginLeft: 10, color: colors.text }]}>
                                        Você ainda não adicionou nenhum agricultor aos favoritos.
                                    </Text>
                                ) : (
                                    agricultoresFavoritos.map((produtor, index) => (
                                        <TouchableOpacity
                                            key={produtor.cpf_cnpj || index}
                                            style={[styles.productItem, { backgroundColor: colors.profileCard, borderColor: colors.borderCard }]}
                                            onPress={() => router.push(`/home/produtorProfile?cpf_cnpj=${produtor.cpf_cnpj}`)}
                                        >
                                            <Text style={[styles.productText, { color: colors.text }]}>
                                                {produtor.nome || "Produtor"}
                                            </Text>
                                        </TouchableOpacity>
                                    ))
                                )}
                            </ScrollView>
                        )}
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

    bannerImg: {
      width: width * 0.85,
      height: height * 0.13,
      borderRadius: width * 0.025,
      marginBottom: height * 0.01,
      backgroundColor: "#eee"
    },

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

    profilePhoto: {
        width: 100,
        height: 100,
        borderRadius: 25, // círculo
        // borderWidth: 1,
        // borderColor: '#4D7E1B',
        marginVertical: 10,
    },

    productScroll: { flexDirection: "row", marginVertical: 6 },

    productItem: { padding: 10, borderWidth: 1, borderRadius: 10, marginHorizontal: 5, borderColor: '#4D7E1B' },

    productText: { fontSize: 14 },
});
