import { defineBuildConfig } from 'unbuild';
import { resolve } from 'path';

export default defineBuildConfig({
    entries: [resolve(__dirname, 'src/jsx')],
    clean: true,
    declaration: true,
    rollup: {
        emitCJS: true,
        inlineDependencies: true,
        esbuild: {
            target: 'es2022',
            minify: true
        },
    },
});
