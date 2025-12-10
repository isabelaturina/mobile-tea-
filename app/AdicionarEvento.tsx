import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
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

// Base URL - Verificar qual está correta:
// Documentação mostra: https://api-diario-t26y.onrender.com
// Mas outros serviços usam: https://api-tea-comunicacao.onrender.com
// Usando api-tea-comunicacao conforme solicitado
const API_URL = "https://api-tea-comunicacao.onrender.com";

export default function AdicionarEvento() {
  const [selectedDate, setSelectedDate] = useState("");
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [time, setTime] = useState("08:00");
  const [showNotification, setShowNotification] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();
  const { addEvent } = useCronograma();
  const isDarkMode = theme === "dark";

  const today = new Date().toISOString().split("T")[0];

  const markedDates = {
    [selectedDate]: {
      selected: true,
      selectedColor: "#8B5CF6",
      selectedTextColor: "#fff",
    },
  };

  const minDate = today;

  const handleDateSelect = (day: any) => {
    setSelectedDate(day.dateString);
  };

  const handleTimeChange = (text: string) => {
    const numbersOnly = text.replace(/[^0-9]/g, '');
    const limited = numbersOnly.slice(0, 4);
    
    let formatted = limited;
    if (limited.length > 2) {
      formatted = limited.slice(0, 2) + ':' + limited.slice(2);
    }
    
    if (formatted.length >= 2) {
      const hours = parseInt(formatted.split(':')[0] || '0', 10);
      if (hours > 23) {
        formatted = '23:' + (formatted.split(':')[1] || '');
      }
    }
    
    if (formatted.length >= 5) {
      const minutes = parseInt(formatted.split(':')[1] || '0', 10);
      if (minutes > 59) {
        const hours = formatted.split(':')[0];
        formatted = hours + ':59';
      }
    }
    
    setTime(formatted);
  };

  const handleAddEvent = () => {
    if (!selectedDate || !title.trim()) {
      Alert.alert("Atenção", "Por favor, selecione uma data e preencha o título");
      return;
    }

    if (selectedDate < today) {
      Alert.alert("Data Inválida", "Não é possível adicionar eventos para datas passadas. Por favor, selecione uma data atual ou futura.");
      return;
    }

    setIsLoading(true);

    // Obter usuarioId do AsyncStorage
    AsyncStorage.getItem('userId').then((storedUserId) => {
      if (!storedUserId || storedUserId === 'null' || storedUserId.trim() === '') {
        // Tenta obter do userData
        return AsyncStorage.getItem('userData').then((storedUserData) => {
          if (storedUserData) {
            try {
              const parsedData = JSON.parse(storedUserData);
              return parsedData.id ? String(parsedData.id).trim() : (parsedData.email || '');
            } catch {
              return '';
            }
          }
          return '';
        });
      }
      return storedUserId.trim();
    }).then((usuarioId) => {
      if (!usuarioId || usuarioId.trim() === '') {
        setIsLoading(false);
        Alert.alert(
          "Erro de Autenticação",
          "Não foi possível identificar o usuário. Por favor, faça login novamente.",
          [{ text: "OK" }]
        );
        return;
      }

      // Preparar payload conforme formato esperado pela API
      // A API espera: titulo, descricao (opcional), datahora (formato ISO 8601), usuarioId
      // IMPORTANTE: A API usa "datahora" (campo único) em vez de "data" e "hora" separados
      
      // Validar e preparar campos obrigatórios
      const tituloValue = title.trim();
      const usuarioIdValue = String(usuarioId).trim();
      
      if (!tituloValue || !selectedDate || !usuarioIdValue) {
        setIsLoading(false);
        Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios.", [{ text: "OK" }]);
        return;
      }
      
      // Formatar datahora no formato ISO 8601: YYYY-MM-DDTHH:mm:ss
      // selectedDate está no formato YYYY-MM-DD
      // time está no formato HH:mm
      const [hours, minutes] = time.split(':').map(Number);
      const datahoraValue = `${selectedDate}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
      
      const payload: any = {
        titulo: tituloValue,
        datahora: datahoraValue, // Formato: YYYY-MM-DDTHH:mm:ss (ISO 8601)
        usuarioId: usuarioIdValue,
      };

      // Adicionar descricao apenas se tiver valor válido
      const descricaoValue = note ? note.trim() : '';
      if (descricaoValue && descricaoValue !== '') {
        payload.descricao = descricaoValue;
      }

      // Garantir que não há campos undefined ou null
      const cleanPayload: any = {};
      Object.keys(payload).forEach(key => {
        const value = payload[key];
        if (value !== undefined && value !== null && value !== '') {
          cleanPayload[key] = value;
        }
      });
      
      // Usar o payload limpo
      const finalPayload = cleanPayload;

      // Validação final do payload
      if (!finalPayload.titulo || !finalPayload.datahora || !finalPayload.usuarioId) {
        setIsLoading(false);
        Alert.alert("Erro", "Campos obrigatórios faltando. Verifique título, data/hora e usuário.", [{ text: "OK" }]);
        return;
      }

      // Logs para debug
      const fullUrl = `${API_URL}/api/eventos/add`;
      console.log("🔍 [EVENTOS] ========== DEBUG ==========");
      console.log("🔍 [EVENTOS] URL completa:", fullUrl);
      console.log("🔍 [EVENTOS] Método: POST");
      console.log("🔍 [EVENTOS] Payload final (limpo):", JSON.stringify(finalPayload, null, 2));
      console.log("🔍 [EVENTOS] Tipos dos campos:", {
        titulo: typeof finalPayload.titulo,
        datahora: typeof finalPayload.datahora,
        usuarioId: typeof finalPayload.usuarioId,
        descricao: finalPayload.descricao ? typeof finalPayload.descricao : 'não enviado',
      });
      console.log("🔍 [EVENTOS] Valores individuais:", {
        titulo: finalPayload.titulo,
        datahora: finalPayload.datahora,
        usuarioId: finalPayload.usuarioId,
        descricao: finalPayload.descricao || '(não enviado)',
      });
      console.log("🔍 [EVENTOS] ==========================");

      // Fazer requisição POST conforme documentação
      // Garantir que o body seja uma string JSON válida sem campos undefined
      const bodyString = JSON.stringify(finalPayload);
      
      console.log("🔍 [EVENTOS] Body string que será enviado:", bodyString);
      console.log("🔍 [EVENTOS] Verificando URL:", {
        API_URL,
        endpoint: '/api/eventos/add',
        fullUrl,
        'URL está correta?': fullUrl === 'https://api-tea-comunicacao.onrender.com/api/eventos/add'
      });
      
      // Verificar se o JSON é válido
      try {
        JSON.parse(bodyString);
        console.log("✅ [EVENTOS] JSON válido");
      } catch (jsonError) {
        console.error("❌ [EVENTOS] JSON inválido:", jsonError);
        setIsLoading(false);
        Alert.alert("Erro", "Erro ao preparar os dados do evento.", [{ text: "OK" }]);
        return;
      }
      
      fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: bodyString,
      })
        .then((response) => {
          console.log("🔍 [EVENTOS] Resposta recebida:", {
            status: response.status,
            statusText: response.statusText,
            ok: response.ok,
            headers: Object.fromEntries(response.headers.entries()),
          });
          
          return response.text().then((text) => {
            console.log("🔍 [EVENTOS] Resposta raw:", text);
            
            let parsed;
            try {
              parsed = text ? JSON.parse(text) : null;
              console.log("🔍 [EVENTOS] Resposta parsed:", parsed);
            } catch (parseError) {
              console.warn("⚠️ [EVENTOS] Erro ao fazer parse da resposta:", parseError);
              parsed = text;
            }
            return { ok: response.ok, status: response.status, data: parsed, text };
          });
        })
        .then((result) => {
          if (result.ok) {
            console.log("✅ Evento salvo com sucesso:", result.data);
            
            // Agenda notificação se solicitado
            if (showNotification) {
              const [hours, minutes] = time.split(":").map(Number);
              const triggerDate = new Date(selectedDate + "T00:00:00");
              triggerDate.setHours(hours);
              triggerDate.setMinutes(minutes);
              triggerDate.setSeconds(0);
              if (triggerDate.getTime() > Date.now()) {
                Notifications.scheduleNotificationAsync({
                  content: {
                    title: "Lembrete do evento",
                    body: `${title} - ${note}`.trim(),
                  },
                  trigger: null
                }).catch((e) => {
                  console.warn("Falha ao agendar notificação:", e);
                });
              }
            }
            
            setIsLoading(false);
            
            // Adicionar evento ao contexto local para aparecer no Cronograma
            // Converter formato da API para formato do contexto
            const eventoLocal = {
              title: title.trim(),
              note: note.trim() || '',
              time: time.trim(),
              date: selectedDate, // Formato: YYYY-MM-DD
              hasAlarm: showNotification,
              alarmTime: showNotification ? time.trim() : undefined,
            };
            
            addEvent(eventoLocal);
            console.log("✅ [EVENTOS] Evento adicionado ao contexto local do Cronograma");
            
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
          } else {
            // Tratar erro da API
            console.error("❌ [EVENTOS] Erro na resposta da API:", {
              status: result.status,
              data: result.data,
              text: result.text,
            });
            
            let errorMessage = "Não foi possível salvar o evento. Tente novamente.";
            
            if (result.data) {
              if (typeof result.data === 'object') {
                if (result.data.error) {
                  errorMessage = typeof result.data.error === 'string' ? result.data.error : JSON.stringify(result.data.error);
                } else if (result.data.message) {
                  errorMessage = typeof result.data.message === 'string' ? result.data.message : JSON.stringify(result.data.message);
                } else if (result.data.errors) {
                  // Se for array de erros
                  if (Array.isArray(result.data.errors)) {
                    errorMessage = result.data.errors.map((e: any) => e.message || e).join(', ');
                  } else {
                    errorMessage = JSON.stringify(result.data.errors);
                  }
                } else {
                  errorMessage = JSON.stringify(result.data);
                }
              } else if (typeof result.data === 'string') {
                errorMessage = result.data;
              }
            } else if (result.text) {
              errorMessage = result.text;
            }

            // Mensagem específica para Bad Request
            if (result.status === 400) {
              errorMessage = `Erro nos dados enviados (400): ${errorMessage}\n\nVerifique se:\n- O título está preenchido\n- A data está no formato correto\n- O usuário está logado`;
            }

            setIsLoading(false);
            Alert.alert("Erro", errorMessage, [{ text: "OK" }]);
          }
        })
        .catch((error) => {
          console.error("Erro ao salvar evento:", error);
          setIsLoading(false);
          
          let errorMessage = "Não foi possível salvar o evento. Verifique sua conexão e tente novamente.";
          if (error.message) {
            errorMessage = error.message;
          }
          
          Alert.alert("Erro", errorMessage, [{ text: "OK" }]);
        });
    }).catch((error) => {
      console.error("Erro ao obter usuarioId:", error);
      setIsLoading(false);
      Alert.alert(
        "Erro",
        "Não foi possível identificar o usuário. Por favor, faça login novamente.",
        [{ text: "OK" }]
      );
    });
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
              placeholder=" Fonoaudiólogo"
              placeholderTextColor={colors.placeholder}
            />
          </View>

          {/* Horário */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>Horário</Text>
            <TextInput
              style={[styles.textInput, { backgroundColor: colors.card, color: colors.textPrimary, borderColor: colors.border }]}
              value={time}
              onChangeText={handleTimeChange}
              placeholder="08:00"
              placeholderTextColor={colors.placeholder}
              keyboardType="numeric"
              maxLength={5}
            />
          </View>

          {/* Nota */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>Nota</Text>
            <TextInput
              style={[styles.textInput, styles.textArea, { backgroundColor: colors.card, color: colors.textPrimary, borderColor: colors.border }]}
              value={note}
              onChangeText={setNote}
              placeholder="adicionar a nota do evento exemplo: fonoaudiólogo com a profissional"
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

        </View>
      </ScrollView>

      {/* Botão de adicionar */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.addButton, isLoading && { opacity: 0.6 }]} 
          onPress={handleAddEvent}
          disabled={isLoading}
        >
          <LinearGradient
            colors={["#8B5CF6", "#3B82F6"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.addButtonGradient}
          >
            <Text style={styles.addButtonText}>
              {isLoading ? "Salvando..." : "Adicionar"}
            </Text>
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
