/*
 * 修改密码
 */

	var modPass = {
		init : function(){
			$('.mp-mod-list .active a').click(function() {
				var opt = $(this).attr('opt');
				$('#select-by-mod').val(opt)
				modPass.selectMod(opt);
			});
			$('#select-by-mod').change(function() {
				var opt = $(this).val();
				modPass.selectMod(opt);
			});
		},
		confirm : function(){
			// 确认帐号 {0=>'重置密码',1=>'找回密码',2=>'找回二级密码'}
			modPass.mod = $('.mp-item-1');
			var vpwd2 = $('input[name="pwd2"]').val();
				username = $('#username'),
				vusername = username.val(),
				code = $('input[name="code"]'),
				 vcode = code.val(),
				 urlcode = vpwd2 ? '/getpass.php?pwd2='+vpwd2 : '/users/users_modpass.php',
				uexist = false;
			if (vusername.length < 4) {
				username.focus();
				modPass.wtip('请正确填写帐号',0);
				return false;
			}else{
				var param = {
					'do' : 'user',
					'LOGIN_ACCOUNT' : vusername,
					'username' : vusername,
					'new' : 1
				}
				$.ajax({
					url: '/check_user.php',
					type: 'GET',
					dataType: 'json',
					data: param,
					cache: false,
					async: false,
					success: function(result){
						if (result) {
							modPass.wtip('用户名不存在',0);
							uexist = false;
						}else{
							modPass.wtip('',0); 
							uexist = true;
						}
					}
				});
				if (!uexist) {
					return false;
				}
			}

			if (!vcode) {
				code.focus();
				modPass.wtip('请填写验证码',1);
				return false;
			}else{modPass.wtip('',1); }

			var param = {
				'do' : 'set_getpass_user',
				'return_json' : 1,
				'username' : vusername,
				'code' : vcode,
				'vpwd2' : vpwd2
			}
			$.post('/users/users_modpass.php', param, function(result) {
				if (result.status == 0) {
					 window.location.href = urlcode;
				}else{
					$('#img-code').trigger('click');
					modPass.wtip(result.msg,1);
				}
			}, 'json');
			return false;
		},
		mod : '',
		selectMod : function(opt){
			$('.mp-item-2 .mp-mod-select').hide();
			$('.mod-by-item').hide();
			$('.mod-by-'+opt).show();
			$('.mp-item-2 .mp-mod-form').show();
			modPass.mod = $('.mod-by-'+opt);
			setPageHeight();
		},
		sendCaptcha : function(btn){
			var vbtn = $(btn), mod = vbtn.attr('opt');
            var vpwd2 = $('input[name="pwd2"]').val();
			if (mod == 'email') {
				var param = {
					'do' : 'send_email',
                    'vpwd2' : vpwd2
				}
				$.post('/users/users_modpass.php', param, function(result) {
					if (result.status >= 0) {
						vbtn.attr('disabled','disabled').addClass('w-button-disabled');
						var capt_cd = 60, capt_timer;
						capt_timer = setInterval(function(){
							capt_cd--;
							vbtn.val(capt_cd+'秒后重试');
							if (capt_cd == 1) {
								vbtn.val('点击发送').removeAttr('disabled').removeClass('w-button-disabled');
								clearInterval(capt_timer);
							}
						},1000);
					}else{
						modPass.wtip(result.msg);
					}
				}, 'json');
			}else if (mod == 'phone') {
				var param = {
					'do': 'send_sms',
                    'vpwd2' : vpwd2
				}
				
				$.post('/users/users_modpass.php', param, function(result) {
					if (result.status >= 0) {
						vbtn.attr('disabled','disabled').addClass('w-button-disabled');
						var capt_cd = 60, capt_timer;
						capt_timer = setInterval(function(){
							capt_cd--;
							vbtn.val(capt_cd+'秒后重试');
							if (capt_cd == 1) {
								vbtn.val('发送验证码').removeAttr('disabled').removeClass('w-button-disabled');
								clearInterval(capt_timer);
							}
						},1000);
					}else if(result.status == -1){
						modPass.wtip('手机格式不正确');
					}else if(result.status == -2){
						modPass.wtip('验证码发送太频繁，请稍后再试');
					}else if(result.status == -3) {
						modPass.wtip('对不起，您输入的手机号码和绑定号码不一致。');
					}else if(result.status == -4) {
						$('#img-code').trigger('click');
						modPass.wtip('请输入正确的验证码。');
					}else{
						modPass.wtip('发送失败');
					}
				}, 'json');
			}
		},
		ver : function(mod){
            var vpwd2 = $('input[name="pwd2"]').val();
			if (mod == 'phone') {
				var captcha = $('#captcha').val();
				if (!captcha) {
					modPass.wtip('请输入验证码');
					return false;
				}
				var param = {
					'do' :  'phone',
					'captcha' : captcha,
                    'vpwd2' : vpwd2
				}
				$.post('/users/users_modpass.php', param, function(result) {
					if (result.status == 0) {
						modPass.step(3);
					}else{
						modPass.wtip(result.msg);
					}
				},'json');
			}else if (mod == 'email') {
				var code = $('#code').val();
				if (!code) {
					modPass.wtip('请输入验证码');
					return false;
				}
				var param = {
					'step' : 3,
					'code' : code,
                    'vpwd2' : vpwd2
				}
				$.post('/users/users_modpass.php', param, function(result) {
					if (result.status == 0) {
						modPass.step(3);
					}else{
						modPass.wtip(result.msg);
					}
				},'json');
			}else if (mod == 'answer') {
				var answer = $('#answer').val();
				if (!answer) {
					modPass.wtip('请输入密保答案');
					return false;
				}
				var param = {
					'step' : 4,
					'answer' : answer,
                    'vpwd2' : vpwd2
				}
				$.post('/users/users_modpass.php', param, function(result) {
					if (result.status == 0) {
						modPass.step(3);
					}else{
						modPass.wtip(result.msg);
					}
				},'json');
			}
		},
		varPass : function(){
			var password = $('#password'),
				password1 = $('#password1'),
				vpass = password.val(),
				vpass1 = password1.val();
			if (vpass.length < 6) {
				modPass.passTip(0, '密码输入有误');
				password.focus();
				return false;
			}
			if (vpass1.length < 6) {
				modPass.passTip(1, '密码输入有误');
				password1.focus();
				return false;
			}
			if (vpass != vpass1) {
				modPass.passTip(1, '两次密码输入不一致');
				password1.focus();
				return false;
			}
            var vpwd2 = $('input[name="pwd2"]').val();

			var param = {
				'do' : 'pwd_up',
				'password' : vpass,
				'password1' : vpass1,
				'vpwd2':vpwd2
			}
			$.post('/users/users_modpass.php', param, function(result) {
				if (result.status == 0) {
					modPass.step(4);
				}else{
					modPass.passTip(result.msg);
				}
			},'json');
		},
		passTip : function(ind, txt){
			$('.mp-item-3 .w-tips').eq(ind).html('<span class="error">'+txt+'</span>');
		},
		wtip : function(txt, ind){
			var ind = ind ? ind : 0;
			modPass.mod.find('.w-tips').eq(ind).html('<span class="error">'+txt+'</span>');
		},
		step : function(ind){
			if (ind == 2) {
				$('.mp-item-1').hide();
				$('.mp-item-2').show();
			}else if (ind == 3) {
				$('.mp-item-2').hide();
				$('.mp-item-3').show();
			}else if (ind == 4) {
				$('.mp-item-3').hide();
				$('.mp-item-4').show();
			}
			$('.step-wp span').removeClass('active').eq(ind-1).addClass('active');
		}
	}
	modPass.init();

	// 设置页面最小高度
	function setPageHeight(){
		var h = $(window).height(),
			th = $('.mp-header').outerHeight(),
			fh = $('.footer').outerHeight(),
			vh = h - th - fh - 67 - 100;
		$('.mp-main').css('min-height',vh+'px');
	}
	$(window).resize(function(){
		setPageHeight();
	}).trigger('resize');

/*
 * 异常登录
 */
 	var excepVer = {
 		init : function(){
 			excepVer.adapter();
 			$('.exce-bd .rem').click(function() {
 				var sel = $(this).children('i'), isSel = sel.hasClass('nos'), ival = isSel ? 1 : 0;
 				$('input[name="remember"]').val(ival);
 				sel.toggleClass('nos');
 			});
 		},
 		adapter : function(){
 			// 微端加载该页面，修改相关尺寸
 			var width = document.documentElement.clientWidth || document.body.clientWidth;
			var height = document.documentElement.clientHeight || document.body.clientHeight;
			if(width < 800){
				$('.mp-header, .footer').hide();
				$('body').css({'min-width' : 'auto', 'overflow': 'auto'});
				$('.mp-main').removeClass('w1000').css({'padding': '18px 0'});
				$('.g-container').css({'width': width, 'padding': '0'});
			}
 		},
 		sendCaptcha : function(btn){
 			var vbtn = $(btn)
 			var param = {
 				'step' : 1,
 				'return_json' : 1
 			}
 			$.post('/users/login_exception.php', param, function(result) {
				if (result.status >= 0) {
					vbtn.attr('disabled','disabled').addClass('w-button-disabled');
					var capt_cd = 60, capt_timer;
					capt_timer = setInterval(function(){
						capt_cd--;
						vbtn.val(capt_cd+'秒后重试');
						if (capt_cd == 1) {
							vbtn.val('发送验证码').removeAttr('disabled').removeClass('w-button-disabled');
							clearInterval(capt_timer);
						}
					},1000);
				}else if(result.status == -2){
					excepVer.wtip('验证码发送太频繁，请稍后再试');
				}else{
					excepVer.wtip('发送失败');
				}
			}, 'json');
 		},
 		ver : function(){
 			var captcha = $('input[name="captcha"]').val();
 			if (captcha.length < 6) {
 				$('.w-tips1').html()
 				excepVer.wtip('请输入正确验证码');
 				return false;
 			}
 			var param = {
 				'remember' : $('input[name="remember"]').val(),
 				'step' : 2,
 				'captcha' : $('input[name="captcha"]').val(),
 				'return_json' : 1
 			}
 			$.post('/users/login_exception.php', param, function(json) {
 				if (json.status >= 0) {
 					window.location.href = json.url;
 				}else if(json.status == -1){
 					excepVer.wtip('手机验证码错误');
 				}else{
 					excepVer.wtip('验证失败，请联系客服');
 				}
 			},'json');
 		},
		wtip : function(txt){
			$('.exception-wp .w-tips').html('<span class="error">'+txt+'</span>');
		}
 	}
 	excepVer.init();