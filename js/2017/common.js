/**
 * @WebSite   :http://www.9377.com/
 * @DateTime  :2017-08-16 15:57:27
 * 平台公用 2017
**/
 	// 菜单
 	try {
 		$('.header .menu li').eq(menuID).addClass('active');
 	} catch(e) {
 		$('.header .menu li').eq(0).addClass('active');
 	}
	// 顶栏
	$('.user-vip-wp').hover(function(){
		$('.user-vip-wp .vip-box').toggle();
	});
	
	$('.user-msg-wp').hover(function(){
		$('.user-msg-wp .msg-box').toggle();
	});
	// 设置为首页
	function winSetHP(){
		if(document.all){
			document.body.style.behavior = 'url(#default#homepage)'; 
			document.body.setHomePage('http://www.9377.com'); 
		}else{ 
			popTips('浏览器不支持此操作, 请手动设为首页'); 
		}
	}
	// 收藏
	function winAddFav(){
		try{ 
			window.external.addFavorite('http://www.9377.com', '9377游戏平台'); 
		} catch(e) {  
			try{ 
				window.sidebar.addPanel('9377游戏平台', 'http://www.9377.com', ''); 
			}catch (e) { 
				popTips('加入收藏失败，请使用Ctrl+D进行添加,或手动在浏览器里进行设置.'); 
			} 
		}
	}
	// 顶栏搜索
	function topBarSearch() {
		var keyobj = document.getElementById('top-search-val');
		var keywords = document.getElementById('top-search-val').value; 
		if( !keywords ) {
			popTips('请输入搜索关键字。');
			keyobj.focus();
			return false;
		}
		return true;
	}
	// 搜索功能
	$('#top-search-val').focus(function() {
		$('#search-rem').show();
	});
	$('#top-search-val').blur(function() {
		setTimeout(function(){
			$('#search-rem').hide();
		},120);
	});
	$('#search-rem li').mouseover(function(){
		$(this).addClass('active').siblings().removeClass('active');
	}).eq(0).addClass('active');

	// 全部游戏
	$('.all-game-wp').mouseenter(function() {
		$('.all-game-box').show();
		allGameImg(0);
	}).mouseleave(function() {
		$('.all-game-box').hide();
	});;
	$('.all-game-list dd').mouseenter(function(){
		var i = $(this).index('.all-game-list dd');
		if (i > 18) { return;};
		allGameImg(i);
	});
	function allGameImg(index){
		var sobj = $('.all-game-img li').eq(index),
			simg = sobj.find('img');
		if (sobj.length) {$('.all-game-img li').hide().eq(index).show(); }
		if (!simg.attr('src')) {simg.attr('src',simg.attr('_src')); }
	}
	// 底部友链
	$('.links-box .more').click(function() {
		var obj = $(this).siblings('.links-list'), lh = obj.find('.lbox').height();
		if (lh > 30) {
			obj.toggleClass('links-auto');
			$(this).toggleClass('morev');
		}
	});
	// 右侧菜单
	var $fmenu = $('#float-menu'), $ftop = $fmenu.find('.f-top');
	$ftop.click(function (e){
		$('body,html').animate({scrollTop:0},200);
	});
	var st = 0;
	$(window).scroll(function (){
		if($(window).scrollTop() === 0){
			$ftop.slideUp();
			st = 0;
		} else {
			if(st === 0) $ftop.slideDown();
			st = 1;
		}
	}).trigger('scroll');
// 展示用户信息
	getUserInfo();
	function getUserInfo(){
		$.getJSON(C9377.app_url+'/api/user_info_jsonp.php?level=1&last_game=1&num=6&callback=?', function(json){
			if(!json.LOGIN_ACCOUNT) return;
			C9377.userInfoJson = json;
			var json_name = json.BBS_NAME ? json.BBS_NAME : (!json.IS_OPENID ? json.LOGIN_ACCOUNT : (json.openid && json.openid.nickname ? json.openid.nickname : json.LOGIN_ACCOUNT));
			var jlevel = json.user_level;
			window['openid_nickname'] = json.openid ? json.openid.nickname : json.LOGIN_ACCOUNT;
			// 首页登录框信息
			var J_index_loginwp = $('#J-index-loginwp');
			if (J_index_loginwp.length > 0) {
				$('#J-index-nologin').hide();
				$('#J-index-logined').show();
				var avatar = $_COOKIE['user_avatar_big'] || 'http://bbs.9377.com/uc_server/images/noavatar_small.gif'; //平台头像
				var avatar3 = $_COOKIE['openid_type'] ?  json.openid.avatar: ''; //第三方帐号头像
				var level_per = jlevel.next_level_per >= 0 ? jlevel.next_level_per : 100,
					level_name = jlevel.next_level ? jlevel.next_level.name : jlevel.name,
					level_diff = jlevel.next_level_diff ? '离下一等级还差 <strong>'+jlevel.next_level_diff+'</strong> 成长值' : '您已达到最高等级';
				var logined_wp = $('#J-index-logined');
				logined_wp.find('.avatar img').attr('src', avatar3 ? avatar3 : avatar);
				logined_wp.find('.u-vip').html('VIP'+jlevel.level);
				logined_wp.find('.u-name').html(json_name);
				logined_wp.find('.u-credit').html(json.credit);
				logined_wp.find('.u-vip-proc i').width(level_per+'%');
				logined_wp.find('.u-vip-wp .u-vip-box').html('<p class="tit">会员等级</p> <p class="txt1">'+level_diff+'</p> <div class="vmod"> <i class="v0"></i> <i class="v10"></i> <em class="vline"><i style="width:'+level_per+'%"></i></em> <em class="vt1">VIP'+jlevel.level+'</em> <em class="vt2">'+level_name+'</em> </div> <a href="'+C9377.app_url+'/users/users_index.php?type=14" target="_blank" class="vb">VIP特权</a>');
				var vipto, vip_obj = $('.logined .u-vip-wp'); //vip弹窗
				vip_obj.hover(function(){
					clearTimeout(vipto);
					vip_obj.addClass('vip-wp-act');
				},function(){
					vipto = setTimeout(function(){
						vip_obj.removeClass('vip-wp-act');
					}, 300);
				});

				var last_games_num = 0;
				if( json.last_games != '' ) {
					var html = '';
					for( i in json.last_games ) {
						if( !json.last_games[i].NAME ) continue;
						last_games_num++;

						if (i%3==0) {
							html += '<ul class="slide-item">';
						}
						html += '<li> <a href="'+json.last_games[i].site+'" class="item1" target="_blank">'+json.last_games[i].NAME+'</a> <a href="'+json.last_games[i].url+'" class="item2" target="_blank">'+json.last_games[i].name+'</a> </li>'
						if (i != 0 && (i+1)%3 == 0) {
							html += '</ul>';
						}
					}
					$('#played .slide-bd').html(html);
					
					last_games_num > 3 && $('#played').slideBox({mode: 'left', optevent: 'click', navCell : false, nextBtn : true, prevBtn : true, autoPlay:false });
				}else{
					$('#played .hd').html('游戏推荐');
				}
				

				// 绑定状态
				if (json.BIND_CELLPHONE == '1' && json.PHONE) {
					$('.icon-uphone').addClass('icon-uphone-y');
				}
				if (json.EMAIL) {
					$('.icon-email').addClass('icon-email-y');
				}
				$.getJSON(C9377.app_url+'/api/sub_account.php?act=get_sub_account&callback=?', function(json){
					if (json.length > 0) {
						$('.icon-uug').addClass('icon-uug-y');
					}
				})
				
				//绑定账号弹窗
				var third_bind_nt = getCookie('third_bind_nt');
				if (json.IS_OPENID && third_bind_nt == null) {
					//判断第三方登录的方式
					var openAction = $_COOKIE['openid_type'], thirdType, thirdTxt;
					if(openAction=='qq'){
						thirdType = 'qq'; thirdTxt = 'QQ';
					}else if(openAction=='weibo'){
						thirdType = 'wb'; thirdTxt = '微博';
					}else{
						thirdType = 'wx'; thirdTxt = '微信';
					};
					$('#pop-bind-user .tuser').html('亲爱的 <i class="i-third-x i-third-'+thirdType+'"></i> <span class="col1">'+json.openid.nickname+'</span>')
					$('#pop-bind-user .hd').html(thirdTxt+'帐号绑定')
					$('#pop-bind-user .thirdtxt').html(thirdTxt)
					popSelect('#pop-bind-user');

					$('#pop-bind-user .btn-bind-nt').click(function(){
						$('.w-pop-close').click();
						var va = new Date(), vb = 60*60*24*30*1000, vc = va.getTime()+vb;
						C9377.setcookie('third_bind_nt','1',(new Date(vc))/1000);
					});
				};
				// 安全模块弹窗
				if (!json.ID_CARD_NUMBER && !getCookie('cs_idc_later')) {
					$('.safe-mod-wp, .safe-mod-idc').show();
					$('.safe-mod .close').attr('opt','idc');
				}else if(json.BIND_CELLPHONE == '0' && !getCookie('cs_phone_later')){
					$('.safe-mod-wp, .safe-mod-phone').show();
					$('.safe-mod .close').attr('opt','phone');
				}else if(!json.infos_per < 100 && !getCookie('cs_info_later')){
					$('.safe-mod-wp, .safe-mod-info').show();
					$('.safe-mod .close').attr('opt','info');
				}
				$('.safe-mod .close, .safe-mod .go').click(function() {
					var opt = $(this).attr('opt'), vck = '';
					if (opt == 'idc') {
						vck = 'cs_idc_later';
					}else if(opt == 'phone'){
						vck = 'cs_phone_later';
					}else{
						vck = 'cs_info_later';
					}
					C9377.setcookie(vck,'1',(new Date()/1000 + 24*60*60*30));
					$('.safe-mod-wp').hide();
				});
			};
			
			setSignMod(); // 设置签到事件
			// 通用顶栏
			$('.header .user-vip em').html(jlevel.level);
			$('.header .user-name').html(json_name);
			$('.header .user-credit').html(json.credit);
			$('.header .user-coin').html(json.gold);
			var user_snum = json.security_per, user_stpl = '';
			for(var i = 0; i < 3; i++){ user_stpl += i < user_snum ? '<em class="s"></em>' : '<em></em>'; }
			$('.header .user-slevel').html(user_stpl);
			$('.header .nologin').hide();
			$('.header .logined').show();
			// 用户中心登录信息
			var J_user_loginwp = $('#J_user_loginwp');
			if (J_user_loginwp.length > 0) {
				$('#user_info_name').html(json_name);
				var has_json = false;
				if( json.last_games != '' ) {
					has_json = true;									
					var html = '';
					for( i in json.last_games ) {
						if( !json.last_games[i].NAME ) continue;
						html += '<li>';
						html += '<a class="name" href="'+json.last_games[i].site+'" target="_blank">'; 
						html += '<img src="'+C9377.resource+'/images/cms_style_2012_new/game/icon/'+json.last_games[i].ALIAS+'.jpg?'+C9377.build+'" />'+json.last_games[i].NAME; 
						html += '</a>'; 
						html += '<span class="serv"><a href="'+json.last_games[i].url+'" target="_blank">'+json.last_games[i].name+'</a></span>'; 
						html += '<a href="'+json.last_games[i].url+'" class="btns" target="_blank">进入游戏</a>'; 
						html += '</li>';
					}
					$('#last_games').html(html);
					$('#users_tui_games').fadeIn('fast');
				}
				//新用户登录显示推荐游戏
				if( has_json == false ){
					$('#users_tui_games').hide();
					$('#users_newer_games').show();
				}
			};
			// 获取用户未读信息
			$.getJSON(C9377.app_url+'/api/get_msg_status.php?do=msg&callback=?', function(json){
				if (json.total != 0) {
					$('.header .user-msg').addClass('user-msg-v');
					$('.header .data .hd').html('<em>新</em><a href="'+json.data[0].url+'" mid="'+json.data[0].msg_id+'" target="_blank" class="J-msg-read">'+json.data[0].title+'</a>');
					var nd = new Date(json.data[0].addtime*1000), y = nd.getFullYear(), m = nd.getMonth()+1, d = nd.getDate();
					var addtime = y+'/'+m+'/'+d;
					$('.header .data .bd').html('<p class="cnt">'+json.data[0].description+'</p><p class="time"><a href="'+json.data[0].url+'" mid="'+json.data[0].msg_id+'" target="_blank" class="more fr J-msg-read">前往查看>></a>'+addtime+'</p>')
					$('.header .user-msg-wp .data').show();
					$('.J-msg-read').click(function() {
						var mid = $(this).attr('mid');
						if (!$.browser.msie || ($.browser.msie && parseInt($.browser.version) > 9)) {
							var param = {
								'do' : 'read_msg',
								'msg_id' : mid
							}
							$.post(C9377.app_url+'/users/users_do.php', param, function(result) {
								if (result.status == '1') {
									// 读取成功
								}
							},'json');
						}
					});
				}else{
					$('.header .user-msg-wp .nomsg').show();
				}
			});
		});
	}
	function setSignMod(){
		// 打卡事件
		dc= new Array(); //全局变量，方便ie跨域使用
		dc[0]="sign-ing";
		dc[1]="sign-done";
		dc[2]="sign-ed";
		dc[3]="";
		if(getCookie('login_name')) {
			if ($.browser.msie && parseInt($.browser.version) < 10) {
				var xurl = C9377.app_url+'/market/api/api.php',
					param = {'ac' : 'new_sign', '_ajax' : 1, 'parent' : 1 }
				iframeP(xurl, 'issign', param);
			}else{
				var param = {
					'ac' : 'new_sign',
					'_ajax' : 1
				}
				$.post(C9377.app_url+'/market/api/api.php', param, function(result) {
					issign_fixcb(result);
				}, 'json');
			}
		}

		$('#sign-in,#btn-sign').live('click', function() {
			popSelect('#sign-box2');
		});
		$('.sign-d').live('click', function() {
			// 打卡操作
			var date = $(this).attr('date');
				C9377.signdate = date; //供签到回调使用
			if ($.browser.msie && parseInt($.browser.version) < 10) {
				var xurl = C9377.app_url+'/market/api/api.php',
					param = {'ac' : 'new_sign', 't' : date, '_ajax' : 1, 'parent' : 1 }
				iframeP(xurl, 'sign', param);
			}else{
				$.ajax({
					'url': C9377.app_url+'/market/api/api.php',
					'type': 'POST',
					'data': {'ac' : 'new_sign', '_ajax' : '1','t':date},
					'dataType': 'json',
					'async': false,
					'cache': false,
					success: function(result){
						sign_fixcb(result);
					},
					error: function(e){
						alert('网络繁忙！');
					}
				});
			}
		});
	}
	
	function setTab(param, cb){
		var defaults = {
			'sel' : param.sel,
			'obj' : param.obj,
			'cls' : param.cls ? param.cls : 'active',
			'inds' : param.inds ? param.inds : 0,
			'mode' : param.mode ? param.mode : 'show',
			'event' : param.event ? param.event : 'click',
			'auto' : param.auto ? param.auto : false
		}
		var tab_index = defaults.inds;
		$(defaults.sel).bind( defaults.event, function(){
			tab_index = $(this).index();
			tabSlide();
		}).eq(tab_index).trigger(defaults.event);
		
		if (defaults.auto) {
			// 自动切换
			var tab_itv;
			var obj_parent = $(defaults.obj).parent().parent();
			obj_parent.hover(function(){
				clearInterval(tab_itv);
			},function(){
				tab_itv = setInterval(function(){
					tab_index++;
					if (tab_index >= $(defaults.sel).length) {tab_index=0;}
					tabSlide();
				}, 4000);
			}).trigger('mouseleave');
		}

		function tabSlide(){
			$(defaults.sel).eq(tab_index).addClass(defaults.cls).siblings().removeClass(defaults.cls);
			if (defaults.mode == 'show') {
				$(defaults.obj).removeClass(defaults.cls).hide().eq(tab_index).addClass(defaults.cls).show();
			}else if (defaults.mode == 'fade') {
				$(defaults.obj).removeClass(defaults.cls).fadeOut().eq(tab_index).addClass(defaults.cls).fadeIn();
			}
			if (cb) {
				cb(tab_index);
			}
		}
	}

	$(window).resize(function() {
		try {
			if (!fixedSize) {
				// 如果页面存在这个变量，则不切换页面尺寸
			}
		} catch(e) {
			winSetWidth();
		}
	}).trigger('resize');
	function winSetWidth(fixed){
		var win_width = $(window).width();
		if (!fixed) {
			if (win_width < 1200) {
				$('.w1200').removeClass('w1200');
				$('html').addClass('J1000').removeClass('J1200');
			}else{
				$('.w1000').addClass('w1200');
				$('html').addClass('J1200').removeClass('J1000');
			}
		}
	}

// 全局弹窗
	function popTips(txt, custom, tit){
		if (!custom) {
			// 纯文字模式
			$('#tips-pop .bd').html('<div class="bd-txt"> <p>'+txt+'</p> </div>');
		}else{
			// 自定义模式
			$('#tips-pop .bd').html(txt);
		}
		var vtit = tit ? tit : '提示';
		$('#tips-pop .hd').html(vtit);
		popSelect('#tips-pop');
	}

	function popSelect(ele){
		$('#mask').show();
		$(ele).show();
		$('.w-pop-close').click(function() {
			$('#mask').hide();
			$(ele).hide();
		});
		$('.w-close-reload').click(function() {
			window.location.reload();
		});
		$(document).keyup(function(event) {
			// Esc关闭弹窗
			if (event.keyCode == 27) {
				$('#mask').hide();
				$(ele).hide();
				$(document).unbind('keyup');
			}
		});
	}

	// 解决ie6-9跨域问题
	function iframeP(url, fixname, param){
		var fixhtml = '<form method="post" action="'+url+'" target="'+fixname+'_iframe" id="'+fixname+'_form">';
		fixhtml += '<input type="hidden" name="callback" value="'+fixname+'_fixcb" />';
		for( var i in param){
			fixhtml += '<input type="hidden" name="'+i+'" value="'+param[i]+'" />';
		}
		fixhtml += '</form>';
		fixhtml += '<iframe id="'+fixname+'_iframe" name="'+fixname+'_iframe" class="none"></iframe>';
		$('body').append(fixhtml);
		$('#'+fixname+'_form').submit();
	}
	// 是否打卡, 请求后的操作，供所有浏览器使用
	function issign_fixcb(result){
		for(var o in result.week){
            $('#d-'+o).addClass(dc[result.week[o]]);
            if(result.week[o]==3 || result.week[o]==1){
                $('#d-'+o).removeClass('sign-d');
            }
            $('#sign-vip').text(result.vip);
            $('#repair_sign').text(result.repair_times);
        }
		if (result.succeed) {
			C9377.signed = true;
			$('#sign-in').html('已打卡');
			$('#btn-sign').html('今日已打卡');
		}
	}
	// 打卡操作, 请求后的操作，供所有浏览器使用
	function sign_fixcb(result){
		if( result.status==1 ) {
            $('.sign-tips').html(result.msg);
            $('.sign-tips').stop(true,true).show().animate({'top': '300px', 'opacity': 0}, 2000, function() {
                $(this).hide().css({'top': '180px', 'opacity': 1})
			});
			//popTxts(result.msg);
            $('#sign-in').html('已打卡');
			$('#btn-sign').html('今日已打卡');
            $('#d-'+C9377.signdate).removeClass('sign-ing sign-ed');
            $('#d-'+C9377.signdate).addClass('sign-done');
            var credit = $('.u-credit').text(credit);
            $('.u-credit').text(parseInt(credit)+parseInt(result.credit));
        }else if(result.status==2){
			//popTxts(result.msg);
            $('.sign-tips').html(result.msg);
        	$('.sign-tips').stop(true,true).show().animate({'top': '300px', 'opacity': 0}, 2000, function() {
                $(this).hide().css({'top': '180px', 'opacity': 1})
			});
        }else{
			//popTxts('打卡失败，请稍后重试。');
            alert('打卡失败，请稍后重试。');
		}
	}
	//补签说明
	$('#sign-desc').hover(function(){
	    $('#sign-into').show();
	},function(){
	    $('#sign-into').hide();
	});
	//打卡的提示信息
	function popTxts(txt){
		$('#sign-pop-tips .sign-tips-con').html(txt);
		$('#sign-pop-tips').show();
	}
	$('.sign-tips-close').click(function(){
		$('#sign-pop-tips').hide();
	});
	$('.sign-close2').live('click',function() {
		$('#sign-box2').hide();
		//$('#sign-pop-tips').hide();
	});