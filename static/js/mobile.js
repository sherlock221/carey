/**
 * mobile js
 */




    var UI = {
       ScreenAll : $("#screen-all")
    };

    var Cons = {
        LayerHeight: 0,
        currentIndex : 0,
        LastIndex   : 0
    };



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

//            $("body").touchwipe({
//                listen : 'y',
//                start  :  function(result){
//                    console.log("开始滑动...");
//                },
//                move   : function(result){
//
//                },
//                stop   : function(result){
//                    //从下往上
//                    if(result.dy > 0){
//                        Cons.currentIndex++;
//                    }
//                    //从上往下
//                    else{
//                        Cons.currentIndex--;
//                    }
//                    Cons.currentIndex = currentIndexSlice(Cons.currentIndex);
//                    toggleDot(Cons.currentIndex);
//                }
//
//            });



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



