/// <reference path="base.js" />
/// <reference path="../jQuery.js" />

var customername = window.global.UserInfo.CustomerName;
var mediaDataSource = null;
var mediaViewModel = function (data) {
    var self = this;
    self.media = ko.observableArray(data);
    mediaDataSource = self.media;
};
var sentitiveDataSource = null;
var sentitiveViewModel = function (data) {
    var self = this;
    self.media = ko.observableArray(data);
    sentitiveDataSource = self.media;
    self.index = function (i) {
        return i + options.pageIndex * options.pageSize;
    };
};
$(function () {
    $(".customer").text(customername);
    //$("#contenttitle").text(customername + $("#qDateStart").val() + "至" + $("#qDateEnd").val() + "舆情汇总报告如下");
    $("#titleDate").text(formatDate(new Date()));
    $("#search").bind("click", function (event) {
        search();
        return false;
    });
    $("#print").bind("click", function () {
        print();
    });
    var view1 = mediaViewModel(null);
    ko.applyBindings(view1, document.getElementById("list1"));
    view2 = sentitiveViewModel(null);
    ko.applyBindings(view2, document.getElementById("list2"));
    search();
});

//搜索
function search() {
    $("#titleDate").text(formatDate(new Date()));

    var startstr = $("#qDateStart").val();
    var endstr = $("#qDateEnd").val();
    if (!compareDate(startstr, endstr)) {
        return false;
    }

    var postData = {
        query: {

        }
    };
    if ($("#qDateStart").val() != "") {
        postData.query.start_date = $("#qDateStart").val();
    }
    if ($("#qDateEnd").val() != "") {
        postData.query.end_date = $("#qDateEnd").val();
    }
    if ($("#qDateStart").val() != "" && $("#qDateEnd").val() != "") {
        $("#contenttitle").text(customername + "舆情汇总报告(" + $("#qDateStart").val() + "至" + $("#qDateEnd").val() + ")");
    } else if ($("#qDateStart").val() != "") {
        $("#contenttitle").text(customername + "舆情汇总报告(起始于:" + $("#qDateStart").val() + ")");
    } else if ($("#qDateEnd").val() != "") {
        $("#contenttitle").text(customername + "舆情汇总报告(结束于:" + $("#qDateEnd").val() + ")");
    } else {
        $("#contenttitle").text(customername + "舆情汇总报告(全部)");
    }
    //绑定舆情数量统计
    window.baseTools.GetSentimentReportByCategory(postData, function (result) {
        if (result && result.Result) {
            var newsCount = parseInt(result.Data[0].count_news);
            var weiboCount = parseInt(result.Data[0].count_weibo);
            var newsEnCount = parseInt(result.Data[0].count_newsen);
            var weixinCount = parseInt(result.Data[0].count_weixin);
            console.log(weixinCount);
            //百分比
            var newsPercent = ((newsCount / sumCount) * 100).toFixed(2) + "%";
            var weiboPercent = ((weiboCount / sumCount) * 100).toFixed(2) + "%";
            var newsEnPercent = ((newsEnCount / sumCount) * 100).toFixed(2) + "%";
            var sumCount = newsCount + weiboCount + newsEnPercent + weixinCount;
            if (newsCount == 0 && weiboCount == 0 && newsEnCount == 0) {
                $(".listone").children(1).empty();
                $("#content1").html("很抱歉，没有相关数据！");
                $("#content1").removeClass("loading");

            } else {
                $("#content1").pieChartNum({ title: "舆情数量统计", data: [
                    ["新闻", newsCount],
                    ["微博", weiboCount],
                    ["海外", newsEnCount],
                    ["微信", weixinCount]
                ]
                });
                $("#content1").removeClass("loading");
                //$(".countall").html("总计：<span>" + sumCount + "</span>");
                //$("#sum1").text(sumCount);
            }
        }
    });
    //绑定舆情正负统计
    window.baseTools.GetSentimentReportBySide(postData, function (result) {
        if (result && result.Result) {
            var sumCount = parseInt(result.Data[0].sumCount);
            var posCount = parseInt(result.Data[0].POSCount);
            var negCount = parseInt(result.Data[0].NegCount);
            var neuCount = sumCount - posCount - negCount;
            if (negCount == 0 && posCount == 0 && neuCount == 0) {
                $(".listtwo").children(1).empty();
                $("#content2").html("很抱歉，没有相关数据！");
                $("#content2").removeClass("loading");
                //$(".listtwo").children(1).html("总计：<span id='sum2'>" + sumCount + "</span>");
            } else {
                $("#content2").pieChartNum({ title: "舆情正负面统计", data: [
                    ["正面", posCount],
                    ["负面", negCount],
                    ["中性", neuCount]
                ]
                });
                $("#content2").removeClass("loading");
                $(".countall").html("总计：<span>" + sumCount + "</span>");
            }
        }

    });
    //绑定舆情分类统计
    window.baseTools.GetSentimentPie(postData, function (result) {
        if (result && result.success) {
//            if (result.data) {
//                if (result.data[0] && result.data[0][0]&&result.data[0][0]==null) {
//                    result.data[0][0] = "其他";
//                }
//                //如果是其它 就把它放在数组第一位 然后反转数字 这个顺序跟首页统一
//                var removeQT;
//                for (var is = 0, len = result.data.length; is < len; is++) {
//                    var every = result.data[is];
//                    if (every[0] == "其它") {
//                        removeQT = result.data.splice(is, 1);
//                        break;
//                    }
//                }
//                result.data.unshift(removeQT[0]);
//                result.data.reverse();
//
//            }
            if (result.data.length == 0) {
                $("#pie").html("很抱歉，没有相关数据！");
                $("#pie").removeClass("loading");
            } else {
                $("#pie").pieChart({ title: "舆情分类统计", data: result.data });
                $("#pie").removeClass("loading");
            }
        } else {
            $("#pie").html("很抱歉，没有相关数据！");
            $("#pie").removeClass("loading");
        }
    });
    //绑定传播媒体
    window.baseTools.GetSentimentReportBySource(postData, function (result) {
        if (result && result.Result) {
            $("#list1 tbody").empty();
            mediaDataSource(result.Data);
        } else {
            $("#list1 tbody").empty().append("<tr><td colspan='7'>很抱歉，没有相关数据！</td></tr>");
        }
    });
    //绑定敏感报道
    window.baseTools.GetSentimentReportBySensitive(postData, function (result) {
        if (result && result.Result) {
            $("#list2 tbody").empty();
            sentitiveDataSource(result.Data);
        } else {
            $("#list2 tbody").empty().append("<tr><td colspan='7'>很抱歉，没有相关数据！</td></tr>");
        }
    });
//    window.baseTools.getSentimentReport(postData, function (result) {
//        if (result && result.Result) {
//            var newsCount = result.Data.count[0].count_news;
//            var weiboCount = result.Data.count[0].count_weibo;
//            var luntanCount = result.Data.count[0].count_newsen;
//            var weixinCount=result.Data.count[0].count_weixin;
//            //var newsenCount = result.Data.count.Data[0].count_newsen;
//            var sumCount = newsCount + weiboCount + luntanCount+weixinCount;
//            var negCount = result.Data.score[0].NegCount;
//            var posCount = result.Data.score[0].POSCount
//            var neuCount = sumCount - negCount - posCount;
//            //百分比
//            var newsPercent = ((newsCount / sumCount) * 100).toFixed(2) + "%";
//            var weiboPercent = ((weiboCount / sumCount) * 100).toFixed(2) + "%";
//            var luntanPercent = ((luntanCount / sumCount) * 100).toFixed(2) + "%";
//            var posPercent = ((posCount / sumCount) * 100).toFixed(2) + "%";
//            var negPercent = ((negCount / sumCount) * 100).toFixed(2) + "%";
//            var neuPercent = ((neuCount / sumCount) * 100).toFixed(2) + "%";
//
//            if (newsCount == 0 && weiboCount == 0 && luntanCount == 0) {
//                $(".listone").children(1).empty();
//                $("#content1").html("很抱歉，没有相关数据！");
//                $("#content1").removeClass("loading");
//
//            } else {
//                $("#content1").pieChartNum({ title: "舆情数量统计", data: [
//                    ["新闻", newsCount],
//                    ["微博", weiboCount],
//                    ["海外", luntanCount],
//                    ["微信",weixinCount]
//                ]
//                });
//                $("#content1").removeClass("loading");
//                $(".countall").html("总计：<span>" + sumCount + "</span>");
//                //$("#sum1").text(sumCount);
//            }
//            if (negCount == 0 && posCount == 0 && neuCount == 0) {
//                $(".listtwo").children(1).empty();
//                $("#content2").html("很抱歉，没有相关数据！");
//                $("#content2").removeClass("loading");
//                //$(".listtwo").children(1).html("总计：<span id='sum2'>" + sumCount + "</span>");
//            } else {
//                $("#content2").pieChartNum({ title: "舆情正负面统计", data: [
//                    ["正面", posCount],
//                    ["负面", negCount],
//                    ["中性", neuCount]
//                ]
//                });
//                $("#content2").removeClass("loading");
//                $(".countall").html("总计：<span>" + sumCount + "</span>");
//            }
//            window.baseTools.GetSentimentPie(postData, function (result) {
//                if (result && result.success) {
//                    if (result.data) {
//                        if (result.data[0] && result.data[0][0] == null) {
//                            result.data[0][0] = "其他";
//                        }
//                        //如果是其它 就把它放在数组第一位 然后反转数字 这个顺序跟首页统一
//                        var removeQT;
//                        for(var is= 0,len=result.data.length;is<len;is++){
//                            var every=result.data[is];
//                            if(every[0]=="其它"){
//                                removeQT=result.data.splice(is,1);
//                                break;
//                            }
//                        }
//                        result.data.unshift(removeQT[0]);
//                        result.data.reverse();
//
//                    }
//                    if (result.data.length == 0) {
//                        $("#pie").html("很抱歉，没有相关数据！");
//                        $("#pie").removeClass("loading");
//                    } else {
//                        $("#pie").pieChart({ title: "舆情分类统计", data: result.data });
//                        $("#pie").removeClass("loading");
//                    }
//                } else {
//                    $("#pie").html("很抱歉，没有相关数据！");
//                    $("#pie").removeClass("loading");
//                }
//            });
//            var mediaData = result.Data.media;
//            var sensitiveDate = result.Data.sensitive;
//            if (mediaData.length == 0) {
//
//                $("#list1 tbody").empty().append("<tr><td colspan='7'>很抱歉，没有相关数据！</td></tr>");
//            } else {
//                $("#list1 tbody").empty();
//                mediaDataSource(mediaData);
//            }
//            if (sensitiveDate.length == 0) {
//                $("#list2 tbody").empty().append("<tr><td colspan='7'>很抱歉，没有相关数据！</td></tr>");
//            } else {
//                $("#list2 tbody").empty();
//                sentitiveDataSource(sensitiveDate);
//            }
//        }
//    });
}
//打印
function print() {
    //document.body.innerHTML = document.getElementById('mainContainer').innerHTML;
    //$("#mainContainer").jqprint();
    //var headElements = '<meta charset="utf-8" />,<meta http-equiv="X-UA-Compatible" content="IE=edge"/>';
    //var options = { mode: "popup", close: true, retainAttr: ["class","id","style"], extraHead: headElements };
    var options = { mode: "popup", popHt: "1000px", popWd: "1000px"};
    $("#mainContainer").printArea(options);
}

//截取内容summary的文字 截取100子后面的第一个句号，感叹号，问号或分号
function summarySubstr(text) {
    var newtext,
        textLen = text.length;
    if (textLen <= 100) {
        newtext = text;
    } else {  //大于100字 先取前一百字 后面的循环 取到第一个标点
        var first_string = text.substr(0, 100),
            need_string,
            last_string = text.substring(100),//第101字的索引为100
            last_len = last_string.length;
        for (var i = 0; i < last_len; i++) {
            if (last_string[i] == "。" || last_string[i] == "？" || last_string[i] == "！" || last_string[i] == "；" || last_string[i] == "." || last_string[i] == "?" || last_string[i] == "!" || last_string[i] == ";") {
                need_string = last_string.substr(0, i + 1);
                break;
            }
            need_string = "";//当100字以后没有需要的那些标点符号就只取前一百字
        }
        newtext = first_string + need_string + "...";
    }

    return newtext;

}