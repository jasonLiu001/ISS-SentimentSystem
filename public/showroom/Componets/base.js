define(function (require, exports, modules) {
    //require('../css/bootstrap.css');
    //require('../css/style.css');
    //require('../js/knockout-3.1.0.js');
    //require('../js/jquery.js');
    //require('../js/highcharts.js');
    //require("../js/rotater/tools/util.js");
    //require("../js/rotater/tools/observer.js");
    //require("../js/rotater/tools/log.js");
    //require("../js/rotater/tools/requestAnimationFrame.js");
    //require("../js/rotater/tools/timer.js");
    //require("../js/rotater/tools/easing.js");
    //require("../js/rotater/lib/core.js");
    //require("../js/rotater/lib/animate.js");
    //require("../js/rotater/marquee.js");
    //require("../js/rotater/animationMgr.js");
    //require("../js/rotater/blockRotater.js");
    //require("../js/rotater/lineSwitcher.js");

    //刷新时间
    exports.timeout = 5 * 60 * 1000;
    //加载View并绑定
    exports.applyBind = function (id, viewName, viewModel, callback) {
        $('#' + id).load(viewName, function () {
            ko.applyBindings(viewModel, this);
            if (callback)
                callback($(this).children());
        })
    };

    exports.setData = function (property, data) {
        if (property && data)
            try {
                property(data);
            }
            catch (exception) { console.log("dataBind-error：" + exception.message) }
    };
    var Height;
    if ((location.href.indexOf("?") > 0) & (location.href.indexOf("Module9") > 0)) {
        Height = $(window).height() - 120
    } else if ((location.href.indexOf("?") > 0) & (location.href.indexOf("Module14") > 0)) {
        Height = $(window).height() - 40
    } else {
        Height = null;
    }

    exports.chartHeight = Height;
    exports.getChartHeight = function (v) {
        return this.chartHeight == null ? v : this.chartHeight;
    }
    //获取utc时间
    exports.getUTCTime = function getUTCTimeForHighchart(dateId) {
        var year = parseInt(dateId.toString().substr(0, 4)),
            month = parseInt(dateId.toString().substr(4, 2)) - 1,
            day = parseInt(dateId.toString().substr(6, 2)),
            hour = parseInt(dateId.toString().substr(8));
        return Date.UTC(year, month, day, hour);
    }
});

Highcharts.setOptions({
    lang: {
        shortMonths: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        weekdays: ['星期日', '星期六', '星期五', '星期四', '星期三', '星期二', '星期一']
    }

})