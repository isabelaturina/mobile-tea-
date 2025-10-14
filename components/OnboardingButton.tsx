import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface Props {
  onPress: () => void;
  label?: string;
}

export default function OnboardingButton({ onPress, label = '→' }: Props) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#000',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginTop: 16,
    minWidth: 120,
  },
  text: {
    color: '#00CFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
}); 