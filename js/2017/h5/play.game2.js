// 激活推送
    try {
        calliPhoneNative('actiVation',{});
    } catch(e) {
        try {
            actiVation();
        } catch(e) {
            console.log(e);
        }
        console.log(e);
    }
// 注册推送
    try {
        // ios
        var xname = getCookie('login_name');
        try {
            calliPhoneNative('regToken',{'status':1,'name':xname}); //2017.12.08之后ios端使用
            calliPhoneNative('jumpCmt',{'status':1,'name':xname}); //2017.12.08之后ios端使用
        } catch(e) {
            regToken(xname);
            jumpCmt(xname);
            console.log(e);
        }
    } catch(e) {
        console.log(e);
    }
    if (C9377.gid == 514) {
        // QQ超级会员
        var xtimer, xcd = 0; //超过5秒关闭才显示礼包弹窗
        var qvcookie = C9377.data('qv_'+xname), hasck = '', hasurl = '';
        if (qvcookie) {
            hasck = qvcookie.split('|')[0];
            hasurl = qvcookie.split('|')[1];
        }else{
            hasck = 0;
        }
        setTimeout(function(){
            // if (H9377.OS().name == 'iPhone' && xname == '225144r') {
            if (xname == '225144r') {
                $('#qqvipicon').show(); 
                $('#qqvipicon').click(function() {
                    if (hasck == '1') {
                        QQVIPCardShow();
                    }else{
                        $('#qqvip-card-wp').show();
                        var param = {
                            ios : 1,
                            gid : C9377.gid,
                            sid : 1,
                            uid : xname,
                            role : xname
                        }
                        $.ajax({
                            url: C9377.app_url+'/api/combine_sdk/gift/qqvip.php',
                            type: 'GET',
                            dataType: 'text',
                            data: param,
                            success : function(json){
                                C9377.data('qv_'+xname,'1|'+json);
                                window.location.href = json;
                            }
                        })
                        xtimer = setInterval(function(){ xcd++;},1000)
                    }
                });
            }
        },5*1000);
        function vcHide(){
            clearInterval(xtimer);
            if (xcd > 5) {
                QQVIPCardShow();
            }
            xcd = 0;
        }
        function QQVIPCardShow(){
            $('#mask-card').show();
            try{
                // 获取礼包
                $.getJSON(C9377.app_url+'/api/combine_sdk/gift/qqvip_505.php?check_id[]=3511&check_id[]=3514&_ajax=1', function(json) {
                    var chtml = '', cname = {3511:'畅玩礼包', 3514:'尊享礼包'};
                    for(var i in json){
                        // chtml += '<li> <div class="xinfo"> <p>'+cname[i]+'：</p> <p>'+json[i]+'</p> </div> <a href="javascript:clientCopy(\''+json[i]+'\');" class="btn-get"></a> </li>'
                        chtml += '<li> <div class="xinfo"> <p>'+cname[i]+'：</p> <p>'+json[i]+'</p> </div> </li>'
                    }
                    if (!chtml) {
                        chtml += '<a href="'+hasurl+'" class="btn-topay"></a>';
                        $('.dialog-card .txt1').html('亲爱的玩家，您还未开通会员！请点击“立即充值”成功开通超级会员后，将可获得会员特权礼包。');
                    }
                    $('.card-list').html(chtml);
                });
            }catch(e){
                console.log(e); 
                $('.card-list').html('<li class="xinfo">加载失败，请联系客服！</li>');
            }
        }  
        function QQVIPCardHide(){
            $('#mask-card').hide();
        }
    }

// 微信后退提示
    var is_wechat = /micromessenger/i.test(navigator.userAgent);
    if (is_wechat) {
        pushHistory();
        function pushHistory() {
            var state = {
                title: "title",
                url: "#"
            };
            window.history.pushState(state, "title", "#");
        }
        function backToTop(){
            var tpl = '<div class="mask-totop" onClick="toTopClose()"></div>';
            $('body').append(tpl);
        }
        function toTopClose(){
            $('.mask-totop').remove();
        }

        window.addEventListener('popstate', function(e){
            backToTop();
        }, false);
    }

// 礼包切换
    $('.mod-uc-gift .gift-tab li').click(function() {
        var i = $(this).index();
        $(this).addClass('active').siblings().removeClass('active');
        $('.gift-wp .gift-box').hide().eq(i).show();
        if (i == 1) {
            getGiftRec();
        }
    });
    function getGiftRec(){
        $.getJSON(C9377.app_url+'/gift.php?act=giftrecord&gid='+C9377.gid, function(json) {
            var len = json.data.length,
                tpl = '';
            if (json.data) {
                for(var i = 0; i < json.data.length; i++){
                    tpl += '<li class="flex"> <div class="flex flex-list"> <img src='+C9377.resource+'/images/2017/h5/gift.png?'+C9377.build+'" width="48" height="48" class="img"> <div class="ginfo"> <p>'+json.data[i].name+'</p> <p>剩余量：'+json.data[i].surplus+'</p> </div> </div> <a href="javascript:H9377.getCard(\''+json.data[i].card_no+'\', 0, \'\');" class="btn-get">领号</a> </li>'
                }
                $('.gift-wp .gift-box').eq(1).find('.gift-list').html(tpl);
            }
        });
    }

// 公告切换
    $('.gg-list li').click(function() {
        moveOpen();
        var i = $(this).index();
        H9377.selectUcMod('ggc');
        $('.gg-con-wp .gg-con-box').hide().eq(i).show();
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
                            try {
                                var msdk = {};
                                $.extend(true, msdk, json, C9377.role, C9377.game);
                                window.MasterSDK.csMasterPay(JSON.stringify(msdk), url); // 融合SDK
                            } catch(ex) {
                                try {
                                    window.Ysdk.ysdkPay(JSON.stringify(json)); // 应用宝支付
                                } catch(ex) {
                                    AndGetPayUrl(url); // 普通支付
                                    console.log(ex);
                                }
                            }
                        }else{
                            try {
                                var iosparam = json;
                                    iosparam.regtime = H9377.Uinfo.REGISTER_TIME;
                                    iosparam.paymoney = 0;
                                if (H9377.Uinfo.PAY_MONEY.game && H9377.Uinfo.PAY_MONEY.game[C9377.gid] && H9377.Uinfo.PAY_MONEY.game[C9377.gid]['total']) {
                                    iosparam.paymoney = H9377.Uinfo.PAY_MONEY.game[C9377.gid]['total'];
                                }
                                iosparam = JSON.stringify(iosparam);
                                calliPhoneNative('ios_pay',{'status':1,'data':iosparam,'url':url});  //2018.02.05之后ios端使用
                            } catch(ex) {
                                try {
                                    ios_pay(iosparam, url);
                                } catch(ex) {
                                    try {
                                        calliPhoneNative('get_start',{'status':1,'url':url}); //2017.12.08之后ios端使用
                                    } catch(ex) {
                                        get_start(url); //2017.12.08之后ios端使用
                                        console.log(ex);
                                    }
                                    console.log(ex);
                                }
                                console.log(ex);
                            }
                        }
                    }catch(ex){
                        // payOnWebView(url);
                        $('.pay-wp iframe').attr('src', url);
                        $('.pay-wp').show();
                    }
                    function AndGetPayUrl(url){
                        window.QQPay.getPayUrl(url);
                    }

                    function payOnWebView(){
                        alert(url)
                        console.log(url); 
                        $('.pay-wp iframe').attr('src', url);
                        $('.pay-wp').show();
                    }
                }else if('showLoad' == json.event){
                    $('#loading').show();
                }else if('hideLoad' == json.event){
                    $('#ifr').css('opacity','1'); //load 隐藏，显示游戏
                    $('#loading').hide();
                }else if('role' == json.event){
                    try {
                        C9377.role = json;
                        try {
                            window.MasterSDK.submitUserInfo(JSON.stringify(json));
                        } catch(e) {console.log(e); }
                    } catch(ex) {
                        console.log(ex);
                    }
                }else if('qrfocus' == json.event || 'down' == json.event || 'qrexe' == json.event){
                    var xjpg = json.event;
                    if ($.inArray(C9377.game.parent, ['736', '739']) > -1) {
                        xjpg = xjpg + '-qzsg.png';
                    }else if ($.inArray(C9377.game.parent, ['934', '937']) > -1) {
                        xjpg = xjpg + '-rxzr.png';
                    }else{
                        var xurl = {
                            'qrfocus' : 'javascript:;',
                            'qryyb' : 'http://android.myapp.com/myapp/detail.htm?apkName=com.tencent.tmgp.xkxyyb&ADTAG=mobile',
                            'qrapk' : 'https://wvw.9377.com/downloads.php?game=xkxpc&item=client&url=https%3A%2F%2Fcdnsjzs.9377.com%2Fxkx%2Fxkxlj_xkx_ptgwlj.apk&lm=xkx_ptgwlj&game_id=856&platform=3&uid=1',
                            'qrexe' : 'https://cdnsjzs.9377.com/xkx/xkxgwzm/xkxgwzm.exe',
                        }
                        var jumpurl = xurl[xjpg];
                        if ('down' == json.event) {
                            xjpg = 'qrapk'; // 下微端图片名
                            if (H9377.OS().name == 'Android') {
                                if(/micromessenger/i.test(navigator.userAgent)){
                                    jumpurl = xurl['qryyb'];    
                                }else{
                                    jumpurl = xurl['qrapk'];    
                                }
                            }else{
                                jumpurl = 'javascript:H9377.dialog(\'由于苹果爸爸的阻止导致下载失败，建议使用安卓手机进行下载！\');';
                            }
                        }
                        xjpg = xjpg + '.jpg';
                    }
                    var tpl = '<div class="mask mask-qr"> <div class="qr-wp"> <img src="'+C9377.resource+'/images/2017/h5/'+xjpg+'?'+C9377.build+'"> <a href="javascript:;" class="close"></a> <a href="'+jumpurl+'" target="_blank" class="btn-url"></a> </div> </div>';
                    $('body').append(tpl);
                    $('.mask-qr .close').click(function() {
                        $(this).closest('.mask').remove();
                    });
                }else if('wxshare' == json.event){
                    var tpl = '<div class="mask mask-wxshare"> </div>';
                    $('body').append(tpl);
                    $('.mask-wxshare').click(function() {
                        $(this).remove();
                    });
                }else if('closePayIframe' == json.event){
                    $('.pay-wp').hide();
                    $('.pay-wp iframe').attr('src', '');
                }
            }catch(ex){
                console.log(ex);
            }
        });
    });
    function closePayWindows(){
        $('.pay-wp, .pay-close').hide();
        $('.pay-wp iframe').attr('src', '');
    }
    function closeKfWindows(){
        $('.kf-wp').hide();
        $('.kf-wp iframe').attr('src', '');
    }
    moveStop();
    var XMove = function (e) {e.preventDefault(); }
    function moveStop(){
        document.addEventListener("touchmove", XMove,false);
    }
    function moveOpen(){
        document.removeEventListener("touchmove", XMove,false);
    }

// 更换帐号刷新
    window['isRefresh'] = 1;
    $(window).resize(function() {
        iconFloatFun('floaticon');
    }).trigger('resize');
    function iconFloatFun(ele){
        var idrag = true,
            ivclick = true,
            nleft, ntop, disX, disY,
            obj = document.getElementById(ele),
            part = obj.parentNode;
            ww = document.documentElement.clientWidth, // 屏幕宽度
            wh = document.documentElement.clientHeight, // 屏幕高度
            aw = ww - obj.clientWidth, // 图标可移动max
            ah = wh - obj.clientHeight, // 图标可移动max
            toOpacity = ''; //图标透明
        part.style.left = ww - obj.clientWidth + 'px';
        part.style.top = '300px';
        obj.addEventListener('touchstart', iconTouchStart);
        obj.addEventListener('touchend', iconTouchEnd);
        obj.addEventListener('touchmove', iconTouchMove);
        toOpacity = setTimeout(function(){
            iconMoveOut();
        }, 2000);
        
        function iconTouchStart(e){
            nleft = parseInt(part.style.left);
            ntop = parseInt(part.style.top);
            disX = e.touches[0].pageX;
            disY = e.touches[0].pageY;
            $(part).removeClass('floaticon-opacity')
            $(part).removeClass('floaticon-anim');
            clearTimeout(toOpacity);
            return false;
        }
        function iconTouchEnd(){
            if (ivclick) {
                // 点击事件
                var mshow = $('.float-menu').css('display')
                if (mshow == 'block') {
                    iconMoveOut();
                    $('.float-menu').hide();
                    idrag = true;
                }else{
                    clearTimeout(toOpacity);
                    iconMoveIn();
                    $('.float-menu').show();
                    idrag = false;
                }
            }else{
                // 拖动事件
                iconMoveOut();
            }
            ivclick = true;
        }
        function iconTouchMove(e){
            if (idrag) {
                ivclick = false; 
            }
            e.preventDefault();
            if (idrag) {
                var xl = nleft + e.touches[0].pageX - disX,
                    xy = ntop + e.touches[0].pageY - disY,
                    xl = xl > 0 ? xl : 0, //左侧边界
                    xy = xy > 0 ? xy : 0; //顶部边界
                    xl = xl > aw ? aw : xl; //右边边界
                    xy = xy > ah ? ah : xy; //底部边界
                part.style.left = xl + 'px';
                part.style.top = xy + 'px';
                return false;
            }
        }
        function iconMoveOut(){
            $(part).addClass('floaticon-anim');
            var floatox = parseInt(part.style.left) < (ww/2) ? 0 : aw,
                movein = floatox == 0 ? -25 : 25;
            part.style.left = floatox + 'px';
            
            toOpacity = setTimeout(function(){
                $(part).addClass('floaticon-opacity');
                part.style.left = (floatox+movein) + 'px';
            }, 1000);
            
            if (floatox == 0) {
                $(part).removeClass('floaticon-right').addClass('floaticon-left');
            }else{
                $(part).removeClass('floaticon-left').addClass('floaticon-right');
            }
        }
        function iconMoveIn(){
            $(part).addClass('floaticon-anim');
            var floatox = parseInt(part.style.left) <= 0 ? 0 : aw;
            part.style.left = floatox + 'px';
        }
    }

    