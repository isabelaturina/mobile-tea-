import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text } from 'react-native';
import OnboardingButton from '../../components/OnboardingButton';
import OnboardingIndicator from '../../components/OnboardingIndicator';

export default function Onboarding3() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#1CB5E0', '#000851']}
      style={styles.container}
    >
      <Text style={styles.title}>Juntos por uma jornada de inclusão e desenvolvimento</Text>
      <Text style={styles.subtitle}>Oferecendo apoio, construindo pontes e celebrando conquistas no espectro autista.</Text>
      <Image source={require('../../assets/images/juntos pela jornada.png')} style={styles.image} />
      <OnboardingIndicator current={2} />
      <OnboardingButton label="Começar" onPress={() => router.push('/onboarding/Onboarding4')} />
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