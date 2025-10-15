import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
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

export default function AnotarDia() {
  const { date } = useLocalSearchParams();
  const { addDiaryEntry, getDiaryEntryForDate } = useCronograma();
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [note, setNote] = useState<string>("");


  const handleSave = () => {
    if (!selectedMood) {
      Alert.alert("Atenção", "Por favor, selecione como você se sentiu hoje.");
      return;
    }

    if (!note.trim()) {
      Alert.alert("Atenção", "Por favor, escreva uma anotação sobre o seu dia.");
      return;
    }

    // Verificar se já existe uma entrada para esta data
    const existingEntry = getDiaryEntryForDate(date as string);
    
    if (existingEntry) {
      Alert.alert(
        "Entrada existente",
        "Já existe uma anotação para esta data. Deseja substituí-la?",
        [
          {
            text: "Cancelar",
            style: "cancel",
          },
          {
            text: "Substituir",
            onPress: () => {
              addDiaryEntry({
                date: date as string,
                mood: selectedMood,
                note: note.trim(),
              });
              router.push({
                pathname: "/DiarioSalvo",
                params: { date: date as string },
              });
            },
          },
        ]
      );
    } else {
      addDiaryEntry({
        date: date as string,
        mood: selectedMood,
        note: note.trim(),
      });
      router.push({
        pathname: "/DiarioSalvo",
        params: { date: date as string },
      });
    }
  };


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
        {/* Seleção de Humor */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Registre com os emojis como você se sentiu hoje
          </Text>
          <View style={styles.moodContainer}>
            {MOOD_OPTIONS.map((mood) => (
              <TouchableOpacity
                key={mood.value}
                style={[
                  styles.moodButton,
                  selectedMood === mood.value && styles.selectedMoodButton,
                ]}
                onPress={() => setSelectedMood(mood.value)}
              >
                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Campo de Nota */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Anote como você se sentiu hoje
          </Text>
          <View style={styles.noteContainer}>
            <TextInput
              style={styles.noteInput}
              placeholder="Faça sua anotação aqui..."
              placeholderTextColor="#999"
              value={note}
              onChangeText={setNote}
              multiline
              textAlignVertical="top"
              maxLength={500}
            />
            <View style={styles.noteFooter}>
              <TouchableOpacity style={styles.addNoteButton}>
                <Text style={styles.addNoteButtonText}>Adicionar nota</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Botão Salvar */}
      <View style={styles.saveButtonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Salvar</Text>
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
    minHeight: 200,
  },
  noteInput: {
    fontSize: 16,
    color: "#333",
    minHeight: 150,
    textAlignVertical: "top",
  },
  noteFooter: {
    alignItems: "flex-end",
    marginTop: 12,
  },
  addNoteButton: {
    backgroundColor: "#333",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addNoteButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  saveButtonContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  saveButton: {
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
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
