import { View, Image, TouchableOpacity, Text } from "react-native";
import { DrawerToggleButton } from '@react-navigation/drawer';
import { styles } from './styles';
import { useSafeAreaInsets, SafeAreaView } from "react-native-safe-area-context";
import { AntDesign, Fontisto } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface HeaderProps {
    showFavoriteicon?: boolean;
    showGoBack?: boolean
}

export default function Header({ showFavoriteicon = false, showGoBack = false }: HeaderProps) {

    const router = useRouter();
    
    return (
        // <SafeAreaView style={styles.safeContainer} edges={["top", "left", "right"]}>
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

                {showFavoriteicon ? (
                    <View style={styles.save}>
                        <Text><Fontisto name="favorite" color={'white'} size={25}/></Text>
                    </View>

                ) : (
                    <View style={{ width: 40 }} />
                )}

                
            </View>
        // </SafeAreaView>
    );
}
