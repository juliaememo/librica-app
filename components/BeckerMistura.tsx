import React, { forwardRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import IngredienteDesenho from '@/components/IngredienteDesenho';
import { getIngredienteById, type IngredienteId } from '@/src/data/misturas';

interface BeckerMisturaProps {
  colocados: IngredienteId[];
  capacidade: number;
  onRemover: (indice: number) => void;
  /** Destaca o béquer enquanto um ingrediente está sobre ele. */
  destacado?: boolean;
  /** Mostra o líquido em 2 camadas (mistura heterogênea de 2 fases). */
  duasCamadas?: boolean;
}

const LARGURA_BECKER = 150;
const ALTURA_BECKER = 170;

/**
 * Béquer da mistura desenhado com Views + lista lateral dos ingredientes
 * colocados. O nível sobe a cada ingrediente; com 2 fases, o líquido
 * aparece em 2 camadas separadas.
 */
const BeckerMistura = forwardRef<View, BeckerMisturaProps>(function BeckerMistura(
  { colocados, capacidade, onRemover, destacado = false, duasCamadas = false },
  ref,
) {
  const nivel = Math.min(colocados.length / Math.max(capacidade, 1), 1);

  return (
    <View style={styles.linha}>
      {/* Béquer (zona de drop — o pai mede via `ref`). */}
      <View
        ref={ref}
        collapsable={false}
        style={[styles.beckerWrap, destacado && styles.beckerDestacado]}
        accessibilityRole="none"
        accessibilityLabel={`Béquer com ${colocados.length} ingredientes`}
      >
        {/* Borda superior (boca do béquer). */}
        <View style={styles.boca} />
        <View style={styles.copo}>
          {nivel > 0 && (
            duasCamadas ? (
              <View style={[styles.liquidoDuas, { height: `${Math.round(nivel * 100)}%` }]}>
                <View style={styles.camadaOleo} />
                <View style={styles.camadaAgua} />
              </View>
            ) : (
              <View style={[styles.liquido, { height: `${Math.round(nivel * 100)}%` }]}>
                <View style={styles.onda} />
              </View>
            )
          )}
          <View style={styles.marcas}>
            <View style={styles.marca} />
            <View style={styles.marca} />
            <View style={styles.marca} />
          </View>
          <Text style={styles.contador}>
            {colocados.length}/{capacidade}
          </Text>
        </View>
      </View>

      {/* Lado do béquer: ingredientes colocados. */}
      <View style={styles.lado}>
        <Text style={styles.ladoTitulo}>No béquer</Text>
        {colocados.length === 0 ? (
          <View style={styles.ladoVazio}>
            <FontAwesome name="arrow-left" size={14} color="#8c7b7d" />
            <Text style={styles.ladoVazioTexto}>Arraste{'\n'}para cá</Text>
          </View>
        ) : (
          colocados.map((id, indice) => {
            const ingrediente = getIngredienteById(id);
            return (
              <View
                key={`${id}-${indice}`}
                style={[styles.chip, { borderColor: ingrediente.corTema, backgroundColor: ingrediente.corFundo }]}
              >
                <View style={styles.chipMini}>
                  <View style={styles.chipMiniEscala}>
                    <IngredienteDesenho id={ingrediente.id} />
                  </View>
                </View>
                <Text style={[styles.chipTexto, { color: ingrediente.corTema }]} numberOfLines={1}>
                  {ingrediente.nome}
                </Text>
                <Pressable
                  onPress={() => onRemover(indice)}
                  hitSlop={8}
                  style={styles.chipRemover}
                  accessibilityRole="button"
                  accessibilityLabel={`Retirar ${ingrediente.nome} do béquer`}
                >
                  <FontAwesome name="times" size={14} color="#7B3E52" />
                </Pressable>
              </View>
            );
          })
        )}
      </View>
    </View>
  );
});

export default BeckerMistura;

const styles = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    width: '100%',
  },
  beckerWrap: {
    width: LARGURA_BECKER,
    alignItems: 'center',
    borderRadius: 12,
    padding: 6,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  beckerDestacado: {
    borderColor: '#00796b',
    backgroundColor: '#e0f2f1',
  },
  boca: {
    width: LARGURA_BECKER - 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#cfd8dc',
    borderWidth: 1.5,
    borderColor: '#90a4ae',
    zIndex: 2,
  },
  copo: {
    width: LARGURA_BECKER - 20,
    height: ALTURA_BECKER,
    marginTop: -4,
    borderLeftWidth: 3,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderColor: '#90a4ae',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    backgroundColor: '#f5fbfd',
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  liquido: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#b3e5fc',
    borderTopWidth: 2,
    borderTopColor: '#4fc3f7',
  },
  onda: {
    height: 8,
    backgroundColor: '#e1f5fe',
    opacity: 0.7,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  liquidoDuas: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 2,
    borderTopColor: '#f9a825',
  },
  camadaOleo: {
    flex: 1,
    backgroundColor: '#ffe082',
    opacity: 0.9,
  },
  camadaAgua: {
    flex: 1,
    backgroundColor: '#b3e5fc',
  },
  marcas: {
    position: 'absolute',
    right: 8,
    top: 16,
    gap: 22,
  },
  marca: {
    width: 22,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#90a4ae',
    opacity: 0.7,
  },
  contador: {
    alignSelf: 'center',
    marginBottom: 10,
    fontSize: 13,
    fontWeight: '700',
    color: '#455a64',
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    overflow: 'hidden',
  },
  lado: {
    minWidth: 140,
    maxWidth: 170,
    gap: 8,
  },
  ladoTitulo: {
    fontSize: 13,
    fontWeight: '700',
    color: '#5a3d40',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  ladoVazio: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#c9bebb',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fff',
  },
  ladoVazioTexto: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8c7b7d',
    textAlign: 'center',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
  },
  chipMini: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  chipMiniEscala: {
    transform: [{ scale: 0.45 }],
  },
  chipTexto: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
  },
  chipRemover: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
});
