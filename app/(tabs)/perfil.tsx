import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { useAuth } from '@/components/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, View } from '@/components/Themed';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons';

import { db } from '@/src/services/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default function PerfilScreen() {
  const { user, logout } = useAuth();
  const insets = useSafeAreaInsets();
  
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [nickname, setNickname] = useState('');
  const [fotoPerfil, setFotoPerfil] = useState('');
  const [progressoModulos, setProgressoModulos] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  const [progressoTotal, setProgressoTotal] = useState(0);

  useEffect(() => {
    async function carregarDadosUsuario() {
      if (user?.uid) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const data = userDoc.data();
            setNome(data.nome || data.displayName || user.displayName || '');
            setSobrenome(data.sobrenome || data.surname || '');
            setNickname(data.nickname || '');
            
            if (data.fotoPerfil) {
              setFotoPerfil(data.fotoPerfil);
            }
          }
        } catch (error) {
          console.error("Erro ao buscar dados do usuário:", error);
        }
      }
    }

    carregarDadosUsuario();
  }, [user?.uid]);

  const escolherFoto = async () => {
    try {
      const result = await launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (result.canceled) {
        return;
      }

      const uri = result.assets[0].uri;
      setFotoPerfil(uri);

      if (user?.uid) {
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, {
          fotoPerfil: uri,
        });
        
        Alert.alert("Sucesso", "Foto de perfil atualizada!");
      }
    } catch (error) {
      console.error("Erro ao selecionar ou salvar foto:", error);
      Alert.alert("Erro", "Não foi possível atualizar a foto.");
    }
  };

  const logoutUser = () => {
    logout();
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
          <TouchableOpacity onPress={escolherFoto} activeOpacity={0.8}>
            <View style={styles.fotoPerfilContainer}>
            <Image
              source={
                fotoPerfil && fotoPerfil.length > 0 
                  ? { uri: fotoPerfil } 
                  : require('@/assets/images/librica-icon.png')
              }
              style={styles.fotoPerfil}
              resizeMode="cover"
            />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={escolherFoto}>
            <Text style={styles.adicionarFoto}>+ Adicionar foto</Text>
          </TouchableOpacity>
        </View>

        {/* Nome e Nickname */}
        <View style={styles.dadosUsuario}>
          <Text style={styles.label}>Nome</Text>
          <Text style={styles.valorUsuario}>{nome || 'Não informado'}</Text>
          
          <Text style={styles.label}>Sobrenome</Text>
          <Text style={styles.valorUsuario}>{sobrenome || 'Não informado'}</Text>
          
          <Text style={styles.label}>Nickname</Text>
          <Text style={styles.valorUsuario}>{nickname || 'Não informado'}</Text>
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