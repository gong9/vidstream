import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    dts(),
  ],
  build: {
    lib: {
      entry: ['src/streaming-video.ts'],
      fileName: (format, entryName) => `streaming-video-${entryName}.${format}.js`,
      name: 'streamingVideo',
      formats: ['es', 'umd'],
    },
    outDir: 'dist',
    sourcemap: true,
  },
})
