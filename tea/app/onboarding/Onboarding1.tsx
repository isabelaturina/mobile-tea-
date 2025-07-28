import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text } from 'react-native';
import OnboardingButton from '../../components/OnboardingButton';
import OnboardingIndicator from '../../components/OnboardingIndicator';

export default function Onboarding1() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#1CB5E0', '#000851']}
      style={styles.container}
    >
      <Text style={styles.title}>Seja bem-vindo ao TEA+</Text>
      <Text style={styles.subtitle}>Conectando vidas com empatia e conhecimento</Text>
      <Image source={require('../../assets/images/familia 1.png')} style={styles.image} />
      <OnboardingIndicator current={0} />
      <OnboardingButton onPress={() => router.push('/onboarding/Onboarding2')} />
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
    fontSize: 24,
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
    width: 250,
    height: 250,
    marginBottom: 32,
    resizeMode: 'contain',
  },
}); 