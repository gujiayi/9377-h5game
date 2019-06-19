// 登录
var username = getCookie('login_name');

$.getJSON(C9377.app_url+'/api/user_info_jsonp.php?callback=?', function(json){
	if(!json.LOGIN_ACCOUNT) return;
	var json_name = !json.openid ? json.LOGIN_ACCOUNT : (json.openid && json.openid.nickname ? json.openid.nickname : json.LOGIN_ACCOUNT);
	$('#top-username, .js-user-openid').html(json_name);
	// 顶栏登录状态
	$('#relogin').hide();
	$('#logined').show();
	// 顶栏登录状态（统一页游）
	$('#top_login_tips').html('<a class="t_user_name" href="'+C9377.app_url+'/users/users_index.php" target="_blank">'+json_name+'</a><a class="t_user_out" href="'+C9377.app_url+'/login.php?do=logout">[退出]</a>')
});

// 配置幻灯
	var navactive, actlocation = navactive ? navactive : 0;
	try{
		if (actlocation == '0') {
			// 幻灯
			$('#slide-box').slideBox({
				mode : 'left',
				nextBtn : true,
				prevBtn : true,
				delay: 5
			});
			// 开服
			$('.sers-kf-list li').click(function() {
				var i = $(this).index();
				$(this).addClass('active').siblings().removeClass('active');
				$('.sers-kf-wrap .sers-kf-tab').hide().eq(i).show();
			});
			$('#new-kf-tab').slideBox({
				mode : 'show',
				nextBtn : false,
				prevBtn : false,
				delay: 5
			});
			$('#oped-kf-tab').slideBox({
				mode : 'show',
				nextBtn : false,
				prevBtn : false,
				delay: 5
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
// 游戏排行榜
	$('.rank-game-list li').mouseenter(function(){
		$(this).addClass('active').siblings().removeClass('active')
	}).eq(0).trigger('mouseenter');
// 热门游戏[手游，游戏中心]
	$('.hot-game-list li').hover(function(){
		$(this).toggleClass('active');
	});
	$('#gc-game-list .download').mouseover(function(){
		$(this).closest('li').addClass('active');
	});
	$('#gc-game-list .enterhome').mouseover(function(){
		$(this).closest('li').removeClass('active');
	});
	$('#gc-game-list li').mouseleave(function(){
		$(this).closest('li').removeClass('active');
	});
// 新闻页面TAB
	$('#newstype-tab a').mouseenter(function(){
		var i = $(this).index();
		$(this).addClass('active').siblings().removeClass('active');
		$('#news-content-box .news-list').hide().eq(i).show();
	});
// 领取礼包
	var filterCqll = ['cqll','cqllfg','cqllios'];
	$('.btn-getgift').click(function(){
		if( !sign ) {
			// alert('请先登录');
			window.location.href = C9377.app_url +'/pc_login.php?ac=login';
			return;
		}else {
			if ($.inArray(game_alias, filterCqll) > -1) {
				$('#pop-gift .false').hide();
				$('#pop-gift .success').show();
				$('#card').html('DfsmkzuA');
				setCopyTxt('.btn-copy', 'DfsmkzuA');
				$('#pop-gift, #mask').show();
			}else{
				$.getJSON('/h5/game_card.php?card_type='+card_type+'&sign='+sign, function(json){
					if( json.status != 1 ) {
						$('#pop-gift .success').hide();
						$('#pop-gift .false').html(json.msg).show();
					}else {
						$('#pop-gift .false').hide();
						$('#pop-gift .success').show();
						$('#card').html(json.msg);
						setCopyTxt('.btn-copy', json.msg);
					}
					$('#pop-gift, #mask').show();
				});
			}
		}
	});
	$('#btn-subcard, .pop-close').click(function(){
		$('#pop-gift, #mask, #pop-play').hide();
	});
//微信二维码弹窗
	var appBox = {
		init : function(){
			appBox.showAcc();
			appBox.selBoxs();
			appBox.boxCls();
			appBox.popQR();
			appBox.appPlay();
		},
		showAcc : function(){
			if (username) {
				$('#app-box-s .hd, #app-box-l .hd').html('帐号：'+username);
			}
		},
		selBoxs : function(){
			var fromAD = $_GET['46'];
			if (fromAD) {
				$('#app-box-l').show();
			}else{
				$('#app-box-s').show();
			}
		},
		boxCls : function(){
			$('.app-box-close').click(function() {
				$(this).parent().hide();
			});
		},
		popQR : function(){
			$('.J-play').click(function(){
				var alias = $(this).attr('alias'), vurl = C9377.resource+'/images/2017/h5/pc/game_qr/'+alias+'.jpg?'+C9377.build;
				$('#pop-game-qr').html('<img src="'+vurl+'" onerror="javascript:this.src=\''+C9377.resource+'/images/2017/h5/pc/game_qr/cqll.jpg?'+C9377.build+'\'" width="200" alt="" />');
				$('#pop-play, #mask').show();
			});
		},
		appPlay : function(){
			$('.J-appPlay').click(function(){
				var haslar = $('#app-box-l').is(':hidden');
				if (haslar) {
					// 如果大框不在显示，显示小
					var hassml = $('#app-box-s').is(':hidden');
					if (hassml) {
						$('#app-box-s').show();
					}else{
						$('#app-box-s').hide();
					}
				}else{
					$('#app-box-l').hide();
				}
			});
		}
	}
	appBox.init();

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
// 通用游戏滚动截图
	if (actlocation == '99') {
		$('#gamepic-box').slideBox({
			mode : 'left',
			optevent: 'mouseenter', // 操作事件：click, mouseenter
			navCell : false, // 导航按钮
			nextBtn : true, // 下一页按钮
			prevBtn : true, // 上一页按钮
			autoPlay : true, // 自动播放
			viewItem : 3 // 滚动数量
		});
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
// 玩游戏
	var gamePlay = {
		fullSrc: function(){
			var docElm = document.documentElement;
			if (docElm.requestFullscreen) {  
				docElm.requestFullscreen();  
			}else if (docElm.mozRequestFullScreen) {  
				docElm.mozRequestFullScreen();  
			}else if (docElm.webkitRequestFullScreen) {  
				docElm.webkitRequestFullScreen();  
			}else if (elem.msRequestFullscreen) {
				elem.msRequestFullscreen();
			}
			gamePlay.lister();
		},
		theBest: function(){
			var url = $('#iframe-game').attr('src');
			window.open(url);
		},
		zoomout: function(){
			if (document.exitFullscreen) {  
				document.exitFullscreen();  
			}else if (document.mozCancelFullScreen) {  
				document.mozCancelFullScreen();  
			}else if (document.webkitCancelFullScreen) {  
				document.webkitCancelFullScreen();  
			}else if (document.msExitFullscreen) {
				document.msExitFullscreen();
			}
			gamePlay.lister();
		},
		rePlay: function(){
			var url = $('#iframe-game').attr('src');
			$('#iframe-game').attr('src', url);
		},
		lister: function(){
			document.addEventListener("fullscreenchange", function () {  
				var isFull = document.fullscreen ? true : false; gamePlay.zoom(isFull);
			});  
			document.addEventListener("mozfullscreenchange", function () {
				var isFull = document.mozFullScreen ? true : false; gamePlay.zoom(isFull);
			});  
			document.addEventListener("webkitfullscreenchange", function () {
				var isFull = document.webkitIsFullScreen ? true : false; gamePlay.zoom(isFull);
			});
			document.addEventListener("msfullscreenchange", function () {
				var isFull = document.msFullscreenElement ? true : false; gamePlay.zoom(isFull);
			});
		},
		zoom: function(z){
			if (z) {
				// 全屏
				var screenWidth = screen.width,
					screenHeight = screen.height,
					funHeight = $('.game-fun').height(),
					optHeight = $('.game-opt').height();
				$('#game-wp').addClass('game-wp-fullscreen').css({'width':screenWidth+'px','height':screenHeight+'px'});
				$('body').addClass('body-fullscreen');
				$('#game-box').height(screenHeight-funHeight-optHeight+'px');
			}else{
				// 还原
				$('#game-wp').attr('style','').removeClass('game-wp-fullscreen');
				$('body').removeClass('body-fullscreen');
				$('#game-box').attr('style','');
			}
		}
	}