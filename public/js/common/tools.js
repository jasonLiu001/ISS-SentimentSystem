/// <reference path="../jquery.cookie.js" />
//格式化日期，返回日期格式,2014-08-10 12:23:45
function formatDate(rowDate) {
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
//格式化日期，返回日期格式,2014年08月10日 12:23:45
function formatDateCN(rowDate) {
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
        return Y + '年' + M + '月' + D + '日' + hh + ":" + mm + ":" + ss;
    }
    return rowDate;
}
//日期格式化 补零
function formatDateType(date, type) {

    var vdate = new Date(date);
    var y = vdate.getFullYear();
    var M = vdate.getMonth() + 1;
    var D = vdate.getDate();
    var hh = vdate.getHours();
    var mm = vdate.getMinutes();
    var ss = vdate.getSeconds();

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
    var retVal = y + "-" + M + "-" + D;
    if (type == "day") {
        retVal += " 00:00:00";
    }
    if (type == "hour") {
        retVal += " " + hh+":00:00";
    }
    if (type == "min") {
        retVal += ":" +hh+":"+ mm + ":00";
    }
    if (type == "sec") {
        retVal += ":" +ss;
    }
    return retVal;
}///格式化日期
function fromDateByMonth(date) {
    if (date) {
        date = new Date(date);
        Y = date.getFullYear();
        M = date.getMonth() + 1;
        if (M < 10) {
            M = "0" + M;
        }
    }
    return Y + "-" + M;
}

//格式化日期，返回日期格式
function formatDatebyDay(rowDate) {
    if (rowDate) {
        rowDate = new Date(rowDate);
        Y = rowDate.getFullYear();
        M = rowDate.getMonth() + 1;
        D = rowDate.getDate();
        if (M < 10) {
            M = "0" + M;
        }
        if (D < 10) {
            D = "0" + D;
        }

    }
    return Y + "-" + M + "-" + D;
}

//比较目标日期与今日日期是否相同，返回bool
function isToday(date) {
    var mdate = formatDatebyDay(date);
    var tdate = formatDatebyDay(new Date());
    return mdate == tdate;
}

//比较目标日期是否小于今日日期，返回bool
function isLessThanToday(date) {
    var mdate = formatDatebyDay(date);
    var tdate = formatDatebyDay(new Date());
    mdate = new Date(mdate);
    tdate = new Date(tdate);
    return mdate <= tdate;
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
var cookieInfo = {
    token: "clienttoken",
    cname: "customername",
    fcname:"fullcustomername",
    cid: "customerid",
    uid: "userid",
    uname: "username",
    ccname:"currentcname",//标识从地图页进来的租户
    expIn: { expires: 1000 * 60 * 30 },
    expOut: { expires: -1 }
};
//初始化cookie
function initalCookie(params) {
    $.cookie(cookieInfo.token, params.ClientToken, cookieInfo.exp);
    $.cookie(cookieInfo.cname, params.CustomName, cookieInfo.exp);
    $.cookie(cookieInfo.cid, params.TenantID, cookieInfo.exp);
    $.cookie(cookieInfo.uid, params.UserID, cookieInfo.exp);
    $.cookie(cookieInfo.uname, params.UserName, cookieInfo.exp);
    $.cookie(cookieInfo.fcname, params.FullCustomerName, cookieInfo.exp);

}
function clearCookie() {//清楚用户登录以后保存cookie
    $.cookie(cookieInfo.token, '', cookieInfo.expOut);
    $.cookie(cookieInfo.cname, '', cookieInfo.expOut);
    $.cookie(cookieInfo.cid, '', cookieInfo.expOut);
    $.cookie(cookieInfo.uid, '', cookieInfo.expOut);
    $.cookie(cookieInfo.uname, '', cookieInfo.expOut);
}
function clearCookieAll(){
    var keys=document.cookie.match(/[^ =;]+(?=\=)/g);
    if (keys) {
        for (var i = keys.length; i--;)
            document.cookie=keys[i]+'=0;expires='+new Date(0).toUTCString();
    }
}
function parseUrl(arg, url) {//解析URL
    var url = url || window.location.toString();
    if(arg){
    var urlArray=url.split('?');
    var keyValue;
    var result={};
    if(urlArray.length>1){
       urlArray=urlArray[1].split('&');
      for(var i=0;i<urlArray.length;i++){
          keyValue=urlArray[i].split('=');
         if(keyValue.length>1)
             result[keyValue[0]]=keyValue[1];
      }
    }
    }else{
        return '';
    }
    if(result[arg]==undefined){
        return '';
    }
return result[arg];
}