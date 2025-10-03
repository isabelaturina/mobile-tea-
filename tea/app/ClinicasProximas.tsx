import { Ionicons } from "@expo/vector-icons";
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
import { useNavigation } from "@react-navigation/native";

// Importa sua imagem da seta
import setaImg from "../assets/images/seta.png";

export default function ClinicasProximas() {
  const navigation = useNavigation();

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
    <View style={styles.card}>
      <Text style={styles.nome}>{item.nome}</Text>
      <Image
        source={{ uri: item.imagemUrl }}
        style={styles.imagem}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Ionicons name="location" size={16} color="#333" />
        <Text style={styles.texto}>{item.endereco}</Text>
      </View>
      <View style={styles.info}>
        <Ionicons name="time" size={16} color="#333" />
        <Text style={styles.texto}>{item.horario}</Text>
      </View>
      <Text style={styles.especialidade}>
        Especialidade: {item.especialidade}
      </Text>
      <TouchableOpacity style={styles.botao}>
        <Text style={styles.botaoTexto}>Saiba Mais</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Botão Voltar */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Image source={setaImg} style={styles.backImage} />
      </TouchableOpacity>

      <Text style={styles.titulo}>Clínicas Próximas</Text>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Busque por clínicas próximas a você"
          value={busca}
          onChangeText={setBusca}
        />
        <TouchableOpacity style={styles.searchButton} onPress={buscarClinicas}>
          <Text style={styles.searchButtonText}>Clique Aqui</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <ActivityIndicator
          size="large"
          color="#3B82F6"
          style={{ marginTop: 20 }}
        />
      )}

      {erro !== "" && <Text style={styles.erro}>{erro}</Text>}

      {!loading && clinicas.length === 0 && erro === "" && (
        <Text style={styles.vazio}>Nenhuma clínica encontrada.</Text>
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
    backgroundColor: "#fff",
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
    tintColor: "#000", // Se quiser a seta branca, use '#fff'
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
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 8,
    backgroundColor: "#f1f1f1",
    marginBottom: -50,
  },
  searchButton: {
    backgroundColor: "#3B82F6",
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
    backgroundColor: "#F1F8FF",
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
    color: "#333",
  },
  especialidade: {
    marginTop: 6,
    fontSize: 13,
    color: "#555",
  },
  botao: {
    marginTop: 10,
    backgroundColor: "#1D4ED8",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  botaoTexto: {
    color: "#fff",
    fontWeight: "bold",
  },
  erro: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
  vazio: {
    textAlign: "center",
    color: "#999",
    marginTop: 20,
  },
  lista: {
    paddingBottom: 60,
  },
});
