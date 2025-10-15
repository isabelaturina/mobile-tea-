import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
<<<<<<< HEAD:app/EditarEvento.tsx
  Alert,
  ScrollView,
  StyleSheet,
<<<<<<<< HEAD:app/EditarEvento.tsx
========
  Switch,
>>>>>>>> 59be562 (fiz as telas de anotações diarias, implementei a notificação LOCALMENTE não esta conectado com o banco de dados):tea/app/AdicionarEvento.tsx
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { useCronograma } from "../contexts/CronogramaContext";
<<<<<<<< HEAD:app/EditarEvento.tsx
========
import { NotificationService } from "../services/notificationService";
>>>>>>>> 59be562 (fiz as telas de anotações diarias, implementei a notificação LOCALMENTE não esta conectado com o banco de dados):tea/app/AdicionarEvento.tsx
=======
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
import { NotificationService } from "../services/notificationService";
>>>>>>> 59be562 (fiz as telas de anotações diarias, implementei a notificação LOCALMENTE não esta conectado com o banco de dados):tea/app/EditarEvento.tsx
import "../utils/calendarLocale";

export default function EditarEvento() {
  const params = useLocalSearchParams();
  const eventId = params.eventId as string;
  
  const [selectedDate, setSelectedDate] = useState("");
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [time, setTime] = useState("08:00");
  const [showNotification, setShowNotification] = useState(false);
  const { updateEvent, events } = useCronograma();

  const today = new Date().toISOString().split("T")[0];

  // Carregar dados do evento
  useEffect(() => {
    if (eventId) {
      const event = events.find(e => e.id === eventId);
      if (event) {
        setTitle(event.title);
        setNote(event.note);
        setSelectedDate(event.date);
        setTime(event.time);
        setShowNotification(event.hasAlarm || false);
      }
    }
  }, [eventId, events]);

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

  const handleUpdateEvent = async () => {
    if (!selectedDate || !title.trim()) {
      Alert.alert("Atenção", "Por favor, selecione uma data e preencha o título");
      return;
    }

    // Verificar se a data selecionada não é no passado
    if (selectedDate < today) {
<<<<<<< HEAD:app/EditarEvento.tsx
<<<<<<<< HEAD:app/EditarEvento.tsx
      Alert.alert("Data Inválida", "Não é possível alterar um evento para uma data passada. Por favor, selecione uma data atual ou futura.");
========
      Alert.alert("Data Inválida", "Não é possível adicionar eventos para datas passadas. Por favor, selecione uma data atual ou futura.");
>>>>>>>> 59be562 (fiz as telas de anotações diarias, implementei a notificação LOCALMENTE não esta conectado com o banco de dados):tea/app/AdicionarEvento.tsx
=======
      Alert.alert("Data Inválida", "Não é possível alterar um evento para uma data passada. Por favor, selecione uma data atual ou futura.");
>>>>>>> 59be562 (fiz as telas de anotações diarias, implementei a notificação LOCALMENTE não esta conectado com o banco de dados):tea/app/EditarEvento.tsx
      return;
    }

    try {
<<<<<<< HEAD:app/EditarEvento.tsx
<<<<<<<< HEAD:app/EditarEvento.tsx
      // Atualizar evento existente
      updateEvent(eventId, {
========
      let notificationId = null;
      
      // Se notificação estiver ativada, agendar
=======
      // Cancelar notificação anterior se existir
      const oldEvent = events.find(e => e.id === eventId);
      if (oldEvent && oldEvent.hasAlarm) {
        await NotificationService.cancelNotification(oldEvent.title + oldEvent.date);
      }

      let notificationId = null;
      
      // Se notificação estiver ativada, agendar nova
>>>>>>> 59be562 (fiz as telas de anotações diarias, implementei a notificação LOCALMENTE não esta conectado com o banco de dados):tea/app/EditarEvento.tsx
      if (showNotification) {
        const hasPermission = await NotificationService.requestPermissions();
        if (hasPermission) {
          notificationId = await NotificationService.scheduleEventNotification({
            title: title.trim(),
            body: note.trim() || 'Lembrete de evento',
            date: selectedDate,
            time: time,
          });
          
          if (!notificationId) {
            Alert.alert(
              "Aviso",
<<<<<<< HEAD:app/EditarEvento.tsx
              "Evento criado, mas não foi possível agendar a notificação. Verifique as configurações de notificação do seu dispositivo.",
=======
              "Evento atualizado, mas não foi possível agendar a notificação. Verifique as configurações de notificação do seu dispositivo.",
>>>>>>> 59be562 (fiz as telas de anotações diarias, implementei a notificação LOCALMENTE não esta conectado com o banco de dados):tea/app/EditarEvento.tsx
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

<<<<<<< HEAD:app/EditarEvento.tsx
      // Criar novo evento
      addEvent({
>>>>>>>> 59be562 (fiz as telas de anotações diarias, implementei a notificação LOCALMENTE não esta conectado com o banco de dados):tea/app/AdicionarEvento.tsx
=======
      // Atualizar evento existente
      updateEvent(eventId, {
>>>>>>> 59be562 (fiz as telas de anotações diarias, implementei a notificação LOCALMENTE não esta conectado com o banco de dados):tea/app/EditarEvento.tsx
        title: title.trim(),
        note: note.trim(),
        date: selectedDate,
        time: time,
        hasAlarm: showNotification,
<<<<<<< HEAD:app/EditarEvento.tsx
<<<<<<<< HEAD:app/EditarEvento.tsx
========
        alarmTime: showNotification ? time : undefined,
>>>>>>>> 59be562 (fiz as telas de anotações diarias, implementei a notificação LOCALMENTE não esta conectado com o banco de dados):tea/app/AdicionarEvento.tsx
      });
      
      const successMessage = showNotification && notificationId 
        ? "Evento adicionado com sucesso! Você receberá uma notificação no horário agendado."
        : "Evento adicionado com sucesso!";
      
      Alert.alert(
        "Sucesso!",
<<<<<<<< HEAD:app/EditarEvento.tsx
        "Evento atualizado com sucesso.",
========
        successMessage,
>>>>>>>> 59be562 (fiz as telas de anotações diarias, implementei a notificação LOCALMENTE não esta conectado com o banco de dados):tea/app/AdicionarEvento.tsx
=======
        alarmTime: showNotification ? time : undefined,
      });
      
      const successMessage = showNotification && notificationId 
        ? "Evento atualizado com sucesso! Você receberá uma notificação no horário agendado."
        : "Evento atualizado com sucesso!";
      
      Alert.alert(
        "Sucesso!",
        successMessage,
>>>>>>> 59be562 (fiz as telas de anotações diarias, implementei a notificação LOCALMENTE não esta conectado com o banco de dados):tea/app/EditarEvento.tsx
        [
          {
            text: "OK",
            onPress: () => {
              console.log('Voltando para cronograma após atualização...');
              router.back();
            }
          }
        ]
      );
    } catch (error) {
<<<<<<< HEAD:app/EditarEvento.tsx
      console.error('Erro ao adicionar evento:', error);
=======
      console.error('Erro ao atualizar evento:', error);
>>>>>>> 59be562 (fiz as telas de anotações diarias, implementei a notificação LOCALMENTE não esta conectado com o banco de dados):tea/app/EditarEvento.tsx
      Alert.alert(
        "Erro",
        "Não foi possível atualizar o evento. Tente novamente.",
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
          <Text style={styles.headerTitle}>Editar Evento</Text>
          <View style={{ width: 24 }} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Calendário compacto */}
        <View style={styles.calendarContainer}>
          <Text style={styles.calendarTitle}>Calendário</Text>
          <Calendar
            onDayPress={handleDateSelect}
            markedDates={markedDates}
            minDate={minDate}
            theme={{
              backgroundColor: "#fff",
              calendarBackground: "#fff",
              textSectionTitleColor: "#3B82F6",
              selectedDayBackgroundColor: "#8B5CF6",
              selectedDayTextColor: "#fff",
              todayTextColor: "#3B82F6",
              dayTextColor: "#333",
              textDisabledColor: "#ccc",
              arrowColor: "#3B82F6",
              monthTextColor: "#333",
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
            <Text style={styles.inputLabel}>Título</Text>
            <TextInput
              style={styles.textInput}
              value={title}
              onChangeText={setTitle}
              placeholder="Fonoaudiologo"
              placeholderTextColor="#999"
            />
          </View>

          {/* Horário */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Horário</Text>
            <TextInput
              style={styles.textInput}
              value={time}
              onChangeText={setTime}
              placeholder="08:00"
              placeholderTextColor="#999"
            />
          </View>

          {/* Nota */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Nota</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={note}
              onChangeText={setNote}
              placeholder="adicionar a nota do evento exemplo|fonoaudiologo com a profissional"
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* Notificação */}
          <View style={styles.notificationContainer}>
            <View style={styles.notificationHeader}>
              <View style={styles.notificationInfo}>
                <Ionicons name="notifications" size={20} color="#3B82F6" />
                <View style={styles.notificationTextContainer}>
                  <Text style={styles.notificationTitle}>Lembrete de Evento</Text>
                  <Text style={styles.notificationSubtitle}>
                    Receber notificação no horário do evento
                  </Text>
                </View>
              </View>
              <Switch
                value={showNotification}
                onValueChange={setShowNotification}
                trackColor={{ false: "#E5E7EB", true: "#3B82F6" }}
                thumbColor={showNotification ? "#fff" : "#f4f3f4"}
                ios_backgroundColor="#E5E7EB"
              />
            </View>
            {showNotification && (
              <View style={styles.notificationDetails}>
                <Text style={styles.notificationDetailsText}>
                  📅 Você receberá uma notificação em {formatDate(selectedDate)} às {time}
                </Text>
              </View>
            )}
          </View>

          {/* Alarme */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Alarme</Text>
            <TouchableOpacity
              style={styles.sectionButton}
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
                    time,
                    editMode: "true",
                    eventId,
                  },
                });
              }}
            >
              <Text style={styles.sectionButtonText}>
                adicione um alarme para te lembrar
              </Text>
              <Ionicons
                name="time-outline"
                size={20}
                color="#3B82F6"
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Botão de atualizar */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.addButton} onPress={handleUpdateEvent}>
          <LinearGradient
            colors={["#8B5CF6", "#3B82F6"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.addButtonGradient}
          >
            <Text style={styles.addButtonText}>Atualizar</Text>
          </LinearGradient>
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
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  calendarContainer: {
    backgroundColor: "#fff",
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
    color: "#333",
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
    color: "#333",
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#333",
    borderWidth: 1,
    borderColor: "#E5E7EB",
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
    color: "#333",
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
    color: "#666",
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
  notificationContainer: {
    backgroundColor: "#fff",
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
    color: "#333",
    marginBottom: 2,
  },
  notificationSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  notificationDetails: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  notificationDetailsText: {
    fontSize: 14,
    color: "#059669",
    fontWeight: "500",
  },
});
