import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useUser } from '../contexts/UserContext';

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { signUp } = useUser();

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setIsLoading(true);
    try {
      // Simular cadastro bem-sucedido
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Fazer cadastro e login automático
      const signUpSuccess = await signUp(name, email, password);
      
      if (signUpSuccess) {
        Alert.alert(
          'Sucesso!', 
          'Conta criada com sucesso! Bem-vindo ao Tea+',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/(tabs)')
            }
          ]
        );
      } else {
        Alert.alert('Erro', 'Erro ao criar a conta');
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao criar a conta');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.backgroundCircle} />
      <Image source={require('../assets/images/logo tea.png')} style={styles.image} />
      <Text style={styles.title}>Crie sua conta</Text>
      <TouchableOpacity onPress={() => router.push('/Login')}>
        <Text style={styles.linkText}>Já possui uma conta? <Text style={styles.link}>Faça seu Login</Text></Text>
      </TouchableOpacity>
      
      <TextInput 
        placeholder="Nome:" 
        style={styles.input}
        value={name}
        onChangeText={setName}
      />
      
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
        onPress={handleSignUp}
        disabled={isLoading}
      >
        <LinearGradient
          colors={['#00C6FF', '#1163E7']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientButton}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Criando Conta...' : 'Criar Conta'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
      
      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>Ou crie com as informações do</Text>
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
    overflow: 'hidden',
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
    zIndex: 1,
  },
  linkText: {
    color: '#888',
    marginBottom: 16,
    textAlign: 'center',
    zIndex: 1,
  },
  link: {
    color: '#007AFF',
    fontWeight: 'bold',
    zIndex: 1,
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
    zIndex: 1,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
    zIndex: 1,
  },
  inputPassword: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#B0B0B0',
    borderRadius: 20,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    zIndex: 1,
  },
  eyeButton: {
    marginLeft: -40,
    padding: 8,
    zIndex: 2,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginTop: 8,
    width: '100%',
    zIndex: 1,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    zIndex: 1,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    width: '100%',
    zIndex: 1,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
    zIndex: 1,
  },
  dividerText: {
    marginHorizontal: 8,
    color: '#888',
    fontSize: 12,
    zIndex: 1,
  },
  googleButton: {
    marginTop: 8,
    alignItems: 'center',
    zIndex: 1,
  },
  googleIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    zIndex: 1,
  },
  gradientButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
}); 