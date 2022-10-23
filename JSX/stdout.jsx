(function () {
    const writeTextSync = _adobe_jsx_.fs.writeTextSync
    
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
