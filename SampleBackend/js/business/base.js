/*与API交互接口*/
(function () {
    var domain = "http://localhost:1337";
    window.baseTools = {
        addModule:function(parameters, callback){
            var self = this;
            var path = "/api/manage/SaveModel";
            self.editData(path, parameters, callback);
        },
        editModule:function(parameters, callback){
            var self = this;
            var path = "/api/manage/SaveModel";
            self.editData(path, parameters, callback,"put");
        },
        deleteModule:function(parameters, callback){
            var self = this;
            var path = "/api/manage/SaveModel";
            self.editData(path, parameters, callback,"delete");
        },
        getModuleList: function (parameters, callback) {//获取用户列表
            var self = this;
            var url = domain + "/api/manage/GetModelList";
            parameters = { params: parameters };
            self.getData(url, parameters, callback);
        },
        addApi:function(parameters, callback){
            var self = this;
            var path = "/api/manage/SaveApi";
            self.editData(path, parameters, callback);
        },
        editApi:function(parameters, callback){
            var self = this;
            var path = "/api/manage/SaveApi";
            self.editData(path, parameters, callback,"put");
        },
        deleteApi:function(parameters, callback){
            var self = this;
            var path = "/api/manage/SaveApi";
            self.editData(path, parameters, callback,"delete");
        },
        getApiList: function (parameters, callback) {//获取用户列表
            var self = this;
            var url = domain + "/api/manage/GetApiByCondition";
            parameters = { params: parameters };
            self.getData(url, parameters, callback);
        },

        getSecurityCode: function () {//获取验证码
            var self = this;
            var url = domain + "/api/authentication/verification?" + Math.random();
            return url;
        },
        checkLogin: function (parameters, callback) {//检验登录
            var self = this;
            var url = domain + "/api/authentication/login";
            self.getData(url, parameters, callback);
        },
        loginOut: function (parameters, callback) {
            var self = this;
            var url = domain + "/api/authentication/logout";
            location.href = url;
        },
        getMoudlle: function (parameters, callback) {//获取权限
            var self = this;
            var url = domain + "/api/manage/GetPermission";
            self.getData(url, parameters, callback);
        },
        getUserById: function (parameters, callback) {//获取用户
            var self = this;
            var url = domain + "/api/manage/GetModelById";
            self.getData(url, parameters, callback);
        },
        getUserList: function (parameters, callback) {//获取用户列表
            var self = this;
            var url = domain + "/api/manage/GetUserList";
            parameters = { params: parameters };
            self.getData(url, parameters, callback);
        },
        addUser: function (parameters, callback) {//添加用户
            var self = this;
            var path = "/api/manage/SaveUser";
            self.editData(path, parameters, callback);
        },
        editUser: function (parameters, callback) {//编辑用户
            var self = this;
            var path = "/api/manage/SaveUser";
            self.editData(path, parameters, callback, "put");
        },
        deleteUser: function (parameters, callback) {//删除用户
            var self = this;
            var path = "/api/manage/SaveUser";
            self.editData(path, parameters, callback, "delete");
        },
        getGrouptById: function (parameters, callback) {//获取组
            var self = this;
            var url = domain + "/api/manage/GetGroupById";
            self.getData(url, parameters, callback);
        },
        getGroupbyCondition: function (parameters, callbac) {//获取组通过查询条件
            var self = this;
            var url = domain + "/api/manage/GetGroupByCondition";
            parameters = { params: parameters };
            self.getData(url, parameters, callback);
        },
        getGroupList: function (parameters, callback) {//获取用户
            var self = this;
            var url = domain + "/api/manage/GetGroupList";
            parameters = { params: parameters };
            self.getData(url, parameters, callback);
        },
        addGroup: function (parameters, callback) {//添加用户
            var self = this;
            var path = "/api/manage/SaveGroup";
            self.editData(path, parameters, callback);
        },
        editGroup: function (parameters, callback) {//编辑组
            var self = this;
            var path = "/api/manage/SaveGroup";
            self.editData(path, parameters, callback, "put");
        },
        deleteGroup: function (parameters, callback) {//删除组
            var self = this;
            var path = "/api/manage/SaveGroup";
            self.editData(path, parameters, callback, "delete");
        },
        getNews: function (parameters, callback) {//获取新闻舆情
            var self = this;
            var url = domain + "/api/middleware/GetNewsList";
            parameters = { params: JSON.stringify(parameters) };
            self.getData(url, parameters, callback);
        },
        getEnNews: function (parameters, callback) {//获取新闻舆情
            var self = this;
            var url = domain + "/api/middleware/GetEnNewsList";
            parameters = { params: JSON.stringify(parameters) };
            self.getData(url, parameters, callback);
        },
        getWeibo: function (parameters, callback) {//获取微博舆情
            var self = this;
            var url = domain + "/api/middleware/GetWeiBoList";
            parameters = { params: JSON.stringify(parameters) };
            self.getData(url, parameters, callback);
        },
        editNews: function (parameters, callback) {//编辑新闻
            var self = this;
            var path = "/api/middleware/EditNewsByID";
            parameters = { params: JSON.stringify(parameters) };
            self.editData(path, parameters, callback);
        },
        editWeiBo: function (parameters, callback) {//编辑微博
            var self = this;
            var path = "/api/middleware/EditWeiboByID";
            parameters = { params: JSON.stringify(parameters) };
            self.editData(path, parameters, callback);
        },
        addEmergency: function (parameters, callback) {//添加应急方案
            var self = this;
            var path = "/api/middleware/AddEmergencyPlan";
            self.editData(path, parameters, callback);
        },
        deleteEmergency: function (parameters, callback) {//删除应急方案
            var self = this;
            var path = "/api/middleware/DeleteEmergencyPlanByID";
            self.editData(path, parameters, callback, "get");
        },
        editEmergency: function (parameters, callback) {//编辑应急方案
            var self = this;
            var path = "/api/middleware/UpdateEmergencyPlan";
            self.editData(path, parameters, callback);
        },
        getEmergency: function (parameters, callback) {//获取应急预案
            var self = this;
            var url = domain + "/api/middleware/GetEmergencyPlanByCondition";
            parameters = { params: JSON.stringify(parameters) };
            self.getData(url, parameters, callback);
        },
        //room14
        getHotWords: function (parameters, callback) {//热词
            var self = this;
            var url = domain + "/api/middleware/GetHotWords";
            parameters = { params: JSON.stringify(parameters) };
            self.getData(url, parameters, callback);
        },
        getSentimentLinear: function (parameters, callback) {//指数 
            var self = this;
            var url = domain + "/api/middleware/GetSentimentLinear";
            parameters = { params: JSON.stringify(parameters) };
            self.getData(url, parameters, callback);
        },
        GetNewsSentimentPie: function (parameters, callback) {//新闻饼图 
            var self = this;
            var url = domain + "/api/middleware/GetNewsSentimentPie";
            parameters = { params: JSON.stringify(parameters) };
            self.getData(url, parameters, callback);
        },
        GetWeiBoSentimentPie: function (parameters, callback) {//微博饼图 
            var self = this;
            var url = domain + "/api/middleware/GetWeiBoSentimentPie";
            parameters = { params: JSON.stringify(parameters) };
            self.getData(url, parameters, callback);
        },
        GetNewsSentimentMonth: function (parameters, callback) {//新闻月度统计图 
            var self = this;
            var url = domain + "/api/middleware/GetNewsSentimentMonth";
            parameters = { params: JSON.stringify(parameters) };
            self.getData(url, parameters, callback);
        },
        GetWeiBoSentimentMonth: function (parameters, callback) {//微博月度统计图 
            var self = this;
            var url = domain + "/api/middleware/GetWeiBoSentimentMonth";
            parameters = { params: JSON.stringify(parameters) };
            self.getData(url, parameters, callback);
        },
        GetNewsSentimentMonitor: function (parameters, callback) {//新闻监听 
            var self = this;
            var url = domain + "/api/middleware/GetNewsSentimentMonitor";
            parameters = { params: JSON.stringify(parameters) };
            self.getData(url, parameters, callback);
        },
        GetWeiBoSentimentMonitor: function (parameters, callback) {//微博监听
            var self = this;
            var url = domain + "/api/middleware/GetWeiBoSentimentMonitor";
            parameters = { params: JSON.stringify(parameters) };
            self.getData(url, parameters, callback);
        },
        GetWeiBoSentimentPublish: function (parameters, callback) {//微博发布
            var self = this;
            var url = domain + "/api/middleware/GetWeiBoSentimentPublish";
            parameters = { params: JSON.stringify(parameters) };
            self.getData(url, parameters, callback);
        },

        GetWeiBoAndNewsSentimentDay: function (parameters, callback) {//关注度曲线
            var self = this;
            var url = domain + "/api/middleware/GetWeiBoAndNewsSentimentDay";
            parameters = { params: JSON.stringify(parameters) };
            self.getData(url, parameters, callback);
        },

        editData: function (path, parameters, callback, type) {//编辑数据
            var self = this;
            var url = domain + path;
            self.setData(url, parameters, callback, type);
        },
        getData: function (url, options, callback) {//获取数据
            try {
                //$(document).queue(function () { 
                var jqXhr = $.ajax({
                    url: url,
                    dataType: "json",
                    async: true,
                    cache: false,
                    data: options || { pageIndex: 1, pageSize: 5 },
                    type: 'post',
                    success: function (result) {
                        if (result) {
                            callback(result);
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        //alert('error:' + textStatus + ',' + errorThrown);
                    }
                });
                if (jqXhr) {
                    //jqXhr.abort();
                }
                //$(this).dequeue();
                // });
            } catch (e) {
                alert(e.message);
            }
        },
        setData: function (url, options, callback, type) {//设置数据
            try {
                $.ajax({
                    url: url,
                    dataType: "json",
                    data: options || {},
                    type: type || 'post',
                    jsonpCallback: 'callback',
                    success: function (result) {
                        if (result && callback) {
                            callback(result);
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        alert('error:' + textStatus + ',' + errorThrown);
                    }
                });
            } catch (e) {
                alert(e.message);
            }
        }
    };
    window.global = {
        UserInfo: {
            UserName: getCookie(" username")||"",
            CustomerName: getCookie(" customername")||"",
            TokenId: null
        },
        CustormerLogo: {
            "昆山": "昆山市",
            "洪泽": "洪泽县",
            "南通": "南通市",
            "无锡": "无锡市",
            "盐城": "盐城市",
            "哈尔滨": "哈尔滨市",
            "烟台": "烟台市",
            "佛山": "佛山市"
            //"昆山": "/img/default/LogoImg/logo.png",
            //"洪泽": "/img/default/LogoImg/logo.png",
            //"南通": "/img/default/LogoImg/logo.png",
            //"无锡": "/img/default/LogoImg/logo.png",
            //"盐城": "/img/default/LogoImg/logo.png",
            //"哈尔滨": "/img/default/LogoImg/logo.png",
            //"烟台": "/img/default/LogoImg/logo.png",
            //"佛山": "/img/default/LogoImg/logo.png"
        }
    };
})();
