import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useUser();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  // 🎨 Define cores com base no tema
  const colors = isDarkMode
    ? {
        background: "#000000",
        textPrimary: "#F8FAFC",
        textSecondary: "#94A3B8",
        card: "#1a1a1a",
        accent: "#3B82F6",
        lightAccent: "#60A5FA",
        border: "#334155",
        placeholder: "#64748B",
        circle: "#182d4eff",
      }
    : {
        background: "#fff",
        textPrimary: "#222",
        textSecondary: "#7b7b7bff",
        card: "#fff",
        accent: "#00C6FF",
        lightAccent: "#1163E7",
        border: "#00C6FF",
        placeholder: "#575757",
        circle: "#E0F2FF",
      };

  const handleLogin = async () => {
    setEmailError('');

    if (!email || !password) {
      Alert.alert('Ops!', 'Parece que você esqueceu de preencher algum campo. Tente novamente!');
      return;
    }

    const regexGmail = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!regexGmail.test(email)) {
      setEmailError('Utilize um email do Gmail (ex: exemplo@gmail.com)');
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        router.replace('/(tabs)/Home' as any);
      } else {
        setEmailError('Este email não está cadastrado ou a senha está incorreta.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.backgroundCircle, { backgroundColor: colors.circle }]} />
        <Image source={require('../assets/images/logo tea.png')} style={styles.image} />
        <Text style={[styles.title, { color: colors.textPrimary }]}>Faça seu Login</Text>
        <TouchableOpacity onPress={() => router.push('/SignUp')}>
          <Text style={[styles.linkText, { color: colors.textSecondary }]}>
            não possui uma conta? <Text style={[styles.link, { color: colors.accent }]}>Faça seu Cadastro</Text>
          </Text>
        </TouchableOpacity>
        
        <View style={styles.formContainer}>
          <TextInput 
            placeholder="Email:" 
            placeholderTextColor={colors.placeholder}
            style={[styles.input, { 
              fontSize: 14,
              fontWeight: '600',
              fontFamily: 'System',
              backgroundColor: colors.card,
              borderColor: colors.border,
              color: colors.textPrimary
            }]} 
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
            blurOnSubmit={false}
          />
        

          <View style={styles.passwordContainer}>
            <TextInput 
              placeholder="Senha:" 
              placeholderTextColor={colors.placeholder}
              style={[styles.inputPassword, { 
                fontSize: 14,
                fontWeight: '600',
                fontFamily: 'System',
                backgroundColor: colors.card,
                borderColor: colors.border,
                color: colors.textPrimary
              }]} 
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />
            <TouchableOpacity 
              onPress={() => setShowPassword(!showPassword)} 
              style={styles.eyeButton}
            >
              <Image 
                source={require('../assets/images/olho.png')} 
                style={styles.eyeIcon} 
              />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={[styles.button, isLoading && styles.buttonDisabled]} 
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[colors.accent, colors.lightAccent]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientBorder}
            >
              <View style={[styles.buttonInner, { backgroundColor: colors.background }]}>
                <Text style={[styles.buttonTextOutline, { color: colors.accent }]}>
                  {isLoading ? 'Entrando...' : 'Entrar'}
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    minHeight: '100%',
  },
  backgroundCircle: {
    position: 'absolute',
    top: -120,
    right: 10,
    width: 500,
    height: 500,
    borderRadius: 250,
    zIndex: -1,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 16,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  linkText: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 16,
  },
  link: {
    fontWeight: 'bold',
  },
  formContainer: {
    width: '100%',
    marginBottom: 16,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 20,
    padding: 12,
    marginBottom: 30,
    fontSize: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  emailErrorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  emailInfoText: {
    color: '#e71b1bff',
    fontSize: 13,
    bottom: 10,
    top: -24,
    paddingHorizontal: 8,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    
  },
  inputPassword: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    padding: 12,
    fontSize: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  eyeButton: {
    marginLeft: -40,
    padding: 8,
    zIndex: 1,
  },
  eyeIcon: {
    width: 24,
    height: 24,
    tintColor: '#7b7b7b', // deixa o ícone cinza (opcional)
    resizeMode: 'contain',
  },
  button: {
    borderRadius: 10,
    marginTop: 8,
    width: '50%',
    left: '25%',
  },
  gradientBorder: {
    borderRadius: 10,
    padding: 2, 
  },
  buttonInner: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  buttonTextOutline: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});
