//切换皮肤
function changeSkin(skinName) {
    
    var stylesheet = $("#skinLink").attr("href", "/css/skin/" + skinName + ".css").attr("href");
    document.cookie = "stylesheet=" + escape(stylesheet);
}
//初始化皮肤方法（以后可扩展为调用API获取用户自定义的样式名称）
function initSkin() {
    if (/stylesheet=([^;]+)/.test(document.cookie)) {
        var cookieStyle=unescape(RegExp.$1);
        $("#skinLink").attr("href",cookieStyle);
    }
    else {
        $("#skinLink").attr("href", "/css/skin/default.css");
    }
}
//初始化皮肤
initSkin();