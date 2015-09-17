define(function (require, exports, modules) {
    var base = require('/showroom/Componets/base');
    var startUTCTime1 = 0;
    var tpwidth;
    var viewModel = {
        news: ko.observableArray([])
    };
    function update() {

        $.getJSON("/showroom/api/getnews.js", function (data) {
            base.setData(viewModel.news, data);
        });

        nm_1();
    }
    exports.load = function (id, callback) {
        //tpwidth = $("#" + id).width() - 10;
        tpwidth = $(window).width() - 300;
        update();
    };

    function nm_1() {
        $('#nm_1').highcharts({
            chart: {
                width: tpwidth,
                height: base.getChartHeight(500),
                backgroundColor: '#639901',
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: true,
                spacingLeft: $(window).width() < 400 ? 0 : -50,
                spacingRight: 30,
                spacingTop:10
            },
            title: {
                text: ''
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            exporting: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0,
                itemStyle: {
                    color: "#ffffff"
                },
                itemMarginBottom: 0,
                labelFormatter: function () {
                    return this.name + " : " + this.percentage + "%";
                }

            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },
            series: [{
                type: 'pie',
                name: '百分百',
                data: [
                    ['安全', 12],
                    ['交通', 9],
                    {
                        name: '环保',
                        y: 8.8,
                        sliced: true,
                        selected: true
                    },
                    ['城建', 4.2],
                    ['电力', 2],
                    ['水利', 2],
                    ['教育', 10.7],
                    ['健康', 10],
                    ['养老', 10],
                    ['文体', 6],
                    ['社区', 4],
                    ['工业', 3],
                    ['农业', 4],
                    ['商业', 5],
                    ['金融', 2],
                    ['旅游', 7.3]
                ]
            }]
        });
    }
});