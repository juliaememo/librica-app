import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import 'react-native-reanimated';

import SplashScreenComponent from './splash';
import { useColorScheme } from '@/components/useColorScheme';
import SinalPreviewOverlay from '@/components/SinalPreviewOverlay';
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
    // Ícones do Dicionário/abas (FontAwesome5): pré-carregados para nunca
    // renderizarem com fonte reserva (que os deixava pretos).
    'FontAwesome5Free-Solid': require('../node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/FontAwesome5_Solid.ttf'),
    'FontAwesome5Free-Regular': require('../node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/FontAwesome5_Regular.ttf'),
    'FontAwesome5Free-Brand': require('../node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/FontAwesome5_Brands.ttf'),
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
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === 'auth';
    const isVerifyScreen = segments[0] === 'auth' && segments[1] === 'verify-email';

    if (!user && !inAuthGroup) {
      // Se o usuário não está logado e não está nas telas de autenticação, redireciona para o login
      router.replace('/auth/login');
    } else if (user && !user.emailVerified) {
      // E-mail ainda não confirmado (só acontece no cadastro): prende na
      // tela de verificação até clicar no link. Vale uma única vez.
      if (!isVerifyScreen) {
        router.replace('/auth/verify-email');
      }
    } else if (user && user.emailVerified && inAuthGroup) {
      // Se o usuário já está logado e verificado e tenta acessar as telas de auth, manda direto para as abas (index/módulos)
      router.replace('/(tabs)');
    }
  }, [user, loading, segments]);

  // Exibe um carregamento enquanto o Firebase valida se há um usuário salvo na sessão
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fbf9f5' }}>
        <ActivityIndicator size="large" color="#7B3E52" />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen name="SplashScreen" options={{ headerShown: false }} />
          <Stack.Screen name="auth/login" options={{ headerShown: false }} />
          <Stack.Screen name="auth/register" options={{ headerShown: false }} />
          <Stack.Screen name="auth/verify-email" options={{ headerShown: false }} />
          <Stack.Screen name="auth/forgot-password" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        </Stack>
        {/* Prévia global do vídeo de sinal: fica acima de todas as telas,
            sempre centralizada e visível, sem ser cortada pelo layout local. */}
        <SinalPreviewOverlay />
      </View>
    </ThemeProvider>
  );
}