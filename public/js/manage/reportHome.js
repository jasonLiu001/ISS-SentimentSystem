/**
 * Created by linux on 14-11-15.
 */
$(function () {
    //运维报告列表初始化
    pageContextInit();

    //初始化【删除】模态对话框中的内容
    initDelModelContext();

    //初始化【添加】和【修改】模态对话框内容
    initAddNewModalContext();

    //初始化Form验证
    initFormValidation();

    //初始化[检查点预览]和[整个报告预览]对话框内容
    initReportReviewContext();

});

/**************定义 全局变量 开始******************/
var reportVersion_01 = "V1.0";//运维报告版本
var reportVersion_02 = "V2.0";//运维报告版本
var reportV2AutoFillMessage = "2.0报告无需此配置";
/**************定义 全局变量 结束******************/

/**
 *
 * 初始化Form验证
 * */
function initFormValidation() {
    //初始化[基础设置]form 验证
    $('#form-basic-settings').validate({
        rules: {
            db_ip: {
                required: true
            },
            db_port: {
                required: true
            },
            db_dbname: {
                required: true
            },
            db_username: {
                required: true
            },
            db_passwd: {
                required: true
            },
            report_tablenames: {
                required: true
            },
            report_querysql: {
                required: true
            }
        },
        messages: {
            db_ip: {
                required: "数据库IP地址不能为空！"
            },
            db_port: {
                required: "数据库对应端口号不能为空！"
            },
            db_dbname: {
                required: '数据库名称不能为空！'
            },
            db_username: {
                required: "数据库用户名不能为空！"
            },
            db_passwd: {
                required: "数据库密码不能为空！"
            },
            report_tablenames: {
                required: "在报告中显示的中文或英文表名不能为空！"
            },
            report_querysql: {
                required: "生成报告的sql不能为空！"
            }
        }
    });
    //初始化[邮件设置]form 验证
    $('#form-email-settings').validate({
        rules: {
            email_smtp_server: {
                required: true
            },
            email_port: {
                required: true
            },
            email_sender: {
                required: true,
                email: true
            },
            email_passwd: {
                required: true
            },
            report_templatepath: {
                required: true
            },
            report_title: {
                required: true
            },
            email_reciever: {
                required: true
            },
            email_sendTimes: {
                required: true
            }
        },
        messages: {
            email_smtp_server: {
                required: "邮箱SMTP服务器地址不能为空！"
            },
            email_port: {
                required: "邮箱SMTP服务器端口不能为空！"
            },
            email_sender: {
                required: "邮箱用户名不能为空！",
                email: "E-mail地址不合法，请重新填写！"
            },
            email_passwd: {
                required: "邮箱登录密码不能为空！"
            },
            report_templatepath: {
                required: "模板路径不能为空！"
            },
            report_title: {
                required: "邮件标题不能为空！"
            },
            email_reciever: {
                required: "邮件收件人列表不能为空！"
            },
            email_sendTimes: {
                required: "邮件定时发送时间不能为空！"
            }
        }
    });
}

/**
 *
 * 初始化预览对话框内容
 * */
function initReportReviewContext() {
    $('#modal_reportView').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);// Button that triggered the modal
        var optionType = button.data('optiontype'); // Extract info from data-* attributes
        var modal = $(this);
        var btnSave = modal.find('#modal_btn_previewConfirm');
        var modalTitle = modal.find('#reportPreview_ModalLabel');
        switch (optionType) {
            case "preview":
            {
                var rowId = button.data('previewid');
                btnSave.text("确定");
                btnSave.removeAttr('value');
                modalTitle.text('报告内容  预览');
                //加载页面时，首先清空页面内容
                $('#modal_reportView .modal-body .container').empty().append(loadingProcessing());
                loadReportContext(rowId);
                //首先移除之前注册的所有事件
                btnSave.unbind();
                //模式对话框中的预览按钮
                btnSave.click(btnContextPreviewHandler);
            }
                break;
            case "preview_all":
            {
                btnSave.text("确定");
                btnSave.removeAttr('value');
                modalTitle.text('完整报告  内容预览');
                //加载页面时，首先清空页面内容
                $('#modal_reportView .modal-body .container').empty().append(loadingProcessing());
                previewEntireReport();
                //首先移除之前注册的所有事件
                btnSave.unbind();
                //模式对话框中的预览按钮
                btnSave.click(btnContextPreviewHandler);
            }
                break;
        }
    });
    $('#modal_reportView').on('hide.bs.modal', function (event) {
        $('#modal_reportView .modal-body .container').empty();
        $('#action_message').text('');
    });
}

/**
 *
 * 加载资源
 * */
function loadingProcessing() {
    var loadingString = "<div style='text-align: center'><img src='../img/load.gif'></div>";
    return loadingString;
}

/**
 *
 * 预览完整的报告内容
 * */
function previewEntireReport() {
    $.ajax({
        url: "/maintain/report/executeAction",
        type: "POST",
        data: {
            executeAction: "previewEntireReport",
            rowId: null
        },
        success: function (result) {
            var data = result.data;
            if (result.success) {
                $('#modal_reportView .modal-body .container').empty().append(data);
            } else {
                var errMessage = result.actionMessage;
                $('#modal_reportView .modal-body .container').empty().append(errMessage);
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}

/**
 *
 * 初始化【添加】和【修改】模态对话框内容
 * */
function initAddNewModalContext() {
    $('#modal_addNewReport').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);// Button that triggered the modal
        var optionType = button.data('optiontype'); // Extract info from data-* attributes
        //区分需要修改的报告类型
        var reportVersion = button.data('reportversion');
        var modal = $(this);
        var btnSave = modal.find('#modal_btn_addNewAndSave');
        var modalTitle = modal.find('#addnew_ModalLabel');
        $('#addnew_Modal_errMessage').text('');
        switch (optionType) {
            case "update"://修改
            {
                var rowId = button.data('updateid');
                btnSave.text("修改并保存");
                btnSave.val(rowId);
                modalTitle.text('运维报告参数修改');
                //填充控件
                fillControlContext(rowId);
                //根据报告版本控制控件状态
                disableOrEnableControl(reportVersion);
                //首先移除之前注册的所有事件
                btnSave.unbind();
                //模式对话框中的修改按钮 注册新事件
                btnSave.click(updateBtnHandler);
            }
                break;
            case "new"://添加
            {
                btnSave.text("保存");
                btnSave.removeAttr('value');
                modalTitle.text('添加新运维检查点');
                //清空控件内容
                clearControlContext();
                //启用2.0中已经禁用的控件
                enableUnusedControl();
                //首先移除之前注册的所有事件
                btnSave.unbind();
                //模式对话框中的添加按钮
                btnSave.click(addNewBtnHandler);
            }
                break;
            case "new_V2"://添加运维2.0报告
            {
                btnSave.text("保存");
                btnSave.removeAttr('value');
                modalTitle.text('添加运维报告V2.0');
                //清空控件内容
                clearControlContext();
                //停用V2.0中不需要的控件
                disabledAndFillUnusedControl();
                //首先移除之前注册的所有事件
                btnSave.unbind();
                //模式对话框中的添加按钮
                btnSave.click(addNewBtnHandlerV2);
            }
        }
    });
}

/**
 *
 * 加载报告内容
 * @param {String} id
 * */
function loadReportContext(id) {
    $.ajax({
        url: "/maintain/report/executeAction",
        type: "POST",
        data: {
            executeAction: "getReportContentById",
            rowId: id
        },
        success: function (result) {
            var data = result.data;
            if (result.success) {
                $('#modal_reportView .modal-body .container').empty().append(data);
            } else {
                var errMessage = result.actionMessage;
                $('#modal_reportView .modal-body .container').empty().append(errMessage);
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}

/**
 *
 * 预览确定按钮
 * */
function btnContextPreviewHandler() {
    $('#modal_reportView').modal("hide");
}

/**
 *
 * @summary 添加按钮事件
 * */
function addNewBtnHandler() {
    //添加运维报告V1.0
    addNewCheckPointReport("1");
}

/**
 *
 * @summary 添加按钮事件
 * */
function addNewBtnHandlerV2() {
    //添加运维报告V2.0
    addNewCheckPointReport("2");
}

/**
 *
 * @param {String} reportVersion 当然添加的报告版本 1=V1.0 2=V2.0 以此类推
 * */
function addNewCheckPointReport(reportVersion) {
    var basicSettingForm = $('#form-basic-settings');
    var emailSettingForm = $('#form-email-settings');
    if (basicSettingForm.valid() && emailSettingForm.valid()) {
        $.ajax({
            url: "/maintain/report/executeAction",
            type: "POST",
            data: {
                executeAction: "addNew",
                rowId: null,
                values: {
                    db_ip: $('#db_ip').val(),
                    db_port: $('#db_port').val(),
                    db_dbname: $('#db_dbname').val(),
                    db_username: $('#db_username').val(),
                    db_passwd: $('#db_passwd').val(),
                    report_querysql: $('#report_querysql').val(),
                    report_tablenames: $('#report_tablenames').val(),
                    email_smtp_server: $('#email_smtp_server').val(),
                    email_port: $('#email_port').val(),
                    email_sender: $('#email_sender').val(),
                    email_passwd: $('#email_passwd').val(),
                    report_templatepath: $('#report_templatepath').val(),
                    report_title: $('#report_title').val(),
                    email_reciever: $('#email_reciever').val(),
                    email_cc: $('#email_cc').val(),
                    email_sendTimes: $('#email_sendTimes').val(),
                    report_version:reportVersion
                }
            },
            success: function (result) {
                $('#modal_addNewReport').modal('hide');
                if (result.success) {//添加成功
                    pageContextInit();//初始化表格
                }
                showActionMessage(result);

            },
            error: function (err) {
                console.log(err);
            }
        });
    }
}

/**
 *
 * @summary 修改按钮事件
 * */
function updateBtnHandler() {
    var id = $(this).val();
    updateFieldValue(id);
}

/**
 *
 * update data to db.
 * @param {String} id
 * */
function updateFieldValue(id) {
    var basicSettingForm = $('#form-basic-settings');
    var emailSettingForm = $('#form-email-settings');
    if (basicSettingForm.valid() && emailSettingForm.valid()) {
        $.ajax({
            url: "/maintain/report/executeAction",
            type: "POST",
            data: {
                executeAction: "updateById",
                rowId: id,
                values: {
                    db_ip: $('#db_ip').val(),
                    db_port: $('#db_port').val(),
                    db_dbname: $('#db_dbname').val(),
                    db_username: $('#db_username').val(),
                    db_passwd: $('#db_passwd').val(),
                    report_querysql: $('#report_querysql').val(),
                    report_tablenames: $('#report_tablenames').val(),
                    email_smtp_server: $('#email_smtp_server').val(),
                    email_port: $('#email_port').val(),
                    email_sender: $('#email_sender').val(),
                    email_passwd: $('#email_passwd').val(),
                    report_templatepath: $('#report_templatepath').val(),
                    report_title: $('#report_title').val(),
                    email_reciever: $('#email_reciever').val(),
                    email_cc: $('#email_cc').val(),
                    email_sendTimes: $('#email_sendTimes').val()
                }
            },
            success: function (result) {
                $('#modal_addNewReport').modal('hide');
                if (result.success) {
                    pageContextInit();//初始化表格
                }
                showActionMessage(result);
            },
            error: function (err) {
                console.log(err);
            }
        });
    }
}

/**
 *
 * 启用V2.0报告中不需要的控件
 * */
function enableUnusedControl() {
    $('#db_ip').attr({disabled: false});
    $('#db_port').attr({disabled: false});
    $('#db_dbname').attr({disabled: false});
    $('#db_username').attr({disabled: false});
    $('#db_passwd').attr({disabled: false});
    $('#report_querysql').attr({disabled: false});
    $('#report_tablenames').attr({disabled: false});
}

/**
 *
 * 根据报告的版本启用或者禁用控件
 * */
function disableOrEnableControl(reportVersion) {
    if (reportVersion == reportVersion_02) {
        //禁用2.0报告中不需要的控件
        disabledAndFillUnusedControl();
    } else if (reportVersion == reportVersion_01) {
        //启用2.0报告中不需要的控件
        enableUnusedControl();
    }
}

/**
 *
 * 禁用V2.0报告中不需要的控件
 * */
function disabledAndFillUnusedControl() {
    $('#db_ip').val(reportV2AutoFillMessage);
    $('#db_ip').attr({disabled: true});
    $('#db_port').val(reportV2AutoFillMessage);
    $('#db_port').attr({disabled: true});
    $('#db_dbname').val('mysql');
    $('#db_dbname').attr({disabled: true});
    $('#db_username').val(reportV2AutoFillMessage);
    $('#db_username').attr({disabled: true});
    $('#db_passwd').val(reportV2AutoFillMessage);
    $('#db_passwd').attr({disabled: true});
    $('#report_querysql').val(reportV2AutoFillMessage);
    $('#report_querysql').attr({disabled: true});
    $('#report_tablenames').val(reportV2AutoFillMessage);
    $('#report_tablenames').attr({disabled: true});
}

/**
 *
 * 清空控件内容并初始化一些基本信息
 * */
function clearControlContext() {
    $('#db_ip').val('');
    $('#db_port').val('3306');
    $('#db_dbname').val('mysql');
    $('#db_username').val('');
    $('#db_passwd').val('');
    $('#report_querysql').val('');
    $('#report_tablenames').val('');
    $('#email_smtp_server').val('smtp.isoftstone.com');
    $('#email_port').val('25');
    $('#report_templatepath').val('/manage/reportTemplate.html');
    $('#report_title').val('');
    $('#email_sender').val('');
    $('#email_passwd').val('');
    $('#email_reciever').val('');
    $('#email_cc').val('');
    $('#email_sendTimes').val('');
//// 添加新运维检查点时的自动填充操作
//    $.ajax({
//        url: "/maintain/report/executeAction",
//        type: "POST",
//        data: {
//            executeAction: "getTopRecord",
//            rowId: null
//        },
//        success: function (result) {//这里不需要显示错误信息
//           var data=result.data;
//           if(data.length>0){
//               var row=data[0];
//               $('#email_sender').val(row["email_sender"]);
//               $('#email_passwd').val(row["email_passwd"]);
//               $('#email_reciever').val(row['email_reciever']);
//               $('#email_cc').val(row['email_cc']);
//               $('#email_sendTimes').val(row['email_sendTimes']);
//           }else{
//               $('#email_sender').val('');
//               $('#email_passwd').val('');
//               $('#email_reciever').val('');
//               $('#email_cc').val('');
//               $('#email_sendTimes').val('');
//           }
//        },
//        error: function (err) {
//            console.log(err);
//            $('#email_sender').val('');
//            $('#email_passwd').val('');
//            $('#email_reciever').val('');
//            $('#email_cc').val('');
//            $('#email_sendTimes').val('');
//        }
//    });
}

/**
 *
 * 填充控件内容
 * *
 * */
function fillControlContext(id) {
    $.ajax({
        url: "/maintain/report/executeAction",
        type: "POST",
        data: {
            executeAction: "getDataById",
            rowId: id
        },
        success: function (result) {
            if (!result.success) {
                $('#addnew_Modal_errMessage').text(result.actionMessage);
            }
            initUpdateModalContext(result);
        },
        error: function (err) {
            console.log(err);
        }
    });
}

/**
 *
 * 发送ajax请求
 * @param {String} url
 * @param {String} actionName
 * @param {String} rowId
 * @param {Function} successFun
 * */
function fireAjaxPostRequest(url, actionName, rowId, successFun) {
    $.ajax({
        url: url,
        type: "POST",
        data: {
            executeAction: actionName,
            rowId: rowId
        },
        success: function (result) {
            successFun(result);
        },
        error: function (err) {
            console.log(err);
        }
    });
}

/**
 *
 * 初始化修改modal中的字段信息
 * @param {Object} result
 * */
function initUpdateModalContext(result) {
    var data = result.data;
    if (result.success) {
        if (data.length > 0) {
            var row = data[0];
            $('#db_ip').val(row["db_ip"]);
            $('#db_port').val(row["db_port"]);
            $('#db_dbname').val(row["db_dbname"]);
            $('#db_username').val(row["db_username"]);
            $('#db_passwd').val(row["db_passwd"]);
            $('#report_tablenames').val(row["report_tablenames"]);
            $('#report_querysql').val(row["report_querysql"]);
            $('#email_smtp_server').val(row["email_smtp_server"]);
            $('#email_port').val(row["email_port"]);
            $('#email_sender').val(row["email_sender"]);
            $('#email_passwd').val(row["email_passwd"]);
            $('#report_templatepath').val(row["report_templatepath"]);
            $('#report_title').val(row["report_title"]);
            $('#email_reciever').val(row["email_reciever"]);
            $('#email_cc').val(row["email_cc"]);
            $('#email_sendTimes').val(row["email_sendTimes"]);
        }
    } else {
        console.log(result.actionMessage);
    }
}

/**
 *
 * @summary 更新删除模态对话框中的内容
 * */
function initDelModelContext() {
    $('#delConfirmModel').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);// Button that triggered the modal
        // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
        // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
        var optionType = button.data('optiontype'); // Extract info from data-* attributes
        var modal = $(this);
        var btnDel = modal.find('#model_btn_delete');
        var modalTitle = modal.find('#del_ModalLabel');
        var messageBody = modal.find('#modal_delBodyContext');
        switch (optionType) {
            case "start"://启动按钮
            {
                var rowId = button.data('startid'); // Extract info from data-* attributes
                btnDel.val(rowId);
                modalTitle.text("操作提示");
                btnDel.text("确定");
                messageBody.text("确认启用自动发送报告？");
                btnDel.unbind();
                btnDel.click(modelBtnStart);
            }
                break;
            case "stop"://停止按钮
            {
                var rowId = button.data('stopid'); // Extract info from data-* attributes
                btnDel.val(rowId);
                modalTitle.text("操作提示");
                btnDel.text("确定");
                messageBody.text("确认停止自动发送报告？");
                btnDel.unbind();
                btnDel.click(modelBtnStop);
            }
                break;
            case "delete"://删除确认按钮
            {
                var rowId = button.data('deleteid'); // Extract info from data-* attributes
                btnDel.val(rowId);
                modalTitle.text("删除确认");
                btnDel.text("删除");
                messageBody.text("是否确定删除该运维报告？删除后无法恢复！");
                btnDel.unbind();
                //模式对话框中的删除按钮事件
                btnDel.click(modelBtnDeleteHandler);
            }
                break;
            case "start_all"://启动所有任务
            {
                modalTitle.text("操作提示");
                btnDel.text("确定");
                messageBody.text("确认启用自动发送报告？");
                btnDel.unbind();
                //模式对话框中的删除按钮事件
                btnDel.click(modelBtnStartAll);
            }
                break;
            case "stop_all"://停止所有任务
            {
                modalTitle.text("操作提示");
                btnDel.text("确定");
                messageBody.text("确认停止自动发送报告？");
                btnDel.unbind();
                //模式对话框中的删除按钮事件
                btnDel.click(modelBtnStopAll);
            }
                break;
        }
    });
}
/**
 *
 *
 * */
function modelBtnStopAll() {
    $.ajax({
        url: "/maintain/report/executeAction",
        type: "POST",
        data: {
            executeAction: "stopAllCheckPoint",
            rowId: "all"
        },
        success: function (result) {
            ajaxSuccessFun(result);
        },
        error: function (err) {
            console.log(err);
        }
    });
}

/**
 *
 * 启动所有检查点任务
 * */
function modelBtnStartAll() {
    $.ajax({
        url: "/maintain/report/executeAction",
        type: "POST",
        data: {
            executeAction: "startAllSchedule",
            rowId: "all"
        },
        success: function (result) {
            ajaxSuccessFun(result);
        },
        error: function (err) {
            console.log(err);
        }
    });
}

/**
 *
 * 停止任务
 * */
function modelBtnStop() {
    var id = $(this).val();
    fireAjaxPostRequest("/maintain/report/executeAction", "stopScheduleById", id, ajaxSuccessFun);
}

/**
 *
 *  启动任务
 * */
function modelBtnStart() {
    var id = $(this).val();
    fireAjaxPostRequest("/maintain/report/executeAction", "startScheduleById", id, ajaxSuccessFun);
}

/**
 *
 * @summary delete the report row data.
 * */
function modelBtnDeleteHandler() {
    var id = $(this).val();
    fireAjaxPostRequest("/maintain/report/executeAction", "deleteRow", id, ajaxSuccessFun);
}

/**
 *
 * ajax调用成功后执行方法
 * */
function ajaxSuccessFun(result) {
    if (result.success) {
        pageContextInit();//初始化表格
    }
    showActionMessage(result);
    $('#delConfirmModel').modal("hide");
}

/**
 *
 * @summary 初始化页面内容[包括分页]
 * */
function pageContextInit() {
    //清空页面错误信息
    $('#action_message').text('');
    var request = $.ajax({url: "/maintain/report/getReportList",
        type: "POST",
        data: {
            start: 1,
            count: 8
        },
        success: function (result) {
            showReportTableBody(result);//加载table中的body体
            //加载分页
            loadPaginationComponent(result);
            if (!result.success) {//错误提示
                showActionMessage(result);
            }

        },
        error: function (err) {
            console.log(err);
            //错误显示
        }
    });
}

/**
 *
 * 提示错误消息
 * @param {Object} result
 * */
function showActionMessage(result) {
    $('#action_message').text(result.actionMessage);
}

/**
 *
 * 加载分页组件
 * @param {Object} result
 * */
function loadPaginationComponent(result) {
    var totalCount = result.total;
    $('#data_pagination').pagination({
        items: totalCount,
        itemsOnPage: 8,
        cssStyle: 'light-theme',
        prevText: '上一页',
        nextText: '下一页',
        onPageClick: function (pageNumber, eTarget) {
            var request = $.ajax({url: "/maintain/report/getReportList",
                type: "POST",
                data: {
                    start: pageNumber,
                    count: 8
                },
                success: function (bodyData) {
                    showReportTableBody(bodyData);//加载table中的body体
                    showActionMessage(bodyData);//错误提示信息
                },
                error: function (err) {
                    console.log(err);
                }
            });
        }
    });
}

/**
 *
 * @summary 展示报告内容
 * */
function showReportTableBody(result) {
    var rows = result.data;
    if (rows.length > 0) {
        $('#report_table tbody').empty();//清空表体数据
        rows.forEach(function (row, position) {
            var trString = "";
            var rowIndex = position + 1;//行序号
            var reportTitle = row["report_title"];
            var job_status = Number(row["job_status"]);
            if (job_status == 0) {
                job_status = "未运行";
            } else {
                job_status = "运行中";
            }
            var id = row["id"];
            var report_version = Number(row["report_version"]);//报告版本
            if (report_version == 1) {
                report_version = reportVersion_01;
            } else {
                report_version = reportVersion_02;
            }
            trString += "<tr>" + "<td>" + rowIndex + "</td>" + "<td>" + reportTitle + "</td>" + "<td style='color: #ff0000'>" + job_status + "</td>" +
                "<td>" + getOptionsButton("btn_start", report_version, id, "启动") + getOptionsButton("btn_stop", report_version, id, "停止") + "</td>" + "<td>" + getOptionsButton("btn_preview", report_version, id, "预览") + "</td>" +
                "<td>" + getOptionsButton("btn_update", report_version, id, "修改") + getOptionsButton("btn_delete", report_version, id, "删除") + "</td><td>" + report_version + "</td>";
            $('#report_table tbody').append(trString);//填充
            //如果任务已经启动，则不能删除和修改操作
            var btnUpdate = "button[data-updateid=" + id + "]";//修改按钮
            var btnDelete = "button[data-deleteid=" + id + "]";//停止按钮
            var btnStart = "button[data-startid=" + id + "]";//启动按钮
            if (job_status == "未运行") {
                $(btnUpdate).attr('disabled', false);
                $(btnDelete).attr('disabled', false);
                $(btnStart).attr('disabled', false);
            } else {
                $(btnUpdate).attr('disabled', true);
                $(btnDelete).attr('disabled', true);
                $(btnStart).attr('disabled', true);
            }
        });
    } else {
        var trString = "<tr><td colspan='7'>没有可显示的数据</td></tr>";
        $('#report_table tbody').empty().append(trString);//填充
    }
}

/**
 *
 * @summary 产生操作按钮
 * @param {String} type 按钮执行的动作类型
 * @param {Number} reportVersion 报告类型
 * @param {String} id 数据行id
 * @param {String} text 按钮上的文字
 * */
function getOptionsButton(type, reportVersion, id, text) {
    var btnString = '';
    switch (type) {
        case 'btn_start'://启动
            btnString = "<button type=\"button\" style=\"margin-right: 4px\" class=\'btn btn-primary\' data-toggle=\"modal\" data-target=\"#delConfirmModel\" data-optiontype=\'start\' data-startid=\'" + id + "\'>" + text + "</button>";
            break;
        case 'btn_stop'://停止
            btnString = "<button type=\"button\" class=\'btn btn-primary\' data-toggle=\"modal\" data-target=\"#delConfirmModel\" data-optiontype=\'stop\'  data-stopid=\'" + id + "\'>" + text + "</button>";
            break;
        case 'btn_preview'://预览
            btnString = "<button type=\"button\" class=\'btn btn-primary\' data-toggle=\"modal\" data-target=\"#modal_reportView\" data-optiontype=\'preview\'  data-previewid=\'" + id + "\'>" + text + "</button>";
            break;
        case 'btn_update':
            btnString = "<button type=\"button\" style=\"margin-right: 4px\" class=\'btn btn-primary\' data-toggle=\"modal\" data-target=\"#modal_addNewReport\" data-optiontype=\'update\' data-reportversion=\'" + reportVersion + "\'  data-updateid=\'" + id + "\'>" + text + "</button>";
            break;
        case 'btn_delete':
            btnString = "<button type=\"button\" class=\'btn btn-primary\' data-toggle=\"modal\" data-target=\"#delConfirmModel\" data-optiontype=\'delete\' data-deleteid=\'" + id + "\'>" + text + "</button>";
            break;
    }


    return btnString;
}