(function () {
    var domain = "";
    window.apiTools = {
        GetNewsList: function (parameters, callback) {//批量删除新闻
            var self = this;
            var url = domain + "/api/middleware/GetNewsListByBrand";
            parameters = { params: parameters };
            self.getData(url, parameters, callback);
        },
        GetEnNewsList: function (parameters, callback) {//批量删除新闻
            var self = this;
            var url = domain + "/api/middleware/GetEnNewsListBrand";
            parameters = { params: parameters };
            self.getData(url, parameters, callback);
        },
        GetWeiboList: function (parameters, callback) {//批量删除新闻
            var self = this;
            var url = domain + "/api/middleware/GetWeiBoListByBrand";
            parameters = { params: parameters };
            self.getData(url, parameters, callback);
        },
        GetWeixinList: function (parameters, callback) {//批量删除新闻
            var self = this;
            var url = domain + "/api/middleware/GetWeiXinListBrand";
            parameters = { params: parameters };
            self.getData(url, parameters, callback);
        },

        DeleteNewsBat: function (parameters, callback) {//批量删除新闻
            var self = this;
            var url = domain + "/api/middleware/DeleteNews";
            parameters = { params: parameters };
            self.getData(url, parameters, callback);
        },
        EditNewsBat: function (parameters, callback) {//更新新闻
            var self = this;
            var url = domain + "/api/middleware/EditNewsOfBatch";
            parameters = { params: parameters };
            self.getData(url, parameters, callback);
        },

        DeleteWeiboBat: function (parameters, callback) {//批量删除新闻
            var self = this;
            var url = domain + "/api/middleware/DeleteWeiBo";
            parameters = { params: parameters };
            self.getData(url, parameters, callback);
        },
        EditWeiboBat: function (parameters, callback) {//更新新闻
            var self = this;
            var url = domain + "/api/middleware/EditWeiBoOfBatch";
            parameters = { params: parameters };
            self.getData(url, parameters, callback);
        },

        DeleteWeixinBat: function (parameters, callback) {//批量删除新闻
            var self = this;
            var url = domain + "/api/middleware/DeleteWeiXin";
            parameters = { params: parameters };
            self.getData(url, parameters, callback);
        },
        EditWeixinBat: function (parameters, callback) {//更新新闻
            var self = this;
            var url = domain + "/api/middleware/EditWeiXinOfBatch";
            parameters = { params: parameters };
            self.getData(url, parameters, callback);
        },


        editData: function (path, parameters, callback, type) {//编辑数据
            var self = this;
            var url = domain + path;
            self.setData(url, parameters, callback, type);
        },
        getData: function (url, options, callback, type, timeoutCallback) {//获取数据
            try {
                CheckCookies();
                //$(document).queue(function () { 
                $.ajax({
                    url: url,
                    dataType: "json",
                   // async: true,
                   // cache: false,
                   // timeout: 1 * 60 * 1000,
                    data: options || { pageIndex: 1, pageSize: 5 },
                    type: type || 'post',
                    success: function (result) {
                        if (result) {
                            callback(result);
                        }
                    },
                });
            } catch (e) {
                alert(e.message);
            }
        },
        getDataIsCheckCookie: function (url, options, callback, type, timeoutCallback, isCheckCookie) {
            try {
                if (isCheckCookie) {
                    CheckCookies();
                }

                //$(document).queue(function () {
                var jqXhr = $.ajax({
                    url: url,
                    dataType: "json",
                    async: true,
                    cache: false,
                    timeout: 1 * 60 * 1000,
                    data: options || { pageIndex: 1, pageSize: 5 },
                    type: type || 'post',
                    beforeSend: function (req) {
                        var token = $.cookie("authentication");
                        if (token) {
                            req.setRequestHeader("authentication", token);
                        }
                    },
                    success: function (result) {
                        if (result) {
                            callback(result);
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        //  alert('error:' + textStatus + ',' + errorThrown);
                    },
                    complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
                        if (status == 'timeout') {//超时,status还有success,error等值的情况
                            if (timeoutCallback != null && timeoutCallback != undefined) {
                                console.log(status);
                                timeoutCallback();
                            }
                        }
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
        LoginFun: function (url, options, callback, type, timeoutCallback) {//获取数据
            try {
                //$(document).queue(function () { 
                var jqXhr = $.ajax({
                    url: url,
                    dataType: "json",
                    async: true,
                    cache: false,
                    timeout: 1 * 60 * 1000,
                    data: options || { pageIndex: 1, pageSize: 5 },
                    type: type || 'post',
                    success: function (result) {
                        if (result) {
                            callback(result);
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        //  alert('error:' + textStatus + ',' + errorThrown);
                    },
                    complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
                        if (status == 'timeout') {//超时,status还有success,error等值的情况
                            if (timeoutCallback != null) {
                                console.log(status);
                                timeoutCallback();
                            }
                        }
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
        },
        translateWeiBoSource: function (str) {//微博转换
            var result = "";
            switch (str) {
                case "sina_weibo":
                    result = "新浪";
                    break;
                case "163_weibo":
                    result = "网易";
                    break;

            }
            return result;
        }
    };
})();