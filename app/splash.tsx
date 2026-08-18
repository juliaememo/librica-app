import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function SplashScreenComponent() {
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Image
          source={require('../assets/images/librica-icon.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>LIBRICA</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontFamily: 'SpaceMono',
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
});