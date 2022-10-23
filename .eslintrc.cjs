const OFF = 0;
const WARN = 1;
// const ERROR = 2;

/** @type {import('eslint').Linter.Config} */
module.exports = {
    env: {
        es2022: true,
        node: true,
    },
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint'],
    rules: {
        '@typescript-eslint/ban-ts-comment': OFF,
        '@typescript-eslint/no-empty-function': OFF,
        '@typescript-eslint/no-empty-interface': OFF,
        '@typescript-eslint/no-explicit-any': OFF,
        '@typescript-eslint/no-non-null-assertion': OFF,
        '@typescript-eslint/no-unused-vars': [
            WARN,
            { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
        ],
    },
};
