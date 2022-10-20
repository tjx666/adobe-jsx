import { defineBuildConfig } from 'unbuild';
import { resolve } from 'path';

export default defineBuildConfig({
    entries: [resolve(__dirname, 'src/jsx')],
    clean: true,
    rollup: {
        esbuild: {
          target: 'es2022'
        }
      },
});
