import React, { useState, useCallback } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator, TextInput } from 'react-native';
import { useAuth } from '@/components/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Text, View } from '@/components/Themed';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons';

import { db } from '@/src/services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { calcularProgressoModulos, calcularProgressoTotal } from '@/src/services/progresso';
import {
  NicknameEmUsoError,
  nicknameKey,
  trocarNickname,
  validarFormatoNickname,
} from '@/src/services/nickname';

/**
 * Sem Storage (pago): a foto viaja como base64 dentro do próprio Firestore.
 * Vale `data:image/...` (novo) e `https://` (compatível). URI local
 * (file://) só existe no aparelho que escolheu e é descartada.
 */
function fotoRemotaValida(valor: unknown): string {
  if (typeof valor !== 'string' || valor.length === 0) return '';
  if (valor.startsWith('data:image/')) return valor;
  if (valor.startsWith('https://') || valor.startsWith('http://')) return valor;
  return '';
}

/** Teto de segurança: documento do Firestore tem limite de 1 MiB. */
const LIMITE_FOTO_BASE64 = 700_000;

const MSG_NICKNAME_EM_USO = 'Esse nickname já está em uso. Escolha outro.';

interface DadosEdicao {
  nome: string;
  sobrenome: string;
  nickname: string;
}

function validarDadosEdicao(dados: DadosEdicao): string | null {
  if (dados.nome.length < 2) return 'Digite um nome com pelo menos 2 letras.';
  if (dados.nome.length > 40) return 'Nome muito longo (máx. 40 caracteres).';
  if (dados.sobrenome.length > 40) return 'Sobrenome muito longo (máx. 40 caracteres).';
  return validarFormatoNickname(dados.nickname);
}

export default function PerfilScreen() {
  const { user, logout } = useAuth();
  const insets = useSafeAreaInsets();
  
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [nickname, setNickname] = useState('');
  const [fotoPerfil, setFotoPerfil] = useState('');
  const [enviandoFoto, setEnviandoFoto] = useState(false);
  const [editando, setEditando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erroEdicao, setErroEdicao] = useState<string | null>(null);
  const [draftNome, setDraftNome] = useState('');
  const [draftSobrenome, setDraftSobrenome] = useState('');
  const [draftNickname, setDraftNickname] = useState('');
  const [progressoModulos, setProgressoModulos] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  const [progressoTotal, setProgressoTotal] = useState(0);

  // Recarrega ao focar a aba: o progresso muda ao ver vídeos e concluir
  // exercícios, então o perfil precisa refletir a volta dessas telas.
  useFocusEffect(
    useCallback(() => {
      // Reseta ao trocar de conta para não vazar dados da sessão anterior.
      setFotoPerfil('');
      async function carregarDadosUsuario() {
        if (user?.uid) {
          try {
            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
              const data = userDoc.data();
              const nomeAtual = data.nome || data.displayName || user.displayName || '';
              const sobrenomeAtual = data.sobrenome || data.surname || '';
              const nicknameAtual = data.nickname || '';
              setNome(nomeAtual);
              setSobrenome(sobrenomeAtual);
              setNickname(nicknameAtual);
              setDraftNome(nomeAtual);
              setDraftSobrenome(sobrenomeAtual);
              setDraftNickname(nicknameAtual);

              // Só URL pública aparece em outro aparelho. Valor legado
              // (file://) é ignorado e limpo para não quebrar a imagem.
              const remota = fotoRemotaValida(data.fotoPerfil);
              setFotoPerfil(remota);
              if (data.fotoPerfil && !remota) {
                setDoc(userDocRef, { fotoPerfil: '' }, { merge: true }).catch(() => {});
              }

              // Progresso: vídeo = 50% + exercícios = 50% (por etapa).
              const modulos = calcularProgressoModulos(data);
              setProgressoModulos(modulos);
              setProgressoTotal(calcularProgressoTotal(modulos));
            } else if (user?.uid) {
              // Conta existe no Auth mas sem doc no Firestore (ex: criada antes
              // do salvamento em 'users' ou via console). Cria a base com merge
              // para as próximas escritas não falharem com "No document to update".
              const nomeAuth = user.displayName || '';
              setNome(nomeAuth);
              setSobrenome('');
              setNickname('');
              setDraftNome(nomeAuth);
              setDraftSobrenome('');
              setDraftNickname('');
              setDoc(
                userDocRef,
                {
                  uid: user.uid,
                  email: user.email ?? '',
                  nome: nomeAuth,
                  displayName: nomeAuth,
                  sobrenome: '',
                  nickname: '',
                  fotoPerfil: '',
                  emailVerified: user.emailVerified ?? false,
                  createdAt: new Date().toISOString(),
                },
                { merge: true },
              ).catch(() => {});
            }
          } catch (error) {
            console.error("Erro ao buscar dados do usuário:", error);
          }
        }
      }

      carregarDadosUsuario();
    }, [user?.uid]),
  );

  const escolherFoto = async () => {
    if (enviandoFoto) return;
    if (!user?.uid) {
      Alert.alert("Erro", "Entre na sua conta antes de trocar a foto.");
      return;
    }
    try {
      const result = await launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.4,
        base64: true,
        exif: false,
      });

      if (result.canceled) {
        return;
      }

      const base64 = result.assets[0].base64;
      if (!base64) {
        Alert.alert("Erro", "Não foi possível ler a imagem. Tente outra foto.");
        return;
      }
      const fotoDataUrl = `data:image/jpeg;base64,${base64}`;
      if (fotoDataUrl.length > LIMITE_FOTO_BASE64) {
        Alert.alert(
          "Foto muito grande",
          "Escolha uma imagem menor para usar como foto de perfil.",
        );
        return;
      }
      setEnviandoFoto(true);

      // Sem Storage: salva o base64 no próprio Firestore, assim a foto
      // aparece em qualquer aparelho logado na mesma conta.
      // setDoc com merge cria o doc se ele ainda não existir (conta antiga).
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(
        userDocRef,
        {
          uid: user.uid,
          email: user.email ?? '',
          fotoPerfil: fotoDataUrl,
        },
        { merge: true },
      );
      setFotoPerfil(fotoDataUrl);

      Alert.alert("Sucesso", "Foto de perfil atualizada!");
    } catch (error) {
      console.error("Erro ao selecionar ou salvar foto:", error);
      Alert.alert("Erro", "Não foi possível atualizar a foto.");
    } finally {
      setEnviandoFoto(false);
    }
  };

  const logoutUser = () => {
    logout();
  };

  const iniciarEdicao = (): void => {
    setDraftNome(nome);
    setDraftSobrenome(sobrenome);
    setDraftNickname(nickname);
    setErroEdicao(null);
    setEditando(true);
  };

  const cancelarEdicao = (): void => {
    if (salvando) return;
    setDraftNome(nome);
    setDraftSobrenome(sobrenome);
    setDraftNickname(nickname);
    setErroEdicao(null);
    setEditando(false);
  };

  const salvarEdicao = async (): Promise<void> => {
    if (salvando) return;
    if (!user?.uid) {
      setErroEdicao('Entre na sua conta antes de editar o perfil.');
      return;
    }
    const dados: DadosEdicao = {
      nome: draftNome.trim(),
      sobrenome: draftSobrenome.trim(),
      nickname: draftNickname.trim(),
    };
    const erroValidacao = validarDadosEdicao(dados);
    if (erroValidacao) {
      setErroEdicao(erroValidacao);
      return;
    }
    setErroEdicao(null);
    setSalvando(true);
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const nicknameMudou = nicknameKey(dados.nickname) !== nicknameKey(nickname);
      if (nicknameMudou) {
        // Troca atômica: reserva o novo nickname e libera o antigo.
        // Se já estiver ocupado por outra conta, lança NicknameEmUsoError.
        // Se as regras ainda não foram publicadas, segue com checagem simples.
        try {
          await trocarNickname(user.uid, nickname, dados.nickname, user.email ?? null);
        } catch (trocaError: unknown) {
          if (trocaError instanceof NicknameEmUsoError) {
            throw trocaError;
          }
          const firestoreCode = (trocaError as { code?: string }).code ?? '';
          if (firestoreCode !== 'permission-denied') {
            throw trocaError;
          }
          console.warn(
            'Regras do Firestore sem coleção nicknames; salvando sem reserva atômica.',
          );
        }
      }
      // setDoc com merge cria o doc se ele ainda não existir (conta antiga
      // sem documento em 'users'), evitando "No document to update".
      await setDoc(
        userDocRef,
        {
          uid: user.uid,
          email: user.email ?? '',
          nome: dados.nome,
          displayName: dados.nome,
          sobrenome: dados.sobrenome,
          nickname: dados.nickname,
          nicknameLower: nicknameKey(dados.nickname),
        },
        { merge: true },
      );
      setNome(dados.nome);
      setSobrenome(dados.sobrenome);
      setNickname(dados.nickname);
      setEditando(false);
      Alert.alert('Sucesso', 'Dados atualizados!');
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      if (error instanceof NicknameEmUsoError) {
        setErroEdicao(MSG_NICKNAME_EM_USO);
      } else {
        setErroEdicao('Não foi possível salvar. Tente novamente.');
      }
    } finally {
      setSalvando(false);
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingTop: insets.top > 0 ? insets.top + 10 : 20 }
      ]}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Perfil</Text>
      </View>

      <View style={styles.perfilContent}>
        {/* Foto de perfil */}
        <View style={styles.fotoPerfilWrapper}>
          <TouchableOpacity onPress={escolherFoto} activeOpacity={0.8} disabled={enviandoFoto}>
            <View style={styles.fotoPerfilContainer}>
            {enviandoFoto ? (
              <ActivityIndicator size="large" color="#7B3E52" />
            ) : (
              <Image
                source={
                  fotoPerfil && fotoPerfil.length > 0 
                    ? { uri: fotoPerfil } 
                    : require('@/assets/images/librica-icon.png')
                }
                style={styles.fotoPerfil}
                resizeMode="cover"
              />
            )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={escolherFoto} disabled={enviandoFoto}>
            <Text style={styles.adicionarFoto}>
              {enviandoFoto ? 'Enviando foto…' : '+ Adicionar foto'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Nome, sobrenome e nickname */}
        <View style={styles.dadosUsuario}>
          <View style={styles.dadosHeader}>
            <Text style={styles.labelProgresso}>Dados pessoais</Text>
            {!editando ? (
              <TouchableOpacity
                style={styles.btnEditar}
                onPress={iniciarEdicao}
                accessibilityRole="button"
                accessibilityLabel="Editar nome, sobrenome e nickname"
              >
                <FontAwesome name="pencil" size={14} color="#7B3E52" style={{ marginRight: 6 }} />
                <Text style={styles.btnEditarTexto}>Editar</Text>
              </TouchableOpacity>
            ) : null}
          </View>

          {!editando ? (
            <>
              <Text style={styles.label}>Nome</Text>
              <Text style={styles.valorUsuario}>{nome || 'Não informado'}</Text>

              <Text style={styles.label}>Sobrenome</Text>
              <Text style={styles.valorUsuario}>{sobrenome || 'Não informado'}</Text>

              <Text style={styles.label}>Nickname</Text>
              <Text style={styles.valorUsuario}>{nickname || 'Não informado'}</Text>
            </>
          ) : (
            <>
              <Text style={styles.label}>Nome</Text>
              <TextInput
                style={styles.input}
                placeholder="Nome"
                placeholderTextColor="#888"
                value={draftNome}
                onChangeText={setDraftNome}
                maxLength={40}
                editable={!salvando}
              />

              <Text style={styles.label}>Sobrenome</Text>
              <TextInput
                style={styles.input}
                placeholder="Sobrenome"
                placeholderTextColor="#888"
                value={draftSobrenome}
                onChangeText={setDraftSobrenome}
                maxLength={40}
                editable={!salvando}
              />

              <Text style={styles.label}>Nickname</Text>
              <TextInput
                style={styles.input}
                placeholder="Nickname"
                placeholderTextColor="#888"
                autoCapitalize="none"
                value={draftNickname}
                onChangeText={setDraftNickname}
                maxLength={20}
                editable={!salvando}
              />

              {erroEdicao ? (
                <View style={styles.errorBox} accessibilityRole="alert">
                  <Text style={styles.errorText}>{erroEdicao}</Text>
                </View>
              ) : null}

              <View style={styles.botoesEdicao}>
                <TouchableOpacity
                  style={[styles.btnCancelar, salvando && styles.btnDesabilitado]}
                  onPress={cancelarEdicao}
                  disabled={salvando}
                  accessibilityRole="button"
                  accessibilityLabel="Cancelar edição"
                >
                  <Text style={styles.btnCancelarTexto}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btnSalvar, salvando && styles.btnDesabilitado]}
                  onPress={salvarEdicao}
                  disabled={salvando}
                  accessibilityRole="button"
                  accessibilityLabel="Salvar alterações"
                >
                  {salvando ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.btnSalvarTexto}>Salvar</Text>
                  )}
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        {/* Progresso */}
        <View style={styles.progressoContainer}>
          <Text style={styles.labelProgresso}>Progresso nos Módulos</Text>
          
          {progressoModulos.map((p, index) => (
            <View key={index} style={styles.barraProgressoItem}>
              <Text style={styles.textProgresso}>Módulo {index + 1}: {p}%</Text>
              <View style={styles.barraFundo}>
                <View style={[styles.barraPreenchida, { width: `${p}%` }]} />
              </View>
            </View>
          ))}

          <Text style={styles.textProgressoTotal}>Progresso Total: {progressoTotal}%</Text>
        </View>

        {/* Botão Logout */}
        <TouchableOpacity style={styles.btnLogout} onPress={logoutUser}>
          <FontAwesome name="sign-out" size={16} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.btnLogoutTexto}>Sair da conta</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbf9f5',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  headerContainer: {
    marginBottom: 16,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#5a3d40',
  },
  perfilContent: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#e6c687',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  fotoPerfilWrapper: {
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: 'transparent',
  },
  fotoPerfilContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#7B3E52',
  },
  fotoPerfil: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  adicionarFoto: {
    marginTop: 8,
    fontSize: 14,
    color: '#7B3E52',
    fontWeight: '600',
    textAlign: 'center',
  },
  dadosUsuario: {
    marginBottom: 20,
    backgroundColor: 'transparent',
  },
  label: {
    fontSize: 12,
    color: '#8c7b7d',
    marginBottom: 2,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  valorUsuario: {
    fontSize: 16,
    color: '#5a3d40',
    marginBottom: 12,
    fontWeight: 'bold',
  },
  dadosHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: 'transparent',
  },
  btnEditar: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    minWidth: 48,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#7B3E52',
    backgroundColor: '#fff',
  },
  btnEditarTexto: {
    color: '#7B3E52',
    fontSize: 14,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    minHeight: 48,
    backgroundColor: '#fbf9f5',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginTop: 4,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    color: '#5a3d40',
    fontSize: 16,
  },
  errorBox: {
    width: '100%',
    backgroundColor: '#fdecea',
    borderWidth: 1,
    borderColor: '#f5c6cb',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  errorText: {
    color: '#8a1f1f',
    fontSize: 14,
    textAlign: 'center',
  },
  botoesEdicao: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
    backgroundColor: 'transparent',
  },
  btnCancelar: {
    flex: 1,
    minHeight: 52,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#7B3E52',
    backgroundColor: '#fff',
    paddingVertical: 14,
  },
  btnCancelarTexto: {
    color: '#7B3E52',
    fontSize: 16,
    fontWeight: 'bold',
  },
  btnSalvar: {
    flex: 1,
    minHeight: 52,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7B3E52',
    paddingVertical: 14,
  },
  btnSalvarTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  btnDesabilitado: {
    opacity: 0.6,
  },
  progressoContainer: {
    marginBottom: 20,
    backgroundColor: 'transparent',
  },
  labelProgresso: {
    fontSize: 14,
    color: '#5a3d40',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  barraProgressoItem: {
    marginBottom: 8,
    backgroundColor: 'transparent',
  },
  textProgresso: {
    fontSize: 12,
    color: '#555',
    marginBottom: 2,
  },
  barraFundo: {
    height: 8,
    backgroundColor: '#eee',
    borderRadius: 4,
    width: '100%',
    overflow: 'hidden',
  },
  barraPreenchida: {
    height: 8,
    backgroundColor: '#7B3E52',
    borderRadius: 4,
  },
  textProgressoTotal: {
    fontSize: 14,
    color: '#5a3d40',
    fontWeight: 'bold',
    marginTop: 10,
  },
  btnLogout: {
    width: '100%',
    backgroundColor: '#d84315',
    padding: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  btnLogoutTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }, 
});