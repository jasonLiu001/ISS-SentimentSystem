/*依赖 util.js,requestAnimationFrame.js,observer.js */
;eval(function(d,f,a,c,b,e){b=function(a){return a.toString(f)};if(!"".replace(/^/,String)){for(;a--;)e[b(a)]=c[a]||b(a);c=[function(a){return e[a]}];b=function(){return"\\w+"};a=1}for(;a--;)c[a]&&(d=d.replace(new RegExp("\\b"+b(a)+"\\b","g"),c[a]));return d}("0.2=(1(){7 0.2||0.3||0.4||0.c||0.6||1(a,b){0.8(a,9/5)}})();",13,13,"window function requestAnimationFrame webkitRequestAnimationFrame mozRequestAnimationFrame 60 msRequestAnimationFrame return setTimeout 1e3   oRequestAnimationFrame".split(" "),0,{}));

var IR = IR || {};
(function (IR) {
    var tools = IR.Util,
        handler = IR.Observer;

    function Timer() {

        this.interval = undefined;
        this._handler = new handler(this);
        this.InervalArray=[];
        /*
         // 单例的实现
         if (tools.isUndefined(Timer.instance)) {
         return getInstance();
         }
         else {
         return Timer.instance;
         }
         function getInstance() {
         Timer.instance = that;
         return that;
         }

         */
    }
    Timer.prototype = {
        addHandler: function (func, caller) {
            if (!tools.isUndefined(caller)) {
                func = tools.bind(func, caller);
            }
            this._handler.attach("timer", func);
        },
        start: function () {
            var that = this;
            //var call2=arguments.callee;//不能使用
           (function () {
                /*that.interval = window.requestAnimationFrame(arguments.callee);*/
                //console.log(arguments.callee);
                //that.interval=window.setTimeout(arguments.callee,60);
               if(that.interval){
                   window.clearTimeout(that.interval);
               }
               console.log(that.interval);
               that.interval=window.setInterval(function(){
                   that._handler.notifyByKey("timer");
               },60);
                that.InervalArray.push(that.interval);


            })();
        },
        stop: function () {
            var that = this;
            /*window.cancelAnimationFrame(that.interval);*/
            //console.log(that.InervalArray);
            for(var i=0;i<=that.InervalArray.length;i++){
                window.clearTimeout(that.InervalArray[i]);
            }
            that.InervalArray=[];
            //window.clearInterval(that.interval);
            //hat._handler.clear();
        }

    };

    IR.Timer = Timer;
})(IR)

