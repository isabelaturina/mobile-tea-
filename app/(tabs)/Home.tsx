import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../contexts/ThemeContext";
import { useUser } from "../../contexts/UserContext";

const { width: screenWidth } = Dimensions.get("window");

export default function Home() {
  const { userData } = useUser();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const isDarkMode = theme === "dark";
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

  const colors = isDarkMode
    ? {
        background: "#000",
        textPrimary: "#F8FAFC",
        textSecondary: "#94A3B8",
        card: "#1E293B",
        accent: "#3B82F6",
        lightAccent: "#60A5FA",
        iconBg: "#334155",
      }
    : {
        background: "#F9FAFB",
        textPrimary: "#111",
        textSecondary: "#555",
        card: "#FFFFFF",
        accent: "#3B82F6",
        lightAccent: "#70DEFE",
        iconBg: "#E0F2FF",
      };

  // Calcular altura da tab bar dinamicamente (sincronizado com CustomTabBar)
  const BASE_TAB_HEIGHT = 60;
  const safeAreaBottom = Platform.OS === 'android' ? Math.max(insets.bottom, 0) : insets.bottom;
  const TAB_BAR_HEIGHT = BASE_TAB_HEIGHT + safeAreaBottom;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={[]}>
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: TAB_BAR_HEIGHT + (Platform.OS === 'android' ? 10 : 20),
        }}
      >
        {/* HEADER CORRIGIDO */}
        <LinearGradient
          colors={[colors.accent, colors.lightAccent]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[
            styles.header,
            {
              paddingTop: insets.top + (Platform.OS === 'android' ? 16 : 20),
              marginTop: 0,
            },
          ]}
        >
          <View style={styles.headerContent}>
            <Text style={[styles.welcomeTitle, { color: "#fff" }]}>
              Bem-vindo{" "}
              <Text style={{ color: "#E0F2FF" }}>
                {userData?.name || "Usuário"}!
              </Text>
            </Text>
            <Text style={[styles.headerSubtitle, { color: "#E0E7FF" }]}>
              Conecte-se com outras famílias e encontre apoio no dia a dia.
            </Text>
          </View>
        </LinearGradient>

        {/* CARROSSEL */}
        <View style={styles.carouselContainer}>
          <FlatList
            data={featureCards}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselContent}
            snapToInterval={screenWidth - 40}
            snapToAlignment="start"
            decelerationRate="fast"
            onMomentumScrollEnd={(event) => {
              const cardWidth = screenWidth - 40;
              const index = Math.max(0, Math.min(featureCards.length - 1, Math.round(event.nativeEvent.contentOffset.x / cardWidth)));
              setCurrentCardIndex(index);
            }}
            renderItem={({ item }) => (
              <View style={styles.carouselCard}>
                <View style={[styles.cardContent, { backgroundColor: colors.card }]}>
                  <View style={styles.cardImageContainer}>
                    <Image source={item.image} style={styles.cardImage} resizeMode="contain" />
                  </View>

                  <View style={styles.cardTextContainer}>
                    <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                      {item.title}
                    </Text>

                    <Text 
                      style={[styles.cardDescription, { color: colors.textSecondary }]}
                      numberOfLines={3}
                    >
                      {item.description}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={[styles.cardButton, { backgroundColor: colors.accent }]}
                    onPress={item.onPress}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.cardButtonText}>{item.buttonText}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            keyExtractor={(item) => item.id.toString()}
          />

          {/* PAGINAÇÃO */}
          <View style={styles.paginationContainer}>
            {featureCards.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  {
                    backgroundColor:
                      index === currentCardIndex ? colors.accent : "#cbd5e1",
                  },
                ]}
              />
            ))}
          </View>
        </View>

        {/* RESTANTE DA TELA — sem mudanças estruturais */}
        <View style={{ paddingHorizontal: 20, marginTop: 10 }}>
          <Text style={[styles.informacoesTitle, { color: colors.textPrimary }]}>
            Informações
          </Text>
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          <TouchableOpacity
            style={[styles.infoCard, { backgroundColor: colors.card }]}
            onPress={() => router.push("/ClinicasProximas")}
            activeOpacity={0.7}
          >
            <View style={[styles.infoIconContainer, { backgroundColor: colors.iconBg }]}>
              <Ionicons name="location" size={22} color={colors.accent} />
            </View>

            <View style={styles.infoTextContainer}>
              <Text style={[styles.infoCardTitle, { color: colors.textPrimary }]}>
                Clínicas Próximas
              </Text>
              <Text style={[styles.infoCardDescription, { color: colors.textSecondary }]}>
                Encontre clínicas especializadas em autismo perto de você.
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Notícias */}
        <View style={{ paddingHorizontal: 20 }}>
          <TouchableOpacity
            style={[styles.infoCard, { backgroundColor: colors.card }]}
            onPress={() => router.push("/(tabs)/News")}
            activeOpacity={0.7}
          >
            <View style={[styles.infoIconContainer, { backgroundColor: colors.iconBg }]}>
              <Ionicons name="newspaper" size={22} color={colors.accent} />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={[styles.infoCardTitle, { color: colors.textPrimary }]}>
                Notícias
              </Text>
              <Text style={[styles.infoCardDescription, { color: colors.textSecondary }]}>
                Notícias atualizadas sobre TEA e inclusão.
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Bea */}
        <View style={{ paddingHorizontal: 20 }}>
          <View style={[styles.beaCard, { backgroundColor: colors.card }]}>
            <Image
              source={require("../../assets/images/bea.png")}
              style={styles.beaImage}
            />
            <View style={styles.beaTextContainer}>
              <Text style={[styles.beaTitle, { color: colors.textPrimary }]}>
                Conheça a <Text style={{ color: colors.accent }}>Bea</Text>
              </Text>
              <Text style={[styles.beaDescription, { color: colors.textSecondary }]}>
                Sua assistente virtual pronta para ajudar.
              </Text>

              <TouchableOpacity
                style={[styles.beaButton, { backgroundColor: colors.accent }]}
                onPress={() => router.push("/ChatBea")}
              >
                <Text style={styles.beaButtonText}>Converse com a Bea</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Autismo */}
        <View style={{ paddingHorizontal: 20 }}>
          <View style={[styles.autismCard, { backgroundColor: colors.card }]}>
            <View style={[styles.autismIconContainer, { backgroundColor: colors.iconBg }]}>
              <Text style={styles.brainIcon}>🧠</Text>
            </View>

            <View style={styles.autismTextContainer}>
              <Text style={[styles.autismTitle, { color: colors.textPrimary }]}>
                Quer saber mais sobre o autismo?
              </Text>

              <Text style={[styles.autismDescription, { color: colors.textSecondary }]}>
                Clique para acessar nosso site com conteúdos educativos.
              </Text>

              <TouchableOpacity style={[styles.autismButton, { backgroundColor: colors.accent }]}>
                <Text style={styles.autismButtonText}>Clique Aqui</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingBottom: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginTop: 0,
  },
  headerContent: { alignItems: "center" },
  welcomeTitle: { fontSize: 26, fontWeight: "bold", textAlign: "center" },
  headerSubtitle: { fontSize: 15, textAlign: "center", lineHeight: 20 },

  carouselContainer: { 
    marginTop: 20, 
    marginBottom: 24,
  },
  carouselContent: {
    paddingLeft: 20,
    paddingRight: 0,
  },
  carouselCard: {
    width: screenWidth - 40,
    marginRight: 20,
    alignItems: "stretch",
  },
  cardContent: {
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
    height: 260,
    shadowColor: "#000",
    shadowOpacity: Platform.OS === 'ios' ? 0.05 : 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: Platform.OS === 'android' ? 4 : 2,
    width: "100%",
  },
  cardImageContainer: { 
    height: 80, 
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginBottom: 8,
  },
  cardImage: { 
    width: 70, 
    height: 70,
  },
  cardTextContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 12,
    flex: 1,
  },
  cardTitle: { 
    fontSize: 16, 
    fontWeight: "bold", 
    textAlign: "center",
    marginBottom: 6,
    paddingHorizontal: 10,
    minHeight: 40,
    maxHeight: 40,
  },
  cardDescription: { 
    fontSize: 13, 
    textAlign: "center", 
    paddingHorizontal: 10,
    lineHeight: 18,
    minHeight: 54,
    maxHeight: 54,
  },
  cardButton: { 
    borderRadius: 12, 
    paddingVertical: 10, 
    paddingHorizontal: 20,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    height: 40,
  },
  cardButtonText: { 
    color: "#fff", 
    fontWeight: "bold", 
    textAlign: "center",
    fontSize: 14,
  },
  paginationContainer: { flexDirection: "row", justifyContent: "center", marginTop: 12 },
  paginationDot: { width: 8, height: 8, borderRadius: 4, marginHorizontal: 4 },

  informacoesTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },

  infoCard: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: Platform.OS === 'ios' ? 0.05 : 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: Platform.OS === 'android' ? 3 : 2,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    flexShrink: 0,
  },
  infoTextContainer: { 
    flex: 1,
    justifyContent: "center",
  },
  infoCardTitle: { 
    fontSize: 15, 
    fontWeight: "bold",
    marginBottom: 4,
  },
  infoCardDescription: { 
    fontSize: 13,
    lineHeight: 18,
  },

  beaCard: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: Platform.OS === 'ios' ? 0.05 : 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: Platform.OS === 'android' ? 3 : 2,
  },
  beaImage: { 
    width: 60, 
    height: 120, 
    marginRight: 12,
    flexShrink: 0,
  },
  beaTextContainer: { 
    flex: 1,
    justifyContent: "center",
  },
  beaTitle: { 
    fontSize: 15, 
    fontWeight: "bold",
    marginBottom: 4,
  },
  beaDescription: { 
    fontSize: 13, 
    marginBottom: 12,
    lineHeight: 18,
  },
  beaButton: { 
    borderRadius: 12, 
    paddingVertical: 10, 
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
  },
  beaButtonText: { 
    color: "#fff", 
    fontWeight: "bold", 
    fontSize: 13,
  },

  autismCard: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 30,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: Platform.OS === 'ios' ? 0.05 : 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: Platform.OS === 'android' ? 3 : 2,
  },
  autismIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    flexShrink: 0,
  },
  brainIcon: { fontSize: 24 },
  autismTextContainer: { 
    flex: 1,
    justifyContent: "center",
  },
  autismTitle: { 
    fontSize: 15, 
    fontWeight: "bold",
    marginBottom: 4,
  },
  autismDescription: { 
    fontSize: 13, 
    marginBottom: 12,
    lineHeight: 18,
  },
  autismButton: { 
    borderRadius: 12, 
    paddingVertical: 10, 
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
  },
  autismButtonText: { 
    color: "#fff", 
    fontWeight: "bold", 
    fontSize: 13,
  },
});
