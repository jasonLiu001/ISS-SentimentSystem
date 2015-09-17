define(function (require, exports, modules) {
    var base = require('/showroom/Componets/base');
    //var startUTCTime1 = 0;
    var tpwidth;
    var viewModel = {
        geteduhotwords: ko.observableArray([]),
        getheahotwords: ko.observableArray([]),
        getoldhotwords: ko.observableArray([]),
        getlithotwords: ko.observableArray([])
    };
    function update() {
        $.getJSON("/showroom/api/geteduhotwords.js", function (data) {
            base.setData(viewModel.geteduhotwords, data);
        });
        $.getJSON("/showroom/api/getheahotwords.js", function (data) {
            base.setData(viewModel.getheahotwords, data);
        });
        $.getJSON("/showroom/api/getoldhotwords.js", function (data) {
            base.setData(viewModel.getoldhotwords, data);
        });
        $.getJSON("/showroom/api/getlithotwords.js", function (data) {
            base.setData(viewModel.getlithotwords, data);
        });
        getEconmicDataByUrl("/showroom/api/getcitymanpeopleindex.js", pi_0)
    }
    exports.load = function (id, par, callback) {
        animationMgr.moduleCount++;
        var amt = animationMgr.register("PeopleInformation" + animationMgr.moduleCount);
        base.applyBind(id, '/showroom/templates/PeopleInformation.html', viewModel, function (view) {
            tpwidth = $(view).width();
            animationMgr.moduleCount++;
            $(view).attr("id", $(view).attr("id") + animationMgr.moduleCount)
            amt.active($(view).attr("id"), par);
            update();

            //翻转


            if (callback)
                callback();
            setInterval(update, base.timeout)
        });
    };

    function getEconmicDataByUrl(url, complate) {
        $.getJSON(url, function (data) {
            var datas = [];
            var datas1 = [];
            startUTCTime = base.getUTCTime(data[0].date_id);
            for (var i = 0; i < data.length; i++) {
                // datas.push([data[i].date_id, data[i].score]);
                if (i < data.length - 1) {
                    var minus = (data[i + 1].score - data[i].score) / 6;
                }
                var dt = parseInt(data[i].date_id + "");
                datas.push(Math.floor(data[i].score));
                datas.push(Math.floor(data[i].score + minus));
                datas.push(Math.floor(data[i].score + minus * 2));
                datas.push(Math.floor(data[i].score + minus * 3));
                datas.push(Math.floor(data[i].score + minus * 4));
                datas.push(Math.floor(data[i].score + minus * 5));

                //datas1.push([data[i].score]);
                /*for (var j = 1; j < 10; j++) {
                    var s = data[i].score;
                    s += (Math.random()) * (s / 10);
                    s += s / 10;
                    datas1.push([parseInt(data[i].date_id + "" + j * 10),s]);
                }*/
            }
            complate([datas, datas1],startUTCTime)
        });
    }

    function pi_0(data, startUTCTime1) {
        //startUTCTime1 = base.getUTCTime(20140621);
        //var jsonArr = [30, 19, 28, 16, 15, 13, 29, 10, 12, 14, 15, 13, 11, 10, 9, 8, 12, 14, 16, 9, 30, 20, 29, 17, 15, 14, 22, 10, 8, 20, 12, 10, 29, 8, 6, 5, 3];
        var jsonArr = data[0];
        var columnArr = jsonArr.slice(0, jsonArr.length - 5);
        var dataArr = new Array(), attention = 460, companyName = "iSoftStone";
        var minValue = jsonArr[0];
        for (var i = 0; i < jsonArr.length - 5; i++) {
            if (jsonArr[i] < minValue)
                minValue = jsonArr[i];
            var data;
            if (i % 6 == 0) {
                data = {
                    dataLabels: {
                        enabled: true,
                        align: 'center',
                        style: {
                            fontWeight: 'normal',
                            color: '#FFFFFF',
                            fontSize: '9px'
                        },
                        y: -15,
                        verticalAlign: 'middle',
                        overflow: true,
                        crop: false
                    },
                    marker: {
                        enabled: true,
                        radius: 3
                    },
                    y: jsonArr[i]
                }
            }
            else {
                data = jsonArr[i];
            }
            dataArr.push(data);
        }


        $('#pi_0').highcharts({
            chart: {
                zoomType: 'xy',
                width: tpwidth,
                height: base.getChartHeight(245),
                backgroundColor: '#1a50a4',
                marginRight: 0,
            },
            title: {
                text: '',
                align: 'right',
                y: 15,
                style: {
                    color: '#d7eab3',
                    fontSize: '0px'
                }
            },

            xAxis: {
                type: 'datetime',
                labels: {
                    style: {
                        color: '#FFFFFF',
                        fontSize: '12px'
                    }

                },

                dateTimeLabelFormats: {
                    hour: '%H:%M',
                },
                tickInterval: 3600 * 1000,
            },
            yAxis: {
                labels: {

                    style: {
                        color: '#FFFFFF',
                        fontSize: '12px'
                    },

                },
                title: {
                    text: '',
                    style: {
                        fontWeight: 'normal',
                        color: '#FFFFFF',
                        fontSize: '12px'

                    },
                    rotation: 0,
                    align: 'high',
                    offset: -10,
                    x: -9,
                    y: -15
                },
                lineColor: '#FFFFFF',
                lineWidth: 1,
                gridLineWidth: 0,
                min: minValue
            },
            tooltip: {
                shared: true,
                backgroundColor: '#eaeaea'
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
            plotOptions: {
                series: {
                    marker: {
                        enabled: false
                    }
                },
                column: {

                    borderColor: '#2572eb'
                }
            },
            series: [{
                name: '指数值',
                color: '#2572eb',
                type: 'column',
                data: columnArr,
                pointStart: startUTCTime1,
                pointInterval: 600 * 1000,

            }, {
                name: '指数值',
                color: '#FFFFFF',
                type: 'spline',
                data: dataArr,
                pointStart: startUTCTime1,
                pointInterval: 600 * 1000,

            }]
        });
    }

});