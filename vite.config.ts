import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')) as {
  name: string;
};

function normalizeBase(raw: string): string {
  const s = raw.trim();
  if (!s) return `/${pkg.name}/`;
  const withSlash = s.startsWith('/') ? s : `/${s}`;
  return withSlash.endsWith('/') ? withSlash : `${withSlash}/`;
}

export default defineConfig({
  base: process.env.BASE_PATH ? normalizeBase(process.env.BASE_PATH) : `/${pkg.name}/`,
});
