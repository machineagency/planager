// Knitspeak mode for CodeMirror
export default () => {
    return {
        startState: function () { return {}; },
        token: function (stream, state) {
            if (stream.eatSpace()) return null;

            if (stream.match(/(k|p)/, true)) {
                return "atom"
            } else if (stream.match(/[0-9]/, true)) {
                return "number";
            } else if (stream.match(/(rows|row)/, true)) {
                return "keyword";
            } else {
                stream.next()
                return null;
            }
        }
    };
}
