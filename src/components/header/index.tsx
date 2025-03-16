import { View, Image } from "react-native";
import { DrawerToggleButton } from '@react-navigation/drawer';
import { styles } from './styles';
import { useSafeAreaInsets, SafeAreaView } from "react-native-safe-area-context";

export default function Header() {

    return (
        <SafeAreaView style={styles.safeContainer} edges={["top", "left", "right"]}>
            <View style={styles.container}>
                <View style={styles.toggleButton}>
                    <DrawerToggleButton tintColor="white" />
                </View>

                <Image source={require("../../../assets/images/logo_comprido.png")} style={styles.img} />

                {/* 🔹 Espaço vazio para alinhar corretamente */}
                <View style={{ width: 40 }} />
            </View>
        </SafeAreaView>
    );
}
