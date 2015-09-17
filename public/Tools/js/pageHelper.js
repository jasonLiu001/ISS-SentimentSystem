/// <reference path="../../js/jQuery.js" />
(function ($) {
    $.fn.extend({
        PageInitial: function (options) {
            //未来可以添加或者设置其他参数
            var defVal = {
                objectModel: null,
                callback: null,
            };
            var opts = $.extend({}, defVal, options);
            var $this = $(this);
            $this.empty();
            var $pageUL = $("<ul style='margin:0px; padding:0px;' class='pagination pagination-sm'></ul>");
            var liHtml = "";
            var total = opts.objectModel.params.pagination.totalCount;
            var psize = opts.objectModel.params.pagination.pagesize;
            var pindex = opts.objectModel.params.pagination.pageindex;

            if (total > 0) {
                var pnum;
                if (total % psize == 0) {
                    pnum = total / psize;
                }
                else {
                    pnum = parseInt(total / psize) + 1;
                }

                var starti = 0;
                var endi = pnum;



                var curIndex = opts.objectModel.params.pagination.pageindex;


                if (pnum <= 11) {
                    endi = pnum;
                }
                else {

                    if (curIndex <= 6) {
                        starti = 0;
                        endi = 10;
                    }
                    else if (curIndex >= pnum - 6) {
                        starti = curIndex - 11;
                        endi = pnum;
                    }
                    else {
                        starti = curIndex - 5;
                        endi = curIndex + 6;
                    }


                }
                var prevLi;
                var nextLi;

                if (curIndex > 0) {
                    prevLi = $("<li><a href='javascript:void(0)' >上一页</a></li>").click(function (event) {
                        opts.objectModel.params.pagination.pageindex = curIndex - 1;
                        if (opts.callback) {
                            opts.callback();
                        }
                    });
                }
                else {
                    prevLi =null;
                }
                $pageUL.append(prevLi);

                for (starti; starti < endi; starti++) {
                    var num = starti;
                    var temLi;
                  
                 
                    var tpPag = function (num) {



                        if (curIndex == num) {
                            temLi = $("<li class='active'><a href='javascript:void(0)' index='" + starti + "' >" + (starti + 1) + "</a></li>");
                        }
                        else {
                            temLi = $("<li><a href='javascript:void(0)' index='" + starti + "' >" + (starti + 1) + "</a></li>").click(function (event) {
                                opts.objectModel.params.pagination.pageindex = num;
                                if (opts.callback) {
                                    opts.callback();
                                }
                            });
                        }



                    }(num);
                    $pageUL.append(temLi);
                }
                console.log("curIndex:" + curIndex + ";pnum" + pnum);
                if (curIndex <pnum-1) {
                    nextLi = $("<li><a href='javascript:void(0)' >下一页</a></li>").click(function (event) {
                        opts.objectModel.params.pagination.pageindex = curIndex + 1;
                        if (opts.callback) {
                            opts.callback();
                        }
                    });
                }
                else {
                    nextLi = null;
                }
                $pageUL.append(nextLi);
                $pageUL.append("<span style='line-height:30px;'>第"+(curIndex+1)+"页&nbsp;共"+pnum+"页</span>");

            }
            $this.append($pageUL);
        }
    })
})(jQuery);