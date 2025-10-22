import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

// Pegar as dimensões da tela
const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

export default function ForgotPassword() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const [email, setEmail] = useState("");

  const isValidEmail = (email: string) => {
    const emailRegex = /^(?!\.)(?!.*\.\.)(?!.*\.$)[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return emailRegex.test(email);
  };

  const handleSendCode = () => {
    if (!email) {
      Alert.alert("Erro", "Digite seu endereço de email");
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert("Erro", "Digite um email válido");
      return;
    }

    // Direciona diretamente para a tela verification-code
    router.push('/verification-code');
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <KeyboardAvoidingView 
        style={[styles.container, isDarkMode && styles.containerDark]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Botão Voltar */}
          <Pressable onPress={() => router.push("/(tabs)/Profile")} style={styles.backButton}>
            <Image 
              source={require('../assets/images/seta.png')} 
              style={[styles.arrowImage, isDarkMode && styles.arrowImageDark]}
              resizeMode="contain"
            />
          </Pressable>

          {/* Imagem */}
          <View style={styles.imageContainer}>
            <Image 
              source={require('../assets/images/forgot.png')} 
              style={styles.image}
              resizeMode="contain"
            />
          </View>
      
          {/* Título */}
          <Text style={[styles.title, isDarkMode && styles.titleDark]}>
            Esqueceu a Senha?
          </Text>

          {/* Descrição */}
          <Text style={[styles.description, isDarkMode && styles.descriptionDark]}>
            Por favor escreva seu email para receber um código de confirmação 
            para definir uma nova senha.
          </Text>

          {/* Campo de Email */}
          <TextInput
            style={[styles.input, isDarkMode && styles.inputDark]}
            value={email}
            onChangeText={setEmail}
            placeholderTextColor={isDarkMode ? "#aaa" : "#999"}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="Endereço de email"
          />  

          {/* Botão de Enviar Código */}
          <TouchableOpacity 
            style={styles.buttonWrapper}
            onPress={handleSendCode}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#1163E7", "#1163E7"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Confirmar Email</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Espaço extra para garantir que o botão fique visível */}
          <View style={styles.spacer} />
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  containerDark: {
    backgroundColor: "#000",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: screenWidth * 0.05, // 5% da largura da tela
    paddingTop: screenHeight * 0.05, // 5% da altura da tela
    paddingBottom: screenHeight * 0.05, // 5% da altura da tela
  },
  arrowImage: {
    width: 20, // Ajuste o tamanho da seta de acordo com sua preferência
    height: 20,
    tintColor: "#000000ff",
    top: 15,
    left: 8,
  },
  arrowImageDark: {
    tintColor: "#70DEFE",
  },
  backButton: {
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: screenHeight * 0.05, // 5% da altura da tela
    marginTop: screenHeight * 0.05, // 5% da altura da tela
  },
  image: {
    width: screenWidth * 0.8, // 80% da largura da tela
    height: screenHeight * 0.3, // 30% da altura da tela
  },
  title: {
    fontSize: screenWidth * 0.07, // 7% da largura da tela
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    color: "#000",
  },
  titleDark: {
    color: "#fff",
  },
  description: {
    fontSize: screenWidth * 0.04, // 4% da largura da tela
    textAlign: "center",
    color: "#575757",
    marginBottom: screenHeight * 0.04, // 4% da altura da tela
    fontWeight: "500",
  },
  descriptionDark: {
    color: "#ccc",
  },
  input: {
    backgroundColor: "#ffffffb8",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
    color: "#000",
    borderWidth: 2,
    borderColor: "#A2AFBC",
  },
  inputDark: {
    backgroundColor: "#1a1a1a",
    color: "#fff",
    borderColor: "#333",
  },
  buttonWrapper: {
    borderRadius: 15,
    overflow: "hidden",
    alignSelf: "center",
    width: "70%",
    marginTop: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
  spacer: {
    height: 50,
  },
});
