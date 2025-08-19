import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
             onPress: () => router.replace('/(tabs)/Home' as any)
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
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.backgroundCircle} />
        <Image source={require('../assets/images/logo tea.png')} style={styles.image} />
        <Text style={styles.title}>Crie sua conta</Text>
        <TouchableOpacity onPress={() => router.push('/Login')}>
          <Text style={styles.linkText}>Já possui uma conta? <Text style={styles.link}>Faça seu Login</Text></Text>
        </TouchableOpacity>
        
        <View style={styles.formContainer}>
          <TextInput 
            placeholder="Nome:" 
            style={styles.input}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="next"
            blurOnSubmit={false}
          />
          
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
              onSubmitEditing={handleSignUp}
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
        </View>
        
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>Ou crie com as informações do</Text>
          <View style={styles.divider} />
        </View>
        <TouchableOpacity style={styles.googleButton}>
          <Image source={require('../assets/images/google.png')} style={styles.googleIcon} />
        </TouchableOpacity>
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
    right: 35,
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
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#222',
    textAlign: 'center',
  },
  linkText: {
    color: '#7b7b7bff',
    marginBottom: 16,
    textAlign: 'center',
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
    borderColor: '#B0B0B0',
    borderRadius: 20,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  gradientButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
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