/// <reference path="../common/tools.js" />
/// <reference path="base.js" />

$(function () {
    var pageJqueryObj = {inputEmail: $("#inputEmail"), inputPassword: $("#inputPassword"), inputCptcha: $("#inputCptcha"),
        btnLogin: $("#btnLogin"), divError: $(".texterror"), divEnter: $("#login_im"), getFormInput: $("input.form-control"), imageVcode: $('.yzm'), divFoot: $("#foot"), spanWebTitle: $("#citySystem")};
    //模拟登录
    //if(parseUrl("customer"))
//    sLogin(function(result){
//        console.log(result);
//       window.location.href='/index.html';
//    });
    function footCss() {//动态设置登录窗口外边距
        var $Hei = $(window).height() - $(".login_top").height() - $("#foot").height() - $("#login_con").height();
        if ($Hei < 100) {
            $Hei = 100;
        }
        $("#login_con").css({ "margin-top": $Hei / 2, "margin-bottom": $Hei / 2 })
    }

    function generateVerificationCode() {
        //生成验证码
        pageJqueryObj.imageVcode.attr('src', window.baseTools.getSecurityCode());
    }

    function getTenantByAPI(callback) {//获取租户信息
        var params = {params: {orderby: {}, query: {}, pagination: {}}};
        window.baseTools.getTenantList(params, callback);
    }

    function setWebSiteTitle(ccname) {//设置站点title
        var currentCityName = ccname|| "软通动力";//ccname==null?currentCity[10]:ccname;
        var txt = currentCityName + "政府舆情监测系统";
        pageJqueryObj.spanWebTitle.text(txt);
        document.title = txt + '登陆';
    }

    function getCurrentTenantName() {
        //清楚cookie
        clearCookie();
        var regex = new RegExp("^([a-zA-Z0-9_]){1,20}$");//验证英文
        var ccname = parseUrl("customer") || $.cookie(cookieInfo.ccname)||'xinxian';
        console.log(ccname);
        if (ccname) {//
            if (regex.test(ccname)) {//是英文
                getTenantByAPI(function (result) {
                    if (result && result.success) {
                        for (var i = 0; i < result.rows.length; i++) {
                            if (ccname.toLowerCase() == result.rows[i].alias.toLowerCase()) {
                                ccname = result.rows[i].name;
                                console.log(ccname);
                                setWebSiteTitle(ccname);
                                $.cookie(cookieInfo.ccname,ccname);//设置当前租户
                            }
                        }
                    }
                });
            } else {//中文
             setWebSiteTitle(ccname);
            }
        } else {//
            setWebSiteTitle();
        }

    }

    function validateData() {
        //初始化
        var inputEmail = pageJqueryObj.inputEmail;
        var inputPassword = pageJqueryObj.inputPassword;
        var inputCptcha = pageJqueryObj.inputCptcha;

        var ccname = $.cookie(cookieInfo.ccname);
        var user;
        //var chbRemValue = $('#chbRem')[0].checked
        var chbRemValue = false;
        if (inputEmail.val() == "") {
            inputEmail.focus();
            return;
        }
        if (inputPassword.val() == "") {
            inputPassword.focus();
            return;
        }
        if (inputCptcha.val() == "") {
            inputCptcha.focus();
            return;
        }
        if (inputEmail.val() != "" && inputPassword.val() != "" && inputCptcha.val() != "") {
            user = {
                cname: ccname, "userName": inputEmail.val(), "userPwd": inputPassword.val(),
                "isRem": chbRemValue, 'verificationCode': inputCptcha.val()
            };
        }
        return user;
    }

    function setAlertMessage(statusCode) {
        var alterMessage = ['验证码错误', "用户未启用请联系管理员", "无法登录舆情监测系统", "用户或密码错误"];
        var testRrror = pageJqueryObj.divError;
        var inputEmail = pageJqueryObj.inputEmail;
        var inputPassword = pageJqueryObj.inputPassword;
        var inputCptcha = pageJqueryObj.inputCptcha;
        var loginBtn = pageJqueryObj.btnLogin;
        switch (statusCode) {
            case -2:
                testRrror.text(alterMessage[0]);
                inputCptcha.focus().val("");
                break;
            case -3:
                testRrror.text(alterMessage[1]);
                inputEmail.focus().val("");
                break;
            case -4:
                testRrror.text(alterMessage[2]);
                inputEmail.focus().val("");
                break;
            default :
                testRrror.text(alterMessage[3]);
                inputEmail.focus();
                break;

        }
        generateVerificationCode();
        loginBtn.removeClass("loginloading");
    }

    function login() {
        var result = validateData();
        if (result) {
            pageJqueryObj.btnLogin.addClass("loginloading");
            window.baseTools.checkLogin(result, function (data) {
                switch (data.loginStatus) {
                    case 1:
                        initalCookie(data.clientInfo);
                        window.location.href = "/index.html#index";
                        break;
                    default:
                        setAlertMessage(data.loginStatus);
                        break;
                }
            }, function () {
                pageJqueryObj.btnLogin.removeClass("loginloading");
            });
        }
    }

    getCurrentTenantName();
    footCss();
    generateVerificationCode();
    //设置用户名焦点
    pageJqueryObj.inputEmail.focus();
    //注册事件
    pageJqueryObj.divEnter.keydown(function (e) {
        if (e.which == 13) {
            $("#btnLogin").trigger("click");
        }
    });
    pageJqueryObj.getFormInput.keydown(function () {
        $(".texterror").empty();
    });
    $(window).resize(function () {
        footCss();
    });
    pageJqueryObj.imageVcode.click(function () {
        generateVerificationCode();
    });
    pageJqueryObj.btnLogin.click(function () {
        login();
    });
    pageJqueryObj.divFoot.load("/common/footer.html");
    $("body").niceScroll(); //滚动条

});