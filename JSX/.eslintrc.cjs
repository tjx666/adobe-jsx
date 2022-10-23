/** @type {import('eslint').Linter.Config} */
module.exports = {
    globals: {
        _adobe_jsx_: 'readonly'
    },
    parserOptions: {
        requireConfigFile: false,
    },
    extends: ['eslint:recommended', 'plugin:extendscript-plus/photoshop', 'prettier'],
    rules: {},
};
