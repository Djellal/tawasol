import adapter from '@sveltejs/adapter-node';

const config = {
  compilerOptions: {
    runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
  },
  kit: {
    adapter: adapter(),
    typescript: {
      config: (config) => ({
        ...config,
        include: [...config.include, '../drizzle.config.ts']
      })
    }
  },
  // ↓ Add this block
  vite: {
    build: {
      rollupOptions: {
        external: [
          '@libsql/client',
          '@libsql/linux-x64-gnu',
          '@libsql/darwin-x64',
          '@libsql/darwin-arm64',
          '@libsql/win32-x64-msvc',
        ]
      }
    },
    optimizeDeps: {
      exclude: ['@libsql/client']
    }
  }
};

export default config;