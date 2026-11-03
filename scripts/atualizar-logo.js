/**
 * Gera `assets/images/librica-splash.png`: a logo com margem de segurança,
 * para não ser cortada pelo recorte circular do Android 12+.
 *
 * Rode sempre que trocar `assets/images/librica-icon.png`:
 *   npm run logo
 *
 * O que ele faz:
 *  1. lê a logo original (librica-icon.png);
 *  2. encaixa ela em 2/3 de um canvas quadrado transparente de 1024x1024;
 *  3. salva como librica-splash.png.
 *
 * Esse resultado é usado no splash e no ícone adaptativo (app.json).
 * A tela inicial e o login continuam usando a logo cheia, sem margem.
 */
const fs = require('fs');
const path = require('path');
const Jimp = require('jimp-compact');

const RAIZ = path.resolve(__dirname, '..');
const ORIGEM = path.join(RAIZ, 'assets', 'images', 'librica-icon.png');
const DESTINO = path.join(RAIZ, 'assets', 'images', 'librica-splash.png');

const CANVAS = 1024;
/**
 * O Android 12+ desenha o ícone do splash / ícone adaptativo dentro de um
 * círculo de 2/3 do quadrado. Tudo que passar disso é cortado, então a
 * arte fica nesse limite (igual à área segura de 72dp em 108dp).
 */
const AREA_SEGURA = 2 / 3;

async function main() {
  if (!fs.existsSync(ORIGEM)) {
    throw new Error(`Logo não encontrada em ${ORIGEM}`);
  }

  const limite = Math.round(CANVAS * AREA_SEGURA);

  const logo = await Jimp.read(ORIGEM);
  // Mantém a proporção: a logo inteira cabe dentro do quadrado seguro.
  const escala = Math.min(limite / logo.bitmap.width, limite / logo.bitmap.height);
  logo.resize(
    Math.round(logo.bitmap.width * escala),
    Math.round(logo.bitmap.height * escala),
    Jimp.RESIZE_BICUBIC,
  );

  const canvas = await new Jimp(CANVAS, CANVAS, 0x00000000);
  canvas.composite(
    logo,
    Math.round((CANVAS - logo.bitmap.width) / 2),
    Math.round((CANVAS - logo.bitmap.height) / 2),
  );

  const png = await canvas.getBufferAsync(Jimp.MIME_PNG);
  fs.writeFileSync(DESTINO, png);

  console.log(`librica-splash.png gerado (${CANVAS}x${CANVAS}, arte em ${limite}px)`);
  console.log('\nAgora rode `npx expo prebuild --platform android` e recompile o app.');
}

main().catch((erro) => {
  console.error(erro);
  process.exit(1);
});
