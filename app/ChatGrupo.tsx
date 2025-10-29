import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
}

export default function ChatGrupo() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  // ✅ Chat inicia vazio
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");

  const GRADIENT_START = "#70DEFE";
  const GRADIENT_END = "#0095FF";

  // 🎨 Define cores com base no tema
  const colors = isDarkMode
    ? {
        background: "#000000",
        textPrimary: "#F8FAFC",
        textSecondary: "#94A3B8",
        inputBackground: "#1E293B",
        borderColor: "#334155",
        otherMessageBg: "#334155",
        myMessageBg: "#3B82F6",
        footerBackground: "#0F172A",
        messageShadow: "#00000040",
        emptyText: "#64748B",
      }
    : {
        background: "#F8F9FA",
        textPrimary: "#333",
        textSecondary: "#666",
        inputBackground: "#fff",
        borderColor: "#ddd",
        otherMessageBg: "#E8E8E8",
        myMessageBg: "#0095FF",
        footerBackground: "#F0F0F0",
        messageShadow: "#00000020",
        emptyText: "#999",
      };

  const sendMessage = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputText,
        sender: "Você",
        timestamp: new Date(),
      };
      setMessages([...messages, newMessage]);
      setInputText("");
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === "Você"
          ? styles.myMessageContainer
          : styles.otherMessageContainer,
      ]}
    >
      <View
        style={[
          styles.messageCard,
          {
            backgroundColor:
              item.sender === "Você"
                ? colors.myMessageBg
                : colors.otherMessageBg,
            shadowColor: colors.messageShadow,
          },
        ]}
      >
        <Text
          style={[
            styles.messageText,
            {
              color:
                item.sender === "Você" ? "#fff" : colors.textPrimary,
            },
          ]}
        >
          {item.text}
        </Text>
        <Text
          style={[
            styles.timestamp,
            {
              color:
                item.sender === "Você"
                  ? "#ffffffaa"
                  : colors.textSecondary,
            },
          ]}
        >
          {formatTime(item.timestamp)}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar 
        barStyle={Platform.OS === 'android' ? 'light-content' : 'dark-content'} 
        backgroundColor={GRADIENT_START}
        translucent={Platform.OS === 'android'}
      />

      {/* Header com Degradê */}
      <LinearGradient
        colors={[GRADIENT_START, GRADIENT_END]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons 
            name="arrow-left" 
            size={28} 
            color="#fff" 
          />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Chat em Grupo</Text>
        <View style={styles.headerRight} />
      </LinearGradient>

      {/* Lista de Mensagens */}
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.messagesList,
          messages.length === 0 && {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <Text style={[styles.emptyMessageText, { color: colors.emptyText }]}>
            Seja o primeiro a enviar uma mensagem!
          </Text>
        )}
      />

      {/* Área de entrada */}
      <View
        style={[
          styles.inputContainer,
          { backgroundColor: colors.footerBackground },
        ]}
      >
        <TextInput
          style={[
            styles.textInput,
            {
              backgroundColor: colors.inputBackground,
              color: colors.textPrimary,
              borderColor: colors.borderColor,
            },
          ]}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Digite sua mensagem"
          placeholderTextColor={colors.textSecondary}
          multiline
          maxLength={500}
        />

        {/* Botão de enviar */}
        <LinearGradient
          colors={
            inputText.trim()
              ? [GRADIENT_START, GRADIENT_END]
              : ["#70DEFE", "#0095FF"]
          }
          style={styles.sendButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <TouchableOpacity
            onPress={sendMessage}
            disabled={!inputText.trim()}
            style={styles.sendButtonTouchable}
          >
            <Text style={styles.sendButtonText}>Enviar</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    height: Platform.OS === "android" ? 56 : 60,
    elevation: Platform.OS === "android" ? 4 : 0,
  },
  backButton: {
    padding: Platform.OS === "android" ? 1 : 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  backText: {
    fontSize: Platform.OS === "android" ? 22 : 24,
    fontWeight: "bold",
    color: "#fff",
  },
  headerTitle: {
    fontSize: Platform.OS === "android" ? 16 : 18,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    color: "#fff",
  },
  headerRight: {
    width: 32,
  },
  messagesList: {
    padding: 16,
    paddingBottom: 8,
    flexGrow: 1,
  },
  messageContainer: {
    marginBottom: 12,
  },
  myMessageContainer: {
    alignItems: "flex-end",
  },
  otherMessageContainer: {
    alignItems: "flex-start",
  },
  messageCard: {
    padding: Platform.OS === "android" ? 10 : 12,
    borderRadius: 12,
    maxWidth: "80%",
    shadowOffset: {
      width: 0,
      height: Platform.OS === "android" ? 1 : 2,
    },
    shadowOpacity: Platform.OS === "android" ? 0.2 : 0.1,
    shadowRadius: Platform.OS === "android" ? 1 : 3,
    elevation: Platform.OS === "android" ? 2 : 0,
  },
  messageText: {
    fontSize: Platform.OS === "android" ? 14 : 16,
    lineHeight: Platform.OS === "android" ? 20 : 22,
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
    opacity: 0.7,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    paddingBottom: Platform.OS === "android" ? 8 : 12,
  },
  textInput: {
    flex: 1,
    borderWidth: Platform.OS === "android" ? 0.5 : 1,
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "android" ? 8 : 10,
    marginRight: 8,
    maxHeight: Platform.OS === "android" ? 80 : 100,
    fontSize: Platform.OS === "android" ? 13 : 14,
    fontWeight: Platform.OS === "android" ? "normal" : "bold",
  },
  sendButton: {
    borderRadius: 25,
    overflow: "hidden",
  },
  sendButtonTouchable: {
    paddingHorizontal: Platform.OS === "android" ? 14 : 16,
    paddingVertical: Platform.OS === "android" ? 8 : 10,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: Platform.OS === "android" ? 14 : 16,
  },
  emptyMessageText: {
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 20,
  },
});
