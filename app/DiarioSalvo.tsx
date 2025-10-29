import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { useCronograma } from "../contexts/CronogramaContext";

const MOOD_OPTIONS = [
  { emoji: "😁", value: "muito_feliz", label: "Muito feliz" },
  { emoji: "😊", value: "feliz", label: "Feliz" },
  { emoji: "😐", value: "neutro", label: "Neutro" },
  { emoji: "😔", value: "triste", label: "Triste" },
  { emoji: "😢", value: "muito_triste", label: "Muito triste" },
  { emoji: "😰", value: "ansioso", label: "Ansioso" },
  { emoji: "😡", value: "irritado", label: "Irritado" },
];

export default function DiarioSalvo() {
  const { date } = useLocalSearchParams();
  const { getDiaryEntryForDate } = useCronograma();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const styles = getStyles(isDark);

  const diaryEntry = date ? getDiaryEntryForDate(date as string) : null;

  const handleFinish = () => {
    router.push("/Cronograma");
  };

  const handleTalkToBea = () => {
    router.push("/ChatBea");
  };

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
        colors={isDark ? ["#8B5CF6", "#3B82F6"] : ["#8B5CF6", "#3B82F6"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Meu humor diário</Text>
          <View style={styles.heartIcon}>
            <Ionicons name="heart" size={20} color="#fff" />
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
                  diaryEntry.mood === mood.value && styles.selectedMoodButton,
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
            <Text style={styles.noteText}>{diaryEntry.note}</Text>
          </View>
        </View>

        {/* Confirmação */}
        <View style={styles.confirmationContainer}>
          <View style={[styles.confirmationCard, isDark && styles.confirmationCardDark]}>
            <Text style={styles.confirmationTitle}>Pronto!</Text>
            <View style={styles.beaIllustration}>
              <Ionicons name="person-circle" size={80} color={isDark ? "#8B5CF6" : "#8B5CF6"} />
            </View>

            <Text style={styles.confirmationMessage}>
              Sua anotação foi salva! A Bea está disponível caso queira conversar, tirar dúvidas ou
              receber ajuda sempre que precisar.
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

const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? "#071426" : "#F8F9FA",
    },
    notFoundText: {
      color: isDark ? "#E5E7EB" : "#ffffffff",
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
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#fff",
      flex: 1,
      textAlign: "center",
    },
    heartIcon: {
      width: 24,
      alignItems: "center",
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
    },
    section: {
      marginTop: 30,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: isDark ? "#E5E7EB" : "#333",
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
      backgroundColor: isDark ? "#0f1116ff" : "#fff",
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      borderWidth: 2,
      borderColor: "transparent",
      margin: 6,
    },
    selectedMoodButton: {
      borderColor: "#3B82F6",
      backgroundColor: isDark ?"#3B82F6" : "#EBF4FF",
    },
    moodEmoji: {
      fontSize: 28,
    },
    noteContainer: {
      // fundo escuro com borda azul "neon" e glow
      backgroundColor: isDark ? "#071426" : "#fff",
      borderRadius: 16,
      padding: 16,
      borderWidth: 2,
      borderColor: isDark ? "rgba(59,130,246,0.95)" : "rgba(59,130,246,0.9)",
      // efeito glow (iOS)
      shadowColor: "#3B82F6",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: isDark ? 0.9 : 0.25,
      shadowRadius: 14,
      // elevação (Android)
      elevation: isDark ? 12 : 6,
      minHeight: 150,
      // opcional: leve gradiente visual simulada com borda interna (fallback)
      overflow: "hidden",
    },
    noteText: {
      fontSize: 16,
      color: isDark ? "#E5E7EB" : "#333",
      lineHeight: 24,
    },
    confirmationContainer: {
      marginTop: 30,
      marginBottom: 20,
    },
    confirmationCard: {
      backgroundColor: "#333",
      borderRadius: 16,
      padding: 24,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
    confirmationCardDark: {
      backgroundColor: "#0a255cff",
      shadowColor: "#000",
    },
    confirmationTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#fff",
      marginBottom: 16,
    },
    beaIllustration: {
      marginBottom: 16,
    },
    confirmationMessage: {
      fontSize: 14,
      color: "#fff",
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
      backgroundColor: "#3B82F6",
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
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
    beaButton: {
      flex: 1,
      backgroundColor: "#8B5CF6",
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
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
  });
