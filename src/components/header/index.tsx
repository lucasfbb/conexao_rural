import { View, Image, TouchableOpacity } from "react-native";
import { DrawerToggleButton } from '@react-navigation/drawer';
import { styles } from './styles';
import { useSafeAreaInsets, SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

export default function Header() {

    return (
        <SafeAreaView style={styles.safeContainer} edges={["top", "left", "right"]}>
            <View style={styles.container}>
                <View style={styles.toggleButton}>
                    <DrawerToggleButton tintColor="white" />
                </View>

                {/* <TouchableOpacity onPress={() => router.push('/home')} style={styles.img}> */}
                    <Image source={require("../../../assets/images/logo_comprido.png")} style={styles.img} />
                {/* </TouchableOpacity> */}
                {/* 🔹 Espaço vazio para alinhar corretamente */}
                <View style={{ width: 40 }} />
            </View>
        </SafeAreaView>
    );
}
