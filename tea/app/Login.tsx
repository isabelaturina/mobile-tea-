import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
        router.replace('/(tabs)/Home' as any);
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
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.backgroundCircle} />
        <Image source={require('../assets/images/logo tea.png')} style={styles.image} />
        <Text style={styles.title}>Faça seu Login</Text>
        <TouchableOpacity onPress={() => router.push('/SignUp')}>
          <Text style={styles.linkText}>
            não possui uma conta? <Text style={styles.link}>Faça seu Cadastro</Text>
          </Text>
        </TouchableOpacity>
        
        <View style={styles.formContainer}>
          <TextInput 
            placeholder="Email:" 
            style={styles.input} 
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
              style={styles.inputPassword} 
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
          >
            <Text style={styles.buttonTextOutline}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    backgroundColor: '#E0F2FF',
    zIndex: -1,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 16,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#222',
    textAlign: 'center',
  },
  linkText: {
    color: '#7b7b7bff',
    marginBottom: 16,
    textAlign: 'center',
    fontSize: 13.5,
  },
  link: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  formContainer: {
    width: '100%',
    marginBottom: 16,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#2B81BE',
    borderRadius: 20,
    padding: 12,
    marginBottom: 30,
    fontSize: 16,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
    borderColor: '#2B81BE',
    borderRadius: 20,
    padding: 12,
    fontSize: 15,
    backgroundColor: '#fff',
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
    borderWidth: 1.6,
    borderColor: '#00C6FF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    left:'25%'
  },
  buttonTextOutline: {
    color: '#00C6FF',
    fontWeight: 'bold',
    fontSize: 18,
   
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});
