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
} from "react-native";
import { useCronograma } from "../contexts/CronogramaContext";
import { useTheme } from "../contexts/ThemeContext";

import { diarioApi } from "../services/api/diarioApi";

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
  const { addDiaryEntry, getDiaryEntryForDate, updateDiaryEntry } = useCronograma();
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const colors = useMemo(
    () =>
      isDarkMode
        ? {
            background: "#050F1E",
            content: "#050F1E",
            sectionText: "#E2E8F0",
            moodButton: "#1F2937",
            moodButtonBorder: "transparent",
            moodButtonText: "#E2E8F0",
            selectedMoodBg: "#5B7FFF",
            selectedMoodBorder: "#3B82F6",
            noteCard: "#071426",
            noteBorder: "rgba(59,130,246,0.95)",
            noteText: "#E2E8F0",
            placeholder: "#94A3B8",
            saveButton: "#3B82F6",
            saveText: "#FFFFFF",
            gradient: ["#8B5CF6", "#3B82F6"] as const,
          }
        : {
            background: "#F8F9FA",
            content: "#F8F9FA",
            sectionText: "#333333",
            moodButton: "#FFFFFF",
            moodButtonBorder: "transparent",
            moodButtonText: "#1F2937",
            selectedMoodBg: "#EBF4FF",
            selectedMoodBorder: "#3B82F6",
            noteCard: "#FFFFFF",
            noteBorder: "rgba(59,130,246,0.55)",
            noteText: "#333333",
            placeholder: "#999999",
            saveButton: "#3B82F6",
            saveText: "#FFFFFF",
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
          // removed unsupported 'gap'
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
          margin: 6, // simulate gap
        },
        selectedMoodButton: {
          borderColor: colors.selectedMoodBorder,
          backgroundColor: colors.selectedMoodBg,
        },
        moodEmoji: {
          fontSize: 28,
        },
        noteContainer: {
          // Neon-blue bordered card for dark mode, subtle for light
          backgroundColor: colors.noteCard,
          borderRadius: 16,
          padding: 16,
          borderWidth: 2,
          borderColor: colors.noteBorder,
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
          color: colors.noteText,
          minHeight: 150,
          textAlignVertical: "top",
        },
        noteFooter: {
          alignItems: "flex-end",
          marginTop: 12,
        },
        addNoteButton: {
          backgroundColor: colors.saveButton,
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 8,
        },
        addNoteButtonText: {
          color: colors.saveText,
          fontSize: 12,
          fontWeight: "600",
        },
        saveButtonContainer: {
          padding: 20,
          paddingBottom: 40,
        },
        saveButton: {
          backgroundColor: colors.saveButton,
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
          color: colors.saveText,
          fontSize: 18,
          fontWeight: "bold",
        },
        buttonDisabled: {
          opacity: 0.7,
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

    const entryDate = (date as string) ?? new Date().toISOString().slice(0, 10);
    const existingEntry = getDiaryEntryForDate(entryDate);

    const saveToApi = async () => {
      setIsSaving(true);
      try {
        console.log("🔄 [ANOTAR DIA] Iniciando salvamento...");
        
        // Verifica se já existe uma anotação na API para esta data
        let existingApiEntry = null;
        try {
          existingApiEntry = await diarioApi.getByDate(entryDate);
          console.log("🔍 [ANOTAR DIA] Verificando anotação existente na API:", existingApiEntry);
        } catch (apiError) {
          console.log("⚠️ Não foi possível verificar anotação existente na API, continuando...");
        }

        // Obter usuarioId do contexto ou AsyncStorage
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        let usuarioId = 'user123'; // Default fallback
        try {
          const storedUserId = await AsyncStorage.getItem('userId');
          const storedUserData = await AsyncStorage.getItem('userData');
          if (storedUserId) {
            usuarioId = storedUserId;
          } else if (storedUserData) {
            const userData = JSON.parse(storedUserData);
            usuarioId = userData.id || userData.email || usuarioId;
          }
        } catch (e) {
          console.warn("⚠️ Erro ao obter usuarioId, usando default");
        }

        // Parse da data para dia, mês e ano
        const dateObj = new Date(entryDate);
        const dia = dateObj.getDate();
        const mes = dateObj.getMonth() + 1; // getMonth() retorna 0-11
        const ano = dateObj.getFullYear();
        const hora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

        let result;
        if (existingApiEntry && existingApiEntry.id) {
          // Se já existe na API, atualiza
          console.log("🔄 [ANOTAR DIA] Atualizando anotação existente na API:", existingApiEntry.id);
          result = await diarioApi.update(existingApiEntry.id, {
            anotacao: note.trim(),
            emocao: selectedMood,
            dia: dia,
            mes: mes,
            ano: ano,
            hora: hora,
            usuarioId: usuarioId,
          });
          console.log("✅ [ANOTAR DIA] Anotação atualizada na API");

          // Atualiza ou adiciona localmente também
          if (existingEntry) {
            updateDiaryEntry(existingEntry.id, {
              date: entryDate,
              mood: selectedMood,
              note: note.trim(),
            });
          } else {
            addDiaryEntry({
              date: entryDate,
              mood: selectedMood,
              note: note.trim(),
            });
          }
        } else {
          // Se não existe na API, cria nova
          console.log("🔄 [ANOTAR DIA] Criando nova anotação na API");
          result = await diarioApi.create({
            anotacao: note.trim(),
            emocao: selectedMood,
            dia: dia,
            mes: mes,
            ano: ano,
            hora: hora,
            usuarioId: usuarioId,
          });
          console.log("✅ [ANOTAR DIA] Anotação criada na API:", result);

          // Salvar localmente também (para aparecer no Cronograma)
          addDiaryEntry({
            date: entryDate,
            mood: selectedMood,
            note: note.trim(),
          });
        }

        console.log("✅ [ANOTAR DIA] Anotação salva no contexto local");

        // Redireciona para o Cronograma com a data selecionada
        router.replace({
          pathname: "/Cronograma",
          params: { selectedDate: entryDate },
        });
      } catch (error: any) {
        console.error("❌ [ANOTAR DIA] Erro ao salvar anotação:", error);
        Alert.alert(
          "Erro",
          error?.message || "Não foi possível salvar a anotação. Tente novamente.",
          [{ text: "OK" }]
        );
      } finally {
        setIsSaving(false);
      }
    };

    // Se já existe localmente, pergunta se quer substituir
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
            onPress: saveToApi,
          },
        ]
      );
    } else {
      await saveToApi();
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={colors.gradient}
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

      <View style={styles.saveButtonContainer}>
        <TouchableOpacity 
          style={[styles.saveButton, isSaving && styles.buttonDisabled]} 
          onPress={handleSave}
          disabled={isSaving}
        >
          <Text style={styles.saveButtonText}>
            {isSaving ? "Salvando..." : "Salvar"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
// ...existing code...