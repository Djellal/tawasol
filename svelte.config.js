import adapter from '@sveltejs/adapter-node';  // ← change this line

const config = {
  compilerOptions: {
    runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
  },
  kit: {
    adapter: adapter(),  // uses build/ by default
    typescript: {
      config: (config) => ({
        ...config,
        include: [...config.include, '../drizzle.config.ts']
      })
    }
  }
};

export default config;