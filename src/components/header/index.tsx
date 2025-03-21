import { View, Image, TouchableOpacity, Text } from "react-native";
import { DrawerToggleButton } from '@react-navigation/drawer';
import { styles } from './styles';
import { useSafeAreaInsets, SafeAreaView } from "react-native-safe-area-context";
import { AntDesign, Fontisto } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface HeaderProps {
    showFavoriteicon?: boolean;
    showGoBack?: boolean
    backRoute?: string
}

export default function Header({ showFavoriteicon = false, showGoBack = false, backRoute = '/home'}: HeaderProps) {

    const router = useRouter();
    
    return (
        <SafeAreaView style={styles.safeContainer} edges={["top", "left", "right"]}>
            <View style={styles.container}>

                {/* {showGoBack && backRoute ? (
                    <View style={styles.toggleButton}>
                        <TouchableOpacity onPress={() => router.push(backRoute as const)}>
                            <Text><AntDesign name="back" color={'white'} size={25}/></Text>
                        </TouchableOpacity>
                    </View>

                ) : (
                    <View style={styles.toggleButton}>
                        <DrawerToggleButton tintColor="white" />
                    </View>
                )} */}

                    <View style={styles.toggleButton}>
                        <DrawerToggleButton tintColor="white" />
                    </View>

                {/* <TouchableOpacity onPress={() => router.push('/home')} style={styles.img}> */}
                    <Image source={require("../../../assets/images/logo_comprido.png")} style={styles.img} />
                {/* </TouchableOpacity> */}
                {/* 🔹 Espaço vazio para alinhar corretamente */}

                {showFavoriteicon ? (
                    <View style={styles.save}>
                        <Text><Fontisto name="favorite" color={'white'} size={25}/></Text>
                    </View>

                ) : (
                    <View style={{ width: 40 }} />
                )}

                
            </View>
        </SafeAreaView>
    );
}
