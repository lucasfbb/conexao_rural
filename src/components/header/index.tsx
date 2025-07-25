import { View, Image, TouchableOpacity, Text } from "react-native";
import { DrawerToggleButton } from '@react-navigation/drawer';
import { styles } from './styles';
import { useSafeAreaInsets, SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { AntDesign, Fontisto } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useFavoritos } from "@/contexts/FavoritosContext";
import { useTema } from "@/contexts/ThemeContext";

interface HeaderProps {
    showFavoriteicon?: boolean;
    showGoBack?: boolean
    cpf_cnpj?: string;
}

export default function Header({ showFavoriteicon = false, showGoBack = false, cpf_cnpj }: HeaderProps) {

    const { isFavorito, adicionarFavorito, removerFavorito } = useFavoritos();

    const router = useRouter();
    const { colors } = useTema();

    const favorito = cpf_cnpj ? isFavorito(cpf_cnpj) : false;

    const toggleFavorito = () => {
        if (!cpf_cnpj) return;
        favorito ? removerFavorito(cpf_cnpj) : adicionarFavorito(cpf_cnpj);
    };
    
    return (
        
            <View style={styles.container}>

                {/* Drawer ou botao de voltar */}

                {/* {showGoBack && backRoute === 'home' ? (
                    <View style={styles.toggleButton}>
                        <TouchableOpacity onPress={() => router.push('/home')}>
                            <Text><AntDesign name="back" color={'white'} size={25}/></Text>
                        </TouchableOpacity>
                    </View>

                ) : showGoBack && backRoute === 'produtorProfile' ? (
                    <View style={styles.toggleButton}>
                        <TouchableOpacity onPress={() => router.push('/home/produtorProfile')}>
                            <Text><AntDesign name="back" color={'white'} size={25}/></Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.toggleButton}>
                        <DrawerToggleButton tintColor="white" />
                    </View>
                )} */}

                {showGoBack ? (
                    <View style={styles.toggleButton}>
                        <TouchableOpacity onPress={() => router.back()}>
                            <Text><AntDesign name="back" color={'white'} size={25}/></Text>
                        </TouchableOpacity>
                    </View>

                ) :  (
                    <View style={styles.toggleButton}>
                        <DrawerToggleButton tintColor="white" />
                    </View>
                )}

                
                <Image source={require("../../../assets/images/logo_comprido.png")} style={styles.img} />
               
                {/* ícone de save ou espaço vazio */}

                {/* Ícone de carrinho */}
                <TouchableOpacity style={styles.save} onPress={()=> router.push('/carrinho')}>
                    <Feather name="shopping-cart" size={20} color={'white'} />
                </TouchableOpacity>
                
            </View>
       
    );
}
