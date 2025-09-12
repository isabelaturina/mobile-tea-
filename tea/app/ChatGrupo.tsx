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
  View
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";

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

  const colors = {
    background: "#F8F9FA",
    textPrimary: "#333",
    textSecondary: "#666",
    inputBackground: "#fff",
    borderColor: "#ddd",
    otherMessageBg: "#E8E8E8",
    myMessageBg: "#0095FF",
    footerBackground: "#F0F0F0",
    messageShadow: "#00000020",
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
      <StatusBar barStyle="dark-content" />

      {/* Header com Degradê */}
      <LinearGradient
        colors={[GRADIENT_START, GRADIENT_END]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
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
          <Text style={styles.emptyMessageText}>
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
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    height: 60,
  },
  backButton: {
    padding: 4,
  },
  backText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  headerTitle: {
    fontSize: 18,
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
    padding: 12,
    borderRadius: 12,
    maxWidth: "80%",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
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
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    maxHeight: 100,
    fontSize: 14,
    fontWeight: "bold",
  },
  sendButton: {
    borderRadius: 25,
    overflow: "hidden",
  },
  sendButtonTouchable: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  emptyMessageText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    paddingHorizontal: 20,
    
  },
});
