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
  const { events, getEventsForDate, isLoading, deleteEvent, forceDeleteEvent, refreshEvents } = useCronograma();

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
    Alert.alert("Anotar Dia", "Funcionalidade em desenvolvimento");
  };

  const getEventsForSelectedDate = () => {
    return getEventsForDate(selectedDate);
  };

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
          <Text style={styles.headerTitle}>
            {selectedDate ? formatDate(selectedDate) : "Agenda"}
          </Text>
          <TouchableOpacity>
            <Ionicons name="arrow-forward" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Calendário */}
        <View style={styles.calendarContainer}>
          <Calendar
            onDayPress={handleDateSelect}
            markedDates={markedDates}
            theme={{
              backgroundColor: "#fff",
              calendarBackground: "#fff",
              textSectionTitleColor: "#3B82F6",
              selectedDayBackgroundColor: "#8B5CF6",
              selectedDayTextColor: "#fff",
              todayTextColor: "#3B82F6",
              dayTextColor: "#333",
              textDisabledColor: "#ccc",
              dotColor: "#3B82F6",
              selectedDotColor: "#fff",
              arrowColor: "#3B82F6",
              monthTextColor: "#333",
              indicatorColor: "#3B82F6",
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
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "diario" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("diario")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "diario" && styles.activeTabText,
              ]}
            >
              Diário
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "eventos" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("eventos")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "eventos" && styles.activeTabText,
              ]}
            >
              Eventos
            </Text>
          </TouchableOpacity>
        </View>

        {/* Conteúdo das tabs */}
        <View style={styles.tabContent}>
          <Text style={styles.tabContentTitle}>informações do dia</Text>
          
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3B82F6" />
              <Text style={styles.loadingText}>Carregando eventos...</Text>
            </View>
          ) : (
            activeTab === "eventos" && selectedDate && (
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
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  calendarContainer: {
    backgroundColor: "#fff",
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
    backgroundColor: "#fff",
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
  activeTab: {
    backgroundColor: "#3B82F6",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  activeTabText: {
    color: "#fff",
  },
  tabContent: {
    marginTop: 20,
    paddingBottom: 100,
  },
  tabContentTitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
  },
  eventsContainer: {
    gap: 12,
  },
  eventCard: {
    backgroundColor: "#fff",
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
    color: "#333",
    marginBottom: 4,
  },
  eventNote: {
    fontSize: 14,
    color: "#666",
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
    color: "#3B82F6",
    fontWeight: "600",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
    marginTop: 12,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#999",
    marginTop: 12,
    textAlign: "center",
  },
});
