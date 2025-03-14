import { DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer"
import { router } from 'expo-router'
import { View, Text, Button, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, MaterialIcons} from "@expo/vector-icons";

export default function CustomDrawer(props: any) {

    const { top, bottom } = useSafeAreaInsets()

    return (
        <View style={{ flex:1 }}>
            <DrawerContentScrollView 
                {...props} 
                scrollEnabled={false}
                contentContainerStyle={{  }}
            >

                <View style={{ padding:20, paddingLeft: 70, paddingTop: 5}}>
                    <Image
                        source={require('../../../assets/images/logo_carro.png')}
                        style={{ 
                            width: 80, // Aumenta um pouco o tamanho da imagem
                            height: 40,
                            resizeMode: 'contain',
                            flex: 1, // Ocupa o espaço restante e permite alinhamento correto
                        }}
                    />
                </View>

                <DrawerItemList {...props}/>
                {/* <DrawerItem label={"Logout"} onPress={() => router.back()}/> */}
            </DrawerContentScrollView>

            <View style={{
                padding: 20,
                paddingLeft: 25,
                paddingBottom: 20 + bottom,
                flexDirection: "row",  // 🔹 Alinha os itens na horizontal
                alignItems: "center",   // 🔹 Alinha verticalmente o ícone e o texto
                gap: 8,  // 🔹 Espaço entre o ícone e o texto (pode ajustar)
            }}>

                <MaterialIcons name="logout" size={20} color={'white'} />
                <Text style={{ color:'white' }} >Sair</Text>

            </View>
        </View>
        )
}