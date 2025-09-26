import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { useTheme } from '../contexts/ThemeContext';

// Pegar as dimensões da tela
const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

import BeaAssistencia from "../assets/images/BeaAssistencia.png";
import ChatBeaBackground from "../assets/images/ChatBea.png";

export default function ChatBea() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const [messages, setMessages] = useState([
    { sender: "Bea", text: "Olá, Eu sou a Bea, como posso te ajudar hoje?" },
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setMessages([...messages, { sender: "Você", text: inputMessage }]);
      setInputMessage("");
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
            <Ionicons name="arrow-back" size={screenWidth * 0.065} color="#fff" />
          </TouchableOpacity>

          {/* Título centralizado */}
          <Text style={styles.headerText}>Bea</Text>
        </View>
      </ImageBackground>

      <ScrollView style={[styles.chatContainer, isDarkMode && styles.chatContainerDark]}>
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
      </ScrollView>

      <View style={[styles.inputContainer, isDarkMode && styles.inputContainerDark]}>
        <TextInput
          style={[styles.input, isDarkMode && styles.inputDark]}
          placeholder="Digite sua Mensagem"
          placeholderTextColor={isDarkMode ? "#aaa" : "#999"}
          value={inputMessage}
          onChangeText={setInputMessage}
        />
        <TouchableOpacity onPress={handleSendMessage}>
          <LinearGradient
            colors={["#70DEFE", "#1163E7"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.sendButton}
          >
            <Text style={styles.sendButtonText}>Enviar</Text>
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
    left: screenWidth * 0.04, // 4% da largura da tela
    top: "-50%",
    transform: [{ translateY: -screenHeight * 0.016 }], // Responsivo baseado na altura
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
