/**
 * Created by blade on 2014/9/25.
 */
//获取租户
function GetTenant(callback) {
    var params = {params: {orderby: {}, query: {}, pagination: {}}};
    window.baseTools.getTenantList(params, callback);
}
//通过获取querystring 模拟登录
function sLogin(callback) {
    var customername = parseUrl("customer");
    if (customername == "") {
        var currentCustomer = window.global.UserInfo.CustomerName;//获取正常登录租户名称
        var fullCustomerName= window.global.UserInfo.FullCustomerName;
        if (currentCustomer) {
            var result = {CustomerName: currentCustomer,FullCustomerName:fullCustomerName};
            if(callback)
                callback(result);
            return;
        } else {
            customername = "beijing";//默认登录北京
        }

    }
    var apiLogin = "/api/authentication/apiLogin";
    GetTenant(function (result) {
        if (result && result.success) {
            for (var i = 0; i < result.rows.length; i++) {
                if (customername.toLowerCase() == result.rows[i].alias.toLowerCase()) {
                    var currentUser = {"userName": customername.toLowerCase(), "userPwd": "123456", CustomerName: result.rows[i].customer_names,FullCustomerName: result.rows[i].name};
                    ajaxRequest(apiLogin, currentUser, callback);
                }
            }
        }
    });
}
//通过获取参数模拟登录
function pLogin(params,callback) {
    var customername = params
    if (customername == "") {
        var currentCustomer = window.global.UserInfo.CustomerName;//获取正常登录租户名称
        var fullCustomerName= window.global.UserInfo.FullCustomerName;
        if (currentCustomer) {
            var result = {CustomerName: currentCustomer,FullCustomerName:fullCustomerName};
            if(callback)
                callback(result);
            return;
        } else {
            customername = "beijing";//默认登录北京
        }

    }
    var apiLogin = "/api/authentication/apiLogin";
    GetTenant(function (result) {
        if (result && result.success) {
            for (var i = 0; i < result.rows.length; i++) {
                if (customername.toLowerCase() == result.rows[i].alias.toLowerCase()) {
                    var currentUser = {"userName": customername.toLowerCase(), "userPwd": "123456", CustomerName: result.rows[i].customer_names,FullCustomerName: result.rows[i].name};
                    ajaxRequest(apiLogin, currentUser, callback);
                }
            }
        }
    });
}
function ajaxRequest(apiLogin, currentUser, callback) {
    $.ajax({
        url: apiLogin,
        dataType: "json",
        sync: false,
        cache: false,
        data: currentUser,
        type: "post",
        success: function (result) {
            if (result) {
                clearCookie();
                initalCookie(result.clientInfo);
                $.cookie("authentication", result.clientInfo.ClientToken);
                callback(currentUser);
            }
        }
    });
}