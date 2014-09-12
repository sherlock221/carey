/**
 *  移动端 工具类
 * */
var util = function(){


    var getBF = function(){
        var ua = navigator.userAgent.toLowerCase();
        var scene = (ua.indexOf('micromessenger')) > -1 ? 'weixin' : ((/qq\/([\d\.]+)*/).test(ua) ? 'qq': 'web');
        return scene;
    }


    /**
     * transition 动画结束
     * @returns {*}
     */
    var transitionEnd = function() {
        var el = document.createElement('div')
        var transEndEventNames = {
            'WebkitTransition' : 'webkitTransitionEnd',
            'MozTransition'    : 'transitionend',
            'OTransition'      : 'oTransitionEnd otransitionend',
            'transition'       : 'transitionend'
        }

        for (var name in transEndEventNames) {
            if (el.style[name] !== undefined) {
                return { end: transEndEventNames[name] }
            }
        }
        return false;
    };




    /**
     * transition 定时器
     * @returns {*}
     */
    var requestAnimationFrame = window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        function(callback) {return setTimeout(callback, 1000 / 60); };


    /**
     * transition 取消定时器
     * @returns {*}
     */
    var cancelAnimationFrame = window.cancelAnimationFrame ||
        window.mozCancelAnimationFrame ||
        window.webkitCancelAnimationFrame ||
        window.msCancelAnimationFrame ||
        window.oCancelAnimationFrame ||
        function(callback) {return clearTimeout(callback, 1000 / 60); };


    /**
     * 继承
     * @returns {*}
     */
    var extend = function(){
        var args = Array.prototype.slice.call(arguments, 0), attr;
        var o = args[0];
        var deep = false;
        if(typeof args[args.length - 1] == 'boolean'){
            deep = args[args.length - 1];
            args.pop();
        }
        for(var i = 1; i < args.length; i++){
            for(attr in args[i]) {
                if(deep && typeof args[i][attr] == 'object'){
                    o[attr] = {};
                    extend(o[attr], args[i][attr], true);
                }
                else
                    o[attr] = args[i][attr];
            }
        }
        return o;
    };


    var proxy = function(scope, fn){
        scope = scope || null;
        return function(){
            fn.apply(scope, arguments);
        }
    };

    var get = function(url, data, cb){
        var _createAjax = function() {
            var xhr = null;
            try {
                //IE系列浏览器
                xhr = new ActiveXObject("microsoft.xmlhttp");
            } catch (e1) {
                try {
                    //非IE浏览器
                    xhr = new XMLHttpRequest();
                } catch (e2) {
                    window.alert("您的浏览器不支持ajax，请更换！");
                }
            }
            return xhr;
        }
        var pram = '';
        if(typeof data == 'object'){
            for(var name in data){
                pram += '&' + name + '=' + data['name'];
            }
        }
        pram.replace(/^&/, '?');
        var xhr = _createAjax();
        if(!url) return;
        xhr.open('get', url + pram, true);
        xhr.send(null);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                cb&&cb();
            }
        }
    }

    var addClass=function(elem,_class){
        var className=elem.className,classReg=new RegExp('(^'+_class+'\\s+)|(\\s+'+_class+'\\s+)|(\\s+'+_class+'$)|(^'+_class+'$)','g');
        if(!className)elem.className=_class;
        else if(classReg.test(className))return;
        else elem.className=className+' '+_class;
    }
    var removeClass=function(elem,_class){
        var className=elem.className,classReg=new RegExp('(^'+_class+'\\s+)|(\\s+'+_class+'\\s+)|(\\s+'+_class+'$)|(^'+_class+'$)','g');
        className=className.replace(classReg,function(k,$1,$2,$3,$4){if($2)return ' ';else return '';});
        elem.className=className;
    }

    var get_transform_value=function(transform,key,index){
        //transform即transform的所有属性,key键名，index_arr按数组索引取value
        key=key.replace(/\-/g,'\\-');
        var index_list=[0];
        if(arguments.length>2){
            for(var i=2;i<arguments.length;++i){
                index_list[i-2]=arguments[i];
            }
        }
        if('none'==transform||''==transform)return null;//没有值，直接中断
        var reg=new RegExp(key+'\\(([^\\)]+)\\)','ig'),key_value=transform.match(reg),value_list=[],ret=[];
        if(key_value&&key_value.length>0){
            key_value=key_value[0];
            value_list=key_value.replace(reg,'$1').split(',');
            for(var i=0;i<index_list.length;++i){
                ret.push(value_list[index_list[i]]);
            }
        }
        if(ret.length==1)ret=ret[0];
        else if(index)ret=ret[index];
        return ret;
    }

    var noop = function(){};

    return{
        'noop' : noop,
        'transitionEnd' : transitionEnd,
        'RAF' : requestAnimationFrame,
        'cRAF' : cancelAnimationFrame,
        'extend' : extend,
        'proxy' : proxy,
        'getBF' : getBF,
        'get' : get,
        'addClass' : addClass,
        'removeClass' : removeClass,
//        'addStyle' : add,
        'getTransform' : get_transform_value
    }
}();

var Event = (function(){
    var _EventList = {};

    var bind = function( name, fn, scope){
        if(typeof scope == 'object'){
            if(!scope['event']){
                scope['event'] = {};
            }
            if(!scope['event'][name]){
                scope['event'][name] = [];
            }
            scope['event'][name].push(fn);
            return;
        }
        if(!_EventList[name]){
            _EventList[name] = [];
        }
        _EventList[name].push(fn);
    }

    var trigger = function(name, scope, args){
        var _list = _EventList[name];
        if(scope['event'] && scope['event'][name]){
            _list = scope['event'][name];
        }
        if(_list == undefined) return;
        for (var i = 0; i < _list.length; i++) {
            _list[i].call(scope,  args || {});
        };
    }

    return {
        bind:bind,
        trigger:trigger
    }

})();

var timer = {
    remainTime: function(y,mm,d,h,min,s){
        var endDate = new Date(y,mm - 1,d,h,min,s).getTime();
        var nowDate = new Date().getTime();
        var _leftTime = endDate - nowDate;
        if(_leftTime < 0){
            return {
                'hour' : 0,
                'min' : 0,
                'sec' : 0
            }
        }
        var hour = Math.floor(_leftTime/3600000);
        _leftTime = _leftTime%3600000;
        var min = Math.floor(_leftTime/60000);
        _leftTime = _leftTime%60000;
        var sec = Math.floor(_leftTime/1000);
        return {
            'hour' : hour,
            'min' : min,
            'sec' : sec
        }
    }
};

Function.prototype.delegate = function(scope){
    var that = this;
    return function(){
        that.apply(scope, arguments);
    };
};







var Scroller = function(selector, opts){
    if(!selector && typeof selector != 'string') return;
    var _s = selector;
    var _opts = opts || {};
    this.init(_s, _opts);
}

var _default_opts = {
    Scontainer : '.container',
    hScroll : false,
    vScroll : false,
    momentum : false,
    bounce : false,
    lockDirection : true,
    snap : true,
    nesting : false
};

Scroller.prototype = {
    init: function(s, opts){
        this.opts = util.extend({},_default_opts, opts);
        console.log(this.opts);
        var $el = document.querySelector(s + ' ' + this.opts.Scontainer);
        var $parent = document.querySelector(s);
        this._initUi($el, $parent);
        this._mixH = $parent.offsetHeight - $el.offsetHeight;
        this._mixW = $parent.offsetWidth - $el.offsetWidth;
        this.$el.style.webkitTransform = 'translate3D(0, 0, 0)';
        if(this.opts.hScroll){
            this.lock = 'lock_y';
        }
        if(this.opts.vScroll){
            this.lock = 'lock_x';
        }
        if(this.opts.hScroll && this.opts.vScroll){
            this.lock = undefined;
        }
        this.initEvent(opts);
    },

    _initUi: function($el, $parent){
        if(this.opts.snap){
            var _pageHeight = $parent.clientHeight;
            var _pageWidth = $parent.clientWidth;
            this._clientW = _pageWidth;
            this._clientH = _pageHeight;

            var li = $el.querySelectorAll('#'+$el.id+'>li');
            for (var i = 0, len = li.length; i < len; i++){
                li[i].style.width = this._clientW + 'px';
                li[i].style.height = this._clientH + 'px';
            };

            $el.style.height = $el.scrollHeight + 'px';
            $el.style.width = $el.scrollWidth + 'px';
        }else{
            $el.style.height = $el.scrollHeight + 'px';
            $el.style.width = $el.scrollWidth + 'px';
        }
        this.$el = $el;
        this.$parent = $parent;
        this.$li = li;
    },

    _touchstart : function(evt){
        if(this.drag) return;
        this.drag = true;
        target = evt.targetTouches[0];
        this._x = this._x || 0;
        this._y = this._y || 0;

        this.startX = target.pageX;
        this.startY = target.pageY;
        this.srartTime = new Date();

        this._clientX = target.pageX - this._x;
        this._clientY = target.pageY - this._y;
        this.$el.style.webkitTransitionDuration = '0ms';
        this.$el.addEventListener('touchmove', this.update.delegate(this));
        this.$el.addEventListener('touchend', this.clearEvent.delegate(this));
        //this.draw(); //鼠标点击开始
        evt.preventDefault();
        Event.trigger('scrollBefore', this, evt);
    },

    initEvent: function(opts){
        opts = opts || this.opts;
        this.fun = this._touchstart.delegate(this);
        this.$el.addEventListener('touchstart', this.fun);
        if(this.opts.momentum){
            this.$el.addEventListener( util.transitionEnd().end , function(e){
                this.$el.style.webkitTransitionDuration = '0ms';
                var curr_num = this.currNum;
                var num = curr_num ? -1 * curr_num : '0';
                Event.trigger('scrollEnd', this, num);
            }.delegate(this), false);
        }
        if(opts.scrollEnd)
            Event.bind('scrollBefore', opts.scrollBefore || util.noop, this);
        if(opts.scrollEnd)
            Event.bind('scrollEnd', opts.scrollEnd || util.noop, this);
        if(opts.onScroll)
            Event.bind('onScroll', opts.onScroll || util.noop, this);
        if(opts.onTouchEnd)
            Event.bind('onTouchEnd', opts.onTouchEnd || util.noop, this);
    },

    scrollTo:function(options){
        this._x = options.x || this._x;
        this._y = options.y || this._y;
        this._x = this._x || 0;
        this._y = this._y || 0;
        if(this.opts.snap){
            if(options.y > 0 || options.x > 0){
                var math = Math.ceil;
            }else{
                var math = Math.floor;
            }
            var curr_num = math( this._y / this._clientH );
            this._x = math( this._x / this._clientW ) * this._clientW;
            this._y = curr_num * this._clientH;
        }
        this.$el.style.webkitTransform = 'translate3d('+ this._x +'px, ' + this._y + 'px, 0px)';
        this.$el.style.webkitTransitionDuration = '300ms';
        var me = this;
        this.currNum = curr_num || 0;
        Event.trigger('onTouchEnd', this, {'x':this._x, 'y':this._y} );
    },
    reset: function(){
        this.$el.style.webkitTransform = 'translate3d(0px, 0px, 0px)';
        this._x = 0;
        this._y = 0;
    },
    draw: function(){
        //没位移就不渲染
        if (!this._shouldMoved) {
            rAF = RAF(this.draw.delegate(this));
            return;
        }
        this.$el.style.webkitTransform = 'translate3D(' + this._x + 'px, ' + this._y + 'px, 0)';

        this._shouldMoved = false;
        rAF = RAF(this.draw.delegate(this));
    },
    clearEvent: function(evt){
        if(!this.drag) return;
        this.drag = false;
        this.$el.removeEventListener("touchmove", this.update, false);
        this.$el.removeEventListener("touchend", this.clearEvent, false);
        //cancelRAF(rAF);
        var target = evt.changedTouches[0];
        var endX = target.pageX;
        var endY = target.pageY;

        var _x = this._x,_y = this._y, _dis;
        if(undefined == this.lock || 'lock_x' == this.lock){
            var direction_y = endY - this.startY < 0 ? -1 : 1;
            _dis = direction_y;
        }

        if(undefined == this.lock || 'lock_y' == this.lock){
            var direction_x = endX - this.startX < 0 ? -1 : 1;
            _dis = direction_x;
        }


        if(this.opts.momentum){
            var endTime = new Date();
            var disTime = endTime - this.srartTime;
            //disTime = 50000/disTime;
            var _v = Math.abs(_dis / disTime);
            this.$el.style.webkitTransitionDuration = '500ms';
        }

        if(this.opts.snap){
            if(direction_y > 0 || direction_x > 0){
                var math = Math.ceil;
            }else{
                var math = Math.floor;
            }
            var curr_num;
            curr_num = math( _y / this._clientH );
            _x = math( _x / this._clientW ) * this._clientW;
            _y = curr_num * this._clientH;
            if('lock_y' == this.lock){
                curr_num = math( _x / this._clientW );
            }

        }
        if(this.opts.momentum && !this.opts.snap){
            if(undefined == this.lock || 'lock_y' == this.lock)
                _x = _x + _dis / disTime * 10000;
            if(undefined == this.lock || 'lock_x' == this.lock)
                _y = _y + _dis / disTime * 10000;
        }

        if(undefined == this.lock || 'lock_x' == this.lock){
            if(_y > 0) _y = 0;
            if(_y < this._mixH) _y = this._mixH;
        }else if(undefined == this.lock || 'lock_y' == this.lock){
            if(_x > 0) _x = 0;
            if(_x < this._mixW) _x = this._mixW;
        }


        this._x = _x;
        this._y = _y;
        this.currNum = curr_num || 0;
        this.$el.style.webkitTransform = 'translate3d('+ _x +'px, ' + _y + 'px, 0px)';

        Event.trigger('onTouchEnd', this, {'x':this._x, 'y':this._y} );

        if(this.opts.nesting){
            this.lock = undefined;
        }

        if(this.opts.lockDirection && this.opts.hScroll && this.opts.vScroll){
            this.lock = undefined;
        }
    },
    update: function(evt){
        if(!this.drag) return;
        var target = evt.targetTouches[0];
        var disY = target.pageY - this._clientY;
        var disX = target.pageX - this._clientX;
        if(disY == disX){
            return;
        }
        var _direction = Math.abs(this._y - disY) > Math.abs(this._x - disX) ? 1 : -1;
        if(this.opts.lockDirection && undefined == this.lock){
            if(_direction == 1){
                this.lock = 'lock_x';
            }else if(_direction == -1){
                this.lock = 'lock_y';
            }
        }
        if(this.lock == 'lock_x' && _direction == -1){
            evt.stopPropagation();
            if(this.opts.nesting){
                this.opts.nesting.drag = false;
            }

            return;
        }else if(this.lock == 'lock_y' && _direction == 1){
            evt.stopPropagation();
            if(this.opts.nesting){
                this.opts.nesting.drag = false;
            }
            return;
        }

        if(undefined == this.lock || 'lock_x' == this.lock){

            if( !this.opts.bounce ){
                if(disY > 0) disY = 0;
                if(disY < this._mixH) disY = this._mixH;
            }else{
                if(disY > 0) disY = disY / 3;
                if(disY < this._mixH) disY = this._mixH + ( disY - this._mixH ) / 3;
            }

            this._y = disY;
        }
        if(undefined == this.lock || 'lock_y' == this.lock){

            if( !this.opts.bounce ){
                if(disX > 0) disX = 0;
                if(disX < this._mixW) disX = this._mixW;
            }else{
                if(disX > 0) disX = disX / 3;
                if(disX < this._mixW) disX = this._mixW + ( disX - this._mixW ) / 3;
            }
            this._x = disX;

        }
        this._shouldMoved = true;
        evt.preventDefault();



        Event.trigger('onScroll', this, {'x':this._x, 'y':this._y} );
    },
    destory:function(){
        this.$el.removeEventListener("touchstart", this.fun);
        this.$parent.style.overflow = 'visible';
    }
};

/**
 * mobile js
 */




var UI = {
    ScreenAll : $("#screen-all"),
    logo      : $("#logo"),
    box       : $("#px")
};

var Cons = {
    LayerHeight: 0,
    currentIndex : 0,
    LastIndex   : 0
};



//animation
var tt = document.querySelector('#px');
if(tt){
    tt.addEventListener("webkitAnimationEnd", function(){
        UI.box.removeClass("rubberBand").addClass("open");
        return false;
    },false);
}




var EventMobile = {

    init: function () {

        //自适应高度
        var $screen = UI.ScreenAll.find(".screen");

        //首次初始化高度

        var winh =   UI.ScreenAll[0].offsetHeight;

        Cons.LayerHeight =winh;
//            //修改每个的高度

        $screen.css("height", Cons.LayerHeight + "px");
        //事件初始化
        EventMobile.button();




        $(window).resize(function(){

            //alert("窗口发生变化")
        });

    },
    button: function () {

        var $screen = UI.ScreenAll.find(".screen");
        Cons.LastIndex = $screen.size() -1;


        var wrapper_scroll = new Scroller('#wp', {
            Scontainer : '.screen-all',
            hScroll : false,
            vScroll : true,
            momentum : true,
            bounce : false,
            snap: true,
            scrollBefore: function(name, e){

            },
            onScroll: function(name, obj){
            },
            onTouchEnd: function(name, obj){
            },
            scrollEnd: function(index){
                console.log(index);

                //logo 部分
                if(index == "0" || index == "8"){
                    UI.logo.hide();
                }
                else if(index == "1"){
                    UI.logo.show();
                }



                var pages = this.$li;
                var $screen = UI.ScreenAll.find(".screen");
                var node = $screen.filter("[id='screen-0"+index+"']");


                for (var i = 0; i < $screen.length; i++) {
                    var $sc = $($screen[i]);
                    $sc.find(".content").addClass("hide");
                };
                node.find(".content").removeClass("hide");

            }
        });





        function toggleDot(index){
            //改变效用
            var node = $screen.filter("[id='screen-0"+index+"']");


            transformLayer(index);

            setTimeout(function(){
                $screen.forEach(function(t){
                    $(t).find(".content").addClass("hide");
                });
                node.find(".content").removeClass("hide");
            },600);

        };





    }


};





//"-webkit-transform" : "translate3d(0px, -" + height + "px,0px)"
//竖向滑动层
function transformLayer(index) {
    var height = Cons.LayerHeight * index;
    var tranPx = "translate(0px, -" + height + "px)";
    UI.ScreenAll.css({
        "-webkit-transform" : "translate3d(0px, -" + height + "px,0px)",
        "transform" : "translate3d(0px, -" + height + "px,0px)"

    });

}

//滚动范围判断
function currentIndexSlice(index){
    var LastIndex = Cons.LastIndex;
    if(index > LastIndex )
        index = LastIndex;
    else if(index < 0 ){
        index = 0;
    }
    return index;
};



var brower = {
    versions:function(){
        var u = window.navigator.userAgent;
        var num ;
        if(u.indexOf('Trident') > -1){
            //IE
            return "IE";
        }else if(u.indexOf('Presto') > -1){
            //opera
            return "Opera";
        }else if(u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1){
            //firefox
            return "Firefox";
        }else if(u.indexOf('AppleWebKit' && u.indexOf('Safari') > -1) > -1){
            //苹果、谷歌内核
            if(u.indexOf('Chrome') > -1){
                //chrome
                return "Chrome";
            }else if(u.indexOf('OPR')){
                //webkit Opera
                return "Opera_webkit"
            }else{
                //Safari
                return "Safari";
            }
        }else if(u.indexOf('Mobile') > -1){
            //移动端
            if(!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
                //ios
                if(u.indexOf('iPhone') > -1){
                    //iphone
                    return "iPhone"
                }else if(u.indexOf('iPod') > -1){
                    //ipod
                    return "iPod"
                }else if(u.indexOf('iPad') > -1){
                    //ipad
                    return "iPad"
                }
            }else if(u.indexOf('Android') > -1 || u.indexOf('Linux') > -1){
                //android
                num = u.substr(u.indexOf('Android') + 8, 3);
                return {"type":"Android", "version": num};
            }else if(u.indexOf('BB10') > -1 ){
                //黑莓bb10系统
                return "BB10";
            }else if(u.indexOf('IEMobile')){
                //windows phone
                return "Windows Phone"
            }
        }
    }
}


$(function(){

    //检测手机系统
    //alert(JSON.stringify(brower.versions()));
    EventMobile.init();
});





