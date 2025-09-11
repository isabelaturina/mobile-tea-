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
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";

export default function AlterarSenha() {
  const router = useRouter();
  const { theme } = useTheme(); // ← Use o hook ORIGINAL
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
     const handleForgotPassword = () => {
    try {
      router.push("/forgot-password"); // ← Redireciona para forgot-password.tsx
    } catch (error) {
      Alert.alert("Erro", "Não foi possível redirecionar para recuperação de senha");
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={[styles.container, isDarkMode && styles.containerDark]}>
        <Pressable onPress={() => router.back()}>
          <Text style={[styles.backButton, isDarkMode && styles.backButtonDark]}>
            ← Voltar
          </Text>
        </Pressable>

        <Text style={[styles.title, isDarkMode && styles.titleDark]}>
          Alterar senha
        </Text>

        <Text style={[styles.label, isDarkMode && styles.labelDark]}>Senha atual</Text>
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

        <TouchableOpacity>
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
            colors={["#00C6FF", "#1163E7"]}
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
    paddingTop: 60,
  },
  containerDark: {
    backgroundColor: "#000",
  },
  backButton: {
    fontSize: 16,
    color: "#1163E7",
    marginBottom: 20,
  },
  backButtonDark: {
    color: "#70DEFE",
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
    marginBottom: 25,
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
    marginBottom: 30,
    color: "#000",
  },
  inputDark: {
    backgroundColor: "#1a1a1a",
    color: "#fff",
  },
  errorText: {
    fontSize: 12,
    color: "red",
    marginTop: -20,
    marginBottom: 16,
  },
  forgot: {
    fontSize: 14,
    color: "#0095FF",
    marginBottom: 10,
  },
  forgotDark: {
    color: "#70DEFE",
  },
  buttonWrapper: {
    borderRadius: 10,
    overflow: "hidden",
    alignSelf: "center",
    width: 220,
    marginTop: 70,
  },
  button: {
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

});
}