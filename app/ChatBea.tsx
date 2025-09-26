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
} from "react-native";

import BeaAssistencia from "../assets/images/BeaAssistencia.png";
import ChatBeaBackground from "../assets/images/ChatBea.png";

export default function ChatBea() {
  const router = useRouter();

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
    <SafeAreaView style={styles.container}>
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
            <Ionicons name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>

          {/* Título centralizado */}
          <Text style={styles.headerText}>Bea</Text>
        </View>
      </ImageBackground>

      <ScrollView style={styles.chatContainer}>
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
            <Text style={styles.messageText}>{message.text}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite sua Mensagem"
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
    height: 130,
    justifyContent: "flex-end",
  },
  headerContent: {
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 15,
    top: "-50%",
    transform: [{ translateY: -13 }], // centraliza o ícone verticalmente
  },
  headerText: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "600",
    top: -55,
  
  },
  chatContainer: {
    flex: 1,
    padding: 15,
  },
  messageContainer: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "flex-start",
  },
  messageBea: {
    justifyContent: "flex-start",

  },
  messageUser: {
    justifyContent: "flex-end",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  messageText: {
    maxWidth: "70%",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#E1E1E1",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingLeft: 10,
    marginRight: 10,
  },
  sendButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
});
