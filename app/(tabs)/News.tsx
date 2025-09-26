import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

export default function News() {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const newsItems = [
    {
      id: 1,
      title: "Dicas para uma vida mais saudável",
      excerpt: "Descubra como pequenas mudanças podem transformar sua saúde...",
      category: "Saúde",
      readTime: "3 min",
    },
    {
      id: 2,
      title: "Benefícios do exercício regular",
      excerpt:
        "Saiba por que a atividade física é essencial para o bem-estar...",
      category: "Fitness",
      readTime: "5 min",
    },
    {
      id: 3,
      title: "Alimentação equilibrada",
      excerpt: "Guia completo para uma alimentação saudável e nutritiva...",
      category: "Nutrição",
      readTime: "4 min",
    },
    {
      id: 4,
      title: "Meditação para iniciantes",
      excerpt:
        "Aprenda técnicas simples de meditação para reduzir o estresse...",
      category: "Bem-estar",
      readTime: "6 min",
    },
  ];

  // Cores dinâmicas
  const colors = {
    background: isDarkMode ? "#121212" : "#F8F9FA",
    headerGradient: isDarkMode
      ? ["#4B0082", "#1E40AF"]
      : ["#00C6FF", "#96bfffff"],
    textPrimary: isDarkMode ? "#fff" : "#333",
    textSecondary: isDarkMode ? "#ccc" : "#666",
    cardBackground: isDarkMode ? "#1E1E1E" : "#fff",
    categoryBackground: isDarkMode ? "#333" : "#E3F2FD",
    categoryText: isDarkMode ? "#70DEF5" : "#1163E7",
    readMoreColor: isDarkMode ? "#70DEF5" : "#1163E7",
  };

  return (
<View style={[styles.container, { backgroundColor: colors.background }]}>
  <LinearGradient
    colors={isDarkMode ? ['#4B0082', '#1E40AF'] : ['#00C6FF', '#96bfffff']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={styles.header}
  >
    <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
      Notícias
    </Text>
    <Text style={[styles.headerSubtitle, { color: colors.textPrimary }]}>
      Fique por dentro das novidades
    </Text>
  </LinearGradient>

  <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
    {newsItems.map((item) => (
      <TouchableOpacity
        key={item.id}
        style={[
          styles.newsCard,
          { backgroundColor: colors.cardBackground },
        ]}
      >
        <View style={styles.newsHeader}>
          <View
            style={[
              styles.categoryBadge,
              { backgroundColor: colors.categoryBackground },
            ]}
          >
            <Text
              style={[styles.categoryText, { color: colors.categoryText }]}
            >
              {item.category}
            </Text>
          </View>
          <View style={styles.readTimeContainer}>
            <Ionicons
              name="time-outline"
              size={14}
              color={colors.textSecondary}
            />
            <Text
              style={[styles.readTimeText, { color: colors.textSecondary }]}
            >
              {item.readTime}
            </Text>
          </View>
        </View>

        <Text style={[styles.newsTitle, { color: colors.textPrimary }]}>
          {item.title}
        </Text>
        <Text style={[styles.newsExcerpt, { color: colors.textSecondary }]}>
          {item.excerpt}
        </Text>

        <View style={styles.newsFooter}>
          <TouchableOpacity style={styles.readMoreButton}>
            <Text
              style={[styles.readMoreText, { color: colors.readMoreColor }]}
            >
              Ler mais
            </Text>
            <Ionicons
              name="arrow-forward"
              size={16}
              color={colors.readMoreColor}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    ))}
  </ScrollView>
</View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  headerSubtitle: { fontSize: 16, textAlign: "center", opacity: 0.9 },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 30 },
  newsCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  newsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: { fontSize: 12, fontWeight: "bold" },
  readTimeContainer: { flexDirection: "row", alignItems: "center" },
  readTimeText: { fontSize: 12, marginLeft: 4 },
  newsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    lineHeight: 24,
  },
  newsExcerpt: { fontSize: 14, lineHeight: 20, marginBottom: 16 },
  newsFooter: { alignItems: "flex-end" },
  readMoreButton: { flexDirection: "row", alignItems: "center" },
  readMoreText: { fontSize: 14, fontWeight: "bold", marginRight: 4 },
});
