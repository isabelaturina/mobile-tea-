import React from "react";
import { StyleSheet, Text, TouchableOpacity, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";

const icons = [
  { name: "home-outline", label: "Home" },
  { name: "newspaper-outline", label: "News" },
  { name: "chatbubble-outline", label: "Chat" },
  { name: "person-outline", label: "Perfil" },
];

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  const TAB_BAR_HEIGHT = 60 + insets.bottom;

  return (
    <LinearGradient
      colors={["#70DEFE", "#70DEFE"]}
      style={[
        styles.tabBar,
        { height: TAB_BAR_HEIGHT, paddingBottom: insets.bottom },
      ]}
    >
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const icon = icons[index];

        const onPress = () => {
          if (!isFocused) navigation.navigate(route.name);
        };

        // ✅ CALCULAR O NOME DO ÍCONE AQUI FORA
        const iconName = (() => {
          if (!icon || !icon.name) return "ellipse";
          if (isFocused && icon.name.endsWith("-outline")) {
            return icon.name.replace("-outline", "");
          }
          return icon.name;
        })();

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tab}
            activeOpacity={0.7}
          >
            <Ionicons
              name={iconName as any}
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
    paddingTop: 8,
    elevation: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 2 },
    alignItems: "center",
    justifyContent: "space-around",
    zIndex: 20,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
  },
  label: {
    fontSize: Dimensions.get("window").width * 0.03,
    marginTop: 2,
    fontWeight: "600",
    color: "#222",
  },
});
