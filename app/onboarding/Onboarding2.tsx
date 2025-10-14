import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text } from 'react-native';
import OnboardingButton from '../../components/OnboardingButton';
import OnboardingIndicator from '../../components/OnboardingIndicator';

export default function Onboarding2() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#1CB5E0', '#000851']}
      style={styles.container}
    >
      <Text style={styles.title}>TEA+: onde empatia e informação se unem para transformar vidas.</Text>
      <Text style={styles.subtitle}>Entendendo, conectando e apoiando o autismo com amor.</Text>
      <Image source={require('../../assets/images/mão segurando a logo.png')} style={styles.image} />
      <OnboardingIndicator current={1} />
      <OnboardingButton onPress={() => router.push('/onboarding/Onboarding3')} />
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
}); 