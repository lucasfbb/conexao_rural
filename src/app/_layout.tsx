import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Drawer } from 'expo-router/drawer'

export default function Layout() {
    return  (
        <GestureHandlerRootView>
            <Drawer screenOptions={{ headerShown : false }}/>
        </GestureHandlerRootView>
    ) 
}
