// scripts/build.mjs
import { rmSync, mkdirSync, cpSync } from 'node:fs';

// Clear out any old builds
rmSync('dist', { recursive: true, force: true });
mkdirSync('dist', { recursive: true });

// Copy all deployment assets into the production folder
cpSync('index.html', 'dist/index.html');
cpSync('calculator.html', 'dist/calculator.html');
cpSync('assets', 'dist/assets', { recursive: true });
cpSync('src', 'dist/src', { recursive: true });

console.log('Build complete -> dist/');