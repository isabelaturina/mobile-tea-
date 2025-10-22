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
  
  const diaryEntry = getDiaryEntryForDate(date as string);


  const handleFinish = () => {
    router.push("/Cronograma");
  };

  const handleTalkToBea = () => {
    router.push("/ChatBea");
  };

  if (!diaryEntry) {
    return (
      <View style={styles.container}>
        <Text>Entrada não encontrada</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={["#8B5CF6", "#3B82F6"]}
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
          <Text style={styles.sectionTitle}>
            Anote como você se sentiu hoje
          </Text>
          <View style={styles.noteContainer}>
            <Text style={styles.noteText}>{diaryEntry.note}</Text>
          </View>
        </View>

        {/* Confirmação */}
        <View style={styles.confirmationContainer}>
          <View style={styles.confirmationCard}>
            <Text style={styles.confirmationTitle}>Pronto!</Text>
            <View style={styles.beaIllustration}>
              <Ionicons name="person-circle" size={80} color="#8B5CF6" />
            </View>
            <Text style={styles.confirmationMessage}>
              Sua anotação foi salva! a Bea está disponível caso queira conversar, tirar dúvidas ou receber ajuda sempre que precisar
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
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
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  moodContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
    gap: 12,
  },
  moodButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedMoodButton: {
    borderColor: "#3B82F6",
    backgroundColor: "#EBF4FF",
  },
  moodEmoji: {
    fontSize: 28,
  },
  noteContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 150,
  },
  noteText: {
    fontSize: 16,
    color: "#333",
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
    gap: 12,
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
  },
  beaButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
