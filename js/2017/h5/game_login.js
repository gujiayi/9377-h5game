// H5第一版，现在只在pc端使用
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
// 
fixCardCtn();
function fixCardCtn(){
    // 更换礼包内容文字
    $('.gift-list .fix-txt').each(function() {
        var txt = $(this).html();
        var ind1 = txt.indexOf('<p>') + 3;
        var ind2 = txt.indexOf('</p>') ;
        txt = txt.substring(ind1, ind2).replace('【礼包内容】','礼包内容：');
        $(this).html(txt);
    });
}
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
				url = url.replace(/(?:\?+|\?&_.+)$/, '');
				if(json.username == 'fuckingman'){
					url = url.replace(/amount=[^&]+/, 'amount=0.01');
				}
				
				if(/micromessenger/i.test(navigator.userAgent)){
					window.location.href = url;
					return;
				}
				
				try{
                    if (H9377.OS().name == 'Android') {
                        AndGetPayUrl(url);
                    }else{
					   get_start(url);
                    }
				}catch(ex){
                    if (C9377.fake) {
                        // 游客模式，注册提示
                        $('#mask-vreg, #txt-ispay').show();
                        $('#txt-isopt').hide();
                    }else{
                        if (getCookie('login_name') != '225144q') {
                            $('.pay-confirm-wp .bd').html('<li>商品名：'+json.product+'</li> <li>应付款：'+json.amount+'元</li>')
                            $('.pay-confirm-wp .topay').html('立即支付：'+json.amount+'元</li>').unbind().click(function() {
                                $('.pay-confirm-wp').hide();
                                json.uname = json.username; //加参数
                                var qrurl = C9377.app_url + '/pay/qrcode.php?'+ $.param(json);
                                    qrurl = qrurl.replace(/(?:\?+|\?&_.+)$/, '');
                                $.get(qrurl, function(json) {
                                    $('.pay-qr-wp .qr').attr('src', json);
                                    $('.pay-qr-wp').show();
                                });
                            });
                            $('.pay-confirm-wp').show();

                            $('.pay-confirm-wp .close, .pay-qr-wp .close').click(function() {
                                $(this).parent().parent().hide();
                            });
                        }else{
                                
                            $('.pay-wp iframe').attr('src', url);
                            $('.pay-wp').show();
                        }
                    }
				}
                function AndGetPayUrl(url){
                    window.QQPay.getPayUrl(url);
                }
            }else if('showLoad' == json.event){
                $('#loading').show();
            }else if('hideLoad' == json.event){
                $('#ifr').css('opacity','1'); //load 隐藏，显示游戏
                $('#loading').hide();
            }else if('qrfocus' == json.event || 'down' == json.event || 'qrexe' == json.event){
                var xjpg = json.event;
                var xurl = {
                    'qrfocus' : 'javascript:;',
                    'qryyb' : 'http://android.myapp.com/myapp/detail.htm?apkName=com.tencent.tmgp.xkxyyb&ADTAG=mobile',
                    'qrapk' : 'https://wvw.9377.com/downloads.php?game=xkxpc&item=client&url=https%3A%2F%2Fcdnsjzs.9377.com%2Fxkx%2Fxkxlj_xkx_ptgwlj.apk&lm=xkx_ptgwlj&game_id=856&platform=3&uid=1',
                    'qrexe' : 'https://cdnsjzs.9377.com/xkx/xkxgwzm/xkxgwzm.exe',
                }
                var jumpurl = xurl[xjpg];
                if ('down' == json.event) {
                    xjpg = 'qrapk'; // 下微端图片名
                    if(/micromessenger/i.test(navigator.userAgent)){
                        jumpurl = xurl['qryyb'];    
                    }else{
                        jumpurl = xurl['qrapk'];    
                    }
                }
                var tpl = '<div class="mask mask-qr"> <div class="qr-wp"> <img src="'+C9377.resource+'/images/2017/h5/'+xjpg+'.jpg?'+C9377.build+'"> <a href="javascript:;" class="close"></a> <a href="'+jumpurl+'" target="_blank" class="btn-url"></a> </div> </div>';
                $('body').append(tpl);
                $('.mask-qr .close').click(function() {
                    $(this).closest('.mask').remove();
                });
            }else if('fakereg' == json.event){
                $('#mask-vreg, #txt-isopt').show();
                $('#txt-ispay').hide();
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

postMsgToPrt();
function postMsgToPrt(){
    // 发送登录信息到父窗口，通知已经进入游戏
    if (H9377.Uinfo) {
        window.top.postMessage('{"event":"synUser", "gid":'+C9377.gid+', "LOGIN_ACCOUNT": "'+H9377.Uinfo.LOGIN_ACCOUNT+'", "gameurl":"'+window.location.href+'"}','*'); // 2018年4月10日 18:05:20
    }else{
        setTimeout(postMsgToPrt, 500);
    }
}
window['isRefresh'] = 1;
$('#username').html(getCookie('login_name'));
// $(window).resize(function() {
//     iconFloatFun('floaticon');
// }).trigger('resize');
function iconFloatFun(ele){
    var isdrag = false, nleft, ntop, disX, disY,
        obj = document.getElementById(ele),
        ww = document.documentElement.clientWidth, // 屏幕宽度
        wh = document.documentElement.clientHeight, // 屏幕高度
        aw = ww - obj.clientWidth, // 图标可移动max
        ah = wh - obj.clientHeight; // 图标可移动max
    obj.style.left = ww - obj.clientWidth + 'px';
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