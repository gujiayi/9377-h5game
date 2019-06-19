// 首页
	$('#slide-box').slideBox({mode: 'show', delay: 5});
	var sobj = $('#slide-box .slide-nav'), sw = sobj.outerWidth(true);
	sobj.css('margin-left', -1*sw/2+'px');
	if(/(mobile|ipad|iphone|android|\s+adr\s+)/i.test(navigator.userAgent)){
		$('#slide-box').css('overflow','hidden');
	}
// 登录判断
	var login_save = 1;
	$('.login-save').click(function() {
		var isChk = $(this).find('i').hasClass('icon-cbed');
		$(this).find('i').toggleClass('icon-cbed');
		login_save = isChk ? 0 : 1;
	});
	$('#login-form').submit(function() {
		var u = $('#login-form input[name="username"]'), p = $('#login-form input[name="password"]');
		if ($.trim(u.val()).length < 4) {
			$('#login-form .login-tip').html('您输入的帐号有误！');
			u.focus();
			return false;
		}
		if ($.trim(p.val()).length < 4) {
			$('#login-form .login-tip').html('您输入的密码有误！');
			p.focus();
			return false;
		}
		var param = {
			'do' : 'login',
			'username' : u.val(),
			'password' : p.val(),
			'login_save' : login_save,
			'return_json' : 1,
			'_ajax' : 1
		}
		$.ajax({
			'url': C9377.app_url+'/login.php',
			'type': 'POST',
			'dataType': 'json',
			'data': param,
			'async': true,
			'cache': false,
			success: function(result){
				if (result.status >= 0) {
					getUserInfo();
					// window.location.reload();
				}else{
					$('#login-form .login-tip').html(result.msg);
				}
			},
			error: function(e){
				$('#login-form .login-tip').html('登录失败！请重试');
			}
		});
		return false;
	});
// 热门游戏交互
	$('#index-hotgame-list li, .hotgame-list li, .newgame-list li').hover(function(){
		$(this).addClass('active');
	},function(){
		$(this).removeClass('active');
	});
	getRandomPic()
	function getRandomPic(){
		for(var i = 0; i < 4; i++){
			var rd = Math.round(Math.random());
			$('.rec-box .img').eq(i).find('img').eq(rd).show();
		}
	}
// 设置tab模块
	setIndexTab('.mod-opser');
	setIndexTab('.mod-news', function(id){
		$('.mod-news .mod-hd .more').hide().eq(id).show();
	});
	function setIndexTab(ele,cb){
		$(ele).find('.mod-select').click(function() {
			var _index = $(this).index(ele+' .mod-select');
			$(this).parent().find('.mod-select span').removeClass('active');
			$(this).find('span').addClass('active');
			$(this).closest('.mod').find('.J-tab-box').hide().eq(_index).show();
			if (cb) {
				cb(_index);
			}
		}).eq(0).trigger('click');
	}
// 设置开服列表分页
	setSerListPage()
	function setSerListPage(){
		$('.opser-box').each(function(index, el) {
			var ul_len = $(this).find('ul').length,
				tpl = '<div class="sl-page">';
			for(var i = 0; i < ul_len; i++){
				tpl += '<a href="javascript:;" class="mod-page J-tab-tar"><span>'+(i+1)+'</span></a>'
			}
			tpl += '</div>';
			$(this).prepend(tpl);
			// 事件
			$(this).find('.sl-page a').click(function() {
				var _index = $(this).index();
				$(this).parent().find('span').removeClass('active');
				$(this).find('span').addClass('active');
				$(this).closest('.opser-box').find('ul').hide().eq(_index).show();
			}).eq(0).trigger('click');
		});
	}
// 展开友情链接
	$('.friends-box .more').click(function(){
		$('.friends-box .friends-list').toggleClass('friends-auto');
	});
// 懒加载
	function lazy_img(){
		var top = $(document).scrollTop();
		var height = $(window).height();
		lazy_img.img.each(function(){
			var _this = $(this);
			if(_this.attr('src')){
				_this.removeClass('lazy_load');
				return;
			}
			
			var y = _this.offset().top;
			var h = _this.height();
			if(y >= top && y <= top + height || y < top && y + h >= top){
				_this.attr('src', _this.attr('_src')).removeClass('lazy_load');
			}
		});
		lazy_img.img = $('img.lazy_load');
	}
	lazy_img.img = $('img.lazy_load');
	$(window).scroll(lazy_img);
	lazy_img();

	
//第三方登录绑定账号验证
	// 同意用户协议
	$('#agreement-bindacc').click(function() {
		var isCheck = $(this).hasClass('icon-cbed');
		if (isCheck) {
			$(this).removeClass('icon-cbed');
			$('#pop-bind-user .errtip').html('<span class="error">请阅读注册协议并勾选同意</span>');
			$('#submit-reg').attr('disabled','disabled');
		}else{
			$(this).addClass('icon-cbed');
			$('#pop-bind-user .errtip').html('');
			$('#submit-reg').removeAttr('disabled');
		}
	});

	$.validator.addMethod('valid_username', function(value, element){return /^[a-zA-Z0-9\_]{6,20}$/.test(value); });
	$.validator.addMethod('valid_9377_username', function(value, element){return !/9377/.test(value); });

	$('#form-bindacc').validate({
		rules: {
			new_username: {
				required: true,
				rangelength: [6, 20],
				valid_username: true,
				valid_9377_username: true,
				remote: {
					url: '/check_user.php',
					cache: false,
					data: {'do': 'user', 'new': 1, 't': (new Date()).getTime(), username: function(){ return $('#username-bindacc').val(); }},
					beforeSend: function(){}
				}
			},
			password: {required: true, rangelength: [6, 20] },
			password1: {required: true, rangelength: [6, 20], equalTo: '#password-bindacc'}
		},
		messages: {
			new_username: {required: '请填写帐号名', rangelength: '6-20个字符', valid_username: '用户名不合法', valid_9377_username: '用户名不合法', remote: '用户名已存在'},
			password: {required: '请填写密码', rangelength: '6-20位密码'},
			password1: {required: '请填写密码', rangelength: '6-20位密码', equalTo: '两次密码不一致'}
		},
		submitHandler: function(form){  		
			$.ajax({
				url: "/users/users_do.php",
				type: 'POST',
				dataType: "jsonp",
				data:  $('#form-bindacc').serialize(),						 
				success: function( data ) {
					if( typeof(data.status) != 'undefined' &&  data.status == 1) {	
						var openAction = $_COOKIE['openid_type'], openType;
							if(openAction=='qq'){
								openType = 'QQ';
							}else if(openAction=='weibo'){
								openType = '微博';
							}else{
								openType = '微信';
							};				
						$('#pop-bind-user-suc .bd').prepend('<p>绑定'+openType+'为：'+window["openid_nickname"]+' </p><p> 绑定账号为：'+data.new_username+'</p>');
						$('#pop-bind-user').hide();	
						popSelect('#pop-bind-user-suc');
					}
					else {
						popTips(data.msg);
					}
				}
			});
		},
		success: function(error, element){
			error.removeClass('error').html('&nbsp;');
		},
		errorClass: 'error',
		validClass: 'correct',
		errorPlacement: function(error, element) {
			$('#pop-bind-user .errtip').html(error);
		},
		invalidHandler: function(event, validator){
			validator.element(validator.errorList[0].element);
		},
		onkeyup: false
	 });			