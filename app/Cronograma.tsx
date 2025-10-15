import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import SpeedDialFAB from "../components/SpeedDialFAB";
import { useCronograma } from "../contexts/CronogramaContext";
<<<<<<< HEAD:app/Cronograma.tsx
import { useTheme } from "../contexts/ThemeContext";
=======
>>>>>>> 59be562 (fiz as telas de anotações diarias, implementei a notificação LOCALMENTE não esta conectado com o banco de dados):tea/app/Cronograma.tsx
import "../utils/calendarLocale";

interface Event {
  id: string;
  title: string;
  note: string;
  time: string;
  date: string;
  hasAlarm?: boolean;
  alarmTime?: string;
  repeatAlarm?: boolean;
}

export default function Cronograma() {
  const [selectedDate, setSelectedDate] = useState("");
  const [activeTab, setActiveTab] = useState<"diario" | "eventos">("diario");
<<<<<<< HEAD:app/Cronograma.tsx
  const { events, getEventsForDate, isLoading, deleteEvent, forceDeleteEvent, refreshEvents } = useCronograma();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  // 🎨 Define cores com base no tema
  const colors = isDarkMode
    ? {
        background: "#000000",
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
        card: "#FFFFFF",
        accent: "#3B82F6",
        lightAccent: "#70DEFE",
        border: "#E5E7EB",
        tabInactive: "#666",
      };
=======
  const { events, getEventsForDate, getDiaryEntryForDate, isLoading, forceDeleteEvent, forceDeleteDiaryEntry, refreshEvents } = useCronograma();
>>>>>>> 59be562 (fiz as telas de anotações diarias, implementei a notificação LOCALMENTE não esta conectado com o banco de dados):tea/app/Cronograma.tsx

  const today = new Date().toISOString().split("T")[0];

  // Recarregar eventos quando a tela for focada
  useFocusEffect(
    useCallback(() => {
      console.log('Tela de cronograma focada, recarregando eventos...');
      refreshEvents();
      
      // Se não há data selecionada, seleciona hoje
      if (!selectedDate) {
        setSelectedDate(today);
        console.log('Data selecionada resetada para hoje:', today);
      }
    }, [refreshEvents, selectedDate, today])
  );

  // Inicializar data selecionada
  useEffect(() => {
    if (!selectedDate) {
      setSelectedDate(today);
      console.log('Data inicial definida como hoje:', today);
    }
  }, [selectedDate, today]);

  const markedDates = {
    [selectedDate]: {
      selected: true,
      selectedColor: "#8B5CF6",
      selectedTextColor: "#fff",
    },
    ...events.reduce((acc, event) => {
      acc[event.date] = {
        marked: true,
        dotColor: "#3B82F6",
      };
      return acc;
    }, {} as any),
  };

  const handleDateSelect = (day: any) => {
    setSelectedDate(day.dateString);
  };

  const handleAddEvent = () => {
    router.push("/AdicionarEvento");
  };

  const handleAddNote = () => {
    router.push({
      pathname: "/AnotarDia",
      params: { date: selectedDate },
    });
  };

  const getEventsForSelectedDate = () => {
    return getEventsForDate(selectedDate);
  };

<<<<<<< HEAD:app/Cronograma.tsx
=======
  const getDiaryEntryForSelectedDate = () => {
    return getDiaryEntryForDate(selectedDate);
  };

>>>>>>> 59be562 (fiz as telas de anotações diarias, implementei a notificação LOCALMENTE não esta conectado com o banco de dados):tea/app/Cronograma.tsx
  const handleEditEvent = (event: Event) => {
    router.push({
      pathname: "/EditarEvento",
      params: {
        eventId: event.id,
      },
    });
  };

  const handleDeleteEvent = (eventId: string) => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir este evento?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              console.log('Tentando excluir evento:', eventId);
              await forceDeleteEvent(eventId);
              console.log('Evento excluído com sucesso');
              // Pequeno delay para garantir que a exclusão foi processada
              setTimeout(() => {
                Alert.alert("Sucesso", "Evento excluído com sucesso!");
              }, 200);
            } catch (error) {
              console.error('Erro ao excluir evento:', error);
              Alert.alert("Erro", "Não foi possível excluir o evento. Tente novamente.");
            }
          },
        },
      ]
    );
  };

<<<<<<< HEAD:app/Cronograma.tsx
=======
  const handleEditDiaryEntry = (date: string) => {
    router.push({
      pathname: "/EditarAnotacao",
      params: { date },
    });
  };

  const handleDeleteDiaryEntry = (entryId: string) => {
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
            try {
              console.log('Tentando excluir anotação:', entryId);
              await forceDeleteDiaryEntry(entryId);
              console.log('Anotação excluída com sucesso');
              // Pequeno delay para garantir que a exclusão foi processada
              setTimeout(() => {
                Alert.alert("Sucesso", "Anotação excluída com sucesso!");
              }, 200);
            } catch (error) {
              console.error('Erro ao excluir anotação:', error);
              Alert.alert("Erro", "Não foi possível excluir a anotação. Tente novamente.");
            }
          },
        },
      ]
    );
  };

>>>>>>> 59be562 (fiz as telas de anotações diarias, implementei a notificação LOCALMENTE não esta conectado com o banco de dados):tea/app/Cronograma.tsx

  const formatDate = (dateString: string) => {
    if (!dateString) return "Agenda";
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Agenda";
    
    const months = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const formatSelectedDate = (dateString: string) => {
    if (!dateString) return "";
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    
    const day = date.getDate();
    const months = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day} de ${month}, ${year}`;
  };

  const getMoodEmoji = (mood: string) => {
    const moodMap: { [key: string]: string } = {
      "muito_feliz": "😁",
      "feliz": "😊",
      "neutro": "😐",
      "triste": "😔",
      "muito_triste": "😢",
      "ansioso": "😰",
      "irritado": "😡",
    };
    return moodMap[mood] || "😐";
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
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
  <Text style={styles.headerTitle}>
    {selectedDate ? formatDate(selectedDate) : "Agenda"}
  </Text>
  <View style={{ width: 24 }} /> {/* Espaço vazio para manter alinhamento */}
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
              dotColor: colors.accent,
              selectedDotColor: "#fff",
              arrowColor: colors.accent,
              monthTextColor: colors.textPrimary,
              indicatorColor: colors.accent,
              textDayFontWeight: "500",
              textMonthFontWeight: "bold",
              textDayHeaderFontWeight: "600",
              textDayFontSize: 16,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 14,
            }}
            firstDay={1}
            showWeekNumbers={false}
            hideExtraDays={true}
            disableMonthChange={false}
            enableSwipeMonths={true}
            monthFormat={'MMMM yyyy'}
          />
        </View>

        {/* Tabs */}
        <View style={[styles.tabsContainer, { backgroundColor: colors.card }]}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "diario" && { backgroundColor: colors.accent },
            ]}
            onPress={() => setActiveTab("diario")}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === "diario" ? "#fff" : colors.tabInactive },
              ]}
            >
              Diário
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "eventos" && { backgroundColor: colors.accent },
            ]}
            onPress={() => setActiveTab("eventos")}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === "eventos" ? "#fff" : colors.tabInactive },
              ]}
            >
              Eventos
            </Text>
          </TouchableOpacity>
        </View>

        {/* Conteúdo das tabs */}
        <View style={styles.tabContent}>
          <Text style={[styles.tabContentTitle, { color: colors.textSecondary }]}>informações do dia</Text>
          
          {isLoading ? (
            <View style={styles.loadingContainer}>
<<<<<<< HEAD:app/Cronograma.tsx
              <ActivityIndicator size="large" color={colors.accent} />
              <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Carregando eventos...</Text>
            </View>
          ) : (
            activeTab === "eventos" && selectedDate && (
              <View style={styles.eventsContainer}>
                {getEventsForSelectedDate().length > 0 ? (
                  getEventsForSelectedDate().map((event) => (
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
                    <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>Nenhum evento para esta data</Text>
=======
              <ActivityIndicator size="large" color="#3B82F6" />
              <Text style={styles.loadingText}>Carregando...</Text>
            </View>
          ) : (
            selectedDate && (
              <>
                {activeTab === "diario" && (
                  <View style={styles.diaryContainer}>
                    {getDiaryEntryForSelectedDate() ? (
                      <View style={styles.diaryCard}>
                        <View style={styles.diaryHeader}>
                          <Text style={styles.diaryDate}>
                            {formatSelectedDate(selectedDate)}
                          </Text>
                          <Text style={styles.diaryMood}>
                            {getMoodEmoji(getDiaryEntryForSelectedDate()?.mood || "")}
                          </Text>
                        </View>
                        <Text style={styles.diaryNote}>
                          {getDiaryEntryForSelectedDate()?.note}
                        </Text>
                        <View style={styles.diaryActions}>
                          <TouchableOpacity 
                            style={[styles.actionButton, styles.editButton]}
                            onPress={() => handleEditDiaryEntry(selectedDate)}
                          >
                            <Ionicons name="create-outline" size={16} color="#fff" />
                          </TouchableOpacity>
                          <TouchableOpacity 
                            style={[styles.actionButton, styles.deleteButton]}
                            onPress={() => handleDeleteDiaryEntry(getDiaryEntryForSelectedDate()?.id || "")}
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
>>>>>>> 59be562 (fiz as telas de anotações diarias, implementei a notificação LOCALMENTE não esta conectado com o banco de dados):tea/app/Cronograma.tsx
                  </View>
                )}

                {activeTab === "eventos" && (
                  <View style={styles.eventsContainer}>
                    {getEventsForSelectedDate().length > 0 ? (
                      getEventsForSelectedDate().map((event) => (
                        <View key={event.id} style={styles.eventCard}>
                          <View style={styles.eventInfo}>
                            <Text style={styles.eventTitle}>{event.title}</Text>
                            <Text style={styles.eventNote}>{event.note}</Text>
                            <View style={styles.eventTime}>
                              <Ionicons name="notifications" size={16} color="#3B82F6" />
                              <Text style={styles.eventTimeText}>{event.time}</Text>
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
                        <Ionicons name="calendar-outline" size={48} color="#ccc" />
                        <Text style={styles.emptyStateText}>Nenhum evento para esta data</Text>
                      </View>
                    )}
                  </View>
                )}
              </>
            )
          )}
        </View>
      </ScrollView>

      {/* Speed Dial FAB */}
      <SpeedDialFAB onAddEvent={handleAddEvent} onAddNote={handleAddNote} />
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
  calendarContainer: {
    borderRadius: 16,
    marginTop: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabsContainer: {
    flexDirection: "row",
    borderRadius: 12,
    marginTop: 20,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
  },
  tabContent: {
    marginTop: 20,
    paddingBottom: 100,
  },
  tabContentTitle: {
    fontSize: 16,
    marginBottom: 16,
  },
  eventsContainer: {
    gap: 12,
  },
  eventCard: {
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  eventNote: {
    fontSize: 14,
<<<<<<< HEAD:app/Cronograma.tsx
=======
    color: "#666",
>>>>>>> 59be562 (fiz as telas de anotações diarias, implementei a notificação LOCALMENTE não esta conectado com o banco de dados):tea/app/Cronograma.tsx
    marginBottom: 8,
  },
  eventTime: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  eventActions: {
    flexDirection: "row",
    gap: 8,
    marginLeft: 12,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  editButton: {
    backgroundColor: "#3B82F6",
  },
  deleteButton: {
    backgroundColor: "#EF4444",
  },
  eventTimeText: {
    fontSize: 14,
    fontWeight: "600",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 12,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    marginTop: 12,
    textAlign: "center",
  },
  diaryContainer: {
    gap: 12,
  },
  diaryCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  diaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  diaryDate: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  diaryMood: {
    fontSize: 24,
  },
  diaryNote: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 12,
  },
  diaryActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
});
