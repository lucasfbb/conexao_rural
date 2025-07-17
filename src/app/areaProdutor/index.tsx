import { View, Text, FlatList, Image, TouchableOpacity, Alert, StyleSheet, Modal, TextInput, ScrollView, ActivityIndicator, useWindowDimensions } from "react-native";
import { useEffect, useRef, useState } from "react";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import Header from "@/components/header";
import { api, baseURL } from "../../../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ModalAddProduto from "@/components/modais/produtos/modalAddProduto";
import { ProdutoGlobal } from "@/components/autoComplete";

type Produto = {
  id: string;
  listagem_id: number;
  nome: string;
  preco: number;
  preco_promocional?: number;
  quantidade: number;
  unidade: string;
  foto: any;
  descricao?: string;
};

function getCamposAlterados(
  orig: Record<string, any> = {},
  editado: Record<string, any> = {}
) {
  const alterados: Record<string, any> = {};
  Object.keys(editado).forEach((key) => {
    if (editado[key] !== orig[key]) {
      alterados[key] = editado[key];
    }
  });
  return alterados;
}

export default function AreaProdutor() {
  const { width, height } = useWindowDimensions();
  const styles = getStyles(width, height);

  const base = baseURL.slice(0, -1);

  const [perfil, setPerfil] = useState({
    cpf_cnpj: "",
    nome: "",
    email: "",
    foto: "",
    banner: "",
    categoria: "",
    telefone_1: "",
    telefone_2: "",
    endereco: "",
  });

  const [perfilOriginal, setPerfilOriginal] = useState({
    cpf_cnpj: "",
    nome: "",
    email: "",
    foto: "",
    banner: "",
    categoria: "",
    telefone_1: "",
    telefone_2: "",
    endereco: "",
  });

  const [carregando, setCarregando] = useState(true);
  const [editando, setEditando] = useState(false);

  // Imagem do perfil/banner
  const [imagemProdutor, setImagemProdutor] = useState<string | null>(null);
  const [imagemBanner, setImagemBanner] = useState<string | null>(null);

  // Modal de editar nome
  const [modalNome, setModalNome] = useState(false);
  const [novoNome, setNovoNome] = useState(perfil.nome);

  // Produtos
  const [produtos, setProdutos] = useState<Produto[]>([]);

  // Modal de novo produto
  const [modalNovoProduto, setModalNovoProduto] = useState(false);
  const [novoNomeProd, setNovoNomeProd] = useState("");
  const [novoPrecoProd, setNovoPrecoProd] = useState("");
  const [novoPrecoPromocional, setNovoPrecoPromocional] = useState("");
  const [novaQtdProd, setNovaQtdProd] = useState("");
  const [novaDescricaoProd, setNovaDescricaoProd] = useState("");
  const [imagemProdutoNovo, setImagemProdutoNovo] = useState<string | null>(null);
  const [unidade, setUnidade] = useState("unidade");

  const [editandoProduto, setEditandoProduto] = useState<Produto | null>(null);
  const [modoEdicao, setModoEdicao] = useState(false);

  // Produtos globais buscados dinamicamente
  const [produtosGlobais, setProdutosGlobais] = useState<ProdutoGlobal[]>([]);
  const [loadingSugestoes, setLoadingSugestoes] = useState(false);
  const buscaTimeout = useRef<any>(null);
  
  const abrirModalEditar = (produto: Produto) => {
    setModoEdicao(true);
    setEditandoProduto(produto);
    setNovoNomeProd(produto.nome);
    setNovoPrecoProd(produto.preco.toString());
    setNovoPrecoPromocional(produto.preco_promocional?.toString() || "");
    setNovaQtdProd(produto.quantidade.toString());
    setUnidade(produto.unidade);
    setImagemProdutoNovo(typeof produto.foto === "object" && produto.foto?.uri ? produto.foto.uri : null);
    setNovaDescricaoProd(produto.descricao ?? "");
    setModalNovoProduto(true);
  };

  const buscarProdutosGlobais = (termo: string) => {
    if (buscaTimeout.current) clearTimeout(buscaTimeout.current);
    if (!termo || termo.length < 2) {
      setProdutosGlobais([]);
      setLoadingSugestoes(false);
      return;
    }
    setLoadingSugestoes(true);
    buscaTimeout.current = setTimeout(async () => {
      try {
        const res = await api.get(`/produtos/search?q=${encodeURIComponent(termo)}`);
        setProdutosGlobais(res.data || []);
      } catch {
        setProdutosGlobais([]);
      }
      setLoadingSugestoes(false);
    }, 300); // 300ms debounce
  };

  // --- Funções de perfil e imagem
  async function salvarPerfil() {
    const camposAlterados = getCamposAlterados(perfilOriginal, perfil);
    if (Object.keys(camposAlterados).length > 0) {
      await api.patch("/produtores/me", camposAlterados);
      Alert.alert("Perfil atualizado!");
      // Atualize o original para os próximos edits
      setPerfilOriginal(perfil);
      setEditando(false);
    } else {
      Alert.alert("Nenhuma alteração feita.");
    }
  }

  useEffect(() => {
    async function buscarPerfil() {
      setCarregando(true);
      try {
        const res = await api.get("/produtores/me");    
        setPerfil(res.data);
        setPerfilOriginal(res.data);
        setImagemProdutor(`${res.data.foto}`);
        setImagemBanner(res.data.banner);
      } catch (e) {
        if (typeof e === "object" && e !== null && "response" in e) {
          // @ts-expect-error: e.response may exist if this is an AxiosError
          console.log("ERRO AO BUSCAR PERFIL", e.response?.data || e);
        } else {
          console.log("ERRO AO BUSCAR PERFIL", e);
        }
        Alert.alert("Erro ao carregar perfil");
      } finally {
        setCarregando(false);
      }
    }
    buscarPerfil();
  }, []);

  useEffect(() => {
    if (perfil.cpf_cnpj) {
      buscarProdutos();
    }
  }, [perfil.cpf_cnpj]);

  const escolherImagemProdutor = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      const localUri = asset.uri;
      let filename = localUri.split('/').pop();
      let match = /\.(\w+)$/.exec(filename ?? "");
      let type = match ? `image/${match[1]}` : `image`;

      const formData = new FormData();
      formData.append("file", {
      uri: localUri,
      name: filename ?? `foto.jpg`,
      type: type,
    } as any);

      try {
        const response = await api.post(
          '/produtores/foto/upload',
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        );
        setImagemProdutor(`${response.data.foto}`);
        setPerfil(prev => ({
          ...prev,
          foto: `${response.data.foto}`,
        }));
        Alert.alert("Foto de perfil atualizada!");
      } catch (err) {
        console.error("Erro no upload:", err);
        Alert.alert("Erro ao enviar imagem de perfil!");
      }
    }
  };

  const escolherImagemBanner = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      const localUri = asset.uri;
      let filename = localUri.split('/').pop();
      let match = /\.(\w+)$/.exec(filename ?? "");
      let type = match ? `image/${match[1]}` : `image`;

      const formData = new FormData();
      formData.append("file", {
        uri: localUri,
        name: filename ?? `foto.jpg`,
        type: type,
      } as any);

      try {
        const response = await api.post(
          '/produtores/banner/upload',
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        );
        setImagemBanner(response.data.banner);
        setPerfil(prev => ({
          ...prev,
          banner: response.data.banner,
        }));
        Alert.alert("Foto de banner atualizada!");
      } catch (err) {
        console.error("Erro no upload:", err);
        Alert.alert("Erro ao enviar imagem de banner!");
      }
    }
  };

  // ---- Produtos

  const buscarProdutos = async () => {
    try {
      const res = await api.get(`/produtores/${perfil.cpf_cnpj}/produtos`);
      // console.log("Produtos do produtor:", res.data);
      
      // Ajusta o array para o formato esperado na FlatList
      const produtosTratados = res.data.map((produto: any) => ({
        id: produto.id?.toString() ?? Math.random().toString(),
        listagem_id: produto.listagem_id,
        nome: produto.nome,
        nome_personalizado: produto.nome_personalizado || produto.nome,
        preco: produto.preco,
        preco_promocional: produto.preco_promocional,
        quantidade: produto.estoque,
        descricao: produto.descricao,
        unidade: produto.unidade ?? 'unidade',
        foto: produto.foto ? { uri: base + produto.foto } : require('../../../assets/images/pacote_produto.png'), // Imagem padrão se não tiver foto
      }));

      setProdutos(produtosTratados);
      // console.log("Produtos carregados:", produtosTratados);
    } catch (err) {
      Alert.alert("Erro ao buscar produtos");
      console.log("Erro ao buscar produtos do produtor:", err);
    }
  };

  const excluirProduto = (listagem_id: number) => {
    Alert.alert("Confirmar exclusão", "Tem certeza que deseja excluir este produto?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/produtores/produtos/remover/${listagem_id}`);
            setProdutos(prev => prev.filter(prod => prod.listagem_id !== listagem_id));
            Alert.alert("Produto removido do estoque!");
          } catch (err) {
            Alert.alert("Erro ao excluir produto");
            console.error("Erro ao excluir produto:", err);
          }
        },
      },
    ]);
  };

  const salvarProduto = async () => {
    if (!novoNomeProd || !novoPrecoProd || !novaQtdProd) {
      Alert.alert("Preencha todos os campos");
      return;
    }

    const precoFloat = parseFloat(novoPrecoProd.replace(',', '.'));
    const precoPromocional = novoPrecoPromocional ? parseFloat(novoPrecoPromocional.replace(',', '.')) : undefined;
    const quantidadeFloat = parseFloat(novaQtdProd.replace(',', '.'));
    if (isNaN(precoFloat) || isNaN(quantidadeFloat)) {
      Alert.alert("Preço ou quantidade inválidos");
      return;
    }

    try {
      if (modoEdicao && editandoProduto) {
        const formData = new FormData();
        formData.append("nome", novoNomeProd);
        formData.append("descricao", novaDescricaoProd);
        formData.append("preco", precoFloat.toString());
        if (precoPromocional) {
          formData.append("preco_promocional", precoPromocional.toString());
        }
        formData.append("quantidade", quantidadeFloat.toString());
        formData.append("unidade", unidade);
        if (imagemProdutoNovo && imagemProdutoNovo !== editandoProduto.foto?.uri) {
          formData.append('file', {
            uri: imagemProdutoNovo,
            name: "produto.jpg",
            type: "image/jpeg"
          } as any);
        }
        await api.patch(`/produtores/produtos/editar/${editandoProduto.listagem_id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });

        Alert.alert("Produto atualizado!");
      } else {
        // ADIÇÃO (POST) ---------------------------
        const formData = new FormData();
        formData.append('nome', novoNomeProd);
        formData.append('preco', precoFloat.toString());
        if (precoPromocional) {
          formData.append("preco_promocional", precoPromocional.toString());
        }
        formData.append('quantidade', quantidadeFloat.toString());
        formData.append('unidade', unidade);
        formData.append('descricao', novaDescricaoProd || "");
        if (imagemProdutoNovo) {
          formData.append('file', {
            uri: imagemProdutoNovo,
            name: "produto.jpg",
            type: "image/jpeg"
          } as any);
        }

        await api.post("/produtores/produtos/adicionar", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        Alert.alert("Produto cadastrado!");
      }

      await buscarProdutos();
      setModalNovoProduto(false);
      setNovoNomeProd("");
      setNovoPrecoProd("");
      setNovoPrecoPromocional("");
      setNovaQtdProd("");
      setImagemProdutoNovo(null);
      setUnidade("unidade");
      setModoEdicao(false);
      setEditandoProduto(null);

    } catch (err) {
      Alert.alert("Erro ao salvar produto", err instanceof Error ? err.message : "Erro desconhecido");
    }
  };

  const escolherImagemProduto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!result.canceled) setImagemProdutoNovo(result.assets[0].uri);
  };

  const handlePrecoChange = (text: string) => {
    // Permite apenas números, vírgula e ponto (para decimais)
    const clean = text.replace(/[^0-9.,]/g, "");
    setNovoPrecoProd(clean);
  };

  const handlePrecoPromocionalChange = (text: string) => {
    // Permite apenas números, vírgula e ponto (para decimais)
    const clean = text.replace(/[^0-9.,]/g, "");
    setNovoPrecoPromocional(clean);
  };

  const handleQuantidadeChange = (text: string) => {
    // Permite apenas números inteiros
    const clean = text.replace(/[^0-9]/g, "");
    setNovaQtdProd(clean);
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.produtoItem}>
      <View style={styles.produtoEsquerda}>
        <Image source={item.foto} style={styles.produtoImagem} />
        <View>
          <Text style={styles.produtoNome}>{item.nome_personalizado}</Text>
          <Text style={styles.produtoPreco}>
            {item.unidade === "unidade"
              ? `${item.quantidade} unidade(s) - R$ ${item.preco}`
              : `${item.quantidade} ${item.unidade} - R$ ${item.preco}`
            }
          </Text>
        </View>
      </View>
      <View style={styles.botoesContainer}>
        <TouchableOpacity onPress={() => abrirModalEditar(item)}>
          <Feather name="edit" size={width * 0.06} color="#E15610" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => excluirProduto(item.listagem_id)}>
          <Feather name="trash" size={width * 0.06} color="#B00020" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (carregando) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#4D7E1B" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: height * 0.03 }}>
      <Header />

      {/* Banner */}
      <View style={{ alignItems: 'center', marginTop: height * 0.015 }}>
        <TouchableOpacity onPress={escolherImagemBanner}>
          {imagemBanner ? (
            <Image source={{
              uri: imagemBanner ? `${base}${imagemBanner}` : undefined
            }} style={styles.bannerImg} />
          ) : (
            <View style={styles.bannerPlaceholder}>
              <Text>Adicionar Banner</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>


      {/* Foto de perfil */}
      <View style={{ alignItems: 'center', marginTop: height * -0.006}}>
        <TouchableOpacity onPress={escolherImagemProdutor}>
          {imagemProdutor ? (
            <Image source={{
              uri: imagemProdutor ? `${base}${imagemProdutor}` : undefined
            }} style={styles.imagemPerfil} />
          ) : (
            <View style={styles.placeholderImagem}>
              <Text>Adicionar Foto</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.nomeContainer}>
          <Text style={styles.nomeProdutor}>{perfil.nome}</Text>
          <TouchableOpacity onPress={() => {
            setNovoNome(perfil.nome);
            setModalNome(true);
          }}>
            <Feather name="edit-2" size={width * 0.05} color="#E15610" />
          </TouchableOpacity>
        </View>
        <Text style={styles.label}>{perfil.email || "teste@email.com"}</Text>
        <Text style={styles.label}>{perfil.telefone_1 || "(21)972943363"}</Text>
        { perfil.telefone_2 && (
            <Text style={styles.label}>{perfil.telefone_2}</Text>
          )
        }
        <Text style={styles.label}>{perfil.categoria || "Teste"}</Text>
      </View>

      {/* Editar perfil */}
      {editando && (
        <View style={{ marginHorizontal: width * 0.06 }}>
          <Text style={styles.inputLabel}>Nome</Text>
          <TextInput style={styles.input} value={perfil.nome} onChangeText={nome => setPerfil(p => ({ ...p, nome }))} />
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput style={styles.input} value={perfil.email} onChangeText={email => setPerfil(p => ({ ...p, email }))} />
          <Text style={styles.inputLabel}>Endereço</Text>
          <TextInput style={styles.input} value={perfil.endereco} onChangeText={endereco => setPerfil(p => ({ ...p, endereco }))} />
          <Text style={styles.inputLabel}>Telefone</Text>
          <TextInput style={styles.input} value={perfil.telefone_1} onChangeText={telefone => setPerfil(p => ({ ...p, telefone }))} />
          <Text style={styles.inputLabel}>Categoria</Text>
          <TextInput style={styles.input} value={perfil.categoria} onChangeText={categoria => setPerfil(p => ({ ...p, categoria }))} />

          <View style={{ flexDirection: "row", gap: width * 0.04, justifyContent: "space-between", marginTop: height * 0.01 }}>
            <TouchableOpacity style={styles.buttonSalvar} onPress={salvarPerfil}>
              <Text style={styles.title}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonCancelar} onPress={() => setEditando(false)}>
              <Text style={styles.title}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {!editando && (
        <TouchableOpacity style={styles.buttonEditar} onPress={() => setEditando(true)}>
          <Feather name="edit" size={width * 0.055} color="#fff" />
          <Text style={[styles.title, { marginLeft: width * 0.025 }]}>Editar informações</Text>
        </TouchableOpacity>
      )}

      {/* Produtos */}
      <Text style={styles.titulo}>Estoque dos produtos</Text>

      <FlatList
        data={produtos}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        style={{ marginHorizontal: width * 0.05, marginTop: height * 0.01 }}
        scrollEnabled={false}
      />

      <View style={{ margin: width * 0.05, gap: height * 0.012 }}>
        <TouchableOpacity style={styles.buttonAdicionar} onPress={() => setModalNovoProduto(true)}>
          <Text style={styles.title}>Adicionar Produto</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonPedidos} onPress={() => alert("Ver pedidos")}>
          <Text style={styles.title}>Ver Pedidos</Text>
        </TouchableOpacity>
      </View>

      {/* Modal editar nome produtor */}
      <Modal visible={modalNome} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Editar nome do produtor</Text>
            <TextInput style={styles.input} value={novoNome} onChangeText={setNovoNome} />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setModalNome(false)}>
                <Text style={{ color: '#B00020' }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                setPerfil(p => ({ ...p, nome: novoNome }));
                setModalNome(false);
              }}>
                <Text style={{ color: '#4CAF50' }}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <ModalAddProduto
        visible={modalNovoProduto}
        nome={novoNomeProd}
        preco={novoPrecoProd}
        precoPromocional={novoPrecoPromocional}
        quantidade={novaQtdProd}
        unidade={unidade}
        descricao={novaDescricaoProd}
        imagemProduto={imagemProdutoNovo}
        produtosGlobais={produtosGlobais}
        loadingSugestoes={loadingSugestoes}
        buscarProdutosGlobais={buscarProdutosGlobais}
        onNomeChange={setNovoNomeProd}
        onPrecoChange={handlePrecoChange}
        onPrecoPromocionalChange={handlePrecoPromocionalChange}
        onQuantidadeChange={handleQuantidadeChange}
        onUnidadeChange={setUnidade}
        onDescricaoChange={setNovaDescricaoProd} 
        onEscolherImagem={escolherImagemProduto}
        onSave={salvarProduto}
        onClose={() => {
          setModalNovoProduto(false);
          setModoEdicao(false);
          setEditandoProduto(null);
        }}
        modoEdicao={modoEdicao}
      />
    </ScrollView>
  );
}

// -------- STYLES DINÂMICOS --------
function getStyles(width: number, height: number) {
  return StyleSheet.create({
    bannerImg: {
      width: width * 0.85,
      height: height * 0.13,
      borderRadius: width * 0.025,
      marginBottom: height * 0.01,
      backgroundColor: "#eee"
    },
    bannerPlaceholder: {
      width: width * 0.85,
      height: height * 0.13,
      borderRadius: width * 0.025,
      borderWidth: 2,           
      borderColor: 'green',
      backgroundColor: 'transparent',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: height * 0.01,
    },
    imagemPerfil: {
      width: width * 0.33,
      height: width * 0.33,
      borderRadius: width * 0.165,
      backgroundColor: "#eee"
    },
    placeholderImagem: {
      width: width * 0.33,
      height: width * 0.33,
      borderRadius: width * 0.165,
      //backgroundColor: '#ccc',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'transparent',
      borderWidth: 2,           
      borderColor: 'green'
    },
    label: { fontSize: width * 0.035, color: '#333', marginBottom: 8, marginTop: -6 },
    nomeContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: height * 0.01,  marginBottom: height * 0.018 },
    nomeProdutor: { fontSize: width * 0.045, fontWeight: 'bold' },
    inputLabel: { fontWeight: "bold", marginBottom: 4, marginTop: height * 0.01, color: "#4D7E1B", fontSize: width * 0.035 },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: width * 0.02,
      padding: width * 0.035,
      marginBottom: height * 0.01,
      backgroundColor: '#fff',
      fontSize: width * 0.04,
    },
    buttonEditar: {
      marginHorizontal: width * 0.06,
      marginBottom: height * 0.02,
      flexDirection: "row",
      backgroundColor: "#4D7E1B",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: height * 0.018,
      paddingHorizontal: width * 0.08,
      borderRadius: width * 0.02,
    },
    buttonSalvar: {
      backgroundColor: "#4D7E1B",
      paddingVertical: height * 0.018,
      paddingHorizontal: width * 0.08,
      borderRadius: width * 0.02,
      minWidth: width * 0.25,
      alignItems: "center"
    },
    buttonCancelar: {
      backgroundColor: "#B00020",
      paddingVertical: height * 0.018,
      paddingHorizontal: width * 0.08,
      borderRadius: width * 0.02,
      minWidth: width * 0.25,
      alignItems: "center"
    },
    titulo: { fontSize: width * 0.06, fontWeight: 'bold', textAlign: 'center', marginVertical: height * 0.018, marginTop: height * 0.04 },
    produtoItem: {
      borderBottomWidth: 1,
      borderColor: '#ccc',
      paddingVertical: height * 0.012,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    produtoEsquerda: { flexDirection: 'row', alignItems: 'center', gap: width * 0.03 },
    produtoImagem: {
      width: width * 0.13,
      height: width * 0.13,
      borderRadius: width * 0.03
    },
    produtoImagemPreview: {
      width: width * 0.22,
      height: width * 0.22,
      borderRadius: width * 0.04,
      marginVertical: height * 0.014
    },
    produtoNome: { fontSize: width * 0.045, fontWeight: 'bold' },
    produtoPreco: { fontSize: width * 0.038, color: '#555' },
    botoesContainer: { flexDirection: 'row', gap: width * 0.05, alignItems: 'center' },
    buttonAdicionar: {
      width: "100%",
      height: height * 0.065,
      backgroundColor: '#E15610',
      borderRadius: width * 0.025,
      justifyContent: 'center',
      alignItems: 'center'
    },
    buttonPedidos: {
      width: "100%",
      height: height * 0.065,
      backgroundColor: '#4CAF50',
      borderRadius: width * 0.025,
      justifyContent: 'center',
      alignItems: 'center'
    },
    title: { fontSize: width * 0.043, fontWeight: 'bold', color: 'white' },
    modalOverlay: {
      flex: 1,
      backgroundColor: '#00000099',
      justifyContent: 'center',
      alignItems: 'center'
    },
    modalBox: {
      width: '95%',            // Deixe praticamente a tela toda
      maxWidth: 400,           // Limite para tablets/desktops
      backgroundColor: 'white',
      borderRadius: width * 0.035,
      paddingHorizontal: width * 0.06,
      paddingVertical: height * 0.035,
      alignItems: 'center',    // Centraliza tudo dentro do box
      gap: height * 0.018,
      elevation: 10
    },
    modalTitle: { fontSize: width * 0.043, fontWeight: 'bold' },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: height * 0.014
    }
  });
}