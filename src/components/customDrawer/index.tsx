import { DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer"
import { router } from 'expo-router'
import { View, Text, Button, Image, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, MaterialIcons} from "@expo/vector-icons";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "@/contexts/UserContext";


export default function CustomDrawer(props: any) {

    const { logout } = useUser();

    const handleLogout = async () => {
        try {
            await logout();
            await AsyncStorage.removeItem("usuario");
            await AsyncStorage.removeItem("token");
          
            router.replace("/login/loginPage"); // Redireciona para a página inicial ou login
        } catch (error) {
            console.error("Erro ao fazer logout:", error);
        }
    };

    const { top, bottom } = useSafeAreaInsets()

    return (
        <View style={{ flex:1 }}>
            <DrawerContentScrollView 
                {...props} 
                scrollEnabled={false}
                contentContainerStyle={{  }}
            >

                <View style={{ padding:20, paddingLeft: 70, paddingTop: 5}}>
                    <TouchableOpacity onPress={() => router.push('/home')}>
                        <Image
                            source={require('../../../assets/images/logo_carro.png')}
                            style={{ 
                                width: 80, // Aumenta um pouco o tamanho da imagem
                                height: 40,
                                resizeMode: 'contain',
                                flex: 1, // Ocupa o espaço restante e permite alinhamento correto
                            }}
                        />
                    </TouchableOpacity>
                </View>

                <DrawerItemList {...props}/>
                {/* <DrawerItem label={"Logout"} onPress={() => router.back()}/> */}
            </DrawerContentScrollView>

            <TouchableOpacity
                onPress={handleLogout}
                style={{
                    padding: 20,
                    paddingLeft: 25,
                    paddingBottom: 30 + bottom,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                }}
            >
                <MaterialIcons name="logout" size={20} color={'white'} />
                <Text style={{ color:'white' }}>Sair</Text>
            </TouchableOpacity>
        </View>
        )
}