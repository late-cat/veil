import { cpSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const src = resolve(ROOT, '..', 'backend', 'contracts', 'managed', 'survey');
const uiPublic = resolve(ROOT, 'public');

mkdirSync(resolve(uiPublic, 'managed', 'survey', 'keys'), { recursive: true });
mkdirSync(resolve(uiPublic, 'zkir'), { recursive: true });

// Copy keys and zkir into public directory
if (existsSync(resolve(src, 'keys'))) {
  cpSync(resolve(src, 'keys'), resolve(uiPublic, 'managed', 'survey', 'keys'), { recursive: true });
  // Also copy to root keys for fallback just in case
  cpSync(resolve(src, 'keys'), resolve(uiPublic, 'keys'), { recursive: true });
}
if (existsSync(resolve(src, 'zkir'))) {
  cpSync(resolve(src, 'zkir'), resolve(uiPublic, 'managed', 'survey', 'zkir'), { recursive: true });
  cpSync(resolve(src, 'zkir'), resolve(uiPublic, 'zkir'), { recursive: true });
}

// Copy contract JS to src/contracts to avoid duplicate node_modules issues
const srcContracts = resolve(ROOT, 'src', 'contracts', 'survey');
mkdirSync(srcContracts, { recursive: true });
if (existsSync(resolve(src, 'contract'))) {
  cpSync(resolve(src, 'contract'), srcContracts, { recursive: true });
  console.log('Synchronized JS Contract to UI src directory');
}

console.log('Synchronized ZK assets to UI public directory');
