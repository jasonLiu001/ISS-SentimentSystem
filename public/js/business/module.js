/**
 * Created by blade on 2014/10/16.
 */
$(function () {
    var pageJqueryObj = {divModule:$("#modules"),btnAddModule:$("#addModule"),divModuleModal:$("#moduleModal")};
    var pageObj={divModule:"modules"};
    var options = {
        pagerCount: 5,
        pageSize: 12,
        dataCount: 0,
        dataSource: ko.observableArray([]),
        pageIndex: 0,
        isSkip: true,
        callback: function (pageIndex, element) {
        }
    };
    var moduleView = function (data) {
        var self = this;
        self.modules = ko.observableArray(data);
        options.dataSource = self.modules;
    };

    function initPage() {
        //绑定事件
        pageJqueryObj.btnAddModule.bind("click",function(){
            pageJqueryObj.divModuleModal.modal("show");
        });
        initGridList(options);
    }
    function getParameters(){
        var parameters={query:{},pagination: { pagesize: options.pageSize, pageindex: options.pageIndex }};
    }
    function initGridList(options){
        if(options){
            getModules(options,function(result){
                if(result.Data.length>0){
                var view=new moduleView(result.Data);
                    ko.applyBindings(viewm, document.getElementById(pageObj.divModule));
                }
            });
        }
    }
    function getModules(options,callback){
    window.baseTools.getModuleList(options,function(result){
        if(result.Result){
            if(callback){
                callback(result);
            }
        }
    })
    }
    //初始化界面
    initPage();
});