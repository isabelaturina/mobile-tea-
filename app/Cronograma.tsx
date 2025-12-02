import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { useCronograma, Event } from "../contexts/CronogramaContext";
import { useTheme } from "../contexts/ThemeContext";
import "../utils/calendarLocale";

export default function Cronograma() {
  const [selectedDate, setSelectedDate] = useState("");
  const [activeTab, setActiveTab] = useState<"diario" | "eventos">("diario");
  const [fabOpen, setFabOpen] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const {
    events,
    getEventsForDate,
    getDiaryEntryForDate,
    isLoading,
    refreshEvents,
    forceDeleteEvent,
    forceDeleteDiaryEntry,
    createEvent,
    updateEvent,
    createDiaryEntry,
    updateDiaryEntry,
  } = useCronograma();

  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const colors = isDarkMode
    ? {
        background: "#000",
        textPrimary: "#F8FAFC",
        textSecondary: "#94A3B8",
        card: "#1E293B",
        accent: "#3B82F6",
        lightAccent: "#60A5FA",
        border: "#334155",
        tabInactive: "#64748B",
      }
    : {
        background: "#F8F9FA",
        textPrimary: "#111",
        textSecondary: "#555",
        card: "#fff",
        accent: "#3B82F6",
        lightAccent: "#70DEFE",
        border: "#E5E7EB",
        tabInactive: "#666",
      };

  const today = new Date().toISOString().split("T")[0];

  useFocusEffect(
    useCallback(() => {
      refreshEvents();
      if (!selectedDate) setSelectedDate(today);
    }, [refreshEvents, selectedDate, today])
  );

  const markedDates = {
    [selectedDate]: { selected: true, selectedColor: "#8B5CF6", selectedTextColor: "#fff" },
    ...events.reduce((acc, event) => {
      acc[event.date] = { marked: true, dotColor: "#3B82F6" };
      return acc;
    }, {} as any),
  };

  const handleDateSelect = (day: any) => setSelectedDate(day.dateString);

  /** FAB Actions */
  const toggleFab = () => {
    setFabOpen((prev) => !prev);
    Animated.timing(rotateAnim, {
      toValue: fabOpen ? 0 : 1,
      duration: 200,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  };

  /** Navegação para adicionar evento */
  const handleAddEvent = () => {
    router.push({ pathname: "/AdicionarEvento", params: { date: selectedDate } });
  };

  const handleAddNote = () => {
    router.push({ pathname: "/AnotarDia", params: { date: selectedDate } });
  };

  /** Editar evento */
  const handleEditEvent = (event: Event) => {
    router.push({ pathname: "/EditarEvento", params: { eventId: event.id } });
  };

  /** Deletar evento */
  const handleDeleteEvent = (eventId: string) => {
    Alert.alert("Confirmar Exclusão", "Tem certeza que deseja excluir este evento?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await forceDeleteEvent(eventId);
            Alert.alert("Sucesso", "Evento excluído com sucesso!");
          } catch {
            Alert.alert("Erro", "Não foi possível excluir o evento.");
          }
        },
      },
    ]);
  };

  /** Deletar anotação */
  const handleDeleteDiaryEntry = (entryId: string) => {
    Alert.alert("Confirmar Exclusão", "Tem certeza que deseja excluir esta anotação?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await forceDeleteDiaryEntry(entryId);
            Alert.alert("Sucesso", "Anotação excluída com sucesso!");
          } catch {
            Alert.alert("Erro", "Não foi possível excluir a anotação.");
          }
        },
      },
    ]);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Agenda";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Agenda";
    const months = [
      "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
      "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
    ];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const formatSelectedDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    const day = date.getDate();
    const months = [
      "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
      "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
    ];
    return `${day} de ${months[date.getMonth()]}, ${date.getFullYear()}`;
  };

  const getMoodEmoji = (mood: string) => {
    const moodMap: { [key: string]: string } = {
      muito_feliz: "😁", feliz: "😊", neutro: "😐",
      triste: "😔", muito_triste: "😢", ansioso: "😰", irritado: "😡"
    };
    return moodMap[mood] || "😐";
  };

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "45deg"],
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={["#8B5CF6", "#3B82F6"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.push("../../Home")}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{selectedDate ? formatDate(selectedDate) : "Agenda"}</Text>
          <View style={{ width: 24 }} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Calendário */}
        <View style={[styles.calendarContainer, { backgroundColor: colors.card }]}>
          <Calendar
            onDayPress={handleDateSelect}
            markedDates={markedDates}
            theme={{
              backgroundColor: colors.card,
              calendarBackground: colors.card,
              textSectionTitleColor: colors.accent,
              selectedDayBackgroundColor: "#8B5CF6",
              selectedDayTextColor: "#fff",
              todayTextColor: colors.accent,
              dayTextColor: colors.textPrimary,
              textDisabledColor: colors.textSecondary,
              arrowColor: colors.accent,
              monthTextColor: colors.textPrimary,
              textDayFontWeight: "500",
              textMonthFontWeight: "bold",
              textDayHeaderFontWeight: "600",
              textDayFontSize: 14,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 12,
            }}
            firstDay={1}
            hideExtraDays
            enableSwipeMonths
            monthFormat={"MMMM yyyy"}
          />
        </View>

        {/* Tabs */}
        <View style={[styles.tabsContainer, { backgroundColor: colors.card }]}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "diario" && { backgroundColor: colors.accent }]}
            onPress={() => setActiveTab("diario")}
          >
            <Text style={[styles.tabText, { color: activeTab === "diario" ? "#fff" : colors.tabInactive }]}>
              Diário
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "eventos" && { backgroundColor: colors.accent }]}
            onPress={() => setActiveTab("eventos")}
          >
            <Text style={[styles.tabText, { color: activeTab === "eventos" ? "#fff" : colors.tabInactive }]}>
              Eventos
            </Text>
          </TouchableOpacity>
        </View>

        {/* Conteúdo */}
        <View style={styles.tabContent}>
          <Text style={[styles.tabContentTitle, { color: colors.textSecondary }]}>informações do dia</Text>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.accent} />
              <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Carregando...</Text>
            </View>
          ) : (
            selectedDate && (
              <>
                {activeTab === "diario" && (
                  <View style={styles.diaryContainer}>
                    {getDiaryEntryForDate(selectedDate) ? (
                      <View style={[styles.diaryCard, isDarkMode ? styles.diaryCardDark : styles.diaryCardLight]}>
                        <View style={styles.diaryHeader}>
                          <Text style={[styles.diaryDate, { color: colors.textPrimary }]}>
                            {formatSelectedDate(selectedDate)}
                          </Text>
                          <Text style={[styles.diaryMood, { color: colors.textPrimary }]}>
                            {getMoodEmoji(getDiaryEntryForDate(selectedDate)?.mood || "")}
                          </Text>
                        </View>
                        <Text style={[styles.diaryNote, { color: colors.textSecondary }]}>
                          {getDiaryEntryForDate(selectedDate)?.note}
                        </Text>
                        <View style={styles.diaryActions}>
                          <TouchableOpacity
                            style={[styles.actionButton, styles.editButton]}
                            onPress={() =>
                              router.push({
                                pathname: "/EditarAnotacao",
                                params: { entryId: getDiaryEntryForDate(selectedDate)?.id },
                              })
                            }
                          >
                            <Ionicons name="create-outline" size={16} color="#fff" />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.actionButton, styles.deleteButton]}
                            onPress={() =>
                              handleDeleteDiaryEntry(getDiaryEntryForDate(selectedDate)?.id || "")
                            }
                          >
                            <Ionicons name="trash-outline" size={16} color="#fff" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    ) : (
                      <View style={styles.emptyState}>
                        <Ionicons name="journal-outline" size={48} color="#ccc" />
                        <Text style={styles.emptyStateText}>Nenhuma anotação para esta data</Text>
                      </View>
                    )}
                  </View>
                )}

                {activeTab === "eventos" && (
                  <View style={styles.eventsContainer}>
                    {getEventsForDate(selectedDate).length > 0 ? (
                      getEventsForDate(selectedDate).map((event) => (
                        <View key={event.id} style={[styles.eventCard, { backgroundColor: colors.card }]}>
                          <View style={styles.eventInfo}>
                            <Text style={[styles.eventTitle, { color: colors.textPrimary }]}>{event.title}</Text>
                            <Text style={[styles.eventNote, { color: colors.textSecondary }]}>{event.note}</Text>
                            <View style={styles.eventTime}>
                              <Ionicons name="notifications" size={16} color={colors.accent} />
                              <Text style={[styles.eventTimeText, { color: colors.accent }]}>{event.time}</Text>
                            </View>
                          </View>
                          <View style={styles.eventActions}>
                            <TouchableOpacity
                              style={[styles.actionButton, styles.editButton]}
                              onPress={() => handleEditEvent(event)}
                            >
                              <Ionicons name="create-outline" size={16} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={[styles.actionButton, styles.deleteButton]}
                              onPress={() => handleDeleteEvent(event.id)}
                            >
                              <Ionicons name="trash-outline" size={16} color="#fff" />
                            </TouchableOpacity>
                          </View>
                        </View>
                      ))
                    ) : (
                      <View style={styles.emptyState}>
                        <Ionicons name="calendar-outline" size={48} color={colors.textSecondary} />
                        <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
                          Nenhum evento para esta data
                        </Text>
                      </View>
                    )}
                  </View>
                )}
              </>
            )
          )}
        </View>
      </ScrollView>

      {/* FAB */}
      <View style={styles.fabContainer}>
        {fabOpen && (
          <>
            <TouchableOpacity style={[styles.fab, styles.fabSecondary]} onPress={handleAddNote}>
              <Ionicons name="create-outline" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.fab, styles.fabEvent]} onPress={handleAddEvent}>
              <Ionicons name="calendar-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </>
        )}
        <Animated.View style={{ transform: [{ rotate: rotation }] }}>
          <TouchableOpacity style={styles.fab} onPress={toggleFab}>
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

/** styles... (use exatamente os mesmos do seu código anterior) */
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  headerContent: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#fff" },
  content: { flex: 1, paddingHorizontal: 20 },
  calendarContainer: { borderRadius: 16, marginTop: 20, padding: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  tabsContainer: { flexDirection: "row", borderRadius: 12, marginTop: 20, padding: 4 },
  tab: { flex: 1, paddingVertical: 12, alignItems: "center", borderRadius: 8 },
  tabText: { fontSize: 16, fontWeight: "600" },
  tabContent: { marginTop: 20, paddingBottom: 100 },
  tabContentTitle: { fontSize: 16, marginBottom: 16 },
  eventsContainer: { gap: 12 },
  eventCard: { borderRadius: 12, padding: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between", shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  eventInfo: { flex: 1 },
  eventTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  eventNote: { fontSize: 14, marginBottom: 8 },
  eventTime: { flexDirection: "row", alignItems: "center", gap: 4 },
  eventActions: { flexDirection: "row", gap: 8, marginLeft: 12 },
  actionButton: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  editButton: { backgroundColor: "#3B82F6" },
  deleteButton: { backgroundColor: "#EF4444" },
  eventTimeText: { fontSize: 14, fontWeight: "600" },
  loadingContainer: { alignItems: "center", justifyContent: "center", paddingVertical: 40 },
  loadingText: { fontSize: 16, marginTop: 12 },
  emptyState: { alignItems: "center", justifyContent: "center", paddingVertical: 40 },
  emptyStateText: { fontSize: 16, marginTop: 12, textAlign: "center" },
  diaryContainer: { gap: 12 },
  diaryCard: { borderRadius: 12, padding: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 3 },
  diaryCardDark: { backgroundColor: "#000", borderWidth: 2, borderColor: "rgba(59,130,246,0.95)", shadowColor: "#3B82F6", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.9, shadowRadius: 18, elevation: 14 },
  diaryCardLight: { backgroundColor: "#fff", borderWidth: 1, borderColor: "rgba(59,130,246,0.18)", shadowColor: "#3B82F6", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 8, elevation: 4 },
  diaryHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  diaryDate: { fontSize: 16, fontWeight: "bold" },
  diaryMood: { fontSize: 24 },
  diaryNote: { fontSize: 14, lineHeight: 20, marginBottom: 12 },
  diaryActions: { flexDirection: "row", justifyContent: "flex-end", gap: 8 },
  fabContainer: { position: "absolute", bottom: 30, right: 20, alignItems: "center", gap: 12 },
  fab: { width: 56, height: 56, borderRadius: 28, backgroundColor: "#3B82F6", alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 },
  fabSecondary: { backgroundColor: "#8B5CF6", width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 6, elevation: 6 },
  fabEvent: { backgroundColor: "#60A5FA", width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 6, elevation: 6 },
});
