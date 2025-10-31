import React from "react";
import { StyleSheet, Text, TouchableOpacity, Platform, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { LinearGradient } from "expo-linear-gradient";

const icons = [
  { name: "home-outline", label: "Home" },
  { name: "newspaper-outline", label: "News" }, // Ícone válido do Ionicons
  { name: "chatbubble-outline", label: "Chat" },
  { name: "person-outline", label: "Perfil" },
  
];

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  // Altura do tabBar ajustada por plataforma para evitar "flutuar" no Android
  const TAB_BAR_HEIGHT = Platform.OS === "android" ? 64 : 84;

  return (
    <LinearGradient
      colors={["#70DEFE", "#70DEFE"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      // aplica altura dinâmica e garante que o tab bar fique fixo na parte inferior em Android
      style={[styles.tabBar, { height: TAB_BAR_HEIGHT }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;
        const icon = icons[index] || { name: "ellipse-outline", label };

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={onPress}
            style={styles.tab}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isFocused ? icon.name.replace("-outline", "") as any : icon.name as any}
              size={28}
              color={isFocused ? "#fff" : "#222"}
            />
            <Text style={[styles.label, isFocused && { color: "#fff" }]}>
              {icon.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingTop: Platform.OS === "android" ? 8 : 12,
    paddingBottom: Platform.OS === "android" ? 8 : 12,
    elevation: 12,
    zIndex: 20,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "transparent",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Platform.OS === 'android' ? 8: 10,
  },
  label: {
    fontSize: Dimensions.get('window').width * 0.03,
    color: "#222",
    marginTop: 2,
    fontWeight: "600",
  },
});