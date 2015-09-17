/**
 * Created by wang on 2014/9/3.
 */

$(function () {
//    var deploy_sit = $('#deploy_sit');
//    var deploy_prod=$('#deploy_prod');
//    var btn_data_init = $('#data_init_sit');
//    var btn_clear_calculated = $('#data_init_prod');

    $('#deploy_sit').click(function () {
        var verion=$("#txtVersion")[0].value;
        $.get('/api/middleware/initializer/Deploy/sit?ver='+verion, function (data) {
            if (data.success === true) {
                showResult(successMsg);
            }
            else {
                showResult(errorMsg + data.message);
            }
        });
    });

    $('#deploy_prod').click(function () {
        var verion=$("#txtVersion")[0].value;
        $.get('/api/middleware/initializer/Deploy/prod?ver='+verion, function (data) {
            if (data.success === true) {
                showResult(successMsg);
            }
            else {
                showResult(errorMsg + data.message);
            }
        });
    });

    $('#data_init_sit').click(function () {
        $.get('/api/middleware/initializer/cleanData/sit', function (data) {
            if (data.success === true) {
                showResult(successMsg);
            } else {
                showResult(errorMsg + data.message);
            }
        });
    });

    $('#data_init_prod').click(function () {
        $.get('/api/middleware/initializer/cleanData/prod', function (data) {
            if (data.success === true) {
                showResult(successMsg);
            } else {
                showResult(errorMsg + data.message);
            }
        });
    });
});

var successMsg = "命令执行成功！请刷新相关页面！";
var errorMsg = "操作失败！错误信息：";

function showResult(msg) {
    var resultDiv = $('#result');
    resultDiv.html(msg);
    setTimeout(function () {
        resultDiv.html('');
    }, 10000);
}