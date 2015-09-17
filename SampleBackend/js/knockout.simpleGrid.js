(function () {
    // Private function
    function getColumnsForScaffolding(data) {
        if ((typeof data.length !== 'number') || data.length === 0) {
            return [];
        }
        var columns = [];
        for (var propertyName in data[0]) {
            columns.push({ headerText: propertyName, rowText: propertyName });
        }
        return columns;
    }

    ko.simpleGrid = {
        // Defines a view model class you can use to populate a grid
        viewModel: function (configuration) {
            var self = this;
            self.data = configuration.data;
            self.currentPageIndex = ko.observable(0);//set current page index;
            self.pageSize = configuration.pageSize || 5;// set size of every page;
            self.index = 0;
            self.firstPage = function (index) {
                self.currentPageIndex(index);
            };//set first page;
            self.prevPage = function (index) {
                if (index == 0) {
                    return;
                } else {
                    self.currentPageIndex(index - 1);
                }
            };//set previous page
            self.nextPage = function (index) {
                if (index >= self.pageIndex) {
                    return;
                } else {
                    self.index += 1;
                    configuration.showPageIndexCount += 1;
                    self.currentPageIndex(index + 1);
                }
            };//set next page;
            self.lastPage = function (pageIndex) {
                self.currentPageIndex(pageIndex);
            };//set last page;
            // If you don't specify columns configuration, we'll use scaffolding
            self.columns = configuration.columns || getColumnsForScaffolding(ko.unwrap(self.data));

            self.itemsOnCurrentPage = ko.computed(function () {
                var startIndex = self.pageSize * self.currentPageIndex();
                return ko.unwrap(self.data).slice(startIndex, startIndex + self.pageSize);
            }, self);

            self.pageIndex = Math.ceil(ko.unwrap(self.data).length / self.pageSize) - 1;//set max index of page

            self.maxPageIndex = ko.computed(function () {
                return self.pageIndex;
            }, self);
            self.showPageIndexCount = ko.computed(function () {
                if (configuration.showPageIndexCount >= self.pageIndex) {
                    return self.pageIndex;
                }
                else {
                    return (configuration.showPageIndexCount - 1);
                }
            }, self);
        }
    };

    // Templates used to render the grid
    var templateEngine = new ko.nativeTemplateEngine();

    templateEngine.addTemplate = function (templateName, templateMarkup) {
        document.write("<script type='text/html' id='" + templateName + "'>" + templateMarkup + "<" + "/script>");
    };

    templateEngine.addTemplate("ko_simpleGrid_grid", "\
                    <table class=\"table table-hover\">\
                        <thead>\
                            <tr data-bind=\"foreach: columns\">\
                               <th data-bind=\"text: headerText\"></th>\
                            </tr>\
                        </thead>\
                        <tbody data-bind=\"foreach: itemsOnCurrentPage\">\
                           <tr data-bind=\"foreach: $parent.columns\">\
                               <td data-bind=\"html: typeof rowText == 'function' ? rowText($parent) : $parent[rowText] \"></td>\
                            </tr>\
                        </tbody>\
                        <tfoot>\
                            <tr>\
                            <td colspan=\"50\" style=\"text-align:right;\">\
                            <ul class=\"pagination pagination-sm\">\
                                <li>\
						        <a href=\"#\" data-bind=\"click:function(){$root.firstPage(0)}\" title=\"首页\">&laquo</a>\
                                </li>\
                                <li>\
						        <a href=\"#\" data-bind=\"click:function(){$root.prevPage($root.currentPageIndex())}\" title=\"前一页\">&lt;</a>\
                                </li>\
                                <!-- ko foreach: ko.utils.range(index, showPageIndexCount) -->\
                                       <li>\
                                       <a href=\"#\" data-bind=\"text: $data+1, click: function() { $root.currentPageIndex($data) }, css: { selected: $data == $root.currentPageIndex() }\">\
                                    </a>\
                                       </li>\
                                <!-- /ko -->\
                                 <li>\
						        <a href=\"#\" data-bind=\"click:function(){$root.nextPage($root.currentPageIndex())}\" title=\"后一页\">&gt;</a>\
                                 </li>\
                                <li>\
                               <a href=\"#\" data-bind=\"click:function(){$root.lastPage(pageIndex)}\" title=\"尾页\">&raquo;</a>\
                                </li>\
                           </ul>\
                        </td>\
                        </tr>\
                    </tfoot>\
                    </table>");
    //templateEngine.addTemplate("ko_simpleGrid_pageLinks", "\
    //                <div class=\"ko-grid-pageLinks\" style=\"text-align:right;margin-top:-15px;\">\
    //                    <ul class=\"pagination pagination-sm\">\
    //                    <li>\
	//					<a href=\"#\" data-bind=\"click:function(){$root.firstPage(0)}\" title=\"首页\">&laquo</a>\
    //                    </li>\
    //                    <li>\
	//					<a href=\"#\" data-bind=\"click:function(){$root.prevPage($root.currentPageIndex())}\" title=\"前一页\">&lt;</a>\
    //                    </li>\
    //                    <!-- ko foreach: ko.utils.range(index, showPageIndexCount) -->\
    //                           <li>\
    //                           <a href=\"#\" data-bind=\"text: $data+1, click: function() { $root.currentPageIndex($data) }, css: { selected: $data == $root.currentPageIndex() }\">\
    //                        </a>\
    //                           </li>\
    //                    <!-- /ko -->\
    //                     <li>\
	//					<a href=\"#\" data-bind=\"click:function(){$root.nextPage($root.currentPageIndex())}\" title=\"后一页\">&gt;</a>\
    //                     </li>\
    //                    <li>\
    //                   <a href=\"#\" data-bind=\"click:function(){$root.lastPage(pageIndex)}\" title=\"尾页\">&raquo;</a>\
    //                    </li>\
    //                   </ul>\
    //                </div>");

    //The "simpleGrid" binding
    ko.bindingHandlers.simpleGrid = {
        init: function (element, viewModelAccessor, allBindings) {
            return { 'controlsDescendantBindings': true };
            // var viewModel = viewModelAccessor();

            // // Empty the element
            // while(element.firstChild)
            // ko.removeNode(element.firstChild);

            // // Allow the default templates to be overridden
            // var gridTemplateName      = allBindings.get('simpleGridTemplate') || "ko_simpleGrid_grid",
            // pageLinksTemplateName = allBindings.get('simpleGridPagerTemplate') || "ko_simpleGrid_pageLinks";

            // // Render the main grid
            // var gridContainer = element.appendChild(document.createElement("DIV"));
            // ko.renderTemplate(gridTemplateName, viewModel, { templateEngine: templateEngine }, gridContainer, "replaceNode");

            // // Render the page links
            // var pageLinksContainer = element.appendChild(document.createElement("DIV"));
            // ko.renderTemplate(pageLinksTemplateName, viewModel, { templateEngine: templateEngine }, pageLinksContainer, "replaceNode");
        },
        // This method is called to initialize the node, and will also be called again if you change what the grid is bound to
        update: function (element, viewModelAccessor, allBindings) {
            //return { 'controlsDescendantBindings': true };
            var viewModel = viewModelAccessor();

            // Empty the element
            while (element.firstChild)
                ko.removeNode(element.firstChild);

            // Allow the default templates to be overridden
            var gridTemplateName = allBindings.get('simpleGridTemplate') || "ko_simpleGrid_grid",
                pageLinksTemplateName = allBindings.get('simpleGridPagerTemplate') || "ko_simpleGrid_pageLinks";

            // Render the main grid
            var gridContainer = element.appendChild(document.createElement("DIV"));
            ko.renderTemplate(gridTemplateName, viewModel, { templateEngine: templateEngine }, gridContainer, "replaceNode");

            // Render the page links
            //var pageLinksContainer = element.appendChild(document.createElement("DIV"));
            //ko.renderTemplate(pageLinksTemplateName, viewModel, { templateEngine: templateEngine }, pageLinksContainer, "replaceNode");
        }
    };
})();