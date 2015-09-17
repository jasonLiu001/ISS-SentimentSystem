define(function (require, exports, modules) {
    var base = require('/showroom/Componets/base');
    var viewModel = {
        words: ko.observableArray([])
    };
    function update() {
        $.getJSON("/showroom/api/gethotwords.js", function (data) {
            base.setData(viewModel.words, data);
        })
    }
    exports.load = function (id, par, callback) {
        
        base.applyBind(id, '/showroom/templates/HotWords.html', viewModel, function (view) {
            update();
            if (callback)
                callback();
            setInterval(update, base.timeout)
        });
    };
});