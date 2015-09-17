define(function (require, exports, modules) {
    var base = require('/showroom/Componets/base');
    var startUTCTime1 = 0;
    var tpwidth=0;
    var viewModel = {
        news: ko.observableArray([])
    };
    function update() {

        $.getJSON("/showroom/api/getnews.js", function (data) {
            base.setData(viewModel.news, data);
        });

        nm_2();
    }
    exports.load = function (id, callback,width) {
        tpwidth = width;
        update();
       // callback(tpwidth);
    };
    function nm_2() {
        $('#nm_2').highcharts({
            chart: {
                type: 'column',
                width: tpwidth,
                height: base.getChartHeight(400),
                backgroundColor: '#639901',
                marginTop:40,
                marginRight: 40

            },
            title: {
                text: ''
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                categories: [
                    '1',
                    '2',
                    '3',
                    '4',
                    '5',
                    '6',
                    '7',
                    '8',
                    '9',
                    '10',
                    '11',
                    '12'
                ],
                labels: {
                    style: {
                        color: '#FFFFFF',
                    }

                },
                lineColor: '#FFFFFF',
                lineWidth: 1,
                gridLineWidth: 0
            },
            yAxis: {
                min: 0,
                title: {
                    text: ''
                },
                labels: {
                    style: {
                        color: '#FFFFFF',
                    }

                },
                gridLineWidth: 1,
                gridLineColor: '#FFFFFF',
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.1,
                    borderWidth: 0
                }
            },
            exporting: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            legend: {
                enabled: false
            },
            series: [{
                name: 'Tokyo',
                color: "#78ba00",
                data: [10, 350, 100, 150, 200, 50, 300,251, 540, 122, 400, 122]

            }]
        });
    }

});