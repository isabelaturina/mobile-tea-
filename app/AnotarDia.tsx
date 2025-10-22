import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";

type Mood = "happy" | "calm" | "tired" | "anxious" | "neutral" | "angry";

interface DailyNote {
  id: string;
  date: string;
  mood: Mood;
  text: string;
}

const STORAGE_KEY = "@daily_notes";

export default function AnotarDia() {
  const { date } = useLocalSearchParams<{ date?: string }>();
  const [selectedMood, setSelectedMood] = useState<Mood>("happy");
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const currentDate = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return typeof date === "string" && date.length > 0 ? date : today;
  }, [date]);

  const colors = isDarkMode
    ? {
        background: "#000000",
        textPrimary: "#F8FAFC",
        textSecondary: "#94A3B8",
        card: "#1E293B",
        accent: "#3B82F6",
        border: "#334155",
        placeholder: "#64748B",
      }
    : {
        background: "#F8F9FA",
        textPrimary: "#111",
        textSecondary: "#555",
        card: "#FFFFFF",
        accent: "#3B82F6",
        border: "#E5E7EB",
        placeholder: "#999",
      };

  // Precarrega nota existente para a data
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (!saved) return;
        const parsed: DailyNote[] = JSON.parse(saved);
        const existing = parsed.find((n) => n.date === currentDate);
        if (existing) {
          setSelectedMood(existing.mood);
          setText(existing.text);
        }
      } catch {}
    })();
  }, [currentDate]);

  const emojiMap: Record<Mood, string> = {
    happy: "😊",
    calm: "😌",
    tired: "🥱",
    anxious: "😰",
    neutral: "🙂",
    angry: "😡",
  };

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      const list: DailyNote[] = saved ? JSON.parse(saved) : [];
      const existingIndex = list.findIndex((n) => n.date === currentDate);
      const newNote: DailyNote = {
        id: Date.now().toString(),
        date: currentDate,
        mood: selectedMood,
        text: text.trim(),
      };
      if (existingIndex >= 0) {
        list[existingIndex] = { ...list[existingIndex], ...newNote };
      } else {
        list.push(newNote);
      }
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      setSuccessVisible(true);
    } catch (e) {
      // fallback: apenas voltar
      router.back();
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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
          <Text style={styles.headerTitle}>Meu humor diario 💙</Text>
          <View style={{ width: 24 }} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Registre com os emojis como você se sentiu hoje</Text>

          <View style={styles.emojiRow}>
            {(Object.keys(emojiMap) as Mood[]).map((m) => (
              <TouchableOpacity
                key={m}
                style={[styles.emojiButton, selectedMood === m && styles.emojiSelected]}
                onPress={() => setSelectedMood(m)}
              >
                <Text style={styles.emoji}>{emojiMap[m]}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Anote como você se sentiu hoje</Text>
          <TextInput
            style={[styles.textArea, { color: colors.textPrimary, borderColor: colors.border, backgroundColor: colors.card }]}
            placeholder="Faça sua anotação aqui..."
            placeholderTextColor={colors.placeholder}
            value={text}
            onChangeText={setText}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
          <LinearGradient
            colors={["#8B5CF6", "#3B82F6"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.saveGradient}
          >
            <Text style={styles.saveText}>{saving ? "Salvando..." : "Salvar"}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <Modal visible={successVisible} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: colors.card }]}>
            <Image source={require("../assets/images/ChatBea.png")} style={{ width: 120, height: 120, alignSelf: "center" }} />
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Pronto!</Text>
            <Text style={[styles.modalText, { color: colors.textSecondary }]}>Sua anotação foi salva! A Bea está disponível caso queira conversar.</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: "#0EA5E9" }]} onPress={() => { setSuccessVisible(false); router.replace("/Cronograma"); }}>
                <Text style={styles.modalButtonText}>Finalizar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: "#3B82F6" }]} onPress={() => router.push("/ChatBea") }>
                <Text style={styles.modalButtonText}>falar com a bea</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  card: {
    borderRadius: 16,
    marginTop: 20,
    padding: 16,
    borderWidth: 1,
  },
  sectionLabel: {
    fontSize: 13,
    marginBottom: 12,
    fontWeight: "600",
  },
  emojiRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  emojiButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1F5F9",
  },
  emojiSelected: {
    borderWidth: 2,
    borderColor: "#3B82F6",
  },
  emoji: {
    fontSize: 22,
  },
  textArea: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    height: 140,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  saveButton: {
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  saveGradient: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  saveText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  modalCard: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 8,
  },
  modalText: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});


