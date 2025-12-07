import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
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

export default function EditarAnotacao() {
  const { date } = useLocalSearchParams();
  const { getDiaryEntryForDate, updateDiaryEntry, forceDeleteDiaryEntry } = useCronograma();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [note, setNote] = useState<string>("");

  useEffect(() => {
    const entry = getDiaryEntryForDate(date as string);
    if (entry) {
      setSelectedMood(entry.mood);
      setNote(entry.note);
    }
  }, [date, getDiaryEntryForDate]);

  const colors = useMemo(
    () =>
      isDarkMode
        ? {
            background: "#000000",
            textPrimary: "#F8FAFC",
            textSecondary: "#94A3B8",
            card: "#1E293B",
            accent: "#3B82F6",
            lightAccent: "#60A5FA",
            border: "#334155",
            placeholder: "#64748B",
          }
        : {
            background: "#F8F9FA",
            textPrimary: "#111",
            textSecondary: "#666",
            card: "#FFFFFF",
            accent: "#3B82F6",
            lightAccent: "#70DEFE",
            border: "#E5E7EB",
            placeholder: "#999",
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
        color: colors.textPrimary,
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
        backgroundColor: colors.card,
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
        borderColor: colors.accent,
        backgroundColor: isDarkMode ? colors.accent : "#EBF4FF",
      },
      moodEmoji: {
        fontSize: 28,
      },
      /* Neon / note container */
      noteContainer: {
        backgroundColor: colors.card,
        borderRadius: 16,
        padding: 16,
        borderWidth: isDarkMode ? 2 : 1,
        borderColor: isDarkMode ? "rgba(59,130,246,0.95)" : "rgba(59,130,246,0.18)",
        shadowColor: isDarkMode ? colors.accent : "#000",
        shadowOffset: { width: 0, height: isDarkMode ? 8 : 2 },
        shadowOpacity: isDarkMode ? 0.9 : 0.08,
        shadowRadius: isDarkMode ? 18 : 6,
        elevation: isDarkMode ? 14 : 4,
        minHeight: 200,
        overflow: "hidden",
      },
      noteInput: {
        fontSize: 16,
        color: colors.textPrimary,
        minHeight: 150,
        textAlignVertical: "top",
      },
      noteFooter: {
        alignItems: "flex-end",
        marginTop: 12,
      },
      addNoteButton: {
        backgroundColor: isDarkMode ? "#111827" : "#333",
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
        backgroundColor: colors.accent,
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
    [colors, isDarkMode]
  );

  const handleSave = async () => {
    if (!selectedMood) {
      Alert.alert("Atenção", "Por favor, selecione como você se sentiu hoje.");
      return;
    }

    if (!note.trim()) {
      Alert.alert("Atenção", "Por favor, escreva uma anotação sobre o seu dia.");
      return;
    }

    const entry = getDiaryEntryForDate(date as string);
    if (entry) {
      try {
        console.log("🔄 [EDITAR ANOTACAO] Atualizando anotação...");
        await updateDiaryEntry(entry.id, {
          mood: selectedMood,
          note: note.trim(),
        });
        
        console.log("✅ [EDITAR ANOTACAO] Anotação atualizada com sucesso!");
        
        // Redireciona para o Cronograma com a data selecionada
        router.replace({
          pathname: "/Cronograma",
          params: { selectedDate: entry.date },
        });
      } catch (error: any) {
        console.error("❌ [EDITAR ANOTACAO] Erro ao atualizar:", error);
        Alert.alert(
          "Erro",
          error?.message || "Não foi possível atualizar a anotação. Tente novamente.",
          [{ text: "OK" }]
        );
      }
    } else {
      Alert.alert("Erro", "Anotação não encontrada.");
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir esta anotação?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            const entry = getDiaryEntryForDate(date as string);
            if (entry) {
              try {
                await forceDeleteDiaryEntry(entry.id);
                Alert.alert("Sucesso", "Anotação excluída com sucesso!", [
                  {
                    text: "OK",
                    onPress: () => router.push("/Cronograma"),
                  },
                ]);
              } catch {
                Alert.alert("Erro", "Não foi possível excluir a anotação. Tente novamente.");
              }
            }
          },
        },
      ]
    );
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
          <Text style={styles.headerTitle}>Editar anotação</Text>
          <TouchableOpacity onPress={handleDelete}>
            <Ionicons name="trash-outline" size={24} color="#fff" />
          </TouchableOpacity>
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
              placeholderTextColor={colors.placeholder}
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

      {/* Botão Salvar */}
      <View style={styles.saveButtonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Atualizar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
