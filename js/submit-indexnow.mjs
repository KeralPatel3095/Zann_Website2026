/**
 * Submit sitemap URLs to IndexNow (Bing, Yandex, and partners).
 * Run after deploy: node scripts/submit-indexnow.mjs
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const config = JSON.parse(readFileSync(join(root, 'seo-config.json'), 'utf8'));
const sitemap = readFileSync(join(root, 'sitemap.xml'), 'utf8');
const urlList = [...sitemap.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map((m) => m[1].trim());

if (!urlList.length) {
  console.error('No URLs found in sitemap.xml');
  process.exit(1);
}

const body = {
  host: config.host,
  key: config.indexNowKey,
  keyLocation: config.keyLocation,
  urlList,
};

const endpoints = [
  'https://api.indexnow.org/indexnow',
  'https://www.bing.com/indexnow',
];

for (const endpoint of endpoints) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  });
  console.log(`${endpoint}: ${res.status} ${res.statusText}`);
}

console.log(`Submitted ${urlList.length} URLs.`);
