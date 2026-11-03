import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, Animated, StyleSheet, Text, View } from 'react-native';

import BrandLogo from '../components/BrandLogo';

/**
 * Tela mostrada enquanto as fontes e os recursos do app carregam,
 * logo depois do splash nativo (definido em app.json).
 *
 * Importante: esta tela aparece ANTES das fontes Gabarito estarem
 * disponíveis, por isso o texto aqui usa a fonte do sistema (fontWeight)
 * em vez de fontFamily — senão o título não renderizaria no Android.
 */
export default function SplashScreenComponent() {
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 450,
      useNativeDriver: true,
    }).start();
  }, [fade]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.contentContainer, { opacity: fade }]}>
        <BrandLogo size={120} />
        <Text style={styles.title}>LIBRICA</Text>
        <Text style={styles.subtitle}>Aprendendo Química em Libras</Text>
      </Animated.View>

      <ActivityIndicator
        size="small"
        color="#7B3E52"
        style={styles.loader}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Mesma cor do splash nativo e do app: a transição não "pisca".
    backgroundColor: '#fbf9f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    alignItems: 'center',
  },
  title: {
    marginTop: 18,
    fontSize: 44,
    fontWeight: '900',
    color: '#7B3E52',
    letterSpacing: 1,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: '600',
    color: '#8c7b7d',
    letterSpacing: 0.5,
  },
  loader: {
    position: 'absolute',
    bottom: 64,
  },
});
