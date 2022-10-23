_adobe_jsx_.fs =  (function () {
    /**
     * @param {string} file
     * @param {string} text
     * @param {object} options
     * @returns {void}
     */
     function writeTextSync(file, text, options) {
        if (options === undefined) options = {};
        const encoding = options.encoding || 'UTF-8';
        const append = !!options.append;

        if (typeof file === 'string') {
            const path = file;
            file = new File(path);
        }
        file.open(append ? 'a' : 'w');
        file.encoding = encoding;
        file.write(text);
        file.close();
    }

    return {
        writeTextSync: writeTextSync
    }
})();
