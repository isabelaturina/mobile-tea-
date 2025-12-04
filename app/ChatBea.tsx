import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useTheme } from '../contexts/ThemeContext';
import { beaApiService, BeaMessage } from '../services/api/beaApi'; // Importe o serviço

// Pegar as dimensões da tela
const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const BeaAssistencia = require("../assets/images/BeaAssistencia.png");
const ChatBeaBackground = require("../assets/images/ChatBea.png");

// REMOVA esta linha - agora usaremos o serviço
// const API_CHAT = "https://chatbea.onrender.com/api/chat";

export default function ChatBea() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const [messages, setMessages] = useState<BeaMessage[]>([
    { 
      role: "assistant", 
      content: "Olá, Eu sou a Bea, como posso te ajudar hoje?",
      timestamp: new Date().toISOString()
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    // Cria a mensagem do usuário
    const userMessage: BeaMessage = {
      role: "user",
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    // Adiciona a mensagem do usuário ao estado
    setMessages(prev => [...prev, userMessage]);
    const userText = inputMessage;
    setInputMessage("");
    setIsLoading(true);

    try {
      // Prepara o histórico da conversa (últimas 10 mensagens)
      const conversationHistory = messages.slice(-10);
      
      // Usa o serviço BeaApi para enviar a mensagem
      const response = await beaApiService.getBeaResponse(userText, conversationHistory);
      
      if (response.success) {
        // Cria a mensagem da assistente
        const assistantMessage: BeaMessage = {
          role: "assistant",
          content: response.message,
          timestamp: response.timestamp || new Date().toISOString()
        };
        
        // Adiciona a resposta da Bea
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        // Trata erro retornado pelo serviço
        console.error('Erro na resposta do serviço:', response.error);
        const errorMessage: BeaMessage = {
          role: "assistant",
          content: response.error || "Desculpe, ocorreu um erro. Tente novamente.",
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      const errorMessage: BeaMessage = {
        role: "assistant",
        content: "Erro de conexão. Tente novamente mais tarde.",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para formatar o timestamp
  const formatTime = (timestamp?: string) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={[styles.container, isDarkMode && styles.containerDark]}>
        {/* HEADER COM IMAGEM DE FUNDO */}
        <ImageBackground
          source={ChatBeaBackground}
          style={styles.headerBackground}
          resizeMode="cover"
        >
          <View style={styles.headerContent}>
            {/* Botão voltar */}
            <TouchableOpacity
              onPress={() => router.push("/Chat")}
              style={styles.backButton}
            >
              <Image
                source={require("../assets/images/seta.png")}
                style={[styles.backImage, { width: screenWidth * 0.065, height: screenWidth * 0.065 }]}
                resizeMode="contain"
                tintColor="#000000ff"
              />
            </TouchableOpacity>

            {/* Título centralizado */}
            <Text style={styles.headerText}>Bea</Text>
          </View>
        </ImageBackground>

        <ScrollView 
          style={[styles.chatContainer, isDarkMode && styles.chatContainerDark]}
          contentContainerStyle={{ paddingBottom: 20 }}
          ref={ref => {
            // Rola para o final quando novas mensagens são adicionadas
            ref?.scrollToEnd({ animated: true });
          }}
        >
          {messages.map((message, index) => (
            <View
              key={index}
              style={[
                styles.messageContainer,
                message.role === "assistant" ? styles.messageBea : styles.messageUser,
              ]}
            >
              {message.role === "assistant" && (
                <Image source={BeaAssistencia} style={styles.avatar} />
              )}
              <View style={[
                styles.messageBubble,
                message.role === "assistant" ? styles.messageBubbleBea : styles.messageBubbleUser
              ]}>
                <Text style={[
                  styles.messageText,
                  message.role === "assistant" ? styles.messageTextBea : styles.messageTextUser
                ]}>
                  {message.content}
                </Text>
                <Text style={[
                  styles.timestamp,
                  message.role === "assistant" ? styles.timestampBea : styles.timestampUser
                ]}>
                  {formatTime(message.timestamp)}
                </Text>
              </View>
            </View>
          ))}
          {isLoading && (
            <View style={[styles.messageContainer, styles.messageBea]}>
              <Image source={BeaAssistencia} style={styles.avatar} />
              <View style={[styles.messageBubble, styles.messageBubbleBea]}>
                <Text style={[styles.messageText, styles.messageTextBea]}>
                  Bea está digitando...
                </Text>
              </View>
            </View>
          )}
        </ScrollView>

        <View style={[styles.inputContainer, isDarkMode && styles.inputContainerDark]}>
          <TextInput
            style={[styles.input, isDarkMode && styles.inputDark]}
            placeholder="Digite sua Mensagem"
            placeholderTextColor={isDarkMode ? "#aaa" : "#999"}
            value={inputMessage}
            onChangeText={setInputMessage}
            editable={!isLoading}
            multiline
            maxLength={500}
            onSubmitEditing={handleSendMessage}
            returnKeyType="send"
            blurOnSubmit={false}
          />
          <TouchableOpacity 
            onPress={handleSendMessage} 
            disabled={isLoading || !inputMessage.trim()}
          >
            <LinearGradient
              colors={["#70DEFE", "#1163E7"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                styles.sendButton,
                (isLoading || !inputMessage.trim()) && styles.sendButtonDisabled
              ]}
            >
              <Text style={styles.sendButtonText}>
                {isLoading ? "..." : "Enviar"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerBackground: {
    width: "100%",
    height: screenHeight * 0.16,
    justifyContent: "flex-end",
  },
  headerContent: {
    height: screenHeight * 0.075,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 16,
    top: -50,
    zIndex: 2,
    padding: 8,
  },
  backImage: {
    width: screenWidth * 0.065,
    height: screenWidth * 0.065,
  },
  headerText: {
    fontSize: screenWidth * 0.055,
    color: "#fff",
    fontWeight: "600",
    top: -screenHeight * 0.068,
  },
  chatContainer: {
    flex: 1,
    padding: screenWidth * 0.04,
  },
  messageContainer: {
    flexDirection: "row",
    marginBottom: screenHeight * 0.012,
    alignItems: "flex-start",
  },
  messageBea: {
    justifyContent: "flex-start",
  },
  messageUser: {
    justifyContent: "flex-end",
  },
  avatar: {
    width: screenWidth * 0.1,
    height: screenWidth * 0.1,
    borderRadius: screenWidth * 0.05,
    marginRight: screenWidth * 0.025,
  },
  messageBubble: {
    maxWidth: "70%",
    padding: screenWidth * 0.025,
    borderRadius: screenWidth * 0.025,
    marginBottom: 4,
  },
  messageBubbleBea: {
    backgroundColor: "#E1E1E1",
  },
  messageBubbleUser: {
    backgroundColor: "#1163E7",
  },
  messageText: {
    fontSize: screenWidth * 0.04,
  },
  messageTextBea: {
    color: "#333333",
  },
  messageTextUser: {
    color: "#FFFFFF",
  },
  timestamp: {
    fontSize: screenWidth * 0.025,
    marginTop: 4,
    opacity: 0.7,
  },
  timestampBea: {
    color: "#666",
    textAlign: "left",
  },
  timestampUser: {
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "right",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: screenWidth * 0.025,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  input: {
    flex: 1,
    minHeight: screenHeight * 0.05,
    maxHeight: screenHeight * 0.15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: screenHeight * 0.025,
    paddingLeft: screenWidth * 0.025,
    paddingRight: screenWidth * 0.025,
    paddingTop: screenHeight * 0.01,
    paddingBottom: screenHeight * 0.01,
    marginRight: screenWidth * 0.025,
    fontSize: screenWidth * 0.04,
    textAlignVertical: "top",
  },
  sendButton: {
    paddingVertical: screenHeight * 0.012,
    paddingHorizontal: screenWidth * 0.05,
    borderRadius: screenHeight * 0.025,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: screenWidth * 0.04,
    textAlign: "center",
  },
  // Estilos para modo escuro
  containerDark: {
    backgroundColor: "#121212",
  },
  chatContainerDark: {
    backgroundColor: "#121212",
  },
  inputContainerDark: {
    backgroundColor: "#1E1E1E",
    borderTopColor: "#333",
  },
  inputDark: {
    backgroundColor: "#2A2A2A",
    borderColor: "#444",
    color: "#fff",
  },
});