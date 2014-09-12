/**
 * Created by abjia on 14-9-11.
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




var EventMobile = {

    init: function () {

        //事件初始化
        EventMobile.button();


    },
    button: function () {












    }


};








$(function(){

    //检测手机系统
    //alert(JSON.stringify(brower.versions()));
    EventMobile.init();
});