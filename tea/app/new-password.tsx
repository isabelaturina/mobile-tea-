import { LinearGradient } from "expo-linear-gradient";
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
import { useTheme } from '../contexts/ThemeContext';

export default function NovaSenha() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
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
    <ScrollView style={styles.container}>
      <View style={styles.innerContainer}>
        {/* Botão de Voltar com a seta */}
        <Pressable onPress={() => router.replace("/(tabs)/Profile")} style={styles.backButton}>
            <Image 
              source={require('../assets/images/seta.png')} 
              style={[styles.arrowImage, isDarkMode && styles.arrowImageDark]}
              resizeMode="contain"
            />
          </Pressable>

        {/* Imagem "New Password" */}
        <View style={styles.imageContainer}>
          <Image
            source={require("../assets/images/new-password.png")}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        {/* Título */}
        <Text style={styles.title}>Nova Senha</Text>

        {/* Descrição */}
        <Text style={styles.description}>
          Por favor, escreva sua nova senha.
        </Text>

        {/* Campo de Nova Senha */}
        <TextInput
          style={styles.input}
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="Digite a nova senha"
          placeholderTextColor="#999"
        />

        {/* Campo de Confirmação da Senha */}
        <TextInput
          style={styles.input}
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirme a nova senha"
          placeholderTextColor="#999"
        />

        {/* Botão de Confirmar Código */}
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
            <Text style={styles.buttonText}>Confirmar Código</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Mensagem de sucesso estilizada */}
        {successMessage && (
          <View style={styles.successMessageBox}>
            <Text style={styles.successMessageText}>
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
    backgroundColor: "#fff",
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
    zIndex: 10, // Adicione esta linha
  },
  backImage: {
    width: 20,
    height: 20,
  },
  arrowImage: {
    width: 20,
    height: 20,
    tintColor: "#000000ff",
    top: 15,
    left: 8,
  },
    arrowImageDark: {
    tintColor: "#70DEFE",
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
    color: "#575757",
    bottom: 20,
    fontWeight: "500",
  },
  input: {
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#A2AFBC",
    paddingVertical: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 30,
  },
  buttonWrapper: {
    borderRadius: 15,
    overflow: "hidden",
    alignSelf: "center",
    width: "70%",
    marginTop: 30,
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  button: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 17,
  },
  successMessageBox: {
    backgroundColor: "#D1FADF",
    borderColor: "#12B76A",
    borderWidth: 1,
    padding: 15,
    borderRadius: 12,
    marginTop: 30,
    alignSelf: "center",
    width: "90%",
  },
  successMessageText: {
    color: "#027A48",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
  },
});
