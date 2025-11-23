import { Ionicons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const icons = [
  { name: "home-outline", label: "Home" },
  { name: "newspaper-outline", label: "News" },
  { name: "chatbubble-outline", label: "Chat" },
  { name: "person-outline", label: "Perfil" },
];

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  // ↓ Desce a TabBar no Android, e usa safe area no iPhone
  const safeAreaBottom = Platform.OS === "android" ? 0 : insets.bottom;

  const TAB_BAR_HEIGHT = 60 + safeAreaBottom;

  return (
    <View style={[styles.tabBarContainer, { height: TAB_BAR_HEIGHT }]}>
      <LinearGradient
        colors={["#70DEFE", "#70DEFE"]}
        style={[
          styles.tabBar,
          {
            height: TAB_BAR_HEIGHT,
            paddingBottom: safeAreaBottom,
            paddingTop: 8,
            paddingHorizontal: 12,
          },
        ]}
      >
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const icon = icons[index];

          const onPress = () => {
            if (!isFocused) navigation.navigate(route.name);
          };

          const iconName = (() => {
            if (!icon?.name) return "ellipse";
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
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,                  // ↓ garante que fica colado no fundo
    width: "100%",
    backgroundColor: "#70DEFE",
    zIndex: 1000,
  },
  tabBar: {
    width: "100%",
    flexDirection: "row",
    elevation: Platform.OS === "android" ? 8 : 0,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: -2 },
    alignItems: "center",
    justifyContent: "space-around",
    borderTopWidth: 0,
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
