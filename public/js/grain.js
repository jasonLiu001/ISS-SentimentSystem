$(function(){
    //初始化日期控件 “高级搜索位置”
    $(".form_date").datetimepicker({
        language: 'zh-CN',
        weekStart: 1,
        todayBtn: 1,
        autoclose: 1,
        todayHighlight: 1,
        startView: 2,
        minView: 2,
        forceParse: 0,
        format: 'yyyy-mm-dd'
    });
    $("#qDateEnd").val(formatDatebyDay(new Date()));
    $("#qDateStart").val(fromDateByMonth(new Date()) + "-01");
    $(".glyphicon-remove").click(function (e) {
        $(this).parent().parent().find("input").val("");
        return false;
    });//日期旁边的‘差’，清除日期
})