import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack initialRouteName="onboarding/Onboarding1">
        <Stack.Screen name="onboarding/Onboarding1" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding/Onboarding2" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding/Onboarding3" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding/Onboarding4" options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" options={{ headerShown: false }} />
        <Stack.Screen name="Login" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
