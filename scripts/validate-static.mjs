import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const seed = readFileSync(join(root, 'src/content/seed.ts'), 'utf8');
const store = readFileSync(join(root, 'src/state/useAthanorStore.ts'), 'utf8');
const app = readFileSync(join(root, 'src/app/App.tsx'), 'utf8');

const required = [
  'proverb_listen_before_reply_01',
  'node_bible_proverbs',
  'node_hod',
  'node_aleph',
  'node_xun',
  'node_magician',
  'node_lamp',
  'item_clear_word_lamp_v1',
  'mission_word_before_response_v1'
];
for (const token of required) {
  const found = seed.includes(token) || store.includes(token) || app.includes(token);
  if (!found) throw new Error(`Token obrigatório ausente: ${token}`);
}

for (const fallback of ['node_language_chamber', 'node_breath_symbol', 'node_constancy', 'node_first_artisan']) {
  if (!seed.includes(fallback)) throw new Error(`Fallback ausente: ${fallback}`);
}

function collectFiles(directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? collectFiles(path) : [path];
  });
}

const sourceFiles = collectFiles(join(root, 'src')).filter((path) => /\.(ts|tsx|css)$/.test(path));
if (sourceFiles.length < 20) throw new Error('Estrutura de implementação incompleta.');

console.log(`Validação estática concluída: ${sourceFiles.length} arquivos de implementação, cadeia e fallbacks presentes.`);
