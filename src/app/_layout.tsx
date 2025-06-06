import { useEffect, useState } from "react";
import { usePathname, router, Slot } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";
import { View } from 'react-native'

import CustomDrawer from "@/components/customDrawer"
import { AppProvider } from "@/providers/AppProvider";

export default function DrawerLayout() {

    const pathname = usePathname(); // Obtém a rota atual

    const usuario = {
        nome: "João",
        tipo: "produtor", // ou "cliente"
    };

    return (
        <AppProvider>
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
                        name="home"
                        options={{ 
                            drawerLabel: "Início",
                            drawerLabelStyle: { color: "white" },
                            drawerIcon: ({ color }) => <Feather name="home" size={20} color={'white'} />,
                        }} 
                    />

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

                    {usuario.tipo === "produtor" ? 
                        <Drawer.Screen 
                            name="areaProdutor"
                            options={{ 
                            drawerLabel: "Área do Produtor",
                            drawerLabelStyle: { color: "white" },
                            drawerIcon: ({ color }) => <Feather name="package" size={20} color={'white'} />,
                            }} 
                        /> :

                        <Drawer.Screen 
                            name="areaProdutor" 
                            options={{ 
                                drawerLabel: () => null, // 🔹 Oculta do menu
                                title: "", // 🔹 Remove o título do header
                                drawerItemStyle: { height: 0 } // 🔹 Evita espaço vazio no Drawer
                            }} 
                    />

                    }

                    <Drawer.Screen 
                        name="login" 
                        options={{ 
                            drawerLabel: () => null, // 🔹 Oculta do menu
                            title: "", // 🔹 Remove o título do header
                            drawerItemStyle: { height: 0 } // 🔹 Evita espaço vazio no Drawer
                        }} 
                    />

                    <Drawer.Screen 
                        name="index"
                        options={{ 
                            drawerLabel: () => null, // 🔹 Oculta do menu
                            title: "", // 🔹 Remove o título do header
                            drawerItemStyle: { height: 0 } // 🔹 Evita espaço vazio no Drawer
                        }} 
                    />

                </Drawer>
            </GestureHandlerRootView>
        </AppProvider>
    );
}
