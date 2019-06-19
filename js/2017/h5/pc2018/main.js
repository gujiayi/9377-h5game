// 登录
var username = getCookie('login_name');

$.getJSON(C9377.app_url+'/api/user_info_jsonp.php?last_game=1&callback=?', function(json){
	if(!json.LOGIN_ACCOUNT){
		C9377.ujson = 'nologin';
		return false;
	}
	C9377.ujson = json;
	var json_name = !json.openid ? json.LOGIN_ACCOUNT : (json.openid && json.openid.nickname ? json.openid.nickname : json.LOGIN_ACCOUNT);
	$('#top_login_tips').html('<a class="t_user_name" href="'+C9377.app_url+'/users/users_index.php" target="_blank">'+json_name+'</a><a class="t_user_out" href="'+C9377.app_url+'/login.php?do=logout">[退出]</a>')

	if (navactive == '0') {
		$('#nologin').hide();
		$('#logined .u-name').html(json_name);
		var xcredit = json.credit ? (json.credit.credit ? json.credit.credit : 0) : 0;
		$('#logined .u-credit').html(parseInt(xcredit));
		var last_games_num = 0;
		if( json.last_games != '' ) {
			var html = '';
			for( i in json.last_games ) {
				if( !json.last_games[i].NAME ) continue;
				last_games_num++;

				if (i%3==0) {
					html += '<ul class="slide-item">';
				}
				html += '<li> <a href="'+json.last_games[i].site+'" class="item1" target="_blank">'+json.last_games[i].NAME+'</a> <a href="'+json.last_games[i].url+'" class="item2" target="_blank">立即进入</a> </li>'
				if (i != 0 && (i+1)%3 == 0) {
					html += '</ul>';
				}
			}
			$('#played .slide-bd').html(html);
			
			last_games_num > 3 && $('#played').slideBox({mode: 'left', optevent: 'click', navCell : false, nextBtn : true, prevBtn : true, autoPlay:false });
		}else{
			$('#played .hd').html('游戏推荐');
		}
		$('#logined').show();
	}
});

	var navactive, actlocation = navactive ? navactive : 0;
// 首页
	try{
		if (actlocation == '0') {
			// 幻灯
			$('#slide-box').slideBox({
				nextBtn : true,
				prevBtn : true,
				delay: 5
			});
			// 推荐游戏
			$('.rmd-game-list li .img').hover(function(){
				$(this).toggleClass('active');
			});
			// 新闻tab
			$('.mod-news .news-tab').mouseenter(function() {
				$(this).addClass('active').siblings('.news-tab').removeClass('active');
				var i = $('.mod-news .news-tab').index($(this));
				$('.news-tab-wp .news-list').hide().eq(i).show();
			});
		};	
	}catch(e){}
	if (parseInt(actlocation) >= 0) {
		$('.g-menu a').eq(actlocation).addClass('active');
	};

// 置顶
	$('#totop').click(function(){
		$('html,body').animate({scrollTop:0},300);
	});

// 游戏中心
	// 游戏排行榜
	if($('#rank-slide .rank-list').length > 1){
		$('#rank-slide').slideBox({'mode' : 'left','autoPlay':false});
	}
	$('.rank-list li').mouseenter(function() {
		$(this).addClass('active').siblings().removeClass('active')
	});
	// 幻灯
	$('.gcslide li').mouseenter(function() {
		$(this).addClass('active').siblings().removeClass('active')
	}).eq(0).trigger('mouseenter');

// 礼包中心
	if($('#rob-list').length > 0){
		$.getJSON(C9377.app_url+'/game_card.php', {return_json: 1}, function(json) {
			if (json.data) {
				var tpl = '';
				for(var i in json.data){
					if (i > 5) { break;}
					tpl += '<li> <div class="item"> <img src="'+C9377.resource+'/images/2017/h5/icon/'+json.data[i].alias+'.png?9377" width="68" alt=""> <div class="info"> <p>'+json.data[i].username+'刚刚领取</p> <p>'+json.data[i].name+'</p> </div> <a href="'+C9377.app_url+'/game_card.php?game='+json.data[i].game+'&card_type='+json.data[i].card_type+'" target="_blank" class="btn-rob">抢</a> </div> </li>'
				}
				$('#rob-list').html(tpl);
			}
		});
	}

	$('.kv-wp .hd li').mouseenter(function() {
		var i = $(this).index();
		$(this).addClass('active').siblings().removeClass('active');
		$('.kv-wp .bd li').hide().eq(i).show();
	}).eq(0).trigger('mouseenter');

// 领取礼包
	var filterCqll = ['cqll','cqllfg','cqllios']; //传奇来了固定礼包
	$('.btn-getgift').click(function(){
		var _this = $(this);
		if( !sign ) {
			window.location.href = C9377.app_url +'/pc_login.php?ac=login';
			return;
		}else {
			if ($.inArray(game_alias, filterCqll) > -1) {
				_this.parent().html('您的激活码为：DfsmkzuA <a href="javascript:;" class="g-btn-s btn-get btn-copy">复制</a>');
				setCopyTxt('.btn-copy', 'DfsmkzuA');
			}else{
				$.getJSON('/h5/game_card.php?card_type='+card_type+'&sign='+sign, function(json){
					if( json.status != 1 ) {
						_this.parent().html(json.msg);
					}else {
						_this.parent().html(json.msg);
						
						setCopyTxt('.btn-copy', json.msg);
					}
				});
			}
		}
	});

	function PCGetCard(ele, cid, sign, single, bp){
		var _this = $(ele);
		if( !sign ) {
			window.location.href = C9377.app_url +'/pc_login.php?ac=login';
			return;
		}else {
			if (single) {
				if (bp) {
					_this.parent().html('该礼包需要绑定手机才可领取， <a href="'+C9377.app_url+'/users/users_index.php?type=4" target="_blank" class="g-btn-s">前往绑定</a>');
				}else{
					_this.parent().html('您的激活码为：'+single+' <a href="javascript:;" class="g-btn-s btn-get btn-copy">复制</a>');
					setCopyTxt('.btn-copy', single);
				}
			}else{
				if ($.inArray(game_alias, filterCqll) > -1) {
					_this.parent().html('您的激活码为：DfsmkzuA <a href="javascript:;" class="g-btn-s btn-get btn-copy">复制</a>');
					setCopyTxt('.btn-copy', 'DfsmkzuA');
				}else{
					$.getJSON('/h5/game_card.php?card_type='+card_type+'&sign='+sign, function(json){
						if( json.status != 1 ) {
							_this.parent().html(json.msg);
						}else {
							_this.parent().html('您的激活码为：'+json.msg+'<a href="javascript:;" class="g-btn-s btn-get btn-copy">复制</a>');
							setCopyTxt('.btn-copy', json.msg);
						}
					});
				}
			}
		}
	}

// 复制功能
	function setCopyTxt(elem, code, tip){
		var clip = new ZeroClipboard.Client();
		var w = $(elem).innerWidth();
		var h = $(elem).innerHeight();
		$(elem).append(clip.getHTML(w,h));
		clip.setText(code);
		clip.addEventListener('onComplete', function(){
			var tip = tip ? tip : '复制成功！请在游戏中用ctrl+v进行粘贴。';
			alert(tip);
			return false;
		});
	}

// 懒加载
	function lazy_img(){
		var top = $(document).scrollTop();
		var height = $(window).height();
		lazy_img.img.each(function(){
			var _this = $(this);
			if(_this.attr('src')){
				_this.removeClass('lazy-load');
				return;
			}
			
			var y = _this.offset().top;
			var h = _this.height();
			if(y >= top && y <= top + height || y < top && y + h >= top){
				_this.attr('src', _this.attr('_src')).removeClass('lazy-load');
			}
		});
		lazy_img.img = $('img.lazy-load');
	}
	lazy_img.img = $('img.lazy-load');
	$(window).scroll(lazy_img);
	lazy_img();

// 保存到桌面
	function addToDesk(vname){
		var nameArr = ['cqll','cqllios','cqllfg','cqllpc'];
		if ($.inArray(vname, nameArr) > -1) {
			var name = '传奇1.76-单机版';
		}else{
			var name = document.title;
		}
		var url = window.location.href;
		window.open("http://wvw.9377.com/shortcut.php?url=" + encodeURIComponent(url) +'&name='+ encodeURIComponent(name) +'&charset=utf-8', '_blank');
	}
	function setHomePage(){
		if(document.all){
			document.body.style.behavior = 'url(#default#homepage)'; 
			document.body.setHomePage('http://www.9377.com'); 
		}else{ 
			alert('浏览器不支持此操作, 请手动设为首页'); 
		}
	}
	function addToFav(){
		try{ 
			window.external.addFavorite('http://www.9377.com/h5/', '9377 H5平台'); 
		} catch(e) {  
			try{ 
				window.sidebar.addPanel('9377 H5平台', 'http://www.9377.com/h5/', ''); 
			}catch (e) { 
				alert('加入收藏失败，请使用Ctrl+D进行添加,或手动在浏览器里进行设置.');  
			} 
		}
	}

//input默认值
	var text_val=$('.input-focus').val();
	$('.input-focus').focus(function(){
		if(this.value==text_val)this.value='';
	}).blur(function(){
		if(this.value=='')this.value=text_val;
	});
	
//搜索游戏
	function check_search(form) {
		var keywords = $(form).find('input[name="q"]').val(); 
		if( !keywords || keywords == '搜索游戏' ) {
			alert('请输入搜索关键字。');
			$(form).find('input[name="q"]').focus();
			return false;
		}
		return true;
	}

// 玩游戏界面
	var gamePlay = {
		init : function(){
			var win_rs = null,
				def_width = 468,
				def_height = 890,
				mob_width = 418,
				mob_height = 776,
				mob_top = 58,
				mob_left = 25,
				rez_num = 0;

			function winRS(){
				var win_height = $(window).height();
				win_height = win_height > 620 ? win_height : 620;
				var	rez_wp_hei = win_height * 0.96 ,
					rez_wp_hei = rez_wp_hei > def_height ? def_height : rez_wp_hei,
					rez_wp_wid = rez_wp_hei/def_height * def_width,
					rez_mob_wid = mob_width/def_width * rez_wp_wid,
					rez_mob_hei = mob_height/def_height * rez_wp_hei,
					rez_mob_top = mob_top/def_height * rez_wp_hei,
					rez_mob_left = mob_left/def_width * rez_wp_wid;
				if (rez_num && rez_wp_hei < 620) { return false;}
				rez_num++;
				$('.container').height(win_height);
				$('#h5play').css({'width': rez_wp_wid, 'height': rez_wp_hei });
				$('#iframe-game').css({'width': rez_mob_wid, 'height': rez_mob_hei, 'top': rez_mob_top+'px', 'left': rez_mob_left+'px' });
			}

			$(window).resize(function() {
				clearTimeout(win_rs)
				win_rs = setTimeout(winRS, 300);
			})

			winRS(); $('body').show();
			
			window.addEventListener('message', function(e){
				console.log(e); 
				try {
					var json = $.parseJSON(e.data);
					if('synUser' == json.event){
						getUserJson(json);
					}
				} catch(e) {
					console.log(e);
				}
			}, false)

			$('.y').hover(function(){
				$('.save-tips').toggle();
			});
			var utimer;
			$('#logined').mouseover(function(){
				clearTimeout(utimer);
				$('.logined-opt').show();
			});
			$('#logined').mouseleave(function(){
				utimer = setTimeout(function(){
					$('.logined-opt').hide();
				}, 100)
			})
			$('.nav li').click(function() {
				var i = $(this).index();
				$(this).addClass('active').siblings().removeClass('active');
				$('.gamecnt-wp .gamecnt-box').hide().eq(i).show();
			});
			$('#fullsrc').click(function() {
				$('body').addClass('body-fullscreen');
				$('#full-tools').show();
			});
			$('#zoomout').click(function() {
				$('body').removeClass('body-fullscreen')
				$('#full-tools').hide();
				$('window').resize();
			});
		}
	}

// 
	function getUserJson(xjson){
		var json = xjson ? xjson : C9377.ujson;
		// 顶栏登录状态
		$('#nologin').hide();
		$('#logined').show();
		// 顶栏登录状态
		$('.js-ustatus').html('<img src="" height="42"><a href="'+C9377.app_url+'/users/users_index.php" target="_blank" class="name">'+json.LOGIN_ACCOUNT+'</a><i class="xicon"></i>');
		$('.rightbar .user-hd').html('<img src="" height="42"> <div class="info"> <p class="name">'+json.LOGIN_ACCOUNT+' <a href="'+C9377.app_url+'/login.php?do=logout">[切换账号]</a></p> <p>9377平台账号：'+json.LOGIN_ACCOUNT+'</p> </div>');
		var avatar = $_COOKIE['user_avatar_big'] || 'http://bbs.9377.com/uc_server/images/noavatar_small.gif'; //平台头像
		var avatar3 = $_COOKIE['openid_type'] ?  json.openid.avatar: ''; //第三方帐号头像
		$('.js-ustatus img, .rightbar .user-hd img').attr('src', avatar3 ? avatar3 : avatar);

		// 当前游戏二维码
		if (!C9377.fake) {
			// 二维码模块点击触发游戏内注册---游客状态
			$('.fun-list .item1, #full-tools .qr-play').click(function() {
				var doc = document.getElementById('iframe-game').contentWindow;
				doc.postMessage('{"event":"fakereg"}','*');
			});
		}
	}

	function getGameQR(){
		$.getJSON(C9377.app_url+'/game.php?callback=?', {act: 'qrcode', gid : C9377.gid}, function(json) {
			$('.fun-list .item1 img, #full-tools .qr img').attr('src', json.msg);
		});
	}