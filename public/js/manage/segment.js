/**
 * Created by wang on 2014/9/16.
 */
$(function () {
    //分词按钮事件
    $('#btn_segment').click(buttonClickHandler);

    //菜单点击事件
    //$('#menu_tab').find('a').click(menuClickHandler);

    //加载极性词
    $('#btn_load_words').click(btnLoadWordsHandler);

    //增加极性词
    $('#polarityAdd').click(addWordsHandler);

    $("#10day").click(function () {
        $("#otherDay").val("10");
        loadTopNew("10");
    });
    $("#20day").click(function () {
        $("#otherDay").val("20");
        loadTopNew("20");
    });
    $("#30day").click(function () {
        $("#otherDay").val("30");
        loadTopNew("30");
    });

    $("#wordCal").click(function () {
        //var data=[];
        var wordList= $("#newTitleList").val();
        if(wordList==""){
            var liCol=$("#word_statistics li");
            wordList="";
            liCol.each(function(index,item){
                wordList=wordList+$(item).find("a")[0].innerText+"\n";
            })
        }
        $.ajax({
            url: "/maintain/showAllWordCal/true",
            type: "POST",
            data: {params:wordList.split("\n")},
            success: function (result) {
                if (result) {
                    var tpArray = [];
                    for (var po in result) {
                        var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&mdash;—|{}【】‘；：”“'。，、？]");
                        if(pattern.test(po)||po.length<2){
                            continue;
                        }
                        tpArray.push({"name": po, "count": result[po]});
                    }
                    tpArray.sort(function (a, b) {
                        return parseInt(b.count) - parseInt(a.count);
                    });
                    $("#table_word_statistics").find("tbody").html("");
                    var indexCount=0;
                    tpArray.slice(0, 20).forEach(function (item) {
                        indexCount++;
                        var row = $("<tr></tr>");
                        var td = $("<td>"+indexCount+"</td><td>"+item.name+"</td><td>"+item.count+"</td>");
                        row.append(td);
                        $("#table_word_statistics").find("tbody").append(row);
                    });
                }
            }
        });
    })
});

function loadTopNew(days) {
    var request = $.ajax({url: "/maintain/GetTopNews/"+days,
        type: "GET",
        data: "",
        success: function (result) {
            if (result) {
                //console.log(result);
                var One = result.slice(0, 9);
                var Two = result.slice(10, 19);
                var Three = result.slice(20, result.length);
                $("#articleList1").html("");
                $("#articleList2").html("");
                $("#articleList3").html("");
                One.forEach(function (item) {
                    $("#articleList1").append("<li><a>" + item.news_title + "</a></li>");
                });
                Two.forEach(function (item) {
                    $("#articleList2").append("<li><a>" + item.news_title + "</a></li>");
                });
                Three.forEach(function (item) {
                    $("#articleList3").append("<li><a>" + item.news_title + "</a></li>");
                });
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}

function addWordsHandler() {
    var level1 = $('#level1').val();
    var level2 = $('#level2').val();
    var level3 = $('#level3').val();
    var prefix = $('#prefix').val();
    var name = $('#name').val();
    var polarityScore = $('#polarityScore').val();
    if (level1 == "" && level2 == "" && level3 == "" && prefix == "" && name == "" && polarityScore == "") {
        alert("数据不能为空，请输入数据！");
        return;
    }

    var request = $.ajax({
        url: "/maintain/AddPolarityEntity",
        type: "POST",
        data: {level1: level1, level2: level2, level3: level3, prefix: prefix, name: name, polarityScore: polarityScore}
    });

    request.done(function (data) {
        if (data.Result) {
            alert("添加成功!");
            $('#level1').val("");
            $('#level2').val("");
            $('#level3').val("");
            $('#prefix').val("");
            $('#name').val("");
            $('#polarityScore').val("");
        } else {
            alert("添加失败：" + data.Message);
        }
        btnLoadWordsHandler();
    });
}

function btnLoadWordsHandler() {
    var tbody = $('#table_grade').find('tbody');

    tbody.html("<tr><td colspan=\"8\">载入中...</td></tr>");

    var request = $.ajax({
        url: "/maintain/loadGradeWords",
        type: "GET"
    });

    request.done(function (data) {
        var wordsArr = data.Data;
        tbody.html('');//清空表体元素

        for (var blocks in wordsArr) {
            var row = "<tr><td>" + wordsArr[blocks]["id"] + "</td><td>" + wordsArr[blocks]["level1"] + "</td><td>" + wordsArr[blocks]["level2"] + "</td><td>" + wordsArr[blocks]["level3"] + "</td><td>" + wordsArr[blocks]["prefix"] + "</td><td>" + wordsArr[blocks]["name"] + "</td><td><input disabled=\"disabled\" value=\'" + Number(wordsArr[blocks]["polarityScore"]) + "\'/></td><td><button class=\'btn btn-primary\' value=\'" + wordsArr[blocks]["id"] + "\'>修改</button>  <button class=\'btn btn-primary\' value=\'" + wordsArr[blocks]["id"] + "\'>删除</button></td></tr>";
            tbody.append(row);
        }
        //给按钮添加click事件
        tbody.find('button').click(buttonUpdateHandler);
    });
}

function buttonUpdateHandler() {
    var self = $(this);
    var name = $(this).text();
    var gradeInput = self.parent().siblings().find('input');
    var rowNum = self.parent().siblings().eq(0).text();//文本行号
    var lv1 = self.parent().siblings().eq(1).text();
    var lv2 = self.parent().siblings().eq(2).text();
    var lv3 = self.parent().siblings().eq(3).text();
    var prifix = self.parent().siblings().eq(4).text();
    var sc = self.parent().siblings().eq(5).text();
    if (name == '修改') {
        gradeInput.removeAttr('disabled');
        self.text('保存');
    } else if (name == '保存') {
        //Save the value to the file.
        var grade = Number(gradeInput.val());

        var request = $.ajax({
            url: "/maintain/updateGradeWords",
            type: "POST",
            data: {polarityScore: grade, id: rowNum}
        });

        request.done(function (data) {
            if (data.Result) {
                gradeInput.attr({disabled: "disabled"});
                alert("更新成功！");
                self.text('修改');
            }
        });
    } else {
        var request = $.ajax({
            url: "/maintain/deletePolarityEntity",
            type: "POST",
            data: {id: rowNum}
        });

        request.done(function (data) {
            if (data.Result) {
                alert("删除成功！");
                btnLoadWordsHandler();
            }
        });
    }
}

//分词按钮点击事件处理函数
function buttonClickHandler() {
    $('#segment_result').text('分词处理中...')
        .css({color: "red"});
    getSegmentResult();//分词
    gradeSplit();//极性划分
}

//菜单点击事件处理函数
//function menuClickHandler(){
//    var name=$(this).attr('name');
//    var parent=$(this).parent();
//    //移除样式
//    parent.addClass('active').siblings()
//        .removeClass();
//
//    //页面内容显示
//    if(name=='segment'){
//        $('#grade_split').hide();
//        $('#news_segment').show();
//    }else if(name=='grade'){
//        $('#grade_split').show();
//        $('#news_segment').hide();
//    }
//}

function gradeSplit() {
    var newsContent = $('#news_content').val();
    var request = $.ajax({
        url: "/maintain/gradeSplit",
        type: "POST",
        data: { newsContent: newsContent }
    });
    request.done(gradeSplitHandler);
}

//发送ajax请求
function getSegmentResult() {
    var newsContent = $('#news_content').val();
    var request = $.ajax({
        url: "/maintain/newsSegment",
        type: "POST",
        data: { newsContent: newsContent }
    });
    request.done(segmentDataHandler);
}

//处理分词结果
function segmentDataHandler(data) {
    var result = data;
    var resultString = ' | ';
    for (var index in result) {
        resultString = resultString + result[index].w + ' | ';
    }
    $('#segment_result').text(resultString)
        .css({color: "blue"});
}

//处理极性划分
function gradeSplitHandler(data) {
    var result = data;
    var positiveWordsString = ' ';
    var negativeWordsString = ' ';
    var positiveWords = result.positiveWords;
    var negativeWords = result.negativeWords;

    if (result) {
        $('#totalScore').text(result.totalScore).css({color: "blue"});
        $('#positiveScore').text(result.positiveScore).css({color: "blue"});
        $('#negativeScore').text(result.negativeScore).css({color: "blue"});
        $('#positiveWordsCount').text(result.positiveWordsCount).css({color: "blue"});
        $('#negativeWordsCount').text(result.negativeWordsCount).css({color: "blue"});
        $('#noScoreWordsCount').text(result.noScoreWordsCount).css({color: "blue"});

        for (var index in positiveWords) {
            var str = ', ';
            if (index == (positiveWords.length - 1)) {
                str = '.';
            }
            positiveWordsString = positiveWordsString + positiveWords[index] + str;
        }

        for (var index in negativeWords) {
            var str = ', ';
            if (index == (negativeWords.length - 1)) {
                str = '.';
            }
            negativeWordsString = negativeWordsString + negativeWords[index] + str;
        }

        $('#positiveWords').text(positiveWordsString)
            .css({color: "blue"});

        $('#negativeWords').text(negativeWordsString)
            .css({color: "blue"});

        var emotionScore = function () {
            if (result.positiveScore > result.negativeScore) {
                return 1;
            } else if (result.positiveScore == result.negativeScore) {
                return 0;
            } else {
                return -1;
            }
        };

        $('#emotionScore').text(emotionScore)
            .css({color: "blue"});
    }
}
