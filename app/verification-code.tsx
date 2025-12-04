import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
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
import { authApi } from '../services/api/authApi';

// Pegar as dimensões da tela
const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

export default function VerificationCode() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  
  const [code, setCode] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const handleCodeChange = (text: string, index: number) => {
    // Remove qualquer caractere que não seja número
    const numericText = text.replace(/[^0-9]/g, '');
    
    // Se o texto tem mais de 1 caractere, significa que foi colado ou digitado rapidamente
    if (numericText.length > 1) {
      const digits = numericText.split('').slice(0, 4);
      const newCode = ['', '', '', ''];
      
      // Preenche os campos com os dígitos
      digits.forEach((digit, i) => {
        if (i < 4) {
          newCode[i] = digit;
        }
      });
      
      setCode(newCode);
      
      // Foca no último campo preenchido ou no próximo vazio
      const lastFilledIndex = digits.length - 1;
      if (lastFilledIndex < 3) {
        inputRefs.current[lastFilledIndex + 1]?.focus();
      } else {
        inputRefs.current[3]?.focus();
      }
      return;
    }
    
    // Comportamento normal para um único dígito
    const newCode = [...code];
    newCode[index] = numericText;
    setCode(newCode);

    // Auto-avançar para o próximo campo se um número foi digitado
    if (numericText && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleGlobalInput = (text: string) => {
    // Remove qualquer caractere que não seja número
    const numericText = text.replace(/[^0-9]/g, '');
    
    if (numericText.length > 0) {
      const digits = numericText.split('').slice(0, 4);
      const newCode = ['', '', '', ''];
      
      // Preenche os campos com os dígitos
      digits.forEach((digit, i) => {
        if (i < 4) {
          newCode[i] = digit;
        }
      });
      
      setCode(newCode);
      
      // Foca no último campo preenchido ou no próximo vazio
      const lastFilledIndex = digits.length - 1;
      if (lastFilledIndex < 3) {
        inputRefs.current[lastFilledIndex + 1]?.focus();
      } else {
        inputRefs.current[3]?.focus();
      }
    }
  };

  const handleVerifyCode = async () => {
    const fullCode = code.join('');
    
    if (fullCode.length !== 4) {
      Alert.alert("Erro", "Por favor, digite o código completo de 4 dígitos");
      return;
    }

    setIsLoading(true);
    try {
      // Valida o token (código de verificação)
      const result = await authApi.validateToken(fullCode);
      setToken(fullCode);
      Alert.alert("Sucesso", "Código verificado com sucesso!");
      // Passa o token para a próxima tela via query params ou state
      router.push({ pathname: '/new-password', params: { token: fullCode } } as any);
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Código inválido ou expirado");
    } finally {
      setIsLoading(false);
    }
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
          <Pressable onPress={() => router.push("/forgot-password")} style={styles.backButton}>
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

          {/* Campos de código */}
          <View style={styles.codeContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                style={[styles.codeInput, isDarkMode && styles.codeInputDark]}
                value={digit}
                onChangeText={(text) => {
                  if (index === 0) {
                    // No primeiro campo, permite entrada de múltiplos dígitos
                    handleGlobalInput(text);
                  } else {
                    // Nos outros campos, comportamento normal
                    handleCodeChange(text, index);
                  }
                }}
                keyboardType="numeric"
                maxLength={index === 0 ? 4 : 1}
                textAlign="center"
                placeholderTextColor={isDarkMode ? "#aaa" : "#999"}
                placeholder=""
                autoFocus={index === 0}
                selectTextOnFocus
              />
            ))}
          </View>

          {/* Botão de Confirmar Código */}
          <TouchableOpacity 
            style={[styles.buttonWrapper, isLoading && styles.buttonDisabled]}
            onPress={handleVerifyCode}
            activeOpacity={0.8}
            disabled={isLoading}
          >
            <LinearGradient
              colors={["#1163E7", "#1163E7"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>
                {isLoading ? "Verificando..." : "Confirmar Código"}
              </Text>
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
    paddingHorizontal: screenWidth * 0.05,
    paddingTop: screenHeight * 0.05,
    paddingBottom: screenHeight * 0.05,
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
  backButton: {
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: screenHeight * 0.05,
    marginTop: screenHeight * 0.05,
  },
  image: {
    width: screenWidth * 0.8,
    height: screenHeight * 0.3,
  },
  title: {
    fontSize: screenWidth * 0.06,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: screenHeight * 0.04,
    color: "#000",
  },
  titleDark: {
    color: "#fff",
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: screenHeight * 0.06,
    paddingHorizontal: screenWidth * 0.1,
  },
  codeInput: {
    width: screenWidth * 0.15,
    height: screenWidth * 0.15,
    backgroundColor: "#ffffffb8",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 15,
    fontSize: screenWidth * 0.08,
    fontWeight: "bold",
    color: "#000",
    borderWidth: 2,
    borderColor: "#A2AFBC",
    textAlign: "center",
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
  buttonDisabled: {
    opacity: 0.6,
  },
});