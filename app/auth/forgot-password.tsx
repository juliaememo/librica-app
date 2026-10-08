import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth, isEmailFormatoValido } from '../../components/AuthContext';

interface ForgotPasswordState {
  email: string;
  loading: boolean;
  errorMessage: string | null;
  success: boolean;
}

export default function ForgotPasswordScreen(): React.JSX.Element {
  const router = useRouter();
  const { resetPassword } = useAuth();
  const params = useLocalSearchParams<{ email?: string }>();
  const initialEmail = typeof params.email === 'string' ? params.email : '';
  const [state, setState] = useState<ForgotPasswordState>({
    email: initialEmail,
    loading: false,
    errorMessage: null,
    success: false,
  });

  const handleSend = async (): Promise<void> => {
    const normalizedEmail = state.email.trim().toLowerCase();
    if (!normalizedEmail) {
      setState((prev) => ({ ...prev, errorMessage: 'Digite seu e-mail.', success: false }));
      return;
    }
    if (!isEmailFormatoValido(normalizedEmail)) {
      setState((prev) => ({
        ...prev,
        errorMessage: 'E-mail inválido. Confira a digitação.',
        success: false,
      }));
      return;
    }
    setState((prev) => ({ ...prev, loading: true, errorMessage: null }));
    try {
      await resetPassword(normalizedEmail);
      setState((prev) => ({ ...prev, success: true }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Não foi possível enviar. Tente de novo.';
      setState((prev) => ({ ...prev, errorMessage: message, success: false }));
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <FontAwesome5 name="key" size={28} color="#7B3E52" />
      </View>
      <Text style={styles.title}>Esqueci minha senha</Text>
      {!state.success ? (
        <>
          <Text style={styles.subtitle}>
            Digite seu e-mail para receber o link de redefinição de senha.
          </Text>
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            placeholderTextColor="#888"
            autoCapitalize="none"
            keyboardType="email-address"
            value={state.email}
            onChangeText={(text) => setState((prev) => ({ ...prev, email: text }))}
          />
          {state.errorMessage ? (
            <View style={styles.errorBox} accessibilityRole="alert">
              <Text style={styles.errorText}>{state.errorMessage}</Text>
            </View>
          ) : null}
          <TouchableOpacity
            style={[styles.buttonContainer, state.loading && styles.buttonDisabled]}
            onPress={handleSend}
            disabled={state.loading}
            accessibilityRole="button"
            accessibilityLabel="Enviar link de redefinição"
          >
            {state.loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>Enviar link</Text>
            )}
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.successBox} accessibilityRole="alert">
          <FontAwesome5 name="check-circle" size={24} color="#2e7d32" style={styles.successIcon} />
          <Text style={styles.successTitle}>E-mail enviado!</Text>
          <Text style={styles.successText}>
            Se existir uma conta para{'\n'}
            <Text style={styles.email}>{state.email.trim()}</Text>
            {'\n'}você receberá o link de redefinição. Confira também o spam.
          </Text>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => router.replace('/auth/login')}
            accessibilityRole="button"
            accessibilityLabel="Voltar para o login"
          >
            <Text style={styles.btnText}>Voltar para o login</Text>
          </TouchableOpacity>
        </View>
      )}

      {!state.success ? (
        <TouchableOpacity onPress={() => router.back()} accessibilityRole="button">
          <Text style={styles.linkText}>Voltar para o login</Text>
        </TouchableOpacity>
      ) : null}
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
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5d9d3',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#7B3E52',
    fontFamily: 'SpaceMono',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 22,
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
  errorBox: {
    width: '100%',
    backgroundColor: '#fdecea',
    borderWidth: 1,
    borderColor: '#f5c6cb',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#8a1f1f',
    fontSize: 14,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    minHeight: 52,
    backgroundColor: '#7B3E52',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  successBox: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#c8e6c9',
  },
  successIcon: {
    marginBottom: 12,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 8,
  },
  successText: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  email: {
    fontWeight: 'bold',
    color: '#5a3d40',
  },
  linkText: {
    color: '#7B3E52',
    marginTop: 20,
    fontSize: 14,
  },
});
