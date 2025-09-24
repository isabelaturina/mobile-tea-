import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";

import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useTheme } from "../contexts/ThemeContext";

export default function AlterarSenha() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSavePassword = () => {
    if (!currentPassword) {
      Alert.alert("Erro", "Digite sua senha atual");
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert("Erro", "A nova senha deve ter pelo menos 8 caracteres");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem");
      return;
    }

    try {
      router.push("/PasswordChangedSuccess");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível redirecionar");
    }
  };

  const handleForgotPassword = () => {
    try {
      router.push("/forgot-password");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível redirecionar para recuperação de senha");
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={[styles.container, isDarkMode && styles.containerDark]}>
        {/* Botão de Voltar com Imagem */}
        <Pressable onPress={() => router.push("/(tabs)/Profile")} style={styles.backButton}>
          <Image
            source={require("../assets/images/seta.png")} // ajuste esse caminho se necessário
            style={[styles.backImage, isDarkMode && styles.backImageDark]}
            resizeMode="contain"
          />
        </Pressable>

        <Text style={[styles.title, isDarkMode && styles.titleDark]}>
          Alterar senha
        </Text>

        <Text style={[styles.label, isDarkMode && styles.labelDark]}>
          Senha atual
        </Text>
        <TextInput
          style={[styles.input, isDarkMode && styles.inputDark]}
          secureTextEntry
          value={currentPassword}
          onChangeText={setCurrentPassword}
          placeholder="Digite sua senha atual"
          placeholderTextColor={isDarkMode ? "#aaa" : "#999"}
        />

        <Text style={[styles.label, isDarkMode && styles.labelDark]}>Nova senha</Text>
        <TextInput
          style={[styles.input, isDarkMode && styles.inputDark]}
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="Digite a nova senha"
          placeholderTextColor={isDarkMode ? "#aaa" : "#999"}
        />
        {newPassword.length > 0 && newPassword.length < 8 && (
          <Text style={styles.errorText}>Mínimo 8 caracteres</Text>
        )}

        <Text style={[styles.label, isDarkMode && styles.labelDark]}>
          Confirme a nova senha
        </Text>
        <TextInput
          style={[styles.input, isDarkMode && styles.inputDark]}
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirme a nova senha"
          placeholderTextColor={isDarkMode ? "#aaa" : "#999"}
        />

        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={[styles.forgot, isDarkMode && styles.forgotDark]}>
            Esqueceu a senha?
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.buttonWrapper}
          onPress={handleSavePassword}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#1163E7", "#1163E7"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Salvar informações</Text>
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
  
  },
  containerDark: {
    backgroundColor: "#000",
  },
  backButton: {
    marginBottom: 20,
    top: 40,
  },
  backImage: {
    width: 15,
    height: 20,
  },
  backImageDark: {
    tintColor: "#70DEFE",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 90,
    color: "#000",
  },
  titleDark: {
    color: "#fff",
  },
  label: {
    fontSize: 15,
    color: "#575757",
    fontWeight: "bold",
    marginBottom: 20,
  },
  labelDark: {
    color: "#ccc",
  },
  input: {
    backgroundColor: "#eee9e9b8",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 15,
    fontSize: 15,
    marginBottom: 10,
    color: "#000",
  },
  inputDark: {
    backgroundColor: "#1a1a1a",
    color: "#fff",
  },
  errorText: {
    fontSize: 12,
    color: "red",
    marginTop: 3,
    marginBottom: 16,
  },
  forgot: {
    fontSize: 14,
    color: "#0095FF",
    marginBottom: 10,
    fontWeight: 500,
  },
  forgotDark: {
    color: "#70DEFE",
  },
  buttonWrapper: {
    borderRadius:13,
    overflow: "hidden",
    alignSelf: "center",
     width: "60%",
    marginTop: 70,
  },
  button: {
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    
  },
  buttonText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 15,
  },

});
