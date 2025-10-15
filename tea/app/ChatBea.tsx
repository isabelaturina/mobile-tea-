import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient"; // <<-- import gradient
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import BeaAssistencia from "../assets/images/BeaAssistencia.png";
import ChatBeaBackground from "../assets/images/ChatBea.png";
import { beaApiService, BeaMessage } from "../services/beaApi";

interface Message {
  sender: "Bea" | "Você";
  text: string;
  timestamp?: string;
  isTyping?: boolean;
}

export default function ChatBea() {
  const router = useRouter(); 
  const scrollViewRef = useRef<ScrollView>(null);

  const [messages, setMessages] = useState<Message[]>([
    { sender: "Bea", text: "Olá! Eu sou a Bea, sua assistente virtual para apoio emocional. Como posso te ajudar hoje?", timestamp: new Date().toISOString() },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<BeaMessage[]>([]);

  // Função para rolar para a última mensagem
  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  // Scroll automático quando novas mensagens são adicionadas
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");

    // Adiciona mensagem do usuário
    const newUserMessage: Message = {
      sender: "Você",
      text: userMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, newUserMessage]);

    // Adiciona indicador de que a Bea está digitando
    const typingMessage: Message = {
      sender: "Bea",
      text: "...",
      isTyping: true,
    };
    setMessages(prev => [...prev, typingMessage]);

    setIsLoading(true);

    try {
      // Chama a API da Bea
      const response = await beaApiService.getBeaResponse(userMessage, conversationHistory);

      // Remove a mensagem de "digitando"
      setMessages(prev => prev.filter(msg => !msg.isTyping));

      // Adiciona a resposta da Bea
      const beaMessage: Message = {
        sender: "Bea",
        text: response.message,
        timestamp: response.timestamp,
      };

      setMessages(prev => [...prev, beaMessage]);

      // Atualiza o histórico da conversa
      const newHistory: BeaMessage[] = [
        ...conversationHistory,
        { role: 'user', content: userMessage },
        { role: 'assistant', content: response.message },
      ];
      setConversationHistory(newHistory);

      if (!response.success) {
        Alert.alert(
          "Aviso",
          "Houve um problema ao processar sua mensagem. Tente novamente.",
          [{ text: "OK" }]
        );
      }

    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      
      // Remove a mensagem de "digitando"
      setMessages(prev => prev.filter(msg => !msg.isTyping));

      // Adiciona mensagem de erro
      const errorMessage: Message = {
        sender: "Bea",
        text: "Desculpe, estou com problemas técnicos no momento. Tente novamente em alguns instantes.",
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);

      Alert.alert(
        "Erro",
        "Não foi possível enviar sua mensagem. Verifique sua conexão e tente novamente.",
        [{ text: "OK" }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER COM IMAGEM DE FUNDO */}
      <ImageBackground
        source={ChatBeaBackground}
        style={styles.headerBackground}
        resizeMode="cover"
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.push("/Chat")}>
            <Ionicons
              name="arrow-back"
              size={26}
              color="#fff"
              style={styles.backButton}
            />
          </TouchableOpacity>
          
          <Text style={styles.headerText}>Bea</Text>
        </View>
      </ImageBackground>

      <ScrollView 
        ref={scrollViewRef}
        style={styles.chatContainer}
        contentContainerStyle={styles.chatContent}
      >
        {messages.map((message, index) => (
          <View
            key={index}
            style={[
              styles.messageContainer,
              message.sender === "Bea" ? styles.messageBea : styles.messageUser,
            ]}
          >
            {message.sender === "Bea" && (
              <Image source={BeaAssistencia} style={styles.avatar} />
            )}
            <View style={[
              styles.messageBubble,
              message.sender === "Bea" ? styles.messageBubbleBea : styles.messageBubbleUser
            ]}>
              {message.isTyping ? (
                <View style={styles.typingContainer}>
                  <ActivityIndicator size="small" color="#1163E7" />
                  <Text style={styles.typingText}>Bea está digitando...</Text>
                </View>
              ) : (
                <Text style={[
                  styles.messageText,
                  message.sender === "Bea" ? styles.messageTextBea : styles.messageTextUser
                ]}>
                  {message.text}
                </Text>
              )}
              {message.timestamp && (
                <Text style={styles.timestamp}>
                  {new Date(message.timestamp).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Text>
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite sua Mensagem"
          value={inputMessage}
          onChangeText={setInputMessage}
          editable={!isLoading}
          multiline
          maxLength={500}
        />
        <TouchableOpacity 
          onPress={handleSendMessage}
          disabled={isLoading || !inputMessage.trim()}
          style={[
            styles.sendButtonContainer,
            (isLoading || !inputMessage.trim()) && styles.sendButtonDisabled
          ]}
        >
          <LinearGradient
            colors={isLoading || !inputMessage.trim() ? ["#ccc", "#999"] : ["#70DEFE", "#1163E7"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.sendButton}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.sendButtonText}>Enviar</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  headerBackground: {
    width: "100%",
    height: 130, 
    justifyContent: "flex-end",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  backButton: {
    marginRight: 10,
    bottom: 80,
  },
  headerText: {
    fontSize: 24,
    color: "#ffffffff",
    bottom: 80,
    fontWeight: "600", 
    left: 100,
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  chatContent: {
    paddingVertical: 15,
    paddingBottom: 20,
  },
  messageContainer: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "flex-start",
  },
  messageBea: {
    justifyContent: "flex-start",
  },
  messageUser: {
    justifyContent: "flex-end",
    flexDirection: "row-reverse",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  messageBubble: {
    maxWidth: "75%",
    borderRadius: 15,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  messageBubbleBea: {
    backgroundColor: "#f0f8ff",
    borderBottomLeftRadius: 5,
  },
  messageBubbleUser: {
    backgroundColor: "#E3F2FD",
    borderBottomRightRadius: 5,
    marginLeft: 10,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  messageTextBea: {
    color: "#333",
  },
  messageTextUser: {
    color: "#333",
  },
  timestamp: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    alignSelf: "flex-end",
  },
  typingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  typingText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 15,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    fontSize: 16,
    backgroundColor: "#f8f9fa",
  },
  sendButtonContainer: {
    borderRadius: 20,
    overflow: "hidden",
  },
  sendButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    minWidth: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
