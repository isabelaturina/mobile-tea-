import { Tabs } from "expo-router";
import { ThemeProvider } from "../../contexts/ThemeContext"; // importa o provider
import CustomTabBar from "../../components/CustomTabBar";

export default function TabsLayout() {
  return (
    <ThemeProvider>
      <Tabs
        tabBar={props => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="Home"
          options={{ title: "Home" }}
        />
        <Tabs.Screen
          name="News"
          options={{ title: "News" }}
        />
        <Tabs.Screen
          name="Chat"
          options={{ title: "Chat" }}
        />
        <Tabs.Screen
          name="Profile"
          options={{ title: "Perfil" }}
        />
      </Tabs>
    </ThemeProvider>
  );
}
