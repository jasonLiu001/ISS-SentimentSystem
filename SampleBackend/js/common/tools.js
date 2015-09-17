//格式化日期，获取日期时分秒
function formDate(rowDate) {
    if (rowDate) {
        //rowDate = new Date(rowDate).toLocaleDateString().replace('年','-').replace('月','-').replace('日','');
        rowDate = new Date(rowDate);
        Y = rowDate.getFullYear();
        M = rowDate.getMonth() + 1;
        D = rowDate.getDate();
        //var s = d.toLocaleString();  // toLocaleString()在google浏览器和ie，火狐的结果不一样 
        var hh = rowDate.getHours(); //截取小时，即8 
        var mm = rowDate.getMinutes(); //截取分钟，即34    
        var ss = rowDate.getTime() % 60000; //获取时间，因为系统中时间是以毫秒计算的，所以秒要通过余60000得到。 
        ss = (ss - (ss % 1000)) / 1000; //然后，将得到的毫秒数再处理成秒 
        if (M < 10) {
            M = "0" + M;
        }
        if (D < 10) {
            D = "0" + D;
        }
        if (hh < 10) {
            hh = "0" + hh;
        }
        if (mm < 10) {
            mm = "0" + mm;
        }
        if (ss < 10) {
            ss = "0" + ss;
        }
        return Y + '-' + M + '-' + D + ' ' + hh + ":" + mm + ":" + ss;
    }
    return rowDate;
}

//截取字符串
function subString(str, len) {
    return str.substr(0, len);
}
//格式化日期，获取日期
function getDate(rowDate) {
    if (rowDate) {
        return rowDate.substr(0, 10);
    }
    return rowDate;
}
//初始化cookie
function initalCookie(params) {
    //var cookies = "clienttoken=" + params.ClientToken + "customername=" + params.CustomName + "customerid=" + params.TenantID + "userid=" + params.UserID + "username=" + params.UserName;
    document.cookie = "clienttoken=" + params.ClientToken;
    document.cookie = "customername=" + params.CustomName;
    document.cookie = "customerid=" + params.TenantID;
    document.cookie = "userid=" + params.UserID;
    document.cookie = "username=" + params.UserName;
    //document.cookie = cookies;
}
function getCookie(cookie) {
    var cookies = {};
    if (document.cookie) {
        var cookieArray = document.cookie.split(';');
        for (var i = 0; i < cookieArray.length; i++) {
            var array = cookieArray[i].split('=');
            cookies[array[0]]= array[1];
        }
        return cookies[cookie];
    }
}
function clearCookie() {
    var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    if (keys) {
        for (var i = keys.length; i--;)
            document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
    }
}
