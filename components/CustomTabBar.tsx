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
  return (
    <LinearGradient
      colors={["#70DEFE", "#70DEFE"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.tabBar}
    >
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
    flexDirection: "row",
    paddingBottom: Platform.OS === 'android' ? 0 : 10,
    elevation: Platform.OS === 'android' ? 8 : 0,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { 
      width: 0, 
      height: Platform.OS === 'android' ? 2 : -2 
    },
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: '2%',
    paddingTop: Platform.OS === 'android' ? 10 : 5,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Platform.OS === 'android' ? 8 : 10,
  },
  label: {
    fontSize: Dimensions.get('window').width * 0.03,
    color: "#222",
    marginTop: 4,
    fontWeight: "600",
  },
});