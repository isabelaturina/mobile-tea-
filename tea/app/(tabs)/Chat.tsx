import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext"; // verifique o caminho

export default function Chat() {
  const router = useRouter();
  const { theme } = useTheme(); // pega o tema atual
  const isDarkMode = theme === "dark"; // converte para booleano

  const chatRooms = [
    {
      id: 1,
      name: "Chat em grupo",
      subtitle: "Se comunique com os usuarios do app!!",
      icon: require("../../assets/images/tea-icon.png"),
      route: "/../../ChatGrupo",
    },
    {
      id: 2,
      name: "Bea",
      subtitle: "Converse com a Bea, sua companheira digital.",
      icon: require("../../assets/images/bea-icon.png"),
      route: "/ChatBea",
      
    },
  ];

  const colors = {
    background: isDarkMode ? "#121212" : "#F8F9FA",
    textPrimary: isDarkMode ? "#fff" : "#333",
    textSecondary: isDarkMode ? "#ccc" : "#333",
    cardBackground: isDarkMode ? "#1E1E1E" : "#fff",
    avatarBackground: isDarkMode ? "#333" : "#E3F2FD",
    subtitleColor: isDarkMode ? "#90CAF9" : "#2196F3",
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Chats</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Encontre apoio, compartilhe vivências, e faça parte da comunidade Tea+
        </Text>

        {chatRooms.map((room) => (
          <TouchableOpacity
            key={room.id}
            style={[
              styles.chatCard,
              { backgroundColor: colors.cardBackground },
            ]}
            onPress={() => router.push(room.route as any)}
          >
            <View
              style={[
                styles.avatarContainer,
                { backgroundColor: colors.avatarBackground },
              ]}
            >
              <Image source={room.icon} style={styles.avatarImage} />
            </View>
            <View style={styles.chatInfo}>
              <Text style={[styles.chatName, { color: colors.textPrimary }]}>
                {room.name}
              </Text>
              <Text
                style={[styles.chatSubtitle, { color: colors.subtitleColor }]}
              >
                {room.subtitle}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, top: 0 },
  content: { flex: 1, paddingHorizontal: 12, paddingTop: 32 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
    textAlign: "left",
  },
  subtitle: {
    fontSize: 15,
    color: '#333',
    marginBottom: 18,
    textAlign: 'left',
  },
  chatCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarImage: { width: 44, height: 44, borderRadius: 22, resizeMode: "cover" },
  chatInfo: { flex: 1, justifyContent: "center" },
  chatName: { fontSize: 17, fontWeight: "bold", marginBottom: 2 },
  chatSubtitle: { fontSize: 14, marginBottom: 0 },
});
