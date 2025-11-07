import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // ⬇️ Define uma altura base confortável e adaptável
  const TAB_BAR_HEIGHT = useMemo(() => insets.bottom + 60, [insets.bottom]);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: TAB_BAR_HEIGHT }, // ajuste adaptativo
        ]}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={["#48B2FA", "#1163E7"]}
          style={styles.headerBackground}
        >
          <Text style={styles.headerText}>
            <Text style={{ fontWeight: "bold" }}>Bem-vindo </Text>
            Isabela !
          </Text>
          <Text style={styles.subHeaderText}>
            Conecte-se com outras famílias e encontre apoio no dia a dia.
          </Text>
        </LinearGradient>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Entre no Chat em grupo</Text>
          <Text style={styles.cardText}>
            Se conecte com outras famílias e compartilhe experiências
          </Text>
          <TouchableOpacity style={styles.cardButton}>
            <Text style={styles.cardButtonText}>toque aqui para entrar</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Informações</Text>

        <View style={styles.infoCard}>
          <Ionicons name="location" size={24} color="#1163E7" />
          <View style={styles.infoText}>
            <Text style={styles.infoTitle}>Clínicas Próximas</Text>
            <Text style={styles.infoDesc}>
              Encontre clínicas especializadas em autismo perto de você e garanta apoio profissional.
            </Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="newspaper" size={24} color="#1163E7" />
          <View style={styles.infoText}>
            <Text style={styles.infoTitle}>Notícias</Text>
            <Text style={styles.infoDesc}>
              Notícias atualizadas sobre inclusão, direitos e avanços na área do TEA.
            </Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Image
            source={require("../assets/Bea.png")}
            style={styles.infoImage}
          />
          <View style={styles.infoText}>
            <Text style={styles.infoTitle}>
              Conheça a <Text style={{ color: "#1163E7" }}>Bea</Text>
            </Text>
            <Text style={styles.infoDesc}>
              Sua assistente virtual do TEA+ pronta para acolher, orientar e responder dúvidas sobre o espectro autista.
            </Text>
            <TouchableOpacity style={styles.cardButton}>
              <Text style={styles.cardButtonText}>Converse com a Bea</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// 🎨 Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FB",
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  headerBackground: {
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingVertical: 40,
    alignItems: "center",
  },
  headerText: {
    fontSize: 22,
    color: "#fff",
  },
  subHeaderText: {
    color: "#fff",
    fontSize: 14,
    marginTop: 4,
    textAlign: "center",
    maxWidth: "90%",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginTop: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardTitle: {
    fontWeight: "600",
    fontSize: 16,
  },
  cardText: {
    color: "#555",
    marginVertical: 8,
  },
  cardButton: {
    backgroundColor: "#1163E7",
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  cardButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 24,
    marginBottom: 12,
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
    gap: 12,
  },
  infoText: {
    flex: 1,
  },
  infoTitle: {
    fontWeight: "600",
    fontSize: 15,
  },
  infoDesc: {
    color: "#555",
    marginTop: 4,
  },
  infoImage: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },
});
