import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";

export default function NovaSenha() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  // 🎨 Define cores com base no tema
  const colors = isDarkMode
    ? {
        background: "#000000",
        textPrimary: "#F8FAFC",
        textSecondary: "#94A3B8",
        card: "#1E293B",
        accent: "#1163E7", // botão azul fixo
        border: "#334155",
        placeholder: "#64748B",
        successBg: "#065F46",
        successBorder: "#10B981",
        successText: "#D1FAE5",
      }
    : {
        background: "#fff",
        textPrimary: "#111",
        textSecondary: "#575757",
        card: "#fff",
        accent: "#1163E7", // botão azul fixo
        border: "#A2AFBC",
        placeholder: "#999",
        successBg: "#D1FADF",
        successBorder: "#12B76A",
        successText: "#027A48",
      };

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState(false);

  const handleSavePassword = () => {
    if (!newPassword) {
      return showError("Por favor, digite a nova senha");
    }

    if (newPassword.length < 8) {
      return showError("A nova senha deve ter pelo menos 8 caracteres");
    }

    if (newPassword !== confirmPassword) {
      return showError("As senhas não coincidem");
    }

    setSuccessMessage(true);

    setTimeout(() => {
      router.push("/(tabs)/Profile");
    }, 2000);
  };

  const showError = (message: string) => {
    alert(message);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.innerContainer}>
        {/* Botão de Voltar */}
        <Pressable
          onPress={() => router.replace("/(tabs)/Profile")}
          style={styles.backButton}
        >
          <Image
            source={require("../assets/images/seta.png")}
            style={[styles.arrowImage, { tintColor: colors.textPrimary }]}
            resizeMode="contain"
          />
        </Pressable>

        {/* Imagem "Nova Senha" */}
        <View style={styles.imageContainer}>
          <Image
            source={require("../assets/images/new-password.png")}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        {/* Título */}
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Nova Senha
        </Text>

        {/* Descrição */}
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          Por favor, escreva sua nova senha.
        </Text>

        {/* Campo Nova Senha */}
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              color: colors.textPrimary,
            },
          ]}
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="Digite a nova senha"
          placeholderTextColor={colors.placeholder}
        />

        {/* Campo Confirmar Senha */}
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              color: colors.textPrimary,
            },
          ]}
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirme a nova senha"
          placeholderTextColor={colors.placeholder}
        />

        {/* Botão Confirmar */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#1163E7" }]}
          onPress={handleSavePassword}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Confirmar Código</Text>
        </TouchableOpacity>

        {/* Mensagem de sucesso */}
        {successMessage && (
          <View
            style={[
              styles.successMessageBox,
              {
                backgroundColor: colors.successBg,
                borderColor: colors.successBorder,
              },
            ]}
          >
            <Text
              style={[
                styles.successMessageText,
                { color: colors.successText },
              ]}
            >
              ✅ Senha alterada com sucesso!
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  innerContainer: {
    flexGrow: 1,
    paddingTop: 40,
    paddingBottom: 40,
  },
  backButton: {
    marginBottom: 20,
    cursor: "pointer",
    top: 40,
    zIndex: 10,
  },
  arrowImage: {
    width: 20,
    height: 20,
    top: 15,
    left: 8,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  image: {
    width: 300,
    height: 250,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    bottom: 30,
  },
  description: {
    fontSize: 15,
    textAlign: "center",
    bottom: 20,
    fontWeight: "500",
  },
  input: {
    borderRadius: 15,
    borderWidth: 2,
    paddingVertical: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 30,
  },
  button: {
    borderRadius: 15,
    alignSelf: "center",
    width: "70%",
    marginTop: 30,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 17,
  },
  successMessageBox: {
    borderWidth: 1,
    padding: 15,
    borderRadius: 12,
    marginTop: 30,
    alignSelf: "center",
    width: "90%",
  },
  successMessageText: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
  },
});
