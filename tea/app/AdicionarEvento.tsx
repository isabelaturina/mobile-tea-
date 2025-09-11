import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
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

export default function AdicionarEvento() {
  const [selectedDate, setSelectedDate] = useState("");
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const { addEvent } = useCronograma();

  const today = new Date().toISOString().split("T")[0];

  const markedDates = {
    [selectedDate]: {
      selected: true,
      selectedColor: "#8B5CF6",
      selectedTextColor: "#fff",
    },
  };

  const handleDateSelect = (day: any) => {
    setSelectedDate(day.dateString);
  };

  const handleAddEvent = async () => {
    if (!selectedDate || !title.trim()) {
      Alert.alert("Atenção", "Por favor, selecione uma data e preencha o título");
      return;
    }

    try {
      // Salvar evento sem alarme
      addEvent({
        title: title.trim(),
        note: note.trim(),
        date: selectedDate,
        time: "08:00", // horário padrão
      });
      
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
          <Text style={styles.headerTitle}>Adicionar Evento</Text>
          <View style={{ width: 24 }} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Calendário compacto */}
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
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Notificação</Text>
            <TouchableOpacity
              style={styles.sectionButton}
              onPress={() => setShowNotification(!showNotification)}
            >
              <Text style={styles.sectionButtonText}>
                {showNotification ? "Notificação ativada" : "Adicionar notificação"}
              </Text>
              <Ionicons
                name={showNotification ? "checkmark-circle" : "add-circle-outline"}
                size={20}
                color="#3B82F6"
              />
            </TouchableOpacity>
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
});
