import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { useUser } from "../contexts/UserContext";
import { authApi } from "../services/api/authApi";

export default function AlterarSenha() {
  const router = useRouter();
  const { theme } = useTheme();
  const { userData } = useUser();
  const isDarkMode = theme === "dark";

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSavePassword = async () => {
    if (!currentPassword) {
      Alert.alert("Erro", "Digite sua senha atual");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Erro", "A nova senha deve ter pelo menos 6 caracteres");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem");
      return;
    }

    // Verifica se temos o ID do usuário
    let userId: number | null = null;
    try {
      const storedUserId = await AsyncStorage.getItem('userId');
      const storedUserData = await AsyncStorage.getItem('userData');
      
      if (storedUserId) {
        userId = parseInt(storedUserId, 10);
      } else if (storedUserData) {
        const userData = JSON.parse(storedUserData);
        userId = userData.id;
      } else if (userData && (userData as any).id) {
        userId = (userData as any).id;
      }
    } catch (error) {
      console.warn("Erro ao buscar ID do usuário:", error);
    }

    if (!userId) {
      Alert.alert("Erro", "Não foi possível identificar o usuário. Faça login novamente.");
      return;
    }

    setIsLoading(true);
    try {
      // Atualiza a senha usando o endpoint da API
      await authApi.updateUserPassword(userId, newPassword);
      Alert.alert("Sucesso", "Senha alterada com sucesso!");
      router.push("/PasswordChangedSuccess");
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Não foi possível alterar a senha. Tente novamente.");
    } finally {
      setIsLoading(false);
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
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={[styles.backText, isDarkMode && styles.backButtonDark]}>
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
        {newPassword.length > 0 && newPassword.length < 6 && (
          <Text style={styles.errorText}>Mínimo 6 caracteres</Text>
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
          style={[styles.buttonWrapper, isLoading && styles.buttonDisabled]}
          onPress={handleSavePassword}
          activeOpacity={0.8}
          disabled={isLoading}
        >
          <LinearGradient
            colors={["#00C6FF", "#1163E7"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>
              {isLoading ? "Salvando..." : "Salvar informações"}
            </Text>
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
  },
  backText: {
    fontSize: 16,
    color: "#1163E7",
    top: 30,
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
  buttonDisabled: {
    opacity: 0.6,
  },
});
