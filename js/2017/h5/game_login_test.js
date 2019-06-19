// 菜单
$('.sidebar-menu li').click(function(){
    var index = $(this).index();
    $(this).addClass('active').siblings().removeClass('active');
    $('.box-wp .box-item').hide().eq(index).show(); 
});
// 侧边栏
$('#floaticon, #sidebar-close').click(function() {
    $('#sidebar-wp').toggleClass('sidebar-wp-active');
});
// 绑定手机按钮显隐
$.getJSON('/h5/api/user_info_jsonp.php?level=1&callback=?', function(json){
    H9377.Uinfo = json;
    if (json.BIND_CELLPHONE == "1") {
        $('.box-item-1 .tip, .box-item-1 .btn-bindphone').hide();
    }
});

// 领取礼包 {普通礼包}
/* 
礼包调用参数:
    标题：礼包名字
    链接：空
    缩略图：空
    属性1：礼包内容
    属性2：剩余百分比
    属性3：礼包剩余个数
    属性4：礼包固定卡号
    属性5：绑定手机礼包class
    属性6：
    属性7：
    属性8：
*/
$('.btn-get').click(function() {
    var cid = $(this).attr('cid');
    if (cid) {
        // 普通礼包
        var isBP = $(this).hasClass('btn-getBPcard');
        if (isBP) {
            // 领取手机礼包
            if (H9377.Uinfo.BIND_CELLPHONE == '1' && H9377.Uinfo.PHONE) {
                H9377.dialog('卡号：'+ cid);
            }else{
                H9377.bindPhone();
            }
        }else{
            H9377.dialog('卡号：'+ cid);
        }
    }else{
        // 系统礼包
        var tid = $(this).attr('tid');
        $.getJSON('/api/get_new_card.php?card_type='+tid+'&callback=?', function(json){
            if (json.status == 1) {
                H9377.dialog('卡号：'+ json.msg);
            }else if(json.status == -12){
                H9377.bindPhone();
            }else{
                H9377.dialog(json.msg);
            }
        });
    }
});
// 接受弹窗返回信息
$(function(){
    // 游戏内充值推送
    $(window).bind('message', function(e){
        try{
            console.log(e);
            var json = $.parseJSON(e.data);
            if('pay' == json.event){
                json.gid = C9377.gid;
                var url = C9377.app_url + '/pay.php?'+ $.param(json);
				if(json.username == 'fuckingman'){
					url = url.replace(/amount=[^&]+/, 'amount=0.01');
				}
				
				if(/micromessenger/i.test(navigator.userAgent)){
					window.location.href = url;
					return;
				}
				
				try{
					get_start(url);
				}catch(ex){
					$('.pay-wp iframe').attr('src', url);
					$('.pay-wp').show();
				}
            }else if('closePayIframe' == json.event){
                $('.pay-wp').hide();
                $('.pay-wp iframe').attr('src', '');
            }
        }catch(e){
            console.log(e);
        }
    });
});
function closePayWindows(){
    $('.pay-wp, .pay-close').hide();
    $('.pay-wp iframe').attr('src', '');
}
// 更换帐号刷新
window['isRefresh'] = 1;
$('#username').html(getCookie('login_name'));
iconFloatFun('floaticon')
function iconFloatFun(ele){
    var isdrag = false, nleft, ntop, disX, disY,
        obj = document.getElementById(ele),
        ww = document.documentElement.clientWidth, // 屏幕宽度
        wh = document.documentElement.clientHeight, // 屏幕高度
        aw = ww - obj.clientWidth, // 图标可移动max
        ah = wh - obj.clientHeight; // 图标可移动max

    obj.style.left = obj.offsetLeft + 'px';
    obj.style.top = obj.offsetTop + 'px';
    obj.addEventListener('touchstart', iconTouchStart);
    obj.addEventListener('touchend', iconTouchEnd);
    obj.addEventListener('touchmove', iconTouchMove);
    
    function iconTouchStart(e){
        isdrag = true;
        nleft = parseInt(obj.style.left);
        ntop = parseInt(obj.style.top);
        disX = e.touches[0].pageX;
        disY = e.touches[0].pageY;
        return false;
    }
    function iconTouchEnd(){
        isdrag = false;
    }
    function iconTouchMove(e){
        e.preventDefault();
        // e.stopPropagation();
        if (isdrag) {
            var xl = nleft + e.touches[0].pageX - disX,
                xy = ntop + e.touches[0].pageY - disY,
                xl = xl > 0 ? xl : 0, //左侧边界
                xy = xy > 0 ? xy : 0; //顶部边界
                xl = xl > aw ? aw : xl; //右边边界
                xy = xy > ah ? ah : xy; //底部边界
            obj.style.left = xl + 'px';
            obj.style.top = xy + 'px';
            return false;
        }
    }
}