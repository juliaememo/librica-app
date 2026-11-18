import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, useWindowDimensions, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth, isEmailFormatoValido } from '../../components/AuthContext';
import BrandLogo from '../../components/BrandLogo';
import LibrasSignButton from '../../components/LibrasSignButton';
import { esconderPreviewSinal } from '@/src/services/sinalPreviewStore';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Botão maior que antes, mas ainda adaptado a telas pequenas.
  const { width: larguraTela } = useWindowDimensions();
  const larguraBotaoEntrar = Math.min(320, Math.max(170, Math.round(larguraTela * 0.54)));

  // Fecha a janelinha de Libras ao sair da tela (ex.: ir para o cadastro).
  useFocusEffect(
    useCallback(() => {
      return () => esconderPreviewSinal();
    }, []),
  );

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha o e-mail e a senha.');
      return;
    }

    if (!isEmailFormatoValido(email)) {
      Alert.alert('E-mail inválido', 'Digite um e-mail válido, ex: nome@exemplo.com.');
      return;
    }

    try {
      setLoading(true);
      const result = await login(email, password);
      // Se o e-mail ainda não foi confirmado (fluxo do cadastro), bloqueia
      // o acesso às abas e leva para a tela de verificação.
      if (!result.emailVerified) {
        router.replace('/auth/verify-email');
        return;
      }
      router.replace('/(tabs)');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Não foi possível entrar.';
      Alert.alert('Erro ao entrar', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <BrandLogo size={96} style={styles.logo} />
        <Text style={styles.title}>LIBRICA</Text>
        <Text style={styles.subtitle}>Faça login para continuar</Text>

        <View style={styles.campo}>
          <TextInput
            style={[styles.input, styles.inputComLibras]}
            placeholder="E-mail"
            placeholderTextColor="#888"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <LibrasSignButton
            sinal="email"
            tamanho={38}
            estilo={styles.librasNoCampo}
          />
        </View>

        <View style={styles.campo}>
          <TextInput
            style={[styles.input, styles.inputComLibras]}
            placeholder="Senha"
            placeholderTextColor="#888"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <LibrasSignButton
            sinal="senha"
            tamanho={38}
            estilo={styles.librasNoCampo}
          />
        </View>

        <View style={styles.linhaBotao}>
          <View style={styles.grupoBotao}>
            <LibrasSignButton sinal="entrar" rotulo="Entrar" tamanho={38} />
            <TouchableOpacity
              style={[styles.buttonContainer, { width: larguraBotaoEntrar }]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnText}>Entrar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.linhaEsqueci}>
          <View style={styles.grupoEsqueci}>
            <LibrasSignButton
              sinal="esqueciSenha"
              rotulo="Esqueci minha senha"
              tamanho={38}
            />
            <TouchableOpacity
              style={styles.toqueLink}
              onPress={() => router.push({ pathname: '/auth/forgot-password', params: { email } })}
            >
              <Text style={styles.linkText}>Esqueci minha senha</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Rota ajustada para apontar corretamente para a tela de registro na pasta auth */}
        <TouchableOpacity style={styles.toqueLink} onPress={() => router.push('/auth/register')}>
          <Text style={[styles.linkText, styles.registerLink]}>Não tem uma conta? Cadastre-se</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#f5f0ec',
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f0ec',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  logo: {
    marginBottom: 4,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#7B3E52',
    fontFamily: 'SpaceMono',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    fontFamily: 'SpaceMono',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    color: '#5a3d40',
  },
  campo: {
    width: '100%',
    height: 50,
    marginBottom: 15,
    position: 'relative',
    justifyContent: 'center',
  },
  inputComLibras: {
    paddingLeft: 54,
  },
  librasNoCampo: {
    position: 'absolute',
    left: 6,
    top: 6,
  },
  linhaBotao: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  grupoBotao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    // Desloca o grupo metade de (ícone + espaço) para o botão ficar
    // exatamente centralizado, com a mãozinha colada à esquerda dele.
    transform: [{ translateX: -23 }],
  },
  buttonContainer: {
    backgroundColor: '#7B3E52',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  linhaEsqueci: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  grupoEsqueci: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    // Mesma ideia: centraliza o texto e mantém a mãozinha ao lado.
    transform: [{ translateX: -22 }],
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkText: {
    color: '#7B3E52',
    fontSize: 14,
  },
  toqueLink: {
    minHeight: 48,
    justifyContent: 'center',
  },
  registerLink: {
    marginTop: 4,
    textAlign: 'center',
  },
});