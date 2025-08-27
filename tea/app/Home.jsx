import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const Home = () => {
  return (
    <LinearGradient
      // Array de cores do gradiente
      colors={[ '#C896FF', '#008BEF']}
      style={styles.container}
    >
      <Text style={styles.text}>Bem-vindo à tela inicial!</Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff', // Mude a cor do texto para ser visível no fundo escuro
  },
});

export default Home;