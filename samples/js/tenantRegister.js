function ShowRegisterInfo(tenantId)
{
    $.getJSON('/api/tenant/GetTenantDetailsById?tenantId='+tenantId,function(data){
        $('#registerResult').html("<ul><li>公司名称:"+data.name+"</li><li>公司简称:"+data.alias+"</li><li>默认域:"+data.mappeddomain+"</li><li>区域："+data.customer_names+"</li><li>联系人电话:"+data.phone+"</li><li>电子邮件:"+data.email+"</li><li>租户管理员名称：Admin</li><li>管理员初始默认密码：Admin</li></ul>");
    });
}

function GetGroup(){
    $.ajax({
        type: "get",
        url: "/api/manage/GetGroupForTenant",
        success:function(data){
            if(data&&data.Result)
            {
                var options = data.Data;

                for(var item in options)
                {
                    var opValue = options[item].id,
                        opText  = options[item].name;
                    $("#group").append("<option value='"+opValue+"'>"+opText+"</option>");  //添加一项option

                }
            }
        }
    });
}

$(function () {
    GetGroup();
    $('#btn_register').click(function (ev) {
        //user name
        var tenantName = $('#tenantName').val();
        // alias
        var alias = $('#alias').val();
        var admin=$('#admin').val();
        var adminPwd=$('#adminPwd').val();
        // mappedDomain
        var mappedDomain=$('#mappedDomain').val();
        var customerNames=$('#customerNames').val();
        var verificationCode=$('#verificationCode').val();
        // email
        var email=$('#email').val();
        //phone
        var phone=$('#phone').val();
        var groupid = $("#group").val();

        var data = { tenantName: tenantName, alias: alias, mappedDomain:mappedDomain,customerNames:customerNames, email:email,phone:phone,admin:admin,adminPwd:adminPwd,verificationCode:verificationCode,groupid:groupid};

        $.ajax({
            type: 'POST',
            url: './api/tenant/AddTenant',
            data: data,
            async: false,
            error: function (e) {
                console.log(e);
            },
            success: function (data) {
               if(data.success===true)
               {
                    ShowRegisterInfo(data.data.tenantId);
               }
            }
        });
    });
});

