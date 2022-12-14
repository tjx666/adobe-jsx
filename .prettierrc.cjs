module.exports = {
    trailingComma: 'all',
    tabWidth: 4,
    semi: true,
    singleQuote: true,
    endOfLine: 'auto',
    printWidth: 100,
    overrides: [
        {
            files: '*.svg',
            options: {
                parser: 'html',
            },
        },
        {
            files: '*.md',
            options: {
                tabWidth: 2,
            },
        },
        {
            files: '*.yaml',
            options: {
                tabWidth: 4,
            },
        },
    ],
};
