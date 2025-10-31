import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

// Interface atualizada para garantir 'link' e 'imagem'
interface Noticia {
  id: string | number;
  titulo: string;
  descricao: string;
  link: string; // OBRIGATÓRIO para o "Ler mais"
  imagem: string; // OBRIGATÓRIO para exibir a imagem
  dataPublicacao?: string;
  categoria?: string;
  tempo_leitura?: string;
  data?: string;
}

export default function NoticiasScreen() {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const colors = {
    background: isDarkMode ? "#121212" : "#F8F9FA",
    headerGradient: isDarkMode
      ? (["#158EE5", "#A05BF0"] as [string, string])
      : (["#00C6FF", "#96bfffff"] as [string, string]),
    textPrimary: isDarkMode ? "#fff" : "#333",
    textSecondary: isDarkMode ? "#ccc" : "#666",
    cardBackground: isDarkMode ? "#1E1E1E" : "#fff",
    categoryBackground: isDarkMode ? "#333" : "#E3F2FD",
    categoryText: isDarkMode ? "#70DEF5" : "#1163E7",
    readMoreColor: isDarkMode ? "#70DEF5" : "#1163E7",
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("https://apinoticias-l1s9.onrender.com/api/noticias");

        if (!response.ok) throw new Error("Erro ao carregar notícias");
        const data: Noticia[] = await response.json();
        
        // Garante que cada item tenha um 'id' para a key do map
        const dataWithId = data.map((item, index) => ({
            ...item,
            id: item.dataPublicacao || index, 
        }));

        setNoticias(dataWithId);
      } catch (err: any) {
        setError("Não foi possível carregar as notícias. Tente novamente mais tarde.");
        console.error("Erro na API:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const abrirLink = async (url: string) => {
    const encodedUrl = encodeURI(url);

    try {
      const supported = await Linking.canOpenURL(encodedUrl);

      if (supported) {
        await Linking.openURL(encodedUrl);
      } else {
        Alert.alert('Erro', 'Não foi possível abrir o link. Verifique a URL.');
        console.error(`Não foi possível abrir a URL: ${encodedUrl}`);
      }
    } catch (err) {
      console.error("Erro ao tentar abrir o link:", err);
      Alert.alert('Erro', 'Ocorreu um erro ao tentar abrir o link.');
    }
  };


  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* HEADER: ESTILO ANTIGO PRESERVADO */}
      <LinearGradient
        colors={colors.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          Notícias
        </Text>
        <Text style={[styles.headerSubtitle, { color: colors.textPrimary }]}>
          Fique por dentro das novidades sobre autismo
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.readMoreColor} />
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
              Carregando notícias...
            </Text>
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={40} color="#EF4444" />
            <Text style={[styles.errorText, { color: colors.textSecondary }]}>
              {error}
            </Text>
          </View>
        )}

        {!loading && !error && noticias.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons name="newspaper-outline" size={48} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Nenhuma notícia encontrada.
            </Text>
          </View>
        )}

        {!loading &&
          !error &&
          noticias.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.newsCard, { backgroundColor: colors.cardBackground }]}
              onPress={() => abrirLink(item.link)} // Abrir link ao tocar no card inteiro
            >
              {/* 🛑 IMAGEM RE-ADICIONADA AQUI */}
              {item.imagem && <Image source={{ uri: item.imagem }} style={styles.newsImage} />}
              
              <View style={styles.newsHeader}>
                <View
                  style={[
                    styles.categoryBadge,
                    { backgroundColor: colors.categoryBackground },
                  ]}
                >
                  <Text style={[styles.categoryText, { color: colors.categoryText }]}>
                    {item.categoria || "TEA+"}
                  </Text>
                </View>

                {item.tempo_leitura && (
                  <View style={styles.readTimeContainer}>
                    <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
                    <Text style={[styles.readTimeText, { color: colors.textSecondary }]}>
                      {item.tempo_leitura}
                    </Text>
                  </View>
                )}
              </View>

              <Text style={[styles.newsTitle, { color: colors.textPrimary }]}>
                {item.titulo}
              </Text>
              <Text style={[styles.newsExcerpt, { color: colors.textSecondary }]}>
                {item.descricao}
              </Text>

              <View style={styles.newsFooter}>
                <TouchableOpacity style={styles.readMoreButton} onPress={() => abrirLink(item.link)}>
                  <Text style={[styles.readMoreText, { color: colors.readMoreColor }]}>
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
  // ESTILOS DO HEADER
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
  // ESTILO PARA A IMAGEM DA NOTÍCIA
  newsImage: {
    width: "100%",
    height: 200, // Altura padrão
    borderRadius: 10,
    marginBottom: 16,
    // Garante que a imagem se ajuste bem dentro do contêiner
    resizeMode: 'cover', 
  },
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
  loadingContainer: { alignItems: "center", marginTop: 60 },
  loadingText: { marginTop: 10, fontSize: 16 },
  errorContainer: { alignItems: "center", marginTop: 60, paddingHorizontal: 20 },
  errorText: { marginTop: 10, fontSize: 16, textAlign: "center" },
  emptyContainer: { alignItems: "center", marginTop: 60 },
  emptyText: { marginTop: 10, fontSize: 16, textAlign: "center" },
});