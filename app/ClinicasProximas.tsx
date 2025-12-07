import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../contexts/ThemeContext";
import { Clinica, clinicasApi } from "../services/api/clinicasApi";

export default function ClinicasProximas() {
  const router = useRouter();
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
  const [clinicas, setClinicas] = useState<Clinica[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const buscarClinicas = async () => {
    setErro("");
    setLoading(true);
    setClinicas([]); // Limpa resultados anteriores

    try {
      console.log("📍 Iniciando busca de clínicas em São Paulo...");
      
      // Usa coordenadas fixas de São Paulo (a API já usa por padrão)
      console.log("🔄 Chamando API com coordenadas fixas de São Paulo");
      
      const data = await clinicasApi.buscarProximas();

      console.log("📋 Dados retornados da API:", JSON.stringify(data, null, 2));
      console.log("📊 Tipo:", typeof data);
      console.log("📊 É array?", Array.isArray(data));
      console.log("📊 Quantidade de clínicas:", data?.length || 0);
      
      if (data && Array.isArray(data) && data.length > 0) {
        console.log("✅ Clínicas encontradas! Definindo no estado...");
        setClinicas(data);
      } else {
        console.log("⚠️ Nenhuma clínica encontrada ou dados inválidos");
        setClinicas([]);
        if (!erro) {
          setErro("Nenhuma clínica encontrada na sua região.");
        }
      }
    } catch (err: any) {
      console.error("❌ Erro completo ao buscar clínicas:", err);
      console.error("❌ Stack:", err?.stack);
      console.error("❌ Message:", err?.message);
      const mensagemErro = err?.message || "Erro ao buscar clínicas. Tente novamente.";
      setErro(mensagemErro);
      setClinicas([]);
    } finally {
      console.log("🏁 Finalizando busca (loading = false)");
      setLoading(false);
    }
  };

  const abrirLocalizacao = async (endereco: string) => {
    try {
      // Codifica o endereço para URL
      const enderecoCodificado = encodeURIComponent(endereco);
      
      // Tenta abrir no Google Maps (funciona em Android e iOS)
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${enderecoCodificado}`;
      
      const supported = await Linking.canOpenURL(googleMapsUrl);
      
      if (supported) {
        await Linking.openURL(googleMapsUrl);
      } else {
        // Fallback: tenta abrir no Apple Maps (iOS) ou Google Maps web
        const mapsUrl = Platform.OS === 'ios' 
          ? `http://maps.apple.com/?q=${enderecoCodificado}`
          : `https://www.google.com/maps/search/?api=1&query=${enderecoCodificado}`;
        
        await Linking.openURL(mapsUrl);
      }
    } catch (err) {
      console.error("Erro ao abrir localização:", err);
      Alert.alert('Erro', 'Não foi possível abrir o mapa. Verifique se há um aplicativo de mapas instalado.');
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    // Normaliza os campos da API (pode ter nomes diferentes)
    const nome = item.nome || item.name || item.nomeFantasia || "Clínica sem nome";
    const endereco = item.endereco || item.endereço || item.address || item.logradouro || "Endereço não informado";
    const imagemUrl = item.imagemUrl || item.imagem || item.foto || item.imageUrl;
    const horario = item.horario || item.horarioFuncionamento || item.funcionamento;
    const especialidade = item.especialidade || item.tipo || item.categoria;
    const distancia = item.distancia || item.distance || item.distanciaMetros;
    
    return (
      <View style={[styles.card, { backgroundColor: colors.cardLight }]}>
        <Text style={[styles.nome, { color: colors.textPrimary }]}>{nome}</Text>
        {imagemUrl && (
          <Image
            source={{ uri: imagemUrl }}
            style={styles.imagem}
            resizeMode="cover"
            onError={(e) => {
              console.log("Erro ao carregar imagem:", imagemUrl);
            }}
          />
        )}
        <View style={styles.info}>
          <Ionicons name="location" size={16} color={colors.textSecondary} />
          <Text style={[styles.texto, { color: colors.textSecondary, flex: 1 }]}>{endereco}</Text>
        </View>
        {horario && (
          <View style={styles.info}>
            <Ionicons name="time" size={16} color={colors.textSecondary} />
            <Text style={[styles.texto, { color: colors.textSecondary }]}>{horario}</Text>
          </View>
        )}
        {especialidade && (
          <Text style={[styles.especialidade, { color: colors.textSecondary }]}>
            Especialidade: {especialidade}
          </Text>
        )}
        {distancia && (
          <Text style={[styles.especialidade, { color: colors.textSecondary }]}>
            Distância: {(Number(distancia) / 1000).toFixed(2)} km
          </Text>
        )}
        <TouchableOpacity 
          style={[styles.botao, { backgroundColor: colors.accent }]}
          onPress={() => abrirLocalizacao(endereco)}
        >
          <Text style={styles.botaoTexto}>Saiba Mais</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Image
          source={require("../assets/images/seta.png")}
          style={styles.backImage}
          resizeMode="contain"
        />
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

      {erro !== "" && (
        <View style={styles.erroContainer}>
          <Text style={[styles.erro, { color: "#EF4444" }]}>{erro}</Text>
        </View>
      )}

      {!loading && clinicas.length === 0 && erro === "" && (
        <View style={styles.vazioContainer}>
          <Ionicons name="location-outline" size={48} color={colors.textSecondary} style={{ marginBottom: 10 }} />
          <Text style={[styles.vazio, { color: colors.textSecondary }]}>
            Nenhuma clínica encontrada na sua região.
          </Text>
          <Text style={[styles.vazioSubtexto, { color: colors.textSecondary }]}>
            Tente aumentar o raio de busca ou verifique sua localização.
          </Text>
        </View>
      )}

      {clinicas.length > 0 && (
        <FlatList
          data={clinicas}
          keyExtractor={(item, index) => (item && item.id != null ? String(item.id) : String(index))}
          renderItem={renderItem}
          contentContainerStyle={styles.lista}
          horizontal={false}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={[styles.vazio, { color: colors.textSecondary }]}>
              Nenhuma clínica encontrada.
            </Text>
          }
        />
      )}
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
  erroContainer: {
    padding: 16,
    marginTop: 20,
    backgroundColor: "#FEE2E2",
    borderRadius: 8,
    marginHorizontal: 16,
  },
  erro: {
    textAlign: "center",
    fontSize: 14,
  },
  vazioContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  vazio: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  vazioSubtexto: {
    textAlign: "center",
    fontSize: 14,
    opacity: 0.7,
  },
  lista: {
    paddingBottom: 60,
  },
});
