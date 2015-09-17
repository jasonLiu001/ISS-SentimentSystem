//公用的一个js文件可以提取出来
var globalModel = function () {
    //这里定义全局self也可以(已注视)
    //self = this;
    //self.objData = ko.observableArray([]);

    globalModel.self = this;
    globalModel.self.objData = ko.observableArray([]);

   // var self = this;
   // globalModel.self.objData = ko.observableArray([]);

    //查询参数
    this.params = {
        pagination: { pageindex: 0, pagesize: 10, totalCount: 0 },
        orderby: {},
        query: {}
    };

    //API 域名
    this.apiDomain = "api/middleware/";
    //API 名称
    this.apiName = "";

    this.datasource = [];

    globalModel.self.BindData = function () {
        globalModel.self.objData(this.datasource);
    }
}