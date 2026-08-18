import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import SplashScreenComponent from './splash';
import { useColorScheme } from '@/components/useColorScheme';

// Captura erros críticos para o app não fechar sozinho
export {
  ErrorBoundary,
} from 'expo-router';

// Define que a tela inicial deve ser a splashscreen
export const unstable_settings = {
  initialRouteName: 'SplashScreen',
};

// Impede que a tela inicial suma antes do app terminar de carregar os recursos
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    // Carregando as fontes Gabarito (incluindo a Black solicitada)
    'Gabarito-Black': require('../assets/fonts/Gabarito-Black.ttf'),
    'Gabarito-Bold': require('../assets/fonts/Gabarito-Bold.ttf'), 
    'Gabarito-Regular': require('../assets/fonts/Gabarito-Regular.ttf'),
  });

  // Se der erro ao carregar as fontes, lança o erro
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  // Esconde a tela de splash assim que as fontes terminam de carregar
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Exibe o componente customizado se as fontes ainda não carregaram
  if (!loaded) {
    return <SplashScreenComponent />;
  }

  // Chama a função que desenha as telas se já carregou
  return <RootLayoutNav />;
}

// Configuração da navegação e do tema (claro/escuro)
function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="SplashScreen" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </ThemeProvider>
  );
}