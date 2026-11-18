import React, { useEffect, useRef } from 'react';
import {
  Keyboard,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import {
  ChaveSinalNavegacao,
  getSinalNavegacaoRotulo,
  getSinalNavegacaoUrl,
} from '@/src/services/sinaisNavegacao';
import {
  ChaveSinalEnunciado,
  SINAIS_ENUNCIADOS,
  getSinalEnunciadoRotulo,
  getSinalEnunciadoUrl,
} from '@/src/services/sinaisEnunciados';
import {
  esconderPreviewSinal,
  lerPreviewSinal,
  mostrarPreviewSinal,
  usePreviewSinal,
} from '@/src/services/sinalPreviewStore';

/** Tom claro e discreto para não competir com o conteúdo dos campos. */
const COR_PADRAO = 'rgba(216, 195, 176, 0.54)';
const COR_ATIVA = '#7B3E52';

type ChaveSinal = ChaveSinalNavegacao | ChaveSinalEnunciado;

/** Sinais de enunciados/exercícios usam vídeos 16:9; os de navegação, 3:4. */
function ehSinalEnunciado(chave: ChaveSinal): chave is ChaveSinalEnunciado {
  return Object.prototype.hasOwnProperty.call(SINAIS_ENUNCIADOS, chave);
}

interface LibrasSignButtonProps {
  /**
   * Qual vídeo de sinal abrir. Veja src/services/sinaisNavegacao.ts (telas de
   * navegação) e src/services/sinaisEnunciados.ts (enunciados dos exercícios).
   */
  sinal: ChaveSinal;
  /** Texto mostrado no título da janelinha. Padrão: rótulo do sinal. */
  rotulo?: string;
  /** Cor do ícone. Padrão: tom discreto do app. */
  cor?: string;
  /** Lado da área tocável, em px. Padrão: 40. */
  tamanho?: number;
  /** Tamanho do ícone, em px. Padrão: metade da área tocável. */
  iconeTamanho?: number;
  /**
   * Proporção do vídeo na janelinha. Padrão: 16:9 deitado para enunciados
   * e 3:4 retrato para os sinais de navegação (login, cadastro etc.).
   */
  proporcao?: '16:9' | '9:16' | '3:4';
  /** Estilo extra do botão (posição, margem etc.). */
  estilo?: StyleProp<ViewStyle>;
  /**
   * Conteúdo opcional para usar como gatilho no lugar do ícone padrão
   * (ex.: o badge "Vídeo & Atividade" dos módulos).
   */
  children?: React.ReactNode;
}

/**
 * Ícone de Libras que abre o vídeo do sinal numa janelinha flutuante,
 * exatamente como a prévia dos sinais do Dicionário: sem fundo escuro e
 * sem tirar o usuário da tela. Toque fora da janelinha para fechar.
 *
 * O desenho da janelinha fica no `SinalPreviewOverlay` global; aqui só
 * publicamos qual sinal deve aparecer e onde o ícone está na tela.
 */
export default function LibrasSignButton({
  sinal,
  rotulo,
  cor = COR_PADRAO,
  tamanho = 40,
  iconeTamanho,
  proporcao,
  estilo,
  children,
}: LibrasSignButtonProps) {
  const marcadorRef = useRef<View | null>(null);
  const previa = usePreviewSinal();

  const enunciado = ehSinalEnunciado(sinal);
  const rotuloFinal =
    rotulo ??
    (enunciado
      ? getSinalEnunciadoRotulo(sinal)
      : getSinalNavegacaoRotulo(sinal as ChaveSinalNavegacao));
  const videoUrl = enunciado
    ? getSinalEnunciadoUrl(sinal)
    : getSinalNavegacaoUrl(sinal as ChaveSinalNavegacao);
  const proporcaoFinal = proporcao ?? (enunciado ? '16:9' : '3:4');
  const ativo = previa?.titulo === rotuloFinal;
  const tamanhoIcone = iconeTamanho ?? Math.round(tamanho / 2);
  const temConteudo = React.Children.count(children) > 0;

  // Ao sair da tela (ex.: login -> cadastro), fecha a janelinha.
  useEffect(() => {
    return () => {
      esconderPreviewSinal(rotuloFinal);
    };
  }, [rotuloFinal]);

  const alternar = (): void => {
    if (ativo) {
      esconderPreviewSinal(rotuloFinal);
      return;
    }

    // O teclado aberto esconderia a janelinha dos campos.
    Keyboard.dismiss();

    const payload = {
      titulo: rotuloFinal,
      videoUrl,
      corTema: COR_ATIVA,
      ancora: null,
      lado: 'direita' as const,
      abreParaBaixo: false,
      proporcao: proporcaoFinal,
    };

    // Publica já no toque para fechar a janelinha de outro sinal.
    mostrarPreviewSinal(payload);

    // Na próxima pintura o ícone já está na posição final: mede e ancora
    // a janelinha pertinho dele (se falhar, o overlay centraliza).
    requestAnimationFrame(() => {
      try {
        marcadorRef.current?.measureInWindow((x, y, largura, altura) => {
          // Se a janelinha já foi fechada (toque fora) antes da medição
          // terminar, não reabre.
          if (lerPreviewSinal()?.titulo !== rotuloFinal) return;
          if (
            typeof x === 'number' &&
            typeof y === 'number' &&
            x > -10000 &&
            y > -10000
          ) {
            mostrarPreviewSinal({
              ...payload,
              ancora: { x, y, largura, altura },
            });
          }
        });
      } catch {
        // Mantém a janelinha centralizada.
      }
    });
  };

  return (
    <Pressable
      ref={marcadorRef}
      onPress={(event) => {
        // Evita que o card do módulo (TouchableOpacity pai) navegue junto.
        event.stopPropagation?.();
        alternar();
      }}
      hitSlop={6}
      style={({ pressed }) => [
        styles.botao,
        !temConteudo && { width: tamanho, height: tamanho },
        { opacity: pressed ? 0.45 : 1 },
        estilo,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Ver o sinal em Libras: ${rotuloFinal}`}
      accessibilityHint="Abre uma janelinha com o vídeo do sinal em Libras"
      accessibilityState={{ expanded: ativo }}
    >
      {temConteudo ? (
        children
      ) : (
        <FontAwesome5
          name="sign-language"
          size={tamanhoIcone}
          color={ativo ? COR_ATIVA : cor}
          solid
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  botao: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
});
