import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth, isEmailFormatoValido } from '../../components/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

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
      router.replace('../(tabs)');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Não foi possível entrar.';
      Alert.alert('Erro ao entrar', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>LIBRICA</Text>
      <Text style={styles.subtitle}>Faça login para continuar</Text>

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        placeholderTextColor="#888"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#888"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>Entrar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push({ pathname: '/auth/forgot-password', params: { email } })}
      >
        <Text style={styles.linkText}>Esqueci minha senha</Text>
      </TouchableOpacity>

      {/* Rota ajustada para apontar corretamente para a tela de registro na pasta auth */}
      <TouchableOpacity onPress={() => router.push('/auth/register')}>
        <Text style={[styles.linkText, styles.registerLink]}>Não tem uma conta? Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f0ec',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
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
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    color: '#5a3d40',
  },
  buttonContainer: {
    width: '100%',
    backgroundColor: '#7B3E52',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkText: {
    color: '#7B3E52',
    marginTop: 20,
    fontSize: 14,
    minHeight: 48,
    textAlignVertical: 'center',
  },
  registerLink: {
    marginTop: 4,
  },
});