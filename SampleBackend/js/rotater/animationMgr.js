var animationMgr = function () {
    var first, last;
    var animationList = [];
    var recount = 5;
    var atmMonitor = function () {
        var tindex = 0;
        for (var key in animationList) {
            tindex++;
            if (!animationList[key]) {
                setTimeout(atmMonitor, 2000);
                return;
            }
        }
        var index = 0;
        for (var key in animationList) {
            //第一个设置为5秒，其它设置为1秒
            //给随机数
            if (animationList[key] != "none") {
                var maxT = Math.random() * 300;//3000 + 3000;
                var minT = Math.random() * 333;//3000 + 800;
                var br = new blockRotater(animationList[key], index == 0 ? maxT : minT);
            }
            index++;
        }
        //如果没有数据，重试5次
        if (index == 0 && recount > 0) {
            recount--;
            setTimeout(atmMonitor, 2000);
        }
        animationMgr.loop();
        animationMgr.start();
    };
    setTimeout(atmMonitor, 2000);

    var getQueryString = function () {
        var arr = window.location.href.split("?");
        if (arr.length > 1) {
            var arr1 = arr[1].split("#");
            if (arr1.length > 1)
                return arr1[1];
        }
        return "";
    };

    return {
        save: function (animation) {
            if (!animation) {
                return;
            }
            if (!first) {
                first = animation;
                last = animation;
                return;
            }
            last.Next = animation;
            last = animation;
        }
        , start: function () {
            if (first) {
                first.start();
            }
        }
        , loop: function () {
            if (first) {
                this.save(first);
            }
        },
        moduleCount:0,
        register: function (key) {
            animationList[key] = null;
            return {
                key: key, active: function (id, p) {
                    //在这里拆除
                    var par = getQueryString() || p;
                    if (par && par != "" && p != undefined) {
                        //在这里移除HTML的代码
                        $("#" + id + ">div").each(function (index) {
                            if (par.indexOf(index) < 0)
                                $(this).remove();
                        });
                    }
                    //判断如果长度为1 不开始动画
                    if ($("#" + id + ">div").length == 1) {
                        animationList[key] = "none";  //这里加个标识以不执行这个动画，最好的做法是移除这个KEY，但不会移除。。。

                    }
                    else
                        animationList[key] = id;
                }
            };
        },

    }

}();