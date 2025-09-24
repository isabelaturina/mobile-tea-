import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import React, { useState, useRef } from "react";
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";

export default function VerificationCode() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const [code, setCode] = useState<string[]>(["", "", "", ""]);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const handleCodeChange = (text: string, index: number) => {
    // Permite apenas números
    const numericText = text.replace(/[^0-9]/g, '');
    
    const newCode = [...code];
    newCode[index] = numericText;
    setCode(newCode);

    // Avança para o próximo input
    if (numericText && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    // Volta para o input anterior quando apagar
    if (!numericText && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyCode = () => {
    const fullCode = code.join('');
    
    if (fullCode.length !== 4) {
      Alert.alert("Erro", "Digite o código completo de 4 dígitos");
      return;
    }

    // Redireciona para nova senha
    router.push('/new-password');
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
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Image 
              source={require('../assets/images/seta.png')} 
              style={[styles.arrowImage, isDarkMode && styles.arrowImageDark]}
              resizeMode="contain"
            />
          </Pressable>

          {/* Imagem */}
          <View style={styles.imageContainer}>
            <Image 
              source={require('../assets/images/verification-code.png')} 
              style={styles.image}
              resizeMode="contain"
            />
          </View>

          {/* Título */}
          <Text style={[styles.title, isDarkMode && styles.titleDark]}>
            Verificar endereços de Email
          </Text>

          {/* Descrição */}
          <Text style={[styles.description, isDarkMode && styles.descriptionDark]}>
            Digite o código de verificação enviado para seu email.
          </Text>

          {/* Inputs do código */}
          <View style={styles.codeContainer}>
            {[0, 1, 2, 3].map((index: number) => (
              <TextInput
                key={index}
                ref={ref => { inputRefs.current[index] = ref; }}
                style={[styles.codeInput, isDarkMode && styles.codeInputDark]}
                value={code[index]}
                onChangeText={(text) => handleCodeChange(text, index)}
                keyboardType="numeric"
                maxLength={1}
                textAlign="center"
              />
            ))}
          </View>

          {/* Botão de Confirmar Código */}
          <TouchableOpacity 
            style={styles.buttonWrapper}
            onPress={handleVerifyCode}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#1163E7", "#1163E7"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Confirmer Código</Text>
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
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  backButton: {
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  arrowImage: {
    width: 15,
    height: 20,
    tintColor: "#000000",
    top: 20,
  },
  arrowImageDark: {
    tintColor: "#70DEFE",
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  image: {
    width: 300,
    height: 250,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    color: "#000",
  },
  titleDark: {
    color: "#fff",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#575757",
    marginBottom: 40,
    fontWeight: "400",
  },
  descriptionDark: {
    color: "#ccc",
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
    gap: 15,
  },
  codeInput: {
    width: 60,
    height: 60,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#A2AFBC",
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    textAlign: 'center',
  },
  codeInputDark: {
    backgroundColor: "#1a1a1a",
    color: "#fff",
    borderColor: "#333",
  },
  buttonWrapper: {
    borderRadius: 15,
    overflow: "hidden",
    alignSelf: "center",
    width: "70%",
    marginTop: 20,
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