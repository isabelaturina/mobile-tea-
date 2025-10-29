// ...existing code...
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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

export default function AnotarDia() {
  const { date } = useLocalSearchParams();
  const { addDiaryEntry, getDiaryEntryForDate } = useCronograma();
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [note, setNote] = useState<string>("");

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: isDarkMode ? "#121212ff" : "#F8F9FA",
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
          backgroundColor: isDarkMode ? "#121212" : undefined,
        },
        section: {
          marginTop: 30,
        },
        sectionTitle: {
          fontSize: 16,
          fontWeight: "600",
          color: isDarkMode ? "#E1E1E1" : "#333",
          marginBottom: 16,
          textAlign: "center",
        },
        moodContainer: {
          flexDirection: "row",
          justifyContent: "space-around",
          flexWrap: "wrap",
          // removed unsupported 'gap'
        },
        moodButton: {
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: isDarkMode ? "#333" : "#fff",
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
          borderWidth: 2,
          borderColor: "transparent",
          margin: 6, // simulate gap
        },
        selectedMoodButton: {
          borderColor: "#3B82F6",
          backgroundColor: isDarkMode ? "#5B7FFF" : "#EBF4FF",
        },
        moodEmoji: {
          fontSize: 28,
        },
        noteContainer: {
          // Neon-blue bordered card for dark mode, subtle for light
          backgroundColor: isDarkMode ? "#071426" : "#fff",
          borderRadius: 16,
          padding: 16,
          borderWidth: 2,
          borderColor: isDarkMode ? "rgba(59,130,246,0.95)" : "rgba(59,130,246,0.55)",
          // glow (iOS)
          shadowColor: "#3B82F6",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: isDarkMode ? 0.9 : 0.18,
          shadowRadius: isDarkMode ? 20 : 6,
          // elevation for Android
          elevation: isDarkMode ? 14 : 4,
          minHeight: 200,
          overflow: "hidden",
        },
        noteInput: {
          fontSize: 16,
          color: isDarkMode ? "#E1E1E1" : "#333",
          minHeight: 150,
          textAlignVertical: "top",
        },
        noteFooter: {
          alignItems: "flex-end",
          marginTop: 12,
        },
        addNoteButton: {
          backgroundColor: isDarkMode ? "#000000ff" : "#333",
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
      }),
    [isDarkMode]
  );

  const handleSave = () => {
    if (!selectedMood) {
      Alert.alert("Atenção", "Por favor, selecione como você se sentiu hoje.");
      return;
    }

    if (!note.trim()) {
      Alert.alert("Atenção", "Por favor, escreva uma anotação sobre o seu dia.");
      return;
    }

    const entryDate = (date as string) ?? new Date().toISOString().slice(0, 10);
    const existingEntry = date ? getDiaryEntryForDate(entryDate) : null;

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
                date: entryDate,
                mood: selectedMood,
                note: note.trim(),
              });
              router.push({
                pathname: "/DiarioSalvo",
                params: { date: entryDate },
              });
            },
          },
        ]
      );
    } else {
      addDiaryEntry({
        date: entryDate,
        mood: selectedMood,
        note: note.trim(),
      });
      router.push({
        pathname: "/DiarioSalvo",
        params: { date: entryDate },
      });
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={isDarkMode ? ["#8B5CF6", "#3B82F6"] : ["#8B5CF6", "#3B82F6"]}
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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Anote como você se sentiu hoje</Text>
          <View style={styles.noteContainer}>
            <TextInput
              style={styles.noteInput}
              placeholder="Faça sua anotação aqui..."
              placeholderTextColor={isDarkMode ? "#bbb" : "#999"}
              value={note}
              onChangeText={setNote}
              multiline
              textAlignVertical="top"
              maxLength={500}
            />
            <View style={styles.noteFooter}>
             
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.saveButtonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Salvar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
// ...existing code...