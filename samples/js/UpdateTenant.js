/**
 * Created by wang on 2014/7/24.
 */

function ShowRegisterInfo(tenantId)
{
    $.getJSON('/api/tenant/GetTenantDetailsById?tenantId='+tenantId,function(data){
        $('#registerResult').html("<ul><li>公司名称:"+data.name+"</li><li>公司简称:"+data.alias+"</li><li>默认域:"+data.mappeddomain+"</li><li>联系人电话:"+data.phone+"</li><li>电子邮件:"+data.email+"</li><li>租户管理员名称：Admin</li><li>管理员初始默认密码：Admin</li></ul>");
    });
}

function getUrlParam(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r!=null) return unescape(r[2]); return null; //返回参数值
}

$(function(){
    var ViewModel= function () {
        var self=this;
        var tenantId=getUrlParam('id');
        self.name=ko.observable('');
        self.alias=ko.observable('');
        self.mappeddomain=ko.observable('');
        self.phone=ko.observable('');
        self.email=ko.observable('');
        $.getJSON('/api/tenant/GetTenantDetailsById?tenantId='+tenantId,function(data){
            self.phone(data.phone);
            self.email(data.email);
            self.name(data.name);
            self.alias(data.alias);
            self.mappeddomain(data.mappeddomain);
        });

    };

    var viewModel=new ViewModel();
    ko.applyBindings(viewModel);

    $('#btn_update').bind('click',function(){
        //user name
        var tenantName = $('#tenantName').val();
        // alias
        var alias = $('#alias').val();
        // mappedDomain
        var mappedDomain=$('#mappedDomain').val();
        // email
        var email=$('#email').val();
        //phone
        var phone=$('#phone').val();

        var data = { tenantName: tenantName, alias: alias, mappedDomain:mappedDomain, email:email,phone:phone,tenantId:getUrlParam('id') };

        $.ajax({
            type: 'POST',
            url: './api/tenant/UpdateTenant',
            data: data,
            async: false,
            error: function (e) {
                console.log(e);
            },
            success: function (data) {
                ShowRegisterInfo(getUrlParam('id'));
            }
        });
    });
});