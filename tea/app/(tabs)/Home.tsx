import { Ionicons } from "@expo/vector-icons";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useUser } from "../../contexts/UserContext";

const { width: screenWidth } = Dimensions.get("window");

export default function Home() {
  const { userData } = useUser();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const featureCards = [
    {
      id: 1,
      title: "Entre no Chat em grupo",
      description: "Se conecte com outras famílias e compartilhe experiências",
      image: require("../../assets/images/family-home.png"),
      buttonText: "toque aqui para entrar",
      onPress: () => router.push("/ChatGrupo"),
    },
    {
      id: 2,
      title: "Organize sua rotina no Cronograma",
      description: "Seu dia organizado em um só lugar",
      image: require("../../assets/images/calendario.png"),
      buttonText: "Abrir meu cronograma",
      onPress: () => router.push("/Cronograma"),
    },
    {
      id: 3,
      title: "Encontre Clínicas Perto de Você",
      description:
        "Localize facilmente centros especializados em autismo e garanta apoio profissional para sua família.",
      image: require("../../assets/images/localiza.png"),
      buttonText: "Abrir Clínicas Próximas",
      onPress: () => router.push("../ClinicasProximas"),
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={["#3B82F6", "#2563EB"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.welcomeTitle}>
            Bem Vindo{" "}
            <Text style={styles.userName}>
              {userData?.name || "Alex"}!
            </Text>
          </Text>
          <Text style={styles.headerSubtitle}>
            Conecte-se com outras famílias e encontre apoio no dia a dia.
          </Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Carrossel de Cards Principais */}
        <View style={styles.carouselContainer}>
          <FlatList
            data={featureCards}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x / screenWidth
              );
              setCurrentCardIndex(index);
            }}
            renderItem={({ item }) => (
              <View style={styles.carouselCard}>
                <View style={styles.cardContent}>
                  <View style={styles.cardImageContainer}>
                    <Image
                      source={item.image}
                      style={styles.cardImage}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardDescription}>
                    {item.description}
                  </Text>
                  <TouchableOpacity
                    style={styles.cardButton}
                    onPress={item.onPress}
                  >
                    <Text style={styles.cardButtonText}>
                      {item.buttonText}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            keyExtractor={(item) => item.id.toString()}
          />
          {/* Indicadores */}
          <View style={styles.paginationContainer}>
            {featureCards.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  index === currentCardIndex && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Informações */}
        <Text style={styles.informacoesTitle}>Informações</Text>

        {/* Clínicas Próximas */}
        <View style={styles.infoCard}>
          <View style={styles.infoIconContainer}>
            <Ionicons name="location" size={22} color="#3B82F6" />
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoCardTitle}>Clínicas Próximas</Text>
            <Text style={styles.infoCardDescription}>
              Encontre clínicas especializadas em autismo perto de você e
              garanta apoio profissional para sua família.
            </Text>
          </View>
        </View>

        {/* Notícias */}
        <View style={styles.infoCard}>
          <View style={styles.infoIconContainer}>
            <Ionicons name="newspaper" size={22} color="#3B82F6" />
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoCardTitle}>Notícias</Text>
            <Text style={styles.infoCardDescription}>
              Notícias atualizadas sobre inclusão, direitos e avanços na área do
              TEA.
            </Text>
          </View>
        </View>

        {/* Bea */}
        <View style={styles.beaCard}>
          <Image
            source={require("../../assets/images/bea.png")}
            style={styles.beaImage}
          />
          <View style={styles.beaTextContainer}>
            <Text style={styles.beaTitle}>
              Conheça a <Text style={styles.beaName}>Bea</Text>
            </Text>
            <Text style={styles.beaDescription}>
              Sua assistente virtual do TEA+ pronta para acolher, orientar e
              responder dúvidas sobre o espectro autista.
            </Text>
            <TouchableOpacity style={styles.beaButton}>
              <Text style={styles.beaButtonText}>Converse com a Bea</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Autismo */}
        <View style={styles.autismCard}>
          <View style={styles.autismIconContainer}>
            <Text style={styles.brainIcon}>🧠</Text>
          </View>
          <View style={styles.autismTextContainer}>
            <Text style={styles.autismTitle}>
              Quer saber mais sobre o autismo?
            </Text>
            <Text style={styles.autismDescription}>
              Se você está usando o TeaMais e ainda não conhece muito sobre o
              tema, clique abaixo e acesse nosso site.
            </Text>
            <TouchableOpacity style={styles.autismButton}>
              <Text style={styles.autismButtonText}>Clique Aqui</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },

  // === Header ===
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: { alignItems: "center" },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 6,
    textAlign: "center",
  },
  userName: { color: "#70DEFE" },
  headerSubtitle: {
    fontSize: 15,
    color: "#E0E7FF",
    textAlign: "center",
    lineHeight: 20,
  },

  // === Conteúdo ===
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },

  // === Carrossel ===
  carouselContainer: { marginBottom: 24 },
  carouselCard: {
    width: screenWidth - 60,
    marginHorizontal: 10,
  },
  cardContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 280,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardImageContainer: {
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  cardImage: { width: 100, height: 100 },
  cardTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#111",
    textAlign: "center",
  },
  cardDescription: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 20,
  },
  cardButton: {
    backgroundColor: "#3B82F6",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: "100%",
  },
  cardButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#d1d5db",
    marginHorizontal: 4,
  },
  paginationDotActive: { backgroundColor: "#3B82F6", width: 20 },

  // === Informações ===
  informacoesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: "#F1F8FF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#E0F2FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  infoTextContainer: { flex: 1 },
  infoCardTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 4,
  },
  infoCardDescription: { fontSize: 13, color: "#555", lineHeight: 18 },

  // === Bea ===
  beaCard: {
    backgroundColor: "#F1F8FF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  beaImage: { width: 60, height: 120, marginRight: 12 },
  beaTextContainer: { flex: 1 },
  beaTitle: { fontSize: 15, fontWeight: "bold", color: "#111" },
  beaName: { color: "#3B82F6" },
  beaDescription: { fontSize: 13, color: "#555", marginVertical: 8 },
  beaButton: {
    backgroundColor: "#3B82F6",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignSelf: "flex-start",
  },
  beaButtonText: { color: "#fff", fontWeight: "bold", fontSize: 13 },

  // === Autismo ===
  autismCard: {
    backgroundColor: "#F1F8FF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 30,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  autismIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#E0F2FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  brainIcon: { fontSize: 24 },
  autismTextContainer: { flex: 1 },
  autismTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 4,
  },
  autismDescription: { fontSize: 13, color: "#555", marginBottom: 10 },
  autismButton: {
    backgroundColor: "#3B82F6",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignSelf: "flex-start",
  },
  autismButtonText: { color: "#fff", fontWeight: "bold", fontSize: 13 },
});
