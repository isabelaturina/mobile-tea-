// app/_layout.tsx
import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';

import { CronogramaProvider } from '../contexts/CronogramaContext';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import { UserProvider } from '../contexts/UserContext';


// Componente para passar o tema certo para o React Navigation
function NavigationThemeWrapper({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const navigationTheme = theme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <NavigationThemeProvider value={navigationTheme}>
      {children}
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) return null;

  return (
    <UserProvider>
      <ThemeProvider>
        <CronogramaProvider>
          <NavigationThemeWrapper>
            <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
              <Stack
                initialRouteName="onboarding/Onboarding1"
                screenOptions={{ headerShown: false }}
              >
                {/* Suas telas */}
                <Stack.Screen name="onboarding/Onboarding1" />
                <Stack.Screen name="onboarding/Onboarding2" />
                <Stack.Screen name="onboarding/Onboarding3" />
                <Stack.Screen name="onboarding/Onboarding4" />
                <Stack.Screen name="SignUp" />
                <Stack.Screen name="Login" />
                <Stack.Screen name="AlterarSenha" />
                <Stack.Screen name="Cronograma" />
                <Stack.Screen name="AdicionarEvento" />
                <Stack.Screen name="AdicionarTimer" />
                <Stack.Screen name="(tabs)" />
              </Stack>
              <StatusBar style="auto" />
            </KeyboardAvoidingView>
          </NavigationThemeWrapper>
        </CronogramaProvider>
      </ThemeProvider>
    </UserProvider>
  );
}
