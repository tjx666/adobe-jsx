/** @type {import('eslint').Linter.Config} */
module.exports = {
    globals: {},
    parserOptions: {
        requireConfigFile: false,
    },
    extends: ['eslint:recommended', 'plugin:extendscript-plus/photoshop', 'prettier'],
    rules: {},
};
