import React from 'react';
import { StyleSheet, View } from 'react-native';

interface Props {
  current: number;
}

export default function OnboardingIndicator({ current }: Props) {
  return (
    <View style={styles.container}>
      {[0, 1, 2, 3].map((i) => (
        <View
          key={i}
          style={[styles.dot, current === i && styles.activeDot]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    marginHorizontal: 4,
    opacity: 0.5,
  },
  activeDot: {
    opacity: 1,
    backgroundColor: '#00CFFF',
  },
}); 