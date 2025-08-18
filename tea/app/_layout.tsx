import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { KeyboardAvoidingView, Platform } from 'react-native';
import 'react-native-reanimated';
import { UserProvider } from '../contexts/UserContext';

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <UserProvider>
      <ThemeProvider value={DefaultTheme}>
        <KeyboardAvoidingView 
          style={{ flex: 1 }} 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <Stack initialRouteName="onboarding/Onboarding1">
            <Stack.Screen name="onboarding/Onboarding1" options={{ headerShown: false }} />
            <Stack.Screen name="onboarding/Onboarding2" options={{ headerShown: false }} />
            <Stack.Screen name="onboarding/Onboarding3" options={{ headerShown: false }} />
            <Stack.Screen name="onboarding/Onboarding4" options={{ headerShown: false }} />
            <Stack.Screen name="SignUp" options={{ headerShown: false }} />
            <Stack.Screen name="Login" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
          <StatusBar style="auto" />
        </KeyboardAvoidingView>
      </ThemeProvider>
    </UserProvider>
  );
}
