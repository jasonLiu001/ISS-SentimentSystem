//判断数组中是否存
function ExistByName(dataArr, dataName) {
    var flag = false;
    for (var i = 0; i < dataArr.length; i++) {
        if (dataArr[i].name == dataName) {
            flag = true;
            break;
        }
    }
    return flag;
}
//根据fieldName，categoryName获取二三级以及关键字
function GetChildrenByName(dataArray, fieldName, categoryName) {
    var sonArr = [];
    if (categoryName.length > 0) {
        //返回关键字[绑架，等等]
        if (categoryName == "测试") {
            var ss = "";
        }
        for (var i = 0; i < dataArray.length; i++) {
            if (dataArray[i].field_name == fieldName && dataArray[i].category_name == categoryName) {
                if (!ExistByName(sonArr, dataArray[i].keyword)) {
                    sonArr.push({ id: 0, name: dataArray[i].keyword, readonly: dataArray[i].is_default_value });
                }
            }
        }
    }
    if (fieldName.length > 0 && categoryName == 0) {
        //返回category[安全，交通，环保]
        for (var i = 0; i < dataArray.length; i++) {
            if (dataArray[i].field_name == fieldName) {
                if (!ExistByName(sonArr, dataArray[i].category_name)) {
                    sonArr.push({ id: 0, name: dataArray[i].category_name, readonly: dataArray[i].is_default_value });
                }
            }
        }
    }
    if (fieldName.length == 0 && categoryName == 0) {
        //返回fieldNames【城管，民生，经济】
        for (var i = 0; i < dataArray.length; i++) {
            if (!ExistByName(sonArr, dataArray[i].field_name)) {
                sonArr.push({ id: 0, name: dataArray[i].field_name, readonly: dataArray[i].is_default_value });
            }
        }
    }
    return sonArr;
}

//初始化页面
$(function () {
    //var level2 = $("#level-three-div");
    //level2.hide();
    //$("#indexLevel").change(function () {
    //    if ($(this).val() == "三级") {
    //        level2.show();
    //    } else {
    //        level2.hide();
    //    }
    //})

    InitialTable();

    function InitialTable() {

        $("#table").html("<tr><td>加载中...</td></tr>");

        window.baseTools.GetCategoryTagList({}, function (result) {//base.js //获取新闻舆情
            var dataSource;
            if (result.Result) {
                dataSource = result.Data;
                var dataRow = GetChildrenByName(dataSource, "", "");
                $("#table").html("");
                //初始化下拉框
                InitialOptions(dataRow);
                for (var i = 0; i < dataRow.length; i++) {
                    var trHtml = "<tr><td style='width:40%' fieldName='" + dataRow[i].name + "'>" + dataRow[i].name + "</td><td style='width:60%' class='drop'>";

                    var dataCategory = GetChildrenByName(dataSource, dataRow[i].name, "");
                    for (var j = 0; j < dataCategory.length; j++) {
                        var dataKeys = GetChildrenByName(dataSource, dataRow[i].name, dataCategory[j].name);
                        var keystring = "";
                        var keyseditstring = "";
                        for (var k = 0; k < dataKeys.length; k++) {
                            if (dataKeys[k].readonly == 1) {
                                keystring += dataKeys[k].name + " ";
                            }
                            else {

                                keyseditstring += dataKeys[k].name + " ";
                            }
                        }

                        trHtml += "<div class='label'><div class='relative'><div class='titlebg'><span class='titlezi' field='" + dataRow[i].name + "'>" + dataCategory[j].name + "</span><i class='icon icon_addsmall' keydata='" + keystring + "' keyedit='" + keyseditstring + "' title='添加关键词' ></i>";
                        if (dataCategory[j].readonly != 1) {
                            trHtml += "<i class='icon icon_deletesmall' title='删除关键词'></i>";
                        }
                        trHtml += "</div></div></div>";
                    }

                    trHtml += "</td></tr>";
                    $("#table").append(trHtml);
                }
                drag();//默认可拖拽
                deleteCon();
            }
            else {
                $("#table").html("<tr><td>没有任何数据！</td></tr>");

            }

        });
    }

    $("#add").click(function () {
        //var selectedOption = $("#indexLevel option:selected").text();//选的指数等级的值
        //value++;
        //if (selectedOption == "二级") { //如果是添加二级
        //    var valueTwo = $("#inputvalue").val().trim(); //取添加的二级的值
        //    for (var i = 0; i < arrTwo.length; i++) { //添加的值已经存在或为空返回
        //        if (valueTwo == arrTwo[i] || valueTwo == "") {
        //            $("#errortext").text("不能重复或为空！");
        //            return;
        //        }
        //    }
        //    $("#indexLevelTwo").append("<option value='value" + value + "'>" + valueTwo + "</option>");//所属二级下拉框加入添加的值
        //    arrTwo.push(valueTwo);
        //    var str = "<tr><td id='value" + value + "'>" + valueTwo + "</td><td class='drop'></td></tr>";
        //    $("#table>tbody").append(str);
        //    obj["value" + value] = valueTwo;//更新obj
        //}
        //else {
        //如果添加三级 已经存在或为空就不添加
        var selectToption = $("#indexLevelTwo option:selected").text();

        $("#errortext").text("");
        //默认给每个三级标签后加空格 便于split变成数组
        $("#table span.titlezi").append(" ");
        var valueTwo = $("#inputvalue").val().trim();


        var str = "<div class='label'><div class='relative'><div class='titlebg'><span class='titlezi' field='" + selectToption + "'>" + valueTwo + " " + "</span><i class='icon icon_addsmall' keyedit='" + valueTwo + "' keydata='' title='添加关键词' ></i><i class='icon icon_deletesmall'></i></div>";


        var parentText = $("#table tr td[fieldName='" + selectToption + "']").next();


        text = parentText.find(".label>.relative>.titlebg>.titlezi").text();
        arrtext = text.split(" ");

        for (var i = 0; i < arrtext.length; i++) {
            if (valueTwo == arrtext[i] || valueTwo == "") {
                $("#errortext").text("不能重复或为空！");
                return;
            }
        }

        //ajax请求添加三级

        var tempfieldName = selectToption;
        var tempcategoryName = valueTwo;
        window.baseTools.AddCategoryTag({
            query: { field_name: tempfieldName, category_name: tempcategoryName }
        }, function (result) {

            if (result.Result) {
                alert("添加成功！");
                parentText.append(str);
                deleteCon();
                drag();//添加拖拽函数
            }
        });
    });

    //弹出对话框
    $(".icon_addsmall").live("click", function () {
        var title = $(this).prev().text(),
         strtitle = "添加<b>" + title + "</b>关键词";

        var tfieldname = $(this).parent().parent().parent().parent().prev().text();

        $("#myModaltitle").html(strtitle);

        $("#myModaltitle").attr("field", tfieldname);
        $("#myModaltitle").attr("category", title);


        var keydata = $(this).attr("keydata");
        var keywords = $(this).attr("keyedit");


        if (keywords.length == 0) {
            keywords = "";
        }
        if (keydata.length == 0) {
            keydata = "";
        }

        var defaultKeys = "";
        if (keydata.length > 0) {
            defaultKeys += "<div>默认关键字</div><div style='border:1px solid gray;color:gray;padding:3px;'>" + keydata + "</div>";;
        }
        $("#defaultKeys").html(defaultKeys + "<div>自定义关键字</div>");

        $("#myModalKey textarea.areaModalKey").val(keywords);
        $("#myModalKey").modal({ keyboard: false, keyboard: false });

    });

    //对话框保存
    $("#btnSave").click(function () {

        var tempfieldName = $("#myModaltitle").attr("field");
        var tempcategoryName = $("#myModaltitle").attr("category");;
        var keywords = $("#myModalKey textarea.areaModalKey").val();

        if (tempfieldName.length == 0 || tempcategoryName.length == 0) {
            alert("参数错误！");
            return;
        }

        // var keyNarray = [];

        var flag = false;
        var repeatword = "";
        var keywordArraySource = keywords.split(" ");

        var keywordArray = keywordArraySource.sort();

        //$.each(keywordArraySource, function (item) {


        //    if (item != '' && keyNarray.indexOf(item) < 0) {
        //        keyNarray.push(item);
        //    } else {
        //        flag = true;
        //        repeatword = keywordArray[i];
        //        return false;
        //    }


        //});

        for (var i = 0; i < keywordArray.length - 1; i++) {
            if ((keywordArray[i] != "" && keywordArray[i + 1] != "") && (keywordArray[i] == keywordArray[i + 1])) {
                flag = true;
                repeatword = keywordArray[i];
                break;
            }
        }
        if (flag) {
            alert("不能有重复关键字！" + repeatword);
            return;
        }

        window.baseTools.SaveCategoryTag({
            query: { field_name: tempfieldName, category_name: tempcategoryName, keywords: keywords }
        }, function (result) {

            if (result.Result) {
                $("#table span.titlezi[field='" + tempfieldName + "']").each(function () {
                    if ($(this).text() == tempcategoryName) {
                        $(this).next().attr("keyedit", keywords);
                    }
                })
                alert("修改成功！");
                $("#myModalKey").modal("hide");
            }
        });
    });


    //删除三级 删除关键词
    function deleteCon() {
        $(".label .icon_deletesmall").unbind("click").click(function () {

            if (confirm("确定要删除该指数吗？")) {
                var tempfieldName = $(this).parent().find("span.titlezi").attr("field");
                var tempcategoryName = $(this).parent().find("span.titlezi").text();
                var $thatCate = $(this).parents(".label");
                window.baseTools.DeleteCategoryTag({
                    query: { field_name: tempfieldName, category_name: tempcategoryName }
                }, function (result) {
                    if (result.Result) {
                        $thatCate.remove();//删除单个三级指数
                        alert("删除成功！");
                    }
                });
            }
        });
    }
    //初始化所属二级下拉框数据
    function InitialOptions(optionData) {
        $("#indexLevelTwo").html("");
        for (var i = 0; i < optionData.length; i++) {
            $("#indexLevelTwo").append("<option>" + optionData[i].name + "</option>");
        }
    }

    function drag() {
        //$("#table div.label").draggable({
        //    revert: true,
        //    handle: ".titlezi"
        //});
        //$("#table td.drop").droppable({
        //    onDragEnter: function () {
        //        $(this).addClass('over');
        //        $(".hidekey").hide();
        //    },
        //    onDragLeave: function () {
        //        $(this).removeClass('over');
        //    },
        //    onDrop: function (e, source) {
        //        $(this).removeClass('over');
        //        $(this).append(source);

        //    }
        //})
    }

});