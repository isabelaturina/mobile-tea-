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
} from "react-native";
import { useTheme } from '../contexts/ThemeContext';
import { sendChatMessage } from '../services/api/chatApi';

// Pegar as dimensões da tela
const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const BeaAssistencia = require("../assets/images/BeaAssistencia.png");
const ChatBeaBackground = require("../assets/images/ChatBea.png");

export default function ChatBea() {
const router = useRouter();
const { theme } = useTheme();
const isDarkMode = theme === "dark";

  const [messages, setMessages] = useState([
    { sender: "Bea", text: "Olá, Eu sou a Bea, como posso te ajudar hoje?" },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Novo estado para loading

  const handleSendMessage = async () => {
    if (inputMessage.trim() && !isLoading) {
      setIsLoading(true); // Inicia o loading
      
      const userText = inputMessage;
      // 1. Adiciona a mensagem do usuário imediatamente
      setMessages(msgs => [...msgs, { sender: "Você", text: userText }]);
      setInputMessage("");

      try {
        const resposta = await sendChatMessage(userText);
        setMessages(msgs => [...msgs, { sender: "Bea", text: resposta }]);
      } catch (error) {
        console.error('Erro ao se comunicar com a API:', error);
        setMessages(msgs => [...msgs, { 
          sender: "Bea", 
          text: `Desculpe, estou com dificuldades técnicas. (Erro: ${error}). Tente novamente mais tarde.`
        }]);
      } finally {
        setIsLoading(false); // Finaliza o loading
      }
    }
  };

  return (
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
      </ImageBackground>      <ScrollView style={[styles.chatContainer, isDarkMode && styles.chatContainerDark]}>
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
            <Text style={[
              styles.messageText,
              message.sender === "Bea" ? styles.messageTextBea : styles.messageTextUser
            ]}>{message.text}</Text>
          </View>
        ))}

        {/* Indicador de digitação */}
        {isLoading && (
          <View style={[styles.messageContainer, styles.messageBea]}>
            <Image source={BeaAssistencia} style={styles.avatar} />
            <Text style={[styles.messageText, styles.messageTextBea, { fontStyle: 'italic' }]}>
              Bea está digitando...
            </Text>
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
          onSubmitEditing={handleSendMessage} // Envia ao pressionar enter/return no teclado
          editable={!isLoading} // Desabilita o input durante o loading
        />
        <TouchableOpacity onPress={handleSendMessage} disabled={isLoading}>
          <LinearGradient
            colors={isLoading ? ["#ccc", "#999"] : ["#70DEFE", "#1163E7"]} // Cor diferente quando desabilitado
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.sendButton}
          >
            <Text style={styles.sendButtonText}>{isLoading ? 'Aguarde...' : 'Enviar'}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerBackground: {
    width: "100%",
    height: screenHeight * 0.16, // 16% da altura da tela
    justifyContent: "flex-end",
  },
  headerContent: {
    height: screenHeight * 0.075, // 7.5% da altura da tela
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
  // Tamanho será definido dinamicamente via screenWidth
  width: screenWidth * 0.065,
  height: screenWidth * 0.065,
},

  headerText: {
    fontSize: screenWidth * 0.055, // 5.5% da largura da tela
    color: "#fff",
    fontWeight: "600",
    top: -screenHeight * 0.068, // Responsivo baseado na altura
  },
  chatContainer: {
    flex: 1,
    padding: screenWidth * 0.04, // 4% da largura da tela
  },
  messageContainer: {
    flexDirection: "row",
    marginBottom: screenHeight * 0.012, // 1.2% da altura da tela
    alignItems: "flex-start",
  },
  messageBea: {
    justifyContent: "flex-start",

  },
  messageUser: {
    justifyContent: "flex-end",
    // CORREÇÃO: Para o usuário a imagem de avatar não aparece, então 
    // ajustamos para garantir que o balão fique à direita
    marginRight: screenWidth * 0.025, // Mesmo padding do avatar da Bea
  },
  avatar: {
    width: screenWidth * 0.1, // 10% da largura da tela
    height: screenWidth * 0.1, // 10% da largura da tela (quadrado)
    borderRadius: screenWidth * 0.05, // 5% da largura da tela
    marginRight: screenWidth * 0.025, // 2.5% da largura da tela
  },
  messageText: {
    maxWidth: "70%",
    padding: screenWidth * 0.025, // 2.5% da largura da tela
    borderRadius: screenWidth * 0.025, // 2.5% da largura da tela
    fontSize: screenWidth * 0.04, // 4% da largura da tela
  },
  messageTextBea: {
    backgroundColor: "#E1E1E1", // Cinza claro para a Bea
    color: "#333333",
  },
  messageTextUser: {
    backgroundColor: "#1163E7", // Azul para o usuário
    color: "#FFFFFF",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: screenWidth * 0.025, // 2.5% da largura da tela
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  input: {
    flex: 1,
    height: screenHeight * 0.05, // 5% da altura da tela
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: screenHeight * 0.025, // 2.5% da altura da tela
    paddingLeft: screenWidth * 0.025, // 2.5% da largura da tela
    marginRight: screenWidth * 0.025, // 2.5% da largura da tela
    fontSize: screenWidth * 0.04, // 4% da largura da tela
  },
  sendButton: {
    paddingVertical: screenHeight * 0.012, // 1.2% da altura da tela
    paddingHorizontal: screenWidth * 0.05, // 5% da largura da tela
    borderRadius: screenHeight * 0.025, // 2.5% da altura da tela
  },
  sendButtonText: {
    color: "#fff",
    fontSize: screenWidth * 0.04, // 4% da largura da tela
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