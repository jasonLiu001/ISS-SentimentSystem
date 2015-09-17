define(function (require, exports, modules) {
    var base = require('/showroom/Componets/base');
    var viewModel = {
        weiBoMonitor: ko.observable([])
    };
    function update() {
        $.getJSON("/showroom/api/GetWeiboModel.js", function (data) {
                base.setData(viewModel.weiBoMonitor, data);
        });
    }
    exports.load = function (id,par, callback) {
        base.applyBind(id, '/showroom/templates/WeiBoModel.html', viewModel, function (view) {
            update();
            //滚动
            
            if ($(window).width() < 400) {
                marqueeObj.append("ulweiBoMonitor", 82, 3500);
            } else {
                marqueeObj.append("ulweiBoMonitor", 65, 3500);
            }
            marqueeObj.start();
            if (callback)
                callback();
            setInterval(update, base.timeout)
        });
    };
});