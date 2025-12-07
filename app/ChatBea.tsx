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
import { useTheme } from "../contexts/ThemeContext";
import { sendChatMessage } from "../services/api/chatApi";

const { height: screenHeight, width: screenWidth } = Dimensions.get("window");

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
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (inputMessage.trim() && !isLoading) {
      setIsLoading(true);

      const userText = inputMessage;

      setMessages((msgs) => [...msgs, { sender: "Você", text: userText }]);
      setInputMessage("");

      try {
        const resposta = await sendChatMessage(userText);
        setMessages((msgs) => [...msgs, { sender: "Bea", text: resposta }]);
      } catch (error) {
        console.error("Erro ao se comunicar com a API:", error);

        setMessages((msgs) => [
          ...msgs,
          {
            sender: "Bea",
            text: `Desculpe, estou com dificuldades técnicas. (Erro: ${error}). Tente novamente mais tarde.`,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.containerDark]}>
      <ImageBackground
        source={ChatBeaBackground}
        style={styles.headerBackground}
        resizeMode="cover"
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => router.push("/Chat")}
            style={styles.backButton}
          >
            <Image
              source={require("../assets/images/seta.png")}
              style={[
                styles.backImage,
                { width: screenWidth * 0.065, height: screenWidth * 0.065 },
              ]}
              resizeMode="contain"
              tintColor="#000"
            />
          </TouchableOpacity>

          <Text style={styles.headerText}>Bea</Text>
        </View>
      </ImageBackground>

      <ScrollView
        style={[styles.chatContainer, isDarkMode && styles.chatContainerDark]}
      >
        {messages.map((message, index) => (
          <View
            key={index}
            style={[
              styles.messageContainer,
              message.sender === "Bea"
                ? styles.messageBea
                : styles.messageUser,
            ]}
          >
            {message.sender === "Bea" && (
              <Image source={BeaAssistencia} style={styles.avatar} />
            )}

            <Text
              style={[
                styles.messageText,
                message.sender === "Bea"
                  ? styles.messageTextBea
                  : styles.messageTextUser,
              ]}
            >
              {message.text}
            </Text>
          </View>
        ))}

        {isLoading && (
          <View style={[styles.messageContainer, styles.messageBea]}>
            <Image source={BeaAssistencia} style={styles.avatar} />
            <Text
              style={[
                styles.messageText,
                styles.messageTextBea,
                { fontStyle: "italic" },
              ]}
            >
              Bea está digitando...
            </Text>
          </View>
        )}
      </ScrollView>

      <View
        style={[styles.inputContainer, isDarkMode && styles.inputContainerDark]}
      >
        <TextInput
          style={[styles.input, isDarkMode && styles.inputDark]}
          placeholder="Digite sua Mensagem"
          placeholderTextColor={isDarkMode ? "#aaa" : "#999"}
          value={inputMessage}
          onChangeText={setInputMessage}
          onSubmitEditing={handleSendMessage}
          editable={!isLoading}
        />

        <TouchableOpacity onPress={handleSendMessage} disabled={isLoading}>
          <LinearGradient
            colors={isLoading ? ["#ccc", "#999"] : ["#70DEFE", "#1163E7"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.sendButton}
          >
            <Text style={styles.sendButtonText}>
              {isLoading ? "Aguarde..." : "Enviar"}
            </Text>
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
  backImage: {},
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
    marginRight: screenWidth * 0.025,
  },
  avatar: {
    width: screenWidth * 0.1,
    height: screenWidth * 0.1,
    borderRadius: screenWidth * 0.05,
    marginRight: screenWidth * 0.025,
  },
  messageText: {
    maxWidth: "70%",
    padding: screenWidth * 0.025,
    borderRadius: screenWidth * 0.025,
    fontSize: screenWidth * 0.04,
  },
  messageTextBea: {
    backgroundColor: "#E1E1E1",
    color: "#333",
  },
  messageTextUser: {
    backgroundColor: "#1163E7",
    color: "#fff",
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
    height: screenHeight * 0.05,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: screenHeight * 0.025,
    paddingLeft: screenWidth * 0.025,
    marginRight: screenWidth * 0.025,
    fontSize: screenWidth * 0.04,
  },
  sendButton: {
    paddingVertical: screenHeight * 0.012,
    paddingHorizontal: screenWidth * 0.05,
    borderRadius: screenHeight * 0.025,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: screenWidth * 0.04,
    textAlign: "center",
  },
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
