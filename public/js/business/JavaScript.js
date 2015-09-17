(function ($, Raphael) {
    $.fn.pointpainter = function (options, params) { if (typeof options == 'string') { if (options == 'setPoint') { setPoint.call(this, params); } return this; } var opts = $.extend(true, {}, $.fn.pointpainter.defaults, options); return this.each(function () { $(this).data('pointpainter.opts', opts); _init.call($(this)); }); }
    //初始化画布    
    function _init() { var opts = this.data('pointpainter.opts'); this.dblclick(function (evt) { var offset = $(this).offset(); var point = { x: evt.pageX - offset.left, y: evt.pageY - offset.top }; opts.onMapDblClick.call(this, evt, point); }); var paper = Raphael(this[0], opts.width || this.width(), opts.height || this.height()); this.data('pointpainter.paper', paper); drawing.call(this); }
    //开始画图   
    function drawing() { var opts = this.data('pointpainter.opts'); var paper = this.data('pointpainter.paper'); paper.clear(); for (var i = 0; i < opts.points.length; i++) { var point = opts.points[i]; paper.path(opts.icon).attr({ fill: point.fill, stroke: opts.stroke, cursor: opts.cursor }).transform('t' + (point.x + opts.position.left) + ',' + (point.y + opts.position.top)).click(function () { opts.onIconClick.call(this, this.data()); }).hover(function (evt) { opts.onIconMouseOver.call(this, evt, this.data()); }, function (evt) { opts.onIconMouseOut.call(this, evt, this.data()); }).data(point.data); } }
    //添加绘画点  
    function setPoint(points) { var opts = this.data('pointpainter.opts'); opts.points.push(points); drawing.call(this); } $.fn.pointpainter.defaults = {
        //图标     
        icon: 'M9.5,3V13C17.5,13,17.5,17,25.5,17V7C17.5,7,17.5,3,9.5,3ZM6.5,29H8.5V3H6.5V29Z',
        //图标颜色      
        fill: 'green', stroke: "none",
        //图标的cursor        
        cursor: 'pointer',
        //画布宽度和高度，默认为绑定元素的宽度和高度      
        width: 0, height: 0,
        //初始化默认坐标点      
        points: [{
            x: 0, y: 0, data: {}
            //data为绑定到图标的数据，可以在onIconMouseOver和onIconMouseOut事件中获取       
        }],
        //定义图标位置，图标位置是以坐标点为基准的定位       
        position: { left: -7, top: -26, }, onIconMouseOver: $.noop, onIconMouseOut: $.noop, onMapDblClick: $.noop,
        //双击地图时触发的事件，两个参数，第一个为事件对象，第二个为所点击的点相对于地图的位置      
        onIconClick: $.noop
        //点击图标事件，两个参数，第一个为点，第二个为该点绑定的数据   
    }
})(jQuery, Raphael);