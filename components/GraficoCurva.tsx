import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { CurvaTipo } from '@/src/data/graficos';

// Mesmo desenho das curvas, mas só com Views (sem lib nativa: o APK
// atual continua valendo, sem precisar de rebuild).
const ESPACO_X = 320;
const ESPACO_Y = 230;
const ALTURA = 230;
const OX = 36;
const OY = 196;
const COR_EIXO = '#78909c';
const COR_CURVA = '#512da8';

/** Pontos (x, y) da curva de aquecimento de cada tipo. */
const PONTOS: Record<CurvaTipo, string> = {
  // 2 patamares (fusão + ebulição).
  substancia: '36,196 92,146 152,146 202,96 252,96 288,56',
  // Sem patamares, só mudanças de inclinação.
  comum: '36,196 82,156 142,134 192,102 242,80 288,44',
  // 1 patamar na fusão.
  eutetica: '36,196 92,146 152,146 212,90 244,72 288,40',
  // 1 patamar na ebulição.
  azeotropica: '36,196 82,156 124,134 174,98 234,98 288,48',
};

interface Ponto {
  x: number;
  y: number;
}

interface GraficoCurvaProps {
  curva: CurvaTipo;
}

/** Curva de aquecimento (Temperatura × Tempo) desenhada só com Views. */
export default function GraficoCurva({ curva }: GraficoCurvaProps) {
  const [largura, setLargura] = useState<number>(0);

  const pontos: Ponto[] = PONTOS[curva].split(' ').map((p) => {
    const [x, y] = p.split(',').map(Number);
    return { x, y };
  });
  const sx = largura / ESPACO_X;
  const sy = ALTURA / ESPACO_Y;
  const px = (v: number) => v * sx;
  const py = (v: number) => v * sy;

  function segmento(a: Ponto, b: Ponto, key: number) {
    const x1 = px(a.x);
    const y1 = py(a.y);
    const x2 = px(b.x);
    const y2 = py(b.y);
    const comp = Math.hypot(x2 - x1, y2 - y1);
    const ang = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    return (
      <View
        key={key}
        style={[
          styles.segmento,
          {
            width: comp + 4,
            left: mx - comp / 2 - 2,
            top: my - 2,
            transform: [{ rotate: `${ang}deg` }],
          },
        ]}
      />
    );
  }

  return (
    <View
      style={styles.box}
      onLayout={(e) => setLargura(e.nativeEvent.layout.width)}
    >
      {largura > 0 && (
        <>
          {/* Eixos */}
          <View style={[styles.eixoX, { top: py(OY) }]} />
          <View style={[styles.eixoY, { left: px(OX), height: py(OY) - 8 }]} />
          <Text style={[styles.rotuloTempo, { top: py(OY) + 4 }]}>tempo</Text>
          <Text style={styles.rotuloT}>T</Text>
          {/* Segmentos da curva */}
          {pontos.slice(0, -1).map((p, i) => segmento(p, pontos[i + 1], i))}
          {/* Bolinhas nos vértices (onde o comportamento muda) */}
          {pontos.slice(1, -1).map((p, i) => (
            <View
              key={`v-${i}`}
              style={[styles.vertice, { left: px(p.x) - 5, top: py(p.y) - 5 }]}
            />
          ))}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    width: '100%',
    height: ALTURA,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#e6c687',
  },
  segmento: {
    position: 'absolute',
    height: 4,
    borderRadius: 2,
    backgroundColor: COR_CURVA,
  },
  vertice: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    borderWidth: 2.5,
    borderColor: COR_CURVA,
  },
  eixoX: {
    position: 'absolute',
    left: 8,
    right: 8,
    height: 2,
    backgroundColor: COR_EIXO,
  },
  eixoY: {
    position: 'absolute',
    top: 8,
    width: 2,
    backgroundColor: COR_EIXO,
  },
  rotuloTempo: {
    position: 'absolute',
    right: 12,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#5a3d40',
  },
  rotuloT: {
    position: 'absolute',
    left: 10,
    top: 8,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#5a3d40',
  },
});
