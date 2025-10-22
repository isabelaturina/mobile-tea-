import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../contexts/ThemeContext";

// Importa sua imagem da seta
import setaImg from "../assets/images/seta.png";

export default function ClinicasProximas() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  // 🎨 Define cores com base no tema
  const colors = isDarkMode
    ? {
        background: "#000000",
        textPrimary: "#F8FAFC",
        textSecondary: "#94A3B8",
        card: "#1E293B",
        accent: "#3B82F6",
        lightAccent: "#60A5FA",
        border: "#334155",
        placeholder: "#64748B",
        cardLight: "#334155",
      }
    : {
        background: "#fff",
        textPrimary: "#111",
        textSecondary: "#555",
        card: "#FFFFFF",
        accent: "#3B82F6",
        lightAccent: "#70DEFE",
        border: "#E5E7EB",
        placeholder: "#999",
        cardLight: "#F1F8FF",
      };

  const [busca, setBusca] = useState("");
  const [clinicas, setClinicas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const buscarClinicas = async () => {
    setErro("");
    setLoading(true);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErro("Permissão de localização negada.");
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Substitua pela sua URL real
      const response = await fetch(
        `https://suaapi.com/clinicas?lat=${latitude}&lng=${longitude}&busca=${busca}`
      );
      const data = await response.json();

      setClinicas(data);
    } catch (err) {
      console.error(err);
      setErro("Erro ao buscar clínicas.");
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: any) => (
    <View style={[styles.card, { backgroundColor: colors.cardLight }]}>
      <Text style={[styles.nome, { color: colors.textPrimary }]}>{item.nome}</Text>
      <Image
        source={{ uri: item.imagemUrl }}
        style={styles.imagem}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Ionicons name="location" size={16} color={colors.textSecondary} />
        <Text style={[styles.texto, { color: colors.textSecondary }]}>{item.endereco}</Text>
      </View>
      <View style={styles.info}>
        <Ionicons name="time" size={16} color={colors.textSecondary} />
        <Text style={[styles.texto, { color: colors.textSecondary }]}>{item.horario}</Text>
      </View>
      <Text style={[styles.especialidade, { color: colors.textSecondary }]}>
        Especialidade: {item.especialidade}
      </Text>
      <TouchableOpacity style={[styles.botao, { backgroundColor: colors.accent }]}>
        <Text style={styles.botaoTexto}>Saiba Mais</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Botão Voltar */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Image source={setaImg} style={[styles.backImage, { tintColor: colors.textPrimary }]} />
      </TouchableOpacity>

      <Text style={[styles.titulo, { color: colors.textPrimary }]}>Clínicas Próximas</Text>

      <View style={styles.searchContainer}>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.textPrimary }]}
          placeholder="Busque por clínicas próximas a você"
          placeholderTextColor={colors.placeholder}
          value={busca}
          onChangeText={setBusca}
        />
        <TouchableOpacity style={[styles.searchButton, { backgroundColor: colors.accent }]} onPress={buscarClinicas}>
          <Text style={styles.searchButtonText}>Clique Aqui</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <ActivityIndicator
          size="large"
          color={colors.accent}
          style={{ marginTop: 20 }}
        />
      )}

      {erro !== "" && <Text style={[styles.erro, { color: "#EF4444" }]}>{erro}</Text>}

      {!loading && clinicas.length === 0 && erro === "" && (
        <Text style={[styles.vazio, { color: colors.textSecondary }]}>Nenhuma clínica encontrada.</Text>
      )}

      <FlatList
        data={clinicas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.lista}
        horizontal={false}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? 30 : 0,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  backImage: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 70,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 8,
    marginBottom: -50,
  },
  searchButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginBottom: -50,
  },
  searchButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },
  card: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imagem: {
    width: "100%",
    height: 140,
    borderRadius: 12,
    marginBottom: 8,
  },
  nome: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
  info: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  texto: {
    marginLeft: 6,
    fontSize: 13,
  },
  especialidade: {
    marginTop: 6,
    fontSize: 13,
  },
  botao: {
    marginTop: 10,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  botaoTexto: {
    color: "#fff",
    fontWeight: "bold",
  },
  erro: {
    textAlign: "center",
    marginTop: 10,
  },
  vazio: {
    textAlign: "center",
    marginTop: 20,
  },
  lista: {
    paddingBottom: 60,
  },
});
