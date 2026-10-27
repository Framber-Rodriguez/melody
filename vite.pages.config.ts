import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
export default defineConfig({root:path.resolve('pages'),base:'./',publicDir:path.resolve('public'),plugins:[react()],build:{outDir:path.resolve('docs'),emptyOutDir:true},server:{host:'0.0.0.0',allowedHosts:['terminal.local']}});
