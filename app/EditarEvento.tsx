import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { useCronograma } from "../contexts/CronogramaContext";
import { useTheme } from "../contexts/ThemeContext";
import { NotificationService } from "../services/notificationService";
import "../utils/calendarLocale";

export default function EditarEvento() {
  const params = useLocalSearchParams();
  const eventId = params.eventId as string;
  const { events, updateEvent } = useCronograma();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const [selectedDate, setSelectedDate] = useState("");
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [time, setTime] = useState("08:00");
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (eventId && events.length > 0) {
      const event = events.find((e) => e.id === eventId);
      if (event) {
        setSelectedDate(event.date);
        setTitle(event.title);
        setNote(event.note);
        setTime(event.time);
        setShowNotification(event.hasAlarm || false);
      }
    }
  }, [eventId, events]);

  const today = new Date().toISOString().split("T")[0];

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
        textSecondary: "#666",
        card: "#FFFFFF",
        accent: "#3B82F6",
        lightAccent: "#70DEFE",
        border: "#E5E7EB",
        placeholder: "#999",
      };

  const markedDates = {
    [selectedDate]: {
      selected: true,
      selectedColor: "#8B5CF6",
      selectedTextColor: "#fff",
    },
  };

  const handleSave = async () => {
    if (!selectedDate || !title.trim()) {
      Alert.alert("Atenção", "Por favor, selecione uma data e preencha o título");
      return;
    }

    // Verificar se a data selecionada não é no passado
    if (selectedDate < today) {
      Alert.alert(
        "Data Inválida",
        "Não é possível alterar um evento para uma data passada. Por favor, selecione uma data atual ou futura."
      );
      return;
    }

    try {
      // Cancelar notificação anterior se existir
      const oldEvent = events.find((e) => e.id === eventId);
      if (oldEvent && oldEvent.hasAlarm) {
        await NotificationService.cancelNotification(oldEvent.title + oldEvent.date);
      }

      let notificationId = null;

      // Se notificação estiver ativada, agendar nova
      if (showNotification) {
        const hasPermission = await NotificationService.requestPermissions();
        if (hasPermission) {
          notificationId = await NotificationService.scheduleEventNotification({
            title: title.trim(),
            body: note.trim() || "Lembrete de evento",
            date: selectedDate,
            time: time,
          });

          if (!notificationId) {
            Alert.alert(
              "Aviso",
              "Evento atualizado, mas não foi possível agendar a notificação. Verifique as configurações de notificação do seu dispositivo.",
              [{ text: "OK" }]
            );
          }
        } else {
          Alert.alert(
            "Permissão Necessária",
            "Para receber lembretes de eventos, é necessário permitir notificações. Você pode ativar nas configurações do seu dispositivo.",
            [{ text: "OK" }]
          );
        }
      }

      updateEvent(eventId, {
        title: title.trim(),
        note: note.trim(),
        date: selectedDate,
        time: time,
        hasAlarm: showNotification,
        alarmTime: showNotification ? time : undefined,
      });

      const successMessage =
        showNotification && notificationId
          ? "Evento atualizado com sucesso! Você receberá uma notificação no horário agendado."
          : "Evento atualizado com sucesso!";

      Alert.alert("Sucesso!", successMessage, [
        {
          text: "OK",
          onPress: () => {
            console.log("Voltando para cronograma após atualização...");
            router.back();
          },
        },
      ]);
    } catch (error) {
      console.error("Erro ao atualizar evento:", error);
      Alert.alert("Erro", "Não foi possível atualizar o evento. Tente novamente.", [
        { text: "OK" },
      ]);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
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
          <Text style={styles.headerTitle}>Editar Evento</Text>
          <View style={{ width: 24 }} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Calendário compacto */}
        <View style={[styles.calendarContainer, { backgroundColor: colors.card }]}>
          <Text style={[styles.calendarTitle, { color: colors.textPrimary }]}>Calendário</Text>
          <Calendar
            onDayPress={(day) => setSelectedDate(day.dateString)}
            markedDates={markedDates}
            minDate={today}
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
            monthFormat={"MMMM yyyy"}
          />
        </View>

        {/* Formulário */}
        <View style={styles.formContainer}>
          {/* Título */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>Título</Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: colors.card,
                  color: colors.textPrimary,
                  borderColor: colors.border,
                },
              ]}
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
              style={[
                styles.textInput,
                {
                  backgroundColor: colors.card,
                  color: colors.textPrimary,
                  borderColor: colors.border,
                },
              ]}
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
              style={[
                styles.textInput,
                styles.textArea,
                { backgroundColor: colors.card, color: colors.textPrimary, borderColor: colors.border },
              ]}
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
          <View style={[styles.notificationContainer, { backgroundColor: colors.card }]}>
            <View style={styles.notificationHeader}>
              <View style={styles.notificationInfo}>
                <Ionicons name="notifications" size={20} color={colors.accent} />
                <View style={styles.notificationTextContainer}>
                  <Text style={[styles.notificationTitle, { color: colors.textPrimary }]}>Lembrete de Evento</Text>
                  <Text style={[styles.notificationSubtitle, { color: colors.textSecondary }]}>
                    Receber notificação no horário do evento
                  </Text>
                </View>
              </View>
              <Switch
                value={showNotification}
                onValueChange={setShowNotification}
                trackColor={{ false: colors.border, true: colors.accent }}
                thumbColor={showNotification ? "#fff" : colors.textSecondary}
                ios_backgroundColor={colors.border}
              />
            </View>
            {showNotification && (
              <View style={[styles.notificationDetails, { borderTopColor: colors.border }]}>
                <Text style={[styles.notificationDetailsText, { color: colors.lightAccent }]}>
                  📅 Você receberá uma notificação em {formatDate(selectedDate)} às {time}
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Botão de salvar */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <LinearGradient
            colors={["#8B5CF6", "#3B82F6"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.saveButtonGradient}
          >
            <Text style={styles.saveButtonText}>Salvar Alterações</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor overridden dynamically
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
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  sectionButtonText: {
    fontSize: 16,
    flex: 1,
    color: "#666",
  },
  buttonContainer: {
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
  saveButtonGradient: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  notificationContainer: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  notificationHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  notificationInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  notificationTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  notificationSubtitle: {
    fontSize: 14,
  },
  notificationDetails: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  notificationDetailsText: {
    fontSize: 14,
    fontWeight: "500",
  },
});