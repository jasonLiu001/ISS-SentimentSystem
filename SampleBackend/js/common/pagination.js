(function ($, undified) {
    var Pagination = function (element, options) {
        this.settings = $.extend({
            url: "123",//api路径，暂时不支持
            pagerCount: 6,//显示分页条码数量
            pageSize: 10,//每页条数
            dataCount: 0,//数据条数
            dataSource: ko.observableArray([]),//数据源
            currentPage: 1,//当前分页
            showText: "...",//省略号
            isShow: false,//是否显示省略
            isSkip:false,//是否跳转
            callback: $.noop
        }, options || {});
        this.element = $(element);
        this.initialize();
    }
    Pagination.prototype = {
        initialize: function () {
            var self = this, settings = self.settings, element = self.element;
            self.pagerCount = settings.pagerCount >= self.calculatePageCount() ? self.calculatePageCount() : settings.pagerCount;//当前显示分页的数量
            self.realPagerCount = self.calculatePageCount();//真实分页数量
            self.currentPage = settings.currentPage;
            self.drawLinks(self.currentPage);
        },
        calculatePageCount: function () {
            var self = this, settings = self.settings;
            return Math.ceil(settings.dataCount / settings.pageSize);
        },
        getInterval: function () {
            var self = this, settings = self.settings, currentPage = self.currentPage;
            var half = Math.ceil(self.pagerCount / 2);
            var start = currentPage % self.pagerCount > half ? (currentPage - half) : (currentPage >= self.pagerCount ? Math.max(currentPage - half, 1) : 1);
            var end = Math.min(currentPage % self.pagerCount > half ? (currentPage + half - 1) : (currentPage >= self.pagerCount ? currentPage + half - 1 : self.pagerCount), self.realPagerCount);
            if (end == self.realPagerCount && end > self.pagerCount) {
                start = end - self.pagerCount;
            }
            return [start, end];
        },
        appendItem: function (pageIndex, options) {
            var self = this, settings = self.settings, element = self.element, itemHtml;
            if (options) {
                if (options.class == "disabled") {
                    itemHtml = $("<li><a>" + options.text + "</a></li>").attr("href", "#").attr("title", options.title).attr("class", options.class);
                } else {
                    itemHtml = $("<li><a>" + options.text + "</a></li>").attr("href", "#").attr("title", options.title).attr("class", options.class).bind("click", function (event) {
                        self.pageSelected(pageIndex, event);
                    });
                }
            } else {

            }
            element.append(itemHtml)
        },
        pageSelected: function (pageIndex, event) {
            var self = this, settings = self.settings;
            self.currentPage = pageIndex;
            self.drawLinks(pageIndex);
            settings.callback(pageIndex, event);
        },
        drawLinks: function (pageIndex) {
            var self = this, settings = self.settings, element = self.element, count = self.realPagerCount, currentPage = self.currentPage;
            element.empty();
            var interval = self.getInterval();
            if (pageIndex > 1) {
                self.appendItem(1, { text: "&laquo;", class: "", title: "首页" });
                self.appendItem(currentPage - 1, { text: "&lt;", class: "", title: "前一页" });
            }

            for (var i = interval[0]; i <= interval[1]; i++) {
                if (pageIndex == i) {
                    self.appendItem(i, { text: i, class: "disabled", title: "" });
                } else {
                    self.appendItem(i, { text: i, class: " ", title: "" });
                }
            }
            if (pageIndex < count) {
                var itemHtml = $("<li><a>" + settings.showText+ "</a></li>");
                if (settings.isShow)
                element.append(itemHtml);
                self.appendItem(currentPage + 1, { text: "&gt;", class: "", title: "后一页" });
                self.appendItem(count, { text: "&raquo;", class: "", title: "尾页" });
               
            }
            itemHtml = $("<li><span>总页数:" + count + "</span></li>");
            element.append(itemHtml);
            if (settings.isSkip) {
                itemHtml = $("<li><span style=\"height:29px;\"><input type=\"text\" style=\"width:30px;height:20px;\"><span>Go</span></span></li>");
                element.append(itemHtml);
                $(itemHtml.find("span")[1]).bind("click", function (event) {
                    pageIndex = $(this).prev().val();
                    if (pageIndex == "") {
                        alert("输入正确跳转数字");
                        $(this).prev().empty().focus();
                        return;
                    } else if (pageIndex != "") {

                        var reg = new RegExp("^[1-9][0-9]*$");
                        if (!reg.test(pageIndex)) {
                            alert("输入正确跳转数字");
                            $(this).prev().val('').focus();
                            return;
                        } else if (pageIndex > count) {
                            alert("输入的跳转数字不能大于分页数");
                            $(this).prev().val('').focus();
                            return;
                        }
                    }
                    self.skipPage(pageIndex, event);
                });
            }
        },
        skipPage: function (pageIndex, event) {
            var self = this, settings=self.settings,currentPage = self.currentPage;
            self.currentPage=pageIndex;
            self.drawLinks(currentPage);
            settings.callback(pageIndex, event);
        }
    };
    $.fn.pagination = function (options) {
        return this.each(function (key, value) {
            var element = $(value);
            //if (element.data('pagination')) {
            //    return element.data('pagination');
            //}
            var pagination = new Pagination(this, options);
            //element.data('pagination', pagination);
            return pagination;
        });
    }
})(jQuery);