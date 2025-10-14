import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useCronograma } from "../contexts/CronogramaContext";

export default function AdicionarTimer() {
  const params = useLocalSearchParams();
  const [hours, setHours] = useState("02");
  const [minutes, setMinutes] = useState("00");
  const [period, setPeriod] = useState("PM");
  const [repeatAlarm, setRepeatAlarm] = useState(true);
  const { addEvent } = useCronograma();

  const hoursArray = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 1;
    return hour.toString().padStart(2, "0");
  });

  const minutesArray = Array.from({ length: 60 }, (_, i) => {
    return i.toString().padStart(2, "0");
  });

  const handleSave = async () => {
    try {
      const time = `${hours}:${minutes} ${period}`;
      
      // Salvar evento com alarme
      addEvent({
        title: params.title as string,
        note: params.note as string,
        date: params.date as string,
        time: time,
        hasAlarm: true,
        alarmTime: time,
        repeatAlarm: repeatAlarm,
      });
      
      // Mostrar feedback de sucesso
      Alert.alert(
        "Sucesso!",
        "Evento salvo com alarme configurado.",
        [
          {
            text: "OK",
            onPress: () => router.push("/Cronograma")
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
          <Text style={styles.headerTitle}>Adicione o timer</Text>
          <View style={{ width: 24 }} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Título da seção */}
        <View style={styles.sectionHeader}>
          <Ionicons name="time" size={24} color="#3B82F6" />
          <Text style={styles.sectionTitle}>Configurar Horário</Text>
        </View>

        {/* Seletor de tempo */}
        <View style={styles.timePickerContainer}>
          <View style={styles.timePicker}>
            {/* Horas */}
            <View style={styles.pickerColumn}>
              <View style={styles.pickerLabelContainer}>
                <Ionicons name="hourglass" size={16} color="#3B82F6" />
                <Text style={styles.pickerLabel}>Horas</Text>
              </View>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={hours}
                  onValueChange={setHours}
                  style={styles.picker}
                  itemStyle={styles.pickerItem}
                >
                  {hoursArray.map((hour) => (
                    <Picker.Item key={hour} label={hour} value={hour} />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Separador */}
            <View style={styles.separator}>
              <View style={styles.separatorLine} />
              <Text style={styles.separatorText}>:</Text>
              <View style={styles.separatorLine} />
            </View>

            {/* Minutos */}
            <View style={styles.pickerColumn}>
              <View style={styles.pickerLabelContainer}>
                <Ionicons name="timer" size={16} color="#3B82F6" />
                <Text style={styles.pickerLabel}>Minutos</Text>
              </View>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={minutes}
                  onValueChange={setMinutes}
                  style={styles.picker}
                  itemStyle={styles.pickerItem}
                >
                  {minutesArray.map((minute) => (
                    <Picker.Item key={minute} label={minute} value={minute} />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Período */}
            <View style={styles.pickerColumn}>
              <View style={styles.pickerLabelContainer}>
                <Ionicons name="sunny" size={16} color="#3B82F6" />
                <Text style={styles.pickerLabel}>Período</Text>
              </View>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={period}
                  onValueChange={setPeriod}
                  style={styles.picker}
                  itemStyle={styles.pickerItem}
                >
                  <Picker.Item label="AM" value="AM" />
                  <Picker.Item label="PM" value="PM" />
                </Picker>
              </View>
            </View>
          </View>
          
          {/* Preview do horário selecionado */}
          <View style={styles.timePreview}>
            <Text style={styles.timePreviewLabel}>Horário selecionado:</Text>
            <Text style={styles.timePreviewText}>{hours}:{minutes} {period}</Text>
          </View>
        </View>

        {/* Repetir alarme */}
        <View style={styles.repeatContainer}>
          <View style={styles.repeatHeader}>
            <Ionicons name="repeat" size={20} color="#3B82F6" />
            <Text style={styles.repeatTitle}>Configurações do Alarme</Text>
          </View>
          <View style={styles.repeatContent}>
            <View style={styles.repeatLabelContainer}>
              <Text style={styles.repeatLabel}>Repetir alarme</Text>
              <Text style={styles.repeatDescription}>O alarme será repetido diariamente</Text>
            </View>
            <Switch
              value={repeatAlarm}
              onValueChange={setRepeatAlarm}
              trackColor={{ false: "#E5E7EB", true: "#3B82F6" }}
              thumbColor={repeatAlarm ? "#fff" : "#fff"}
              ios_backgroundColor="#E5E7EB"
            />
          </View>
        </View>

        {/* Informações do evento */}
        {params.title && (
          <View style={styles.eventInfoContainer}>
            <View style={styles.eventInfoHeader}>
              <Ionicons name="information-circle" size={20} color="#3B82F6" />
              <Text style={styles.eventInfoHeaderTitle}>Resumo do Evento</Text>
            </View>
            <View style={styles.eventInfoContent}>
              <View style={styles.eventInfoItem}>
                <Ionicons name="calendar" size={16} color="#666" />
                <View style={styles.eventInfoTextContainer}>
                  <Text style={styles.eventInfoTitle}>Evento</Text>
                  <Text style={styles.eventInfoText}>{params.title}</Text>
                </View>
              </View>
              
              {params.note && (
                <View style={styles.eventInfoItem}>
                  <Ionicons name="document-text" size={16} color="#666" />
                  <View style={styles.eventInfoTextContainer}>
                    <Text style={styles.eventInfoTitle}>Nota</Text>
                    <Text style={styles.eventInfoText}>{params.note}</Text>
                  </View>
                </View>
              )}
              
              <View style={styles.eventInfoItem}>
                <Ionicons name="time" size={16} color="#666" />
                <View style={styles.eventInfoTextContainer}>
                  <Text style={styles.eventInfoTitle}>Data</Text>
                  <Text style={styles.eventInfoText}>{params.date}</Text>
                </View>
              </View>
            </View>
          </View>
        )}
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
            <Text style={styles.saveButtonText}>Salvar</Text>
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
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 8,
  },
  timePickerContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timePicker: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  pickerColumn: {
    flex: 1,
    alignItems: "center",
  },
  pickerLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  pickerLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#3B82F6",
    marginLeft: 4,
  },
  pickerWrapper: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    width: "90%",
    overflow: "hidden",
  },
  picker: {
    height: 80,
  },
  pickerItem: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  separator: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 6,
    height: 80,
  },
  separatorLine: {
    width: 1,
    height: 15,
    backgroundColor: "#3B82F6",
    marginVertical: 4,
  },
  separatorText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#3B82F6",
    marginVertical: 4,
  },
  timePreview: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#F0F4FF",
    borderRadius: 8,
    alignItems: "center",
  },
  timePreviewLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  timePreviewText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3B82F6",
  },
  repeatContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginTop: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  repeatHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  repeatTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 8,
  },
  repeatContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  repeatLabelContainer: {
    flex: 1,
  },
  repeatLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  repeatDescription: {
    fontSize: 14,
    color: "#666",
  },
  eventInfoContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginTop: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  eventInfoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  eventInfoHeaderTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 8,
  },
  eventInfoContent: {
    gap: 16,
  },
  eventInfoItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  eventInfoTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  eventInfoTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  eventInfoText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  saveButton: {
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  saveButtonGradient: {
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
