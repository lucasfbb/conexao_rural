import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";

import CustomDrawer from "@/components/customDrawer"

export default function DrawerLayout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Drawer drawerContent={CustomDrawer} screenOptions={{ 
                    headerShown: false, 
                    drawerStyle: { backgroundColor: "#4D7E1B", width: 250 },
                    // drawerHideStatusBarOnOpen: true
                    drawerActiveBackgroundColor: "#396110",
                    drawerActiveTintColor: 'white'

                }}>
                {/* 🔹 Cada item do Drawer aponta para um Stack Navigator */}
                <Drawer.Screen 
                    name="perfil"
                    options={{ 
                        drawerLabel: "Perfil",
                        drawerLabelStyle: { color: "white" },
                        drawerIcon: ({ color }) => <Feather name="user" size={20} color={'white'} />,
                    }} 
                />
                <Drawer.Screen 
                    name="notificacoes"
                    options={{ 
                        drawerLabel: "Notificações",
                        drawerLabelStyle: { color: "white" },
                        drawerIcon: ({ color }) => <Feather name="bell" size={20} color={'white'} />,
                    }} 
                />
                <Drawer.Screen 
                    name="carrinho"
                    options={{ 
                        drawerLabel: "Carrinho",
                        drawerLabelStyle: { color: "white" },
                        drawerIcon: ({ color }) => <Feather name="shopping-cart" size={20} color={'white'} />,
                    }} 
                />
                <Drawer.Screen 
                    name="configuracoes"
                    options={{ 
                        drawerLabel: "Configurações",
                        drawerLabelStyle: { color: "white" },
                        drawerIcon: ({ color }) => <Feather name="settings" size={20} color={'white'} />,
                    }} 
                />
            </Drawer>
        </GestureHandlerRootView>
    );
}
