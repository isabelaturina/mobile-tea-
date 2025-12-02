import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";

const MOOD_OPTIONS = [
  { emoji: "😁", value: "muito_feliz", label: "Muito feliz" },
  { emoji: "😊", value: "feliz", label: "Feliz" },
  { emoji: "😐", value: "neutro", label: "Neutro" },
  { emoji: "😔", value: "triste", label: "Triste" },
  { emoji: "😢", value: "muito_triste", label: "Muito triste" },
  { emoji: "😰", value: "ansioso", label: "Ansioso" },
  { emoji: "😡", value: "irritado", label: "Irritado" },
];

const API_DIARIO = "https://diario-uvit.onrender.com/api/diario";

export default function DiarioSalvo() {
  const { date } = useLocalSearchParams();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const [diaryEntry, setDiaryEntry] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!date) return;
    setLoading(true);
    setError("");
    fetch(`${API_DIARIO}?date=${date}`)
      .then(res => {
        if (!res.ok) throw new Error("Erro ao buscar diário");
        return res.json();
      })
      .then(data => {
        // Se a API retorna um array, pega o primeiro item
        if (Array.isArray(data)) {
          setDiaryEntry(data.length > 0 ? data[0] : null);
        } else {
          setDiaryEntry(data);
        }
      })
      .catch(() => {
        setError("Não foi possível carregar o diário.");
      })
      .finally(() => setLoading(false));
  }, [date]);

  const colors = useMemo(
    () =>
      isDarkMode
        ? {
            background: "#050F1E",
            content: "#050F1E",
            notFoundText: "#E5E7EB",
            sectionText: "#E5E7EB",
            moodButton: "#0F172A",
            moodButtonBorder: "transparent",
            selectedMoodBg: "#3B82F6",
            selectedMoodBorder: "#3B82F6",
            moodEmoji: "#FFFFFF",
            noteCard: "#071426",
            noteBorder: "rgba(59,130,246,0.95)",
            noteText: "#E5E7EB",
            confirmationCard: "#0A255C",
            confirmationShadow: "#000000",
            confirmationText: "#FFFFFF",
            finishButton: "#3B82F6",
            beaButton: "#8B5CF6",
            buttonText: "#FFFFFF",
            gradient: ["#8B5CF6", "#3B82F6"] as const,
          }
        : {
            background: "#F8F9FA",
            content: "#F8F9FA",
            notFoundText: "#333333",
            sectionText: "#333333",
            moodButton: "#FFFFFF",
            moodButtonBorder: "transparent",
            selectedMoodBg: "#EBF4FF",
            selectedMoodBorder: "#3B82F6",
            moodEmoji: "#111827",
            noteCard: "#FFFFFF",
            noteBorder: "rgba(59, 130, 246, 0.55)",
            noteText: "#333333",
            confirmationCard: "#031532",
            confirmationShadow: "#000000",
            confirmationText: "#FFFFFF",
            finishButton: "#3B82F6",
            beaButton: "#8B5CF6",
            buttonText: "#FFFFFF",
            gradient: ["#8B5CF6", "#3B82F6"] as const,
          },
    [isDarkMode]
  );

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: colors.background,
        },
        notFoundText: {
          color: colors.notFoundText,
          textAlign: "center",
          marginTop: 40,
        },
        header: {
          paddingTop: 60,
          paddingBottom: 20,
          paddingHorizontal: 20,
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
        },
        headerContent: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 10,
        },
        headerTitle: {
          fontSize: 20,
          fontWeight: "bold",
          color: "#fff",
          flex: 1,
          textAlign: "center",
          marginHorizontal: 10,
        },
        heartIcon: {
          width: 24,
          alignItems: "center",
          justifyContent: "center",
          height: 24,
        },
        content: {
          flex: 1,
          paddingHorizontal: 20,
          backgroundColor: colors.content,
        },
        section: {
          marginTop: 30,
        },
        sectionTitle: {
          fontSize: 16,
          fontWeight: "600",
          color: colors.sectionText,
          marginBottom: 16,
          textAlign: "center",
        },
        moodContainer: {
          flexDirection: "row",
          justifyContent: "space-around",
          flexWrap: "wrap",
          paddingHorizontal: 6,
        },
        moodButton: {
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: colors.moodButton,
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
          borderWidth: 2,
          borderColor: colors.moodButtonBorder,
          margin: 6,
        },
        selectedMoodButton: {
          borderColor: colors.selectedMoodBorder,
          backgroundColor: colors.selectedMoodBg,
        },
        moodEmoji: {
          fontSize: 28,
          color: colors.moodEmoji,
        },
        noteContainer: {
          backgroundColor: colors.noteCard,
          borderRadius: 16,
          padding: 16,
          borderWidth: 2,
          borderColor: colors.noteBorder,
          shadowColor: "#3B82F6",
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: isDarkMode ? 0.9 : 0.25,
          shadowRadius: isDarkMode ? 14 : 8,
          elevation: isDarkMode ? 12 : 6,
          minHeight: 150,
          overflow: "hidden",
        },
        noteText: {
          fontSize: 16,
          color: colors.noteText,
          lineHeight: 24,
        },
        confirmationContainer: {
          marginTop: 30,
          marginBottom: 20,
        },
        confirmationCard: {
          backgroundColor: colors.confirmationCard,
          borderRadius: 16,
          padding: 24,
          alignItems: "center",
          shadowColor: colors.confirmationShadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 5,
        },
        confirmationTitle: {
          fontSize: 24,
          fontWeight: "bold",
          color: colors.confirmationText,
          marginBottom: 16,
        },
        beaIllustration: {
          marginBottom: 16,
        },
        confirmationMessage: {
          fontSize: 14,
          color: colors.confirmationText,
          textAlign: "center",
          lineHeight: 20,
          opacity: 0.9,
        },
        buttonsContainer: {
          flexDirection: "row",
          padding: 20,
          paddingBottom: 40,
        },
        finishButton: {
          flex: 1,
          backgroundColor: colors.finishButton,
          paddingVertical: 16,
          borderRadius: 12,
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
          marginRight: 6,
        },
        finishButtonText: {
          color: colors.buttonText,
          fontSize: 16,
          fontWeight: "bold",
        },
        beaButton: {
          flex: 1,
          backgroundColor: colors.beaButton,
          paddingVertical: 16,
          borderRadius: 12,
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
          marginLeft: 6,
        },
        beaButtonText: {
          color: colors.buttonText,
          fontSize: 16,
          fontWeight: "bold",
        },
      }),
    [colors, isDarkMode]
  );

  const handleFinish = () => {
    router.push("/Cronograma");
  };

  const handleTalkToBea = () => {
    router.push("/ChatBea");
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.notFoundText}>Carregando...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.notFoundText}>{error}</Text>
      </View>
    );
  }

  if (!diaryEntry) {
    return (
      <View style={styles.container}>
        <Text style={styles.notFoundText}>Entrada não encontrada</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={colors.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ padding: 8 }}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Meu humor diário</Text>
          <View style={styles.heartIcon}>
            <Ionicons name="heart" size={24} color="#fff" />
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Seleção de Humor - Mostrando o selecionado */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Registre com os emojis como você se sentiu hoje
          </Text>
          <View style={styles.moodContainer}>
            {MOOD_OPTIONS.map((mood) => (
              <View
                key={mood.value}
                style={[
                  styles.moodButton,
                  diaryEntry?.mood === mood.value && styles.selectedMoodButton,
                ]}
              >
                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Campo de Nota - Mostrando a nota salva */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Anote como você se sentiu hoje</Text>
          <View style={styles.noteContainer}>
            <Text style={styles.noteText}>{diaryEntry?.note || ""}</Text>
          </View>
        </View>

        {/* Confirmação */}
        <View style={styles.confirmationContainer}>
          <View style={styles.confirmationCard}>
            <Text style={styles.confirmationTitle}>Pronto!</Text>
            <View style={styles.beaIllustration}>
              <Ionicons
                name="person-circle"
                size={80}
                color="#8B5CF6"
              />
            </View>

            <Text style={styles.confirmationMessage}>
              Sua anotação foi salva! A Bea está disponível caso queira conversar,
              tirar dúvidas ou receber ajuda sempre que precisar.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Botões de Ação */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
          <Text style={styles.finishButtonText}>Finalizar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.beaButton} onPress={handleTalkToBea}>
          <Text style={styles.beaButtonText}>falar com a bea</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

