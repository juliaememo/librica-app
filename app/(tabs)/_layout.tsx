import { Tabs } from 'expo-router';
import React from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  // Com a barra nativa oculta (imersiva), o menu do app desce até a borda.
  // Usa só o inset real do sistema + respiro mínimo de 8px (múltiplo de 4/8).
  const bottomInset = Math.max(insets.bottom, 8);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#7B3E52',
        tabBarInactiveTintColor: '#8c7b7d',
        headerShown: false,
        tabBarShowLabel: false,
        headerStyle: { backgroundColor: '#fbf9f5' },
        tabBarStyle: {
          backgroundColor: '#fbf9f5',
          borderTopColor: '#e2d9cd',
          borderTopWidth: 1,
          height: 56 + bottomInset,
          paddingBottom: bottomInset,
          paddingTop: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarAccessibilityLabel: 'Início',
          headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesome5 name="home" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="dicionario"
        options={{
          title: 'Dicionário',
          tabBarAccessibilityLabel: 'Dicionário',
          headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesome5 name="book" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarAccessibilityLabel: 'Perfil',
          headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesome5 name="user" size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}