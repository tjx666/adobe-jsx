$.global._adobe_jsx_ = {};

// @include './polyfill/json2.jsx'

// @include './utils/fs.jsx'

// @include './stdout.jsx'

(function () {
    const writeTextSync = _adobe_jsx_.fs.writeTextSync;

    const resultFile = new File('~/.adobe_jsx/jsx_result.json');
    const errorFile = new File('~/.adobe_jsx/jsx_error.txt');

    var errorResult;
    var result;
    try {
        result = $.evalFile($.__eval_file_path__);
    } catch (error) {
        errorResult = 'Eval jsx script occur error.\n';
        errorResult += error && error.toString;
        writeTextSync(errorFile, errorResult);
        return;
    }

    var stringifiedResult;
    if (typeof result === 'function') {
        stringifiedResult = result.toString();
    } else {
        try {
            stringifiedResult = JSON.stringify(result);
        } catch (error) {
            errorResult = "The result of eval jsx script can't be stringified.\n";
            errorResult += error && error.toString();
            writeTextSync(errorFile, errorResult);
            return;
        }
    }

    writeTextSync(resultFile, stringifiedResult);
})();
