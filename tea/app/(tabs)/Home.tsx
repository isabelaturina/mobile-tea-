import { Ionicons } from "@expo/vector-icons";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useUser } from "../../contexts/UserContext";

export default function Home() {
  const { userData } = useUser();

  return (
    <View style={styles.container}>
      {/* Header com gradiente e ilustração */}
      <LinearGradient
        colors={["#8B5CF6", "#3B82F6"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>
              Conecte-se com outras famílias e encontre apoio no dia a dia.
            </Text>
          </View>
          <View style={styles.headerIllustration}>
            {/* Ilustração da família */}
            <View style={styles.illustrationContainer}>
              <Image
                source={require("../../assets/images/homefamily.png")}
                style={styles.familyImage}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Mensagem de boas-vindas */}
        <Text style={styles.welcomeText}>
          Bem-vindo(a) {userData?.name || "Usuário"}!
        </Text>

        {/* Cards de funcionalidades */}
        <View style={styles.featureCardsContainer}>
          <TouchableOpacity style={styles.featureCard}>
            <Ionicons name="location" size={32} color="#3B82F6" />
            <Text style={styles.featureCardText}>Localização</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.featureCard}>
            <Ionicons name="calendar" size={32} color="#3B82F6" />
            <Text style={styles.featureCardText}>Cronograma</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.featureCard}>
            <View style={styles.newsIconContainer}>
              <Ionicons name="newspaper" size={24} color="#fff" />
              <Text style={styles.newsText}>NEWS</Text>
            </View>
            <Text style={styles.featureCardText}>Notícias</Text>
          </TouchableOpacity>
        </View>

        {/* Seção "Conheça a Bea" */}
        <View style={styles.beaCard}>
          <View style={styles.beaContent}>
            <View style={styles.beaIllustration}>
              <Image
                source={require("../../assets/images/bea.png")}
                style={styles.beaImage}
                resizeMode="contain"
              />
            </View>
            <View style={styles.beaTextContainer}>
              <View style={styles.beaTitleContainer}>
                <Text style={styles.beaTitle}>Conheça a </Text>
                <MaskedView
                  maskElement={
                    <Text style={styles.beaName}>Bea</Text>
                  }
                >
                  <LinearGradient
                    colors={["#70DEF", "#0066CC"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ width: 40, height: 30, left: 60 }} // 👈 tamanho do gradiente
                  />
                </MaskedView>
                <Ionicons
                  name="heart"
                  size={16}
                  color="#3B82F6"
                  style={styles.beaHeart}
                />
              </View>
              <Text style={styles.beaDescription}>
                Sua assistente virtual do TEA+ pronta para acolher, orientar e
                responder dúvidas sobre o espectro autista. Seja você mãe, pai
                ou cuidador, a Bea está aqui para ajudar com informações seguras
                e apoio humanizado.
              </Text>
              <TouchableOpacity style={styles.beaButton}>
                <LinearGradient
                  colors={["#70DEFE", "#1D4ED8"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.beaButtonGradient}
                >
                  <Text style={styles.beaButtonText}>Converse com a Bea</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Seção "Quer saber mais sobre o autismo?" */}
        <View style={styles.autismCard}>
          <View style={styles.autismContent}>
            <View style={styles.autismIconContainer}>
              <Text style={styles.brainIcon}>🧠</Text>
            </View>
            <View style={styles.autismTextContainer}>
              <Text style={styles.autismTitle}>
                Quer saber mais sobre o autismo?
              </Text>
              <Text style={styles.autismDescription}>
                Se você está usando o TeaMais e ainda não conhece muito sobre o
                tema, clique no botão abaixo e acesse nosso site! Lá você
                encontra curiosidades, informações importantes e muito mais.
                Conhecimento transforma!{" "}
                <Ionicons name="heart" size={14} color="#3B82F6" />
              </Text>
              <TouchableOpacity style={styles.autismButton}>
                <Text style={styles.autismButtonText}>Clique Aqui</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  headerTextContainer: {
    flex: 1,
    marginRight: 10,
    minWidth: 0,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    lineHeight: 28,
    textShadowColor: "#4f4e4eff",    
    textShadowOffset: { width: 0, height: 0 }, 
    textShadowRadius: 6, 
    textAlign: "left",
    flexWrap: "wrap",
    width: "100%",
  },
  headerIllustration: {
    alignItems: "center",
  },
  iconsContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  decorativeIcon: {
    marginHorizontal: 2,
  },
  illustrationContainer: {
    alignItems: "center",
  },
  familyImage: {
    width: 120,
    height: 120,
    marginLeft: 0,
    marginBottom: 0,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3B82F6",
    marginBottom: 24,
  },
  featureCardsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  featureCard: {
    backgroundColor: "#E0F2FF",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    width: "30%",
    aspectRatio: 1,
  },
  featureCardText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
    marginTop: 8,
    textAlign: "center",
  },
  newsIconContainer: {
    backgroundColor: "#3B82F6",
    borderRadius: 8,
    padding: 4,
    alignItems: "center",
  },
  newsText: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 2,
  },
  beaCard: {
    backgroundColor: '#D9F2FF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  beaContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  beaIllustration: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    marginBottom: 0,
  },
  beaImage: {
    width: 70,
    height: 150,
    resizeMode: 'contain',
  },
  beaTextContainer: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
  },
  beaTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  beaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginLeft: 0,
  },
  beaName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 4,
    marginTop: 0,
    color: '#2196F3',
  },
  beaHeart: {
    marginLeft: 4,
    color: '#2196F3',
  },
  beaDescription: {
    fontSize: 15,
    color: '#222',
    lineHeight: 22,
    marginBottom: 0,
    textAlign: 'left',
    width: '100%',
  },
  beaButton: {
    alignSelf: 'flex-end',
    marginTop: 16,
    marginLeft: 0,
  },
  beaButtonGradient: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  beaButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  autismCard: {
    backgroundColor: "#E0F2FF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  autismContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  autismIconContainer: {
    marginRight: 16,
    marginTop: 4,
  },
  brainIcon: {
    fontSize: 35,
    bottom: 9,
  },
  autismTextContainer: {
    flex: 1,
  },
  autismTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  autismDescription: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
    marginBottom: 16,
    width: "100%",
    textAlign: "left",
  },
  autismButton: {
    backgroundColor: "#2e79e9ff",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignSelf: "flex-end",
  },
  autismButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});
