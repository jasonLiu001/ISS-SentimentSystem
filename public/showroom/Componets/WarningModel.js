define(function (require, exports, modules) {
    var base = require('/showroom/Componets/base');
    var viewModel = {
        
    };
    function update() {
        
    }
    exports.load = function (id, par,callback) {
        base.applyBind(id, '/showroom/templates/WarningModel.html', viewModel, function (view) {
            update();
            if (callback)
                callback();
            setInterval(update, base.timeout)
        });
    };
});