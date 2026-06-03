// Build combinado: site Vite na raiz (dist/) + blog Astro em dist/blog/
// Resultado serve: /  (site)  e  /blog , /blog/post/..., /blog/studio
import { execSync } from 'node:child_process';
import { cpSync, rmSync, existsSync } from 'node:fs';

const run = (cmd, cwd) => execSync(cmd, { stdio: 'inherit', cwd });

// 1) Site Vite -> dist/  (o Vite limpa o dist/ antes)
run('npm run build:site');

// 2) Garante deps do blog (em CI/limpo) e builda o Astro -> blog/dist/
if (!existsSync('blog/node_modules')) run('npm ci', 'blog');
run('npm run build', 'blog');

// 3) Coloca o blog sob /blog no output final
const dest = 'dist/blog';
if (existsSync(dest)) rmSync(dest, { recursive: true, force: true });
cpSync('blog/dist', dest, { recursive: true });

console.log('\n✓ Build combinado pronto: site em dist/, blog em dist/blog/ (serve /blog e /blog/studio)');
