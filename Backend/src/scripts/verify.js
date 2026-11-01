import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.resolve(__dirname, '..');

let total = 0;
let passed = 0;

function checkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      checkDir(fullPath);
    } else if (entry.name.endsWith('.js')) {
      total++;
      try {
        execSync(`node -c "${fullPath}"`);
        passed++;
        console.log(`[PASS] ${path.relative(srcDir, fullPath)}`);
      } catch (err) {
        console.error(`[FAIL] ${path.relative(srcDir, fullPath)}: ${err.message}`);
      }
    }
  }
}

console.log('Verifying all UniMitra Backend JavaScript files...');
checkDir(srcDir);
console.log(`\nVerification Complete: ${passed}/${total} files passed syntax validation.`);

if (passed !== total) {
  process.exit(1);
}

