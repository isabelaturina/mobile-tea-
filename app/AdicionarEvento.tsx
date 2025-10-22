import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
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
import { Calendar } from "react-native-calendars";
import { useCronograma } from "../contexts/CronogramaContext";
import { useTheme } from "../contexts/ThemeContext";
import "../utils/calendarLocale";

export default function AdicionarEvento() {
  const [selectedDate, setSelectedDate] = useState("");
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [time, setTime] = useState("08:00");
  const [showNotification, setShowNotification] = useState(false);
  const { addEvent } = useCronograma();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const today = new Date().toISOString().split("T")[0];

  const markedDates = {
    [selectedDate]: {
      selected: true,
      selectedColor: "#8B5CF6",
      selectedTextColor: "#fff",
    },
  };

  // Desabilitar datas passadas
  const minDate = today;

  const handleDateSelect = (day: any) => {
    setSelectedDate(day.dateString);
  };

  const handleAddEvent = async () => {
    if (!selectedDate || !title.trim()) {
      Alert.alert("Atenção", "Por favor, selecione uma data e preencha o título");
      return;
    }

    // Verificar se a data selecionada não é no passado
    if (selectedDate < today) {
      Alert.alert("Data Inválida", "Não é possível adicionar eventos para datas passadas. Por favor, selecione uma data atual ou futura.");
      return;
    }

    try {
      // Criar novo evento
      addEvent({
        title: title.trim(),
        note: note.trim(),
        date: selectedDate,
        time: time,
        hasAlarm: showNotification,
      });
      // Agenda notificação se solicitado
      if (showNotification) {
        try {
          const [hours, minutes] = time.split(":").map(Number);
          const triggerDate = new Date(selectedDate + "T00:00:00");
          triggerDate.setHours(hours);
          triggerDate.setMinutes(minutes);
          triggerDate.setSeconds(0);
          if (triggerDate.getTime() > Date.now()) {
            await Notifications.scheduleNotificationAsync({
              content: {
                title: "Lembrete do evento",
                body: `${title} - ${note}`.trim(),
              },
              trigger: null
            });
            console.log("Notificação agendada com sucesso");
          }
        } catch (e) {
          console.warn("Falha ao agendar notificação");
        }
      }
      
      Alert.alert(
        "Sucesso!",
        "Evento adicionado com sucesso.",
        [
          {
            text: "OK",
            onPress: () => router.back()
          }
        ]
      );
    } catch (error) {
      Alert.alert(
        "Erro",
        "Não foi possível salvar o evento. Tente novamente.",
        [{ text: "OK" }]
      );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

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
        placeholder: "#64748B",
      }
    : {
        background: "#F8F9FA",
        textPrimary: "#111",
        textSecondary: "#555",
        card: "#FFFFFF",
        accent: "#3B82F6",
        lightAccent: "#70DEFE",
        border: "#E5E7EB",
        placeholder: "#999",
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
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Adicionar Evento</Text>
          <View style={{ width: 24 }} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Calendário compacto */}
        <View style={[styles.calendarContainer, { backgroundColor: colors.card }]}>
          <Text style={[styles.calendarTitle, { color: colors.textPrimary }]}>Calendário</Text>
          <Calendar
            onDayPress={handleDateSelect}
            markedDates={markedDates}
            minDate={minDate}
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
            showWeekNumbers={false}
            hideExtraDays={true}
            disableMonthChange={false}
            enableSwipeMonths={true}
            style={styles.calendar}
            monthFormat={'MMMM yyyy'}
          />
        </View>

        {/* Formulário */}
        <View style={styles.formContainer}>
          {/* Título */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>Título</Text>
            <TextInput
              style={[styles.textInput, { backgroundColor: colors.card, color: colors.textPrimary, borderColor: colors.border }]}
              value={title}
              onChangeText={setTitle}
              placeholder="Fonoaudiologo"
              placeholderTextColor={colors.placeholder}
            />
          </View>

          {/* Horário */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>Horário</Text>
            <TextInput
              style={[styles.textInput, { backgroundColor: colors.card, color: colors.textPrimary, borderColor: colors.border }]}
              value={time}
              onChangeText={setTime}
              placeholder="08:00"
              placeholderTextColor={colors.placeholder}
            />
          </View>

          {/* Nota */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>Nota</Text>
            <TextInput
              style={[styles.textInput, styles.textArea, { backgroundColor: colors.card, color: colors.textPrimary, borderColor: colors.border }]}
              value={note}
              onChangeText={setNote}
              placeholder="adicionar a nota do evento exemplo|fonoaudiologo com a profissional"
              placeholderTextColor={colors.placeholder}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* Notificação */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Notificação</Text>
            <TouchableOpacity
              style={[styles.sectionButton, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => setShowNotification(!showNotification)}
            >
              <Text style={[styles.sectionButtonText, { color: colors.textSecondary }]}>
                {showNotification ? "Notificação ativada" : "Adicionar notificação"}
              </Text>
              <Ionicons
                name={showNotification ? "checkmark-circle" : "add-circle-outline"}
                size={20}
                color={colors.accent}
              />
            </TouchableOpacity>
          </View>

          {/* Alarme */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Alarme</Text>
            <TouchableOpacity
              style={[styles.sectionButton, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => {
                if (!selectedDate || !title.trim()) {
                  alert("Por favor, selecione uma data e preencha o título primeiro");
                  return;
                }
                router.push({
                  pathname: "/AdicionarTimer",
                  params: {
                    title,
                    note,
                    date: selectedDate,
                  },
                });
              }}
            >
              <Text style={[styles.sectionButtonText, { color: colors.textSecondary }]}>
                adicione um alarme para te lembrar
              </Text>
              <Ionicons
                name="time-outline"
                size={20}
                color={colors.accent}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Botão de adicionar */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.addButton} onPress={handleAddEvent}>
          <LinearGradient
            colors={["#8B5CF6", "#3B82F6"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.addButtonGradient}
          >
            <Text style={styles.addButtonText}>Adicionar</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
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
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  calendar: {
    borderRadius: 12,
  },
  formContainer: {
    marginTop: 20,
    paddingBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  textInput: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  textArea: {
    height: 80,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  sectionButton: {
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
  },
  sectionButtonText: {
    fontSize: 16,
    flex: 1,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  addButton: {
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  addButtonGradient: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
