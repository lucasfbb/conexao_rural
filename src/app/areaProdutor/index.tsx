import { View, Text, FlatList, Image, TouchableOpacity, Alert, StyleSheet, Modal, TextInput, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import Header from "@/components/header";
import { api } from "../../../services/api";

export default function AreaProdutor() {
  const [perfil, setPerfil] = useState({
    nome: "",
    email: "",
    foto: "",
    banner: "",
    categoria: "",
    telefone: "",
    // ...outros campos
  });
  const [carregando, setCarregando] = useState(true);
  const [editando, setEditando] = useState(false);

  const [produtos, setProdutos] = useState([
    {
      id: '1',
      nome: 'Tomate',
      preco: 'R$ 5,00',
      quantidade: '10kg',
      imagem: require('../../../assets/images/principais/alface.png'),
    },
    {
      id: '2',
      nome: 'Alface',
      preco: 'R$ 3,00',
      quantidade: '20kg',
      imagem: require('../../../assets/images/principais/alface.png'),
    },
     {
      id: '3',
      nome: 'Alface',
      preco: 'R$ 3,00',
      quantidade: '20kg',
      imagem: require('../../../assets/images/principais/alface.png'),
    },
     {
      id: '4',
      nome: 'Alface',
      preco: 'R$ 3,00',
      quantidade: '20kg',
      imagem: require('../../../assets/images/principais/alface.png'),
    },
     {
      id: '5',
      nome: 'Alface',
      preco: 'R$ 3,00',
      quantidade: '20kg',
      imagem: require('../../../assets/images/principais/alface.png'),
    },
     {
      id: '6',
      nome: 'Alface',
      preco: 'R$ 3,00',
      quantidade: '20kg',
      imagem: require('../../../assets/images/principais/alface.png'),
    },
     {
      id: '7',
      nome: 'Alface',
      preco: 'R$ 3,00',
      quantidade: '20kg',
      imagem: require('../../../assets/images/principais/alface.png'),
    },
     {
      id: '8',
      nome: 'Alface',
      preco: 'R$ 3,00',
      quantidade: '20kg',
      imagem: require('../../../assets/images/principais/alface.png'),
    },
     {
      id: '9',
      nome: 'Alface',
      preco: 'R$ 3,00',
      quantidade: '20kg',
      imagem: require('../../../assets/images/principais/alface.png'),
    },
     {
      id: '10',
      nome: 'Alface',
      preco: 'R$ 3,00',
      quantidade: '20kg',
      imagem: require('../../../assets/images/principais/alface.png'),
    },
     {
      id: '11',
      nome: 'Alface',
      preco: 'R$ 3,00',
      quantidade: '20kg',
      imagem: require('../../../assets/images/principais/alface.png'),
    },
     {
      id: '12',
      nome: 'Alface',
      preco: 'R$ 3,00',
      quantidade: '20kg',
      imagem: require('../../../assets/images/principais/alface.png'),
    },
     {
      id: '13',
      nome: 'Alface',
      preco: 'R$ 3,00',
      quantidade: '20kg',
      imagem: require('../../../assets/images/principais/alface.png'),
    },
     {
      id: '14',
      nome: 'Alface',
      preco: 'R$ 3,00',
      quantidade: '20kg',
      imagem: require('../../../assets/images/principais/alface.png'),
    },
     {
      id: '15',
      nome: 'Alface',
      preco: 'R$ 3,00',
      quantidade: '20kg',
      imagem: require('../../../assets/images/principais/alface.png'),
    },
     {
      id: '16',
      nome: 'Alface',
      preco: 'R$ 3,00',
      quantidade: '20kg',
      imagem: require('../../../assets/images/principais/alface.png'),
    }
  ]);

  async function salvarPerfil() {
    try {
      await api.patch("/produtores/me", perfil);
      Alert.alert("Perfil atualizado!");
      setEditando(false);
    } catch {
      Alert.alert("Erro ao atualizar perfil");
    }
  }

  useEffect(() => {
    async function buscarPerfil() {
      setCarregando(true);
      try {
        const res = await api.get("/produtores/me");
        setPerfil(res.data);
      } catch (e) {
        Alert.alert("Erro ao carregar perfil");
      } finally {
        setCarregando(false);
      }
    }
    buscarPerfil();
  }, []);

  const [imagemProdutor, setImagemProdutor] = useState<string | null>(null);
  const [nomeProdutor, setNomeProdutor] = useState("João da Feira");

  const [modalNome, setModalNome] = useState(false);
  const [novoNome, setNovoNome] = useState(nomeProdutor);

  const [modalNovoProduto, setModalNovoProduto] = useState(false);
  const [novoNomeProd, setNovoNomeProd] = useState("");
  const [novoPrecoProd, setNovoPrecoProd] = useState("");
  const [novaQtdProd, setNovaQtdProd] = useState("");
  const [imagemProdutoNovo, setImagemProdutoNovo] = useState<string | null>(null);

  const escolherImagemProdutor = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!result.canceled) setImagemProdutor(result.assets[0].uri);
  };

  const escolherImagemProduto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!result.canceled) setImagemProdutoNovo(result.assets[0].uri);
  };

  const excluirProduto = (id: string) => {
    Alert.alert("Confirmar exclusão", "Tem certeza que deseja excluir este produto?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => setProdutos(prev => prev.filter(prod => prod.id !== id)),
      },
    ]);
  };

  const salvarNovoProduto = () => {
    if (!novoNomeProd || !novoPrecoProd || !novaQtdProd || !imagemProdutoNovo) {
      Alert.alert("Preencha todos os campos");
      return;
    }

    const novo = {
      id: Date.now().toString(),
      nome: novoNomeProd,
      preco: novoPrecoProd,
      quantidade: novaQtdProd,
      imagem: { uri: imagemProdutoNovo },
    };

    setProdutos(prev => [...prev, novo]);
    setModalNovoProduto(false);
    setNovoNomeProd("");
    setNovoPrecoProd("");
    setNovaQtdProd("");
    setImagemProdutoNovo(null);
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.produtoItem}>
      <View style={styles.produtoEsquerda}>
        <Image source={item.imagem} style={styles.produtoImagem} />
        <View>
          <Text style={styles.produtoNome}>{item.nome}</Text>
          <Text style={styles.produtoPreco}>{item.quantidade} - {item.preco}</Text>
        </View>
      </View>
      <View style={styles.botoesContainer}>
        <TouchableOpacity onPress={() => alert(`Editar ${item.nome}`)}>
          <Feather name="edit" size={24} color="#E15610" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => excluirProduto(item.id)}>
          <Feather name="trash" size={24} color="#B00020" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <Header />

      <View style={{ alignItems: 'center', marginVertical: 20 }}>
        <TouchableOpacity onPress={escolherImagemProdutor}>
          {imagemProdutor ? (
            <Image source={{ uri: imagemProdutor }} style={styles.imagemPerfil} />
          ) : (
            <View style={styles.placeholderImagem}>
              <Text>Adicionar Foto</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.nomeContainer}>
          <Text style={styles.nomeProdutor}>{nomeProdutor}</Text>
          <TouchableOpacity onPress={() => {
            setNovoNome(nomeProdutor);
            setModalNome(true);
          }}>
            <Feather name="edit-2" size={18} color="#E15610" />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.titulo}>Estoque dos produtos</Text>

      <FlatList
        data={produtos}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        style={{ marginHorizontal: 20, marginTop: 10 }}
      />

      <View style={{ margin: 20, gap: 10 }}>
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
                setNomeProdutor(novoNome);
                setModalNome(false);
              }}>
                <Text style={{ color: '#4CAF50' }}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal adicionar produto */}
      <Modal visible={modalNovoProduto} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={styles.modalBox}>
            <Text style={styles.modalTitle}>Novo Produto</Text>

            <TextInput placeholder="Nome" style={styles.input} value={novoNomeProd} onChangeText={setNovoNomeProd} />
            <TextInput placeholder="Preço" style={styles.input} value={novoPrecoProd} onChangeText={setNovoPrecoProd} />
            <TextInput placeholder="Quantidade" style={styles.input} value={novaQtdProd} onChangeText={setNovaQtdProd} />

            <TouchableOpacity onPress={escolherImagemProduto}>
              {imagemProdutoNovo ? (
                <Image source={{ uri: imagemProdutoNovo }} style={styles.produtoImagemPreview} />
              ) : (
                <View style={[styles.placeholderImagem, { width: 80, height: 80 }]}>
                  <Text>Imagem</Text>
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setModalNovoProduto(false)}>
                <Text style={{ color: '#B00020' }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={salvarNovoProduto}>
                <Text style={{ color: '#4CAF50' }}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  imagemPerfil: { width: 120, height: 120, borderRadius: 60 },
  placeholderImagem: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center'
  },
  nomeContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 },
  nomeProdutor: { fontSize: 18, fontWeight: 'bold' },
  titulo: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 },
  produtoItem: {
    borderBottomWidth: 1, borderColor: '#ccc', paddingVertical: 10,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
  },
  produtoEsquerda: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  produtoImagem: { width: 40, height: 40, borderRadius: 5 },
  produtoImagemPreview: { width: 80, height: 80, borderRadius: 8, marginVertical: 10 },
  produtoNome: { fontSize: 16, fontWeight: 'bold' },
  produtoPreco: { fontSize: 14, color: '#555' },
  botoesContainer: { flexDirection: 'row', gap: 15, alignItems: 'center' },
  buttonAdicionar: {
    width: "100%", height: 52, backgroundColor: '#E15610',
    borderRadius: 10, justifyContent: 'center', alignItems: 'center'
  },
  buttonPedidos: {
    width: "100%", height: 52, backgroundColor: '#4CAF50',
    borderRadius: 10, justifyContent: 'center', alignItems: 'center'
  },
  title: { fontSize: 16, fontWeight: 'bold', color: 'white' },
  modalOverlay: {
    flex: 1, backgroundColor: '#00000099', justifyContent: 'center', alignItems: 'center'
  },
  modalBox: {
    width: '85%', backgroundColor: 'white', borderRadius: 10,
    padding: 20, gap: 10, elevation: 5
  },
  modalTitle: { fontSize: 16, fontWeight: 'bold' },
  input: {
    borderWidth: 1, borderColor: '#ccc',
    borderRadius: 8, padding: 10
  },
  modalButtons: {
    flexDirection: 'row', justifyContent: 'space-between', marginTop: 10
  }
});

// import { View, Text, FlatList, Image, TouchableOpacity, Alert, StyleSheet, Modal, TextInput, ScrollView, ActivityIndicator } from "react-native";
// import { useEffect, useState } from "react";
// import { Feather } from "@expo/vector-icons";
// import * as ImagePicker from 'expo-image-picker';
// import Header from "@/components/header";
// import { api } from "../../../services/api";

// export default function AreaProdutor() {
//   // -------------------- PERFIL PRODUTOR -----------------------
//   const [perfil, setPerfil] = useState({
//     nome: "",
//     email: "",
//     foto: "",
//     banner: "",
//     categoria: "",
//     telefone: "",
//   });
//   const [carregando, setCarregando] = useState(true);
//   const [editando, setEditando] = useState(false);

//   // Modal antigo do nome - ainda funciona mas agora sincroniza com perfil.nome
//   const [modalNome, setModalNome] = useState(false);
//   const [novoNome, setNovoNome] = useState("");

//   useEffect(() => {
//     async function buscarPerfil() {
//       setCarregando(true);
//       try {
//         const res = await api.get("/produtores/me");
//         setPerfil(res.data);
//         setNovoNome(res.data.nome); // já prepara o novoNome com o nome do backend
//       } catch (e) {
//         Alert.alert("Erro ao carregar perfil");
//       } finally {
//         setCarregando(false);
//       }
//     }
//     buscarPerfil();
//   }, []);

//   async function salvarPerfil() {
//     try {
//       await api.patch("/produtores/me", perfil);
//       Alert.alert("Perfil atualizado!");
//       setEditando(false);
//     } catch {
//       Alert.alert("Erro ao atualizar perfil");
//     }
//   }

//   async function escolherImagem(campo: "foto" | "banner") {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       quality: 0.7,
//     });
//     if (!result.canceled && result.assets[0]) {
//       setPerfil((p) => ({ ...p, [campo]: result.assets[0].uri }));
//     }
//   }

//   // ---------------------- PRODUTOS ---------------------------
//   const [produtos, setProdutos] = useState([
//     {
//       id: '1',
//       nome: 'Tomate',
//       preco: 'R$ 5,00',
//       quantidade: '10kg',
//       imagem: require('../../../assets/images/principais/alface.png'),
//     },
//     // ... demais produtos mockados
//   ]);

//   const [modalNovoProduto, setModalNovoProduto] = useState(false);
//   const [novoNomeProd, setNovoNomeProd] = useState("");
//   const [novoPrecoProd, setNovoPrecoProd] = useState("");
//   const [novaQtdProd, setNovaQtdProd] = useState("");
//   const [imagemProdutoNovo, setImagemProdutoNovo] = useState<string | null>(null);

//   const escolherImagemProduto = async () => {
//     const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
//     if (!result.canceled) setImagemProdutoNovo(result.assets[0].uri);
//   };

//   const excluirProduto = (id: string) => {
//     Alert.alert("Confirmar exclusão", "Tem certeza que deseja excluir este produto?", [
//       { text: "Cancelar", style: "cancel" },
//       {
//         text: "Excluir",
//         style: "destructive",
//         onPress: () => setProdutos(prev => prev.filter(prod => prod.id !== id)),
//       },
//     ]);
//   };

//   const salvarNovoProduto = () => {
//     if (!novoNomeProd || !novoPrecoProd || !novaQtdProd || !imagemProdutoNovo) {
//       Alert.alert("Preencha todos os campos");
//       return;
//     }
//     const novo = {
//       id: Date.now().toString(),
//       nome: novoNomeProd,
//       preco: novoPrecoProd,
//       quantidade: novaQtdProd,
//       imagem: { uri: imagemProdutoNovo },
//     };
//     setProdutos(prev => [...prev, novo]);
//     setModalNovoProduto(false);
//     setNovoNomeProd("");
//     setNovoPrecoProd("");
//     setNovaQtdProd("");
//     setImagemProdutoNovo(null);
//   };

//   const renderItem = ({ item }: any) => (
//     <View style={styles.produtoItem}>
//       <View style={styles.produtoEsquerda}>
//         <Image source={item.imagem} style={styles.produtoImagem} />
//         <View>
//           <Text style={styles.produtoNome}>{item.nome}</Text>
//           <Text style={styles.produtoPreco}>{item.quantidade} - {item.preco}</Text>
//         </View>
//       </View>
//       <View style={styles.botoesContainer}>
//         <TouchableOpacity onPress={() => alert(`Editar ${item.nome}`)}>
//           <Feather name="edit" size={24} color="#E15610" />
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => excluirProduto(item.id)}>
//           <Feather name="trash" size={24} color="#B00020" />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   // ---------------------- RENDER -----------------------------
//   if (carregando) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" color="#4D7E1B" />
//         <Text style={{ marginTop: 12 }}>Carregando perfil...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={{ flex: 1 }}>
//       <Header />

//       {/* ----- BANNER ----- */}
//       <TouchableOpacity style={{ alignItems: 'center', marginTop: 10 }} onPress={() => escolherImagem("banner")}>
//         {perfil.banner ? (
//           <Image source={{ uri: perfil.banner }} style={styles.bannerImg} />
//         ) : (
//           <View style={styles.bannerPlaceholder}><Text>Adicionar banner</Text></View>
//         )}
//         <Text style={styles.label}>Banner</Text>
//       </TouchableOpacity>

//       {/* ----- FOTO E NOME ----- */}
//       <View style={{ alignItems: 'center', marginVertical: 20 }}>
//         <TouchableOpacity onPress={() => escolherImagem("foto")}>
//           {perfil.foto ? (
//             <Image source={{ uri: perfil.foto }} style={styles.imagemPerfil} />
//           ) : (
//             <View style={styles.placeholderImagem}>
//               <Text>Adicionar Foto</Text>
//             </View>
//           )}
//         </TouchableOpacity>
//         <Text style={styles.label}>Foto de perfil</Text>
//         <View style={styles.nomeContainer}>
//           <Text style={styles.nomeProdutor}>{perfil.nome}</Text>
//           <TouchableOpacity onPress={() => {
//             setNovoNome(perfil.nome);
//             setModalNome(true);
//           }}>
//             <Feather name="edit-2" size={18} color="#E15610" />
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* ----- RESTANTE DO PERFIL ----- */}
//       <ScrollView contentContainerStyle={{ paddingHorizontal: 24 }}>
//         <Text style={styles.inputLabel}>E-mail</Text>
//         <TextInput value={perfil.email} style={styles.input} editable={false} />

//         <Text style={styles.inputLabel}>Categoria</Text>
//         <TextInput
//           value={perfil.categoria}
//           style={styles.input}
//           editable={editando}
//           onChangeText={categoria => setPerfil(p => ({ ...p, categoria }))}
//           placeholder="Categoria ex: Orgânicos, Hortaliças..."
//         />

//         <Text style={styles.inputLabel}>Telefone</Text>
//         <TextInput
//           value={perfil.telefone}
//           style={styles.input}
//           editable={editando}
//           onChangeText={telefone => setPerfil(p => ({ ...p, telefone }))}
//           placeholder="Telefone"
//           keyboardType="phone-pad"
//         />

//         {/* Botões de editar/salvar */}
//         {editando ? (
//           <View style={{ flexDirection: 'row', gap: 18, marginTop: 18 }}>
//             <TouchableOpacity style={styles.buttonSalvar} onPress={salvarPerfil}>
//               <Text style={{ color: '#fff', fontWeight: 'bold' }}>Salvar</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.buttonCancelar} onPress={() => setEditando(false)}>
//               <Text style={{ color: '#fff', fontWeight: 'bold' }}>Cancelar</Text>
//             </TouchableOpacity>
//           </View>
//         ) : (
//           <TouchableOpacity style={styles.buttonEditar} onPress={() => setEditando(true)}>
//             <Feather name="edit-2" size={18} color="#fff" />
//             <Text style={{ color: '#fff', fontWeight: 'bold', marginLeft: 8 }}>Editar perfil</Text>
//           </TouchableOpacity>
//         )}

//         {/* ----- PRODUTOS ----- */}
//         <Text style={styles.titulo}>Estoque dos produtos</Text>
//         <FlatList
//           data={produtos}
//           keyExtractor={item => item.id}
//           renderItem={renderItem}
//           style={{ marginTop: 10 }}
//         />
//         <View style={{ marginTop: 20, gap: 10 }}>
//           <TouchableOpacity style={styles.buttonAdicionar} onPress={() => setModalNovoProduto(true)}>
//             <Text style={styles.title}>Adicionar Produto</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.buttonPedidos} onPress={() => alert("Ver pedidos")}>
//             <Text style={styles.title}>Ver Pedidos</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>

//       {/* Modal editar nome produtor */}
//       <Modal visible={modalNome} transparent animationType="fade">
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalBox}>
//             <Text style={styles.modalTitle}>Editar nome do produtor</Text>
//             <TextInput style={styles.input} value={novoNome} onChangeText={setNovoNome} />
//             <View style={styles.modalButtons}>
//               <TouchableOpacity onPress={() => setModalNome(false)}>
//                 <Text style={{ color: '#B00020' }}>Cancelar</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={() => {
//                 setPerfil(p => ({ ...p, nome: novoNome }));
//                 setModalNome(false);
//               }}>
//                 <Text style={{ color: '#4CAF50' }}>Salvar</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       {/* Modal adicionar produto */}
//       <Modal visible={modalNovoProduto} transparent animationType="fade">
//         <View style={styles.modalOverlay}>
//           <ScrollView contentContainerStyle={styles.modalBox}>
//             <Text style={styles.modalTitle}>Novo Produto</Text>
//             <TextInput placeholder="Nome" style={styles.input} value={novoNomeProd} onChangeText={setNovoNomeProd} />
//             <TextInput placeholder="Preço" style={styles.input} value={novoPrecoProd} onChangeText={setNovoPrecoProd} />
//             <TextInput placeholder="Quantidade" style={styles.input} value={novaQtdProd} onChangeText={setNovaQtdProd} />
//             <TouchableOpacity onPress={escolherImagemProduto}>
//               {imagemProdutoNovo ? (
//                 <Image source={{ uri: imagemProdutoNovo }} style={styles.produtoImagemPreview} />
//               ) : (
//                 <View style={[styles.placeholderImagem, { width: 80, height: 80 }]}><Text>Imagem</Text></View>
//               )}
//             </TouchableOpacity>
//             <View style={styles.modalButtons}>
//               <TouchableOpacity onPress={() => setModalNovoProduto(false)}>
//                 <Text style={{ color: '#B00020' }}>Cancelar</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={salvarNovoProduto}>
//                 <Text style={{ color: '#4CAF50' }}>Salvar</Text>
//               </TouchableOpacity>
//             </View>
//           </ScrollView>
//         </View>
//       </Modal>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   bannerImg: {
//     width: 300, height: 100, borderRadius: 10, marginBottom: 8, backgroundColor: "#eee"
//   },
//   bannerPlaceholder: {
//     width: 300, height: 100, borderRadius: 10, backgroundColor: "#ccc",
//     alignItems: 'center', justifyContent: 'center', marginBottom: 8,
//   },
//   imagemPerfil: { width: 120, height: 120, borderRadius: 60, backgroundColor: "#eee" },
//   placeholderImagem: {
//     width: 120, height: 120, borderRadius: 60,
//     backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center'
//   },
//   label: { fontSize: 14, color: '#555', marginBottom: 8, marginTop: -6 },
//   nomeContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 },
//   nomeProdutor: { fontSize: 18, fontWeight: 'bold' },
//   inputLabel: { fontWeight: "bold", marginBottom: 4, marginTop: 10, color: "#4D7E1B" },
//   input: {
//     borderWidth: 1, borderColor: '#ccc',
//     borderRadius: 8, padding: 10, marginBottom: 6, backgroundColor: '#fff'
//   },
//   buttonEditar: {
//     marginTop: 24,
//     flexDirection: "row",
//     backgroundColor: "#4D7E1B",
//     alignItems: "center",
//     justifyContent: "center",
//     paddingVertical: 12,
//     paddingHorizontal: 28,
//     borderRadius: 8,
//   },
//   buttonSalvar: {
//     backgroundColor: "#4D7E1B",
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//     borderRadius: 8,
//     minWidth: 100,
//     alignItems: "center"
//   },
//   buttonCancelar: {
//     backgroundColor: "#B00020",
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//     borderRadius: 8,
//     minWidth: 100,
//     alignItems: "center"
//   },
//   titulo: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 },
//   produtoItem: {
//     borderBottomWidth: 1, borderColor: '#ccc', paddingVertical: 10,
//     flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
//   },
//   produtoEsquerda: { flexDirection: 'row', alignItems: 'center', gap: 10 },
//   produtoImagem: { width: 40, height: 40, borderRadius: 5 },
//   produtoImagemPreview: { width: 80, height: 80, borderRadius: 8, marginVertical: 10 },
//   produtoNome: { fontSize: 16, fontWeight: 'bold' },
//   produtoPreco: { fontSize: 14, color: '#555' },
//   botoesContainer: { flexDirection: 'row', gap: 15, alignItems: 'center' },
//   buttonAdicionar: {
//     width: "100%", height: 52, backgroundColor: '#E15610',
//     borderRadius: 10, justifyContent: 'center', alignItems: 'center'
//   },
//   buttonPedidos: {
//     width: "100%", height: 52, backgroundColor: '#4CAF50',
//     borderRadius: 10, justifyContent: 'center', alignItems: 'center'
//   },
//   title: { fontSize: 16, fontWeight: 'bold', color: 'white' },
//   modalOverlay: {
//     flex: 1, backgroundColor: '#00000099', justifyContent: 'center', alignItems: 'center'
//   },
//   modalBox: {
//     width: '85%', backgroundColor: 'white', borderRadius: 10,
//     padding: 20, gap: 10, elevation: 5
//   },
//   modalTitle: { fontSize: 16, fontWeight: 'bold' },
//   modalButtons: {
//     flexDirection: 'row', justifyContent: 'space-between', marginTop: 10
//   }
// });

