import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../components/AuthContext';

const RESEND_COOLDOWN_SECONDS = 60;

interface VerifyEmailState {
  checking: boolean;
  resending: boolean;
  cooldown: number;
  errorMessage: string | null;
}

export default function VerifyEmailScreen(): React.JSX.Element {
  const router = useRouter();
  const { user, refreshUser, sendVerificationEmail, logout } = useAuth();
  const [state, setState] = useState<VerifyEmailState>({
    checking: false,
    resending: false,
    cooldown: 0,
    errorMessage: null,
  });

  useEffect(() => {
    if (state.cooldown <= 0) return;
    const timer = setTimeout(() => {
      setState((prev) => ({ ...prev, cooldown: prev.cooldown - 1 }));
    }, 1000);
    return () => clearTimeout(timer);
  }, [state.cooldown]);

  useEffect(() => {
    // Sem usuário na sessão, volta para o login.
    if (user === null) return;
  }, [user]);

  const handleAlreadyVerified = async (): Promise<void> => {
    setState((prev) => ({ ...prev, checking: true, errorMessage: null }));
    try {
      const verified = await refreshUser();
      if (verified) {
        router.replace('/(tabs)');
      } else {
        setState((prev) => ({
          ...prev,
          errorMessage:
            'Ainda não identificamos a confirmação. Abra o link enviado ao seu e-mail e toque de novo em "Já confirmei".',
        }));
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Não foi possível verificar agora.';
      setState((prev) => ({ ...prev, errorMessage: message }));
    } finally {
      setState((prev) => ({ ...prev, checking: false }));
    }
  };

  const handleResend = async (): Promise<void> => {
    if (state.cooldown > 0) return;
    setState((prev) => ({ ...prev, resending: true, errorMessage: null }));
    try {
      await sendVerificationEmail();
      setState((prev) => ({ ...prev, cooldown: RESEND_COOLDOWN_SECONDS }));
      Alert.alert('E-mail reenviado', 'Confira sua caixa de entrada e também o spam.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Não foi possível reenviar.';
      setState((prev) => ({ ...prev, errorMessage: message }));
    } finally {
      setState((prev) => ({ ...prev, resending: false }));
    }
  };

  const handleLogout = async (): Promise<void> => {
    try {
      await logout();
      router.replace('/auth/login');
    } catch {
      router.replace('/auth/login');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <FontAwesome5 name="envelope-open-text" size={32} color="#7B3E52" />
      </View>
      <Text style={styles.title}>Confirme seu e-mail</Text>
      <Text style={styles.subtitle}>
        Enviamos um link de confirmação para{'\n'}
        <Text style={styles.email}>{user?.email ?? 'seu e-mail'}</Text>
      </Text>
      <Text style={styles.hint}>
        Essa verificação acontece uma única vez, só no cadastro, para garantir que o
        e-mail é válido e pertence a você. Abra o link no mesmo aparelho ou depois
        volte aqui e toque em “Já confirmei”.
      </Text>

      {state.errorMessage ? (
        <View style={styles.errorBox} accessibilityRole="alert">
          <Text style={styles.errorText}>{state.errorMessage}</Text>
        </View>
      ) : null}

      <TouchableOpacity
        style={[styles.buttonContainer, state.checking && styles.buttonDisabled]}
        onPress={handleAlreadyVerified}
        disabled={state.checking}
        accessibilityRole="button"
        accessibilityLabel="Já confirmei meu e-mail"
      >
        {state.checking ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>Já confirmei</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.secondaryButton,
          (state.resending || state.cooldown > 0) && styles.buttonDisabled,
        ]}
        onPress={handleResend}
        disabled={state.resending || state.cooldown > 0}
        accessibilityRole="button"
        accessibilityLabel="Reenviar e-mail de confirmação"
      >
        {state.resending ? (
          <ActivityIndicator color="#7B3E52" />
        ) : (
          <Text style={styles.secondaryBtnText}>
            {state.cooldown > 0
              ? `Reenviar em ${state.cooldown}s`
              : 'Reenviar e-mail'}
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogout} accessibilityRole="button">
        <Text style={styles.linkText}>Sair / usar outro e-mail</Text>
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
    marginBottom: 12,
    textAlign: 'center',
    lineHeight: 22,
  },
  email: {
    fontWeight: 'bold',
    color: '#5a3d40',
  },
  hint: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
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
  secondaryButton: {
    width: '100%',
    minHeight: 52,
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#7B3E52',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryBtnText: {
    color: '#7B3E52',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkText: {
    color: '#7B3E52',
    marginTop: 20,
    fontSize: 14,
  },
});
