(function () {
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

    const outputFile = new File('~/.adobe_jsx/jsx_output.txt');
    const originWrite = $.write;
    $.write = function write() {
        var text = '';
        for (var i = 0, len = arguments.length; i < len; i++) {
            text += arguments[i];
        }

        originWrite.call($, text);
        writeTextSync(outputFile, text, { append: true });
    };

    const originWriteln = $.writeln;
    $.writeln = function writeln() {
        var text = '';
        for (var i = 0, len = arguments.length; i < len; i++) {
            text += arguments[i];
        }
        originWriteln.call($, text);

        text += '\n';
        writeTextSync(outputFile, text, { append: true });
    };
})();
