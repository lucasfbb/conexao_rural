import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { StyleSheet} from 'react-native'
import { Drawer } from 'expo-router/drawer'
import { Feather } from '@expo/vector-icons'

export default function Layout() {
    return  (
        <GestureHandlerRootView>
            <Drawer screenOptions={{ headerShown : false, drawerStyle: { 
                backgroundColor: '#4D7E1B',
                width: 250 
            }}}>
                <Drawer.Screen name='index' options={{ 
                    drawerLabel: 'Ínicio',
                    drawerLabelStyle: { color: 'white' }, 
                    drawerIcon: ({ color }) => (<Feather name='home' size={20} color={color}/>),
                }} />

                <Drawer.Screen name='dashboard' options={{ 
                    drawerLabel: 'Dashboard',
                    drawerLabelStyle: { color: 'white' },
                    drawerIcon: ({ color }) => (<Feather name='code' size={20} color={color}/>),
                }} />
            </Drawer>
        </GestureHandlerRootView>
    ) 
}

