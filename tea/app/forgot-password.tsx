import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  Image
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";

export default function ForgotPassword() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");

  const handleSendCode = () => {
    if (!email) {
      Alert.alert("Erro", "Digite seu endereço de email");
      return;
    }

    if (!confirmEmail) {
      Alert.alert("Erro", "Confirme seu endereço de email");
      return;
    }

    if (email !== confirmEmail) {
      Alert.alert("Erro", "Os emails não coincidem");
      return;
    }

    // Lógica para enviar código de confirmação
    Alert.alert("Sucesso", "Código de confirmação enviado para seu email");
   
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={[styles.container, isDarkMode && styles.containerDark]}>
        {/* Botão Voltar */}
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={[styles.backText, isDarkMode && styles.backTextDark]}>
            ← Voltar
          </Text>
        </Pressable>

        {/* Título */}
        <Text style={[styles.title, isDarkMode && styles.titleDark]}>
          Esqueceu a Senha?
        </Text>

        {/* Descrição */}
        <Text style={[styles.description, isDarkMode && styles.descriptionDark]}>
          Por favor escreva seu email para receber um código de confirmação 
          para definir uma nova senha.
        </Text>

        {/* Linha divisória */}
        <View style={[styles.divider, isDarkMode && styles.dividerDark]} />

        {/* Campo de Email */}
        <Text style={[styles.label, isDarkMode && styles.labelDark]}>
          Endereço de Email
        </Text>
        <TextInput
          style={[styles.input, isDarkMode && styles.inputDark]}
          value={email}
          onChangeText={setEmail}
          placeholder="Digite seu email"
          placeholderTextColor={isDarkMode ? "#aaa" : "#999"}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Campo de Confirmar Email */}
        <Text style={[styles.label, isDarkMode && styles.labelDark]}>
          Confirmar Email
        </Text>
        <TextInput
          style={[styles.input, isDarkMode && styles.inputDark]}
          value={confirmEmail}
          onChangeText={setConfirmEmail}
          placeholder="Confirme seu email"
          placeholderTextColor={isDarkMode ? "#aaa" : "#999"}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Botão de Enviar Código */}
        <TouchableOpacity 
          style={styles.buttonWrapper}
          onPress={handleSendCode}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#00C6FF", "#1163E7"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Enviar Código</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  containerDark: {
    backgroundColor: "#000",
  },
  backButton: {
    marginBottom: 30,
  },
  backText: {
    fontSize: 16,
    color: "#1163E7",
    fontWeight: "bold",
  },
  backTextDark: {
    color: "#70DEFE",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#000",
  },
  titleDark: {
    color: "#fff",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 30,
    lineHeight: 22,
  },
  descriptionDark: {
    color: "#ccc",
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 30,
  },
  dividerDark: {
    backgroundColor: "#333",
  },
  label: {
    fontSize: 16,
    color: "#575757",
    fontWeight: "bold",
    marginBottom: 10,
  },
  labelDark: {
    color: "#ccc",
  },
  input: {
    backgroundColor: "#eee9e9b8",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 25,
    color: "#000",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  inputDark: {
    backgroundColor: "#1a1a1a",
    color: "#fff",
    borderColor: "#333",
  },
  buttonWrapper: {
    borderRadius: 10,
    overflow: "hidden",
    alignSelf: "center",
    width: "100%",
    marginTop: 40,
  },
  button: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});