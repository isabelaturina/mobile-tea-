import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import OnboardingButton from '../../components/OnboardingButton';
import OnboardingIndicator from '../../components/OnboardingIndicator';

export default function Onboarding4() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#1CB5E0', '#000851']}
      style={styles.container}
    >
      <Text style={styles.title}>Informação transforma.</Text>
      <Text style={styles.subtitle}>Junte-se a nós na jornada pela inclusão.</Text>
      <Image source={require('../../assets/images/logo tea.png')} style={styles.image} />
      <OnboardingIndicator current={3} />
      <OnboardingButton label="Cadastrar-se" onPress={() => router.push('/SignUp')} />
      <TouchableOpacity onPress={() => router.push('/Login')}>
        <Text style={styles.loginText}>Já tem uma conta? <Text style={styles.loginLink}>Faça login</Text></Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 24,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 32,
    resizeMode: 'contain',
  },
  loginText: {
    color: '#fff',
    marginTop: 16,
    textAlign: 'center',
    fontSize:16
  },
  loginLink: {
    color: '#00CFFF',
    textDecorationLine: 'underline',
    fontSize: 16,
   
  },
}); 