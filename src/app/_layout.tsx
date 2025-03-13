import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Drawer } from 'expo-router/drawer'
import { Slot } from 'expo-router'
import { Feather } from '@expo/vector-icons'

export default function DrawerLayout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Drawer screenOptions={{ 
                headerShown: false, 
                drawerStyle: { backgroundColor: '#4D7E1B', width: 250 }
            }}>
                <Drawer.Screen name="index" options={{ 
                    drawerLabel: 'Início',
                    drawerLabelStyle: { color: 'white' }, 
                    drawerIcon: ({ color }) => (<Feather name='home' size={20} color={color}/>),
                }} />

                <Drawer.Screen name="dashboard" options={{ 
                    drawerLabel: 'Dashboard',
                    drawerLabelStyle: { color: 'white' },
                    drawerIcon: ({ color }) => (<Feather name='code' size={20} color={color}/>),
                }} />
            </Drawer>
        </GestureHandlerRootView>
    )
}
