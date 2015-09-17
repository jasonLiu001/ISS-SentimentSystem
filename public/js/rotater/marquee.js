var marqueeObj = function () {
    var aniContxt = new IR.Animation();
    var animations = [];
    var list = {};
    var _easing = "linear";
    var _delay = 0;
    var _duration = 1000;

    return {
        append: function (id, lineHeight, duration, easing, delay) {
            var _ul = document.getElementById(id);
            var _lineHeight;
            if (lineHeight == undefined) {
                for (var i = 0, ci; ci = _ul.childNodes[i]; i++) {
                    if (ci.tagName == "LI") {
                        _lineHeight = ci.clientHeight;
                        break;
                    }
                }
            }
            else {
                _lineHeight = lineHeight;
            }

            var animate = this.createAnimation(delay, duration, easing);

            animate.onframe(function (data) {
                _ul.style.marginTop = -(_lineHeight * data.perc) / 100 + "px";
//                var lineHeight=_lineHeight
//                _lineHeight=parseInt(_lineHeight)-1.5;
//                _ul.style.marginTop=-(_lineHeight/100)+"px";
//                if(_lineHeight==0){
//                    _lineHeight=100;
//                }
                //_ul.style.marginTop=-90+"px";
                //console.log(data.perc);
                //console.log(_ul.style.marginTop);
            });

            animate.oncompleted(function () {
                //console.log("the ul child nodes is ",_ul.childNodes.length);
                for (var i = 0, ci; ci = _ul.childNodes[i]; i++) {
                   //console.log("the ci is ",ci);
                    if (ci.tagName == "LI") {

                        //console.log("the ul count is ",_ul.childNodes.length,"the ci is ",ci);
                        _ul.appendChild(ci);
                        //console.log(_ul.style.marginTop);
                        _ul.style.marginTop = "0px";
                        //console.log(_ul.style.marginTop);
                        break;
                    }
                }
                //console.log(_ul.childNodes.length);
                this.start();
            });
            animations=[];
            console.log(animations);
            animations.push(animate);
        }
        , createAnimation: function (delay, duration, easing) {
            var _easing = easing ? easing : "linear";
            var _delay = delay == undefined ? 0 : delay;
            var _duration = duration == undefined ? 1000 : duration;
            var animate = aniContxt.create({
                from: { perc: 0 }
                   , to: { perc:100 }
                   , easing: _easing
                   , delay: _delay
                   , duration: _duration
            });
            return animate;
        }

        , start: function () {
            for (var i = 0, ci; ci = animations[i]; i++) {
                ci.start();
            }
          aniContxt.start();
        }
        , stop: function () {
            aniContxt.stop();
        }
    }
};