#! /usr/bin/env node

import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, '../../.github/ISSUE_TEMPLATE');
const files = await fs.readdir(dir);

const results = await Promise.all(files.map(async (file) => {
  const [id, lang, ext] = file.split('.');

  if (ext !== 'md') {
    throw new Error('Expected all templates to have a .md extension');
  }

  if (!['es', 'pt'].includes(lang)) {
    throw new Error(`Expected lang to be es or pt and got ${lang}`);
  }

  const text = await fs.readFile(path.join(dir, file), 'utf-8');
  const lines = text.split('\n');

  if (lines[0] !== '---') {
    throw new Error('Expected first line to be ---');
  }

  const headersEndIdx = lines.slice(1).indexOf('---');
  const headersLines = lines.slice(1, headersEndIdx);
  const bodyLines = lines.slice(headersEndIdx + 2);

  return {
    fname: file,
    id,
    lang,
    headers: yaml.load(headersLines.join('\n')),
    body: bodyLines.join('\n').trim(),
  };
}));

await fs.writeFile(
  path.join(__dirname, '../templates.json'),
  JSON.stringify(results, null, 2),
);
