import { Tabs } from "expo-router";
import CustomTabBar from "../../components/CustomTabBar";

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        // Remover tabBarStyle padrão para usar apenas o CustomTabBar
        tabBarStyle: { 
          display: 'none',
          height: 0,
          elevation: 0,
        },
      }}
    >
      <Tabs.Screen name="Home" options={{ title: "Home" }} />
      <Tabs.Screen name="News" options={{ title: "News" }} />
      <Tabs.Screen name="Chat" options={{ title: "Chat" }} />
      <Tabs.Screen name="Profile" options={{ title: "Perfil" }} />
    </Tabs>
  );
}
