import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    sveltekit({
      compilerOptions: {
        runes: ({ filename }) =>
          filename.split(/[/\\]/).includes('node_modules') ? undefined : true
      },
      adapter: adapter(),
      // '/raj/<site>' when built by the Pages workflow, '' for local dev/preview + custom domain
      paths: { base: (process.env.BASE_PATH ?? '') as '' | `/${string}` }
    })
  ]
});
