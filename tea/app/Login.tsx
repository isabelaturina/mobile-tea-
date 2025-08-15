import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useUser } from '../contexts/UserContext';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useUser();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    setIsLoading(true);
    try {
              const success = await login(email, password);
        if (success) {
          router.replace('/(tabs)');
        } else {
        Alert.alert('Erro', 'Email ou senha incorretos');
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/logo tea.png')} style={styles.image} />
      <View style={styles.backgroundCircle} />
      <Text style={styles.title}>Faça seu Login</Text>
      <TouchableOpacity onPress={() => router.push('/SignUp')}>
        <Text style={styles.linkText}>não possui uma conta? <Text style={styles.link}>Faça seu Cadastro</Text></Text>
      </TouchableOpacity>
      <TextInput 
        placeholder="Email:" 
        style={styles.input} 
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <View style={styles.passwordContainer}>
        <TextInput 
          placeholder="Senha:" 
          style={styles.inputPassword} 
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
          <Text>👁️</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]} 
        onPress={handleLogin}
        disabled={isLoading}
      >
        <LinearGradient
          colors={['#00C6FF', '#1163E7']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientButton}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>Ou faça login com</Text>
        <View style={styles.divider} />
      </View>
      <TouchableOpacity style={styles.googleButton}>
        <Image source={require('../assets/images/google.png')} style={styles.googleIcon} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
 backgroundCircle: {
    position: 'absolute',
    top: -120,
    right: 35,
    width: 500,
    height: 500,
    borderRadius: 250,
    backgroundColor: '#E0F2FF',
    zIndex: 0,
  },
    container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 16,
    resizeMode: 'contain',
    zIndex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#222',
    textAlign: 'center',
  },
  linkText: {
    color: '#888',
    marginBottom: 16,
    textAlign: 'center',
  },
  link: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#B0B0B0',
    borderRadius: 20,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  inputPassword: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#B0B0B0',
    borderRadius: 20,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  eyeButton: {
    marginLeft: -40,
    padding: 8,
    zIndex: 1,
  },
  button: {
    borderRadius: 20,
    marginTop: 8,
    width: '100%',
    overflow: 'hidden',
  },
  gradientButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    width: '100%',
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    marginHorizontal: 8,
    color: '#888',
    fontSize: 12,
  },
  googleButton: {
    marginTop: 8,
    alignItems: 'center',
  },
  googleIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
}); 