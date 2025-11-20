import { Tabs } from "expo-router";
import { Platform } from "react-native";
import CustomTabBar from "../../components/CustomTabBar";

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,

        // 🔥 Ajuste para Android ficar igual ao iOS
        tabBarStyle: {
          height: Platform.OS === "android" ? 60 : 90,
          paddingBottom: Platform.OS === "android" ? 6 : 20,
          paddingTop: 6,
          backgroundColor: "white", // ou a cor da sua tabBar
          borderTopWidth: 0,
          elevation: 0,
        },

        // Evita que o expo-router coloque safeArea extra no Android
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen name="Home" options={{ title: "Home" }} />
      <Tabs.Screen name="News" options={{ title: "News" }} />
      <Tabs.Screen name="Chat" options={{ title: "Chat" }} />
      <Tabs.Screen name="Profile" options={{ title: "Perfil" }} />
    </Tabs>
  );
}
