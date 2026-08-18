import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import 'react-native-reanimated';

import SplashScreenComponent from './splash';
import { useColorScheme } from '@/components/useColorScheme';
import { AuthProvider, useAuth } from '../components/AuthContext';

// Captura erros críticos para o app não fechar sozinho
export {
  ErrorBoundary,
} from 'expo-router';

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

  // Envolve a navegação com o Provedor de Autenticação do Firebase
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

// Configuração da navegação, controle de rotas por autenticação e temas
function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { user, initializing } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (initializing) return;

    const inAuthGroup = segments[0] === 'auth';

    if (!user && !inAuthGroup) {
      // Se o usuário não está logado e não está nas telas de autenticação, redireciona para o login
      router.replace('/auth/login');
    } else if (user && inAuthGroup) {
      // Se o usuário já está logado e tenta acessar as telas de auth, manda direto para as abas (index/módulos)
      router.replace('/(tabs)');
    }
  }, [user, initializing, segments]);

  // Exibe um carregamento enquanto o Firebase valida se há um usuário salvo na sessão
  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fbf9f5' }}>
        <ActivityIndicator size="large" color="#7B3E52" />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="SplashScreen" options={{ headerShown: false }} />
        <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        <Stack.Screen name="auth/register" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </ThemeProvider>
  );
}