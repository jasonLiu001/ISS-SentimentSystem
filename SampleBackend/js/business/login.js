
$(function () {
    $("body").niceScroll(); //滚动条
    clearCookie();
    function Footcss() {
        var $Hei = $(window).height() - 100;
        if ($Hei < 560) {
            $("#foot").css("position", "static")
            $("#login_con").css("margin-top", "150px");
        } else {
            $("#foot").removeAttr("style");
            $("#login_con").removeAttr("style");
        }
    }
    Footcss();
    $(window).resize(function () {
        Footcss();
    })
    function GenerateVerificationCode() {
        //生成验证码
        $('.yzm').attr('src', window.baseTools.getSecurityCode());
    }

    function Longin() {
        var inputEmail = $("#inputEmail").val();
        var inputPassword = $("#inputPassword").val();
        var inputCptcha = $("#inputCptcha").val();
        var chbRemValue = $('#chbRem')[0].checked;
        if (inputEmail != "" && inputPassword != "" && inputCptcha != "") {
            var user = {
                "userName": inputEmail, "userPwd": inputPassword,
                "isRem": chbRemValue, 'verificationCode': inputCptcha
            };
            window.baseTools.checkLogin(user, function (data) {
                switch (data.loginStatus) {
                    case 1:
                        //window.global.UserInfo.ClientToken = data.ClientToken;
                        //window.global.UserInfo.CustomerId = data.TenantID;
                        //window.global.UserInfo.CustomerName = data.CustomName;
                        //window.global.UserInfo.UserId = data.UserId;
                        //window.global.UserInfo.UserName = data.UserName;
                          initalCookie(data.clientInfo);
                        window.location.href = "/index.html";
                        break;
                    case -2:
                        alert("验证码错误");
                        GenerateVerificationCode();
                        break;
                    default:
                        alert("密码或者用户名错误");
                        GenerateVerificationCode();
                        break;
                }
            });
        } else {
            $(".texterror").text("用户名密码验证码不能为空！")
        }
    }
    $('.yzm').click(function () {
        GenerateVerificationCode();
    });
    $("#btnLogin").click(function () {
        Longin();
    })
    GenerateVerificationCode();
});