import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth, isEmailFormatoValido } from '../../components/AuthContext';
import { validarFormatoNickname } from '@/src/services/nickname';
import LibrasSignButton from '../../components/LibrasSignButton';
import { esconderPreviewSinal } from '@/src/services/sinalPreviewStore';

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();

  // Fecha a janelinha de Libras ao sair da tela (ex.: voltar para o login).
  useFocusEffect(
    useCallback(() => {
      return () => esconderPreviewSinal();
    }, []),
  );

  const [displayName, setDisplayName] = useState('');
  const [surname, setSurname] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
  const toggleConfirmPasswordVisibility = () => setConfirmPasswordVisible(!confirmPasswordVisible);

  const handleRegister = async () => {
    if (!displayName || !surname || !username || !email || !password || !confirmPassword) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    if (!isEmailFormatoValido(email)) {
      Alert.alert('E-mail inválido', 'Digite um e-mail válido, ex: nome@exemplo.com.');
      return;
    }

    const erroNickname = validarFormatoNickname(username.trim());
    if (erroNickname) {
      Alert.alert('Nickname inválido', erroNickname);
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    try {
      setLoading(true);
      // Passando todos os parâmetros exigidos pelo AuthContext
      await register(email, password, displayName.trim(), surname.trim(), username.trim());
      // Verificação acontece uma única vez aqui no cadastro: enviamos o link
      // e levamos para a tela de confirmação em vez de entrar direto.
      Alert.alert(
        'Verifique seu e-mail',
        'Enviamos um link de confirmação para o seu e-mail. Abra o link para validar sua conta.',
      );
      router.replace('/auth/verify-email');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Não foi possível concluir o cadastro.';
      Alert.alert('Erro no cadastro', message);
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
        <Text style={styles.title}>LIBRICA</Text>
        <Text style={styles.subtitle}>Crie sua conta</Text>

        <View style={styles.campo}>
          <TextInput
            style={[styles.input, styles.inputComLibras]}
            placeholder="Nome"
            placeholderTextColor="#888"
            value={displayName}
            onChangeText={setDisplayName}
          />
          <LibrasSignButton
            sinal="nome"
            tamanho={38}
            estilo={styles.librasNoCampo}
          />
        </View>

        <View style={styles.campo}>
          <TextInput
            style={[styles.input, styles.inputComLibras]}
            placeholder="Sobrenome"
            placeholderTextColor="#888"
            value={surname}
            onChangeText={setSurname}
          />
          <LibrasSignButton
            sinal="sobrenome"
            tamanho={38}
            estilo={styles.librasNoCampo}
          />
        </View>

        <View style={styles.campo}>
          <TextInput
            style={[styles.input, styles.inputComLibras]}
            placeholder="Nome de usuário"
            placeholderTextColor="#888"
            autoCapitalize="none"
            value={username}
            onChangeText={setUsername}
          />
          <LibrasSignButton
            sinal="nomeUsuario"
            tamanho={38}
            estilo={styles.librasNoCampo}
          />
        </View>

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

        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, styles.inputComLibras, styles.inputSenha]}
            placeholder="Senha"
            placeholderTextColor="#888"
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={setPassword}
          />
          <LibrasSignButton
            sinal="senha"
            tamanho={38}
            estilo={styles.librasNoCampo}
          />
          <TouchableOpacity style={styles.eyeButton} onPress={togglePasswordVisibility}>
            <FontAwesome5 name={passwordVisible ? 'eye-slash' : 'eye'} size={20} color="#555" />
          </TouchableOpacity>
        </View>

        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, styles.inputComLibras, styles.inputSenha]}
            placeholder="Confirmar senha"
            placeholderTextColor="#888"
            secureTextEntry={!confirmPasswordVisible}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <LibrasSignButton
            sinal="confirmarSenha"
            tamanho={38}
            estilo={styles.librasNoCampo}
          />
          <TouchableOpacity style={styles.eyeButton} onPress={toggleConfirmPasswordVisibility}>
            <FontAwesome5 name={confirmPasswordVisible ? 'eye-slash' : 'eye'} size={20} color="#555" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.buttonContainer}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Cadastrar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/auth/login')}>
          <Text style={styles.linkText}>Já tem uma conta? Faça login</Text>
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
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#7B3E52',
    fontFamily: 'SpaceMono',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
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
  inputSenha: {
    paddingRight: 48,
  },
  librasNoCampo: {
    position: 'absolute',
    left: 6,
    top: 6,
  },
  passwordContainer: {
    width: '100%',
    marginBottom: 15,
    position: 'relative',
    height: 50,
  },
  eyeButton: {
    position: 'absolute',
    right: 8,
    top: 7,
    padding: 5,
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
  },
});