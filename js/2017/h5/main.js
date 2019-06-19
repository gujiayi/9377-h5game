// 9377 H5
var H9377 = {
	init: function(){
		H9377.setSlide();
		H9377.setIndexTab();
		H9377.setTab();
		H9377.showFocus();
		H9377.getUserInfo();
		// H9377.checkUserLogin();
		$('.dialog-close').live('click', function() {$(this).closest('.mask').remove(); });
		// 全局通用按钮事件，通过data-opt绑定
		$('.btn').click(function() {
			var opt = $(this).attr('data-opt');
			if (opt == "get-gift") {
				H9377.getGift();
			}
		});
		// 底部企业信息 pc显示
		// try {
		// 	if (footer == 0) {
				
		// 	}
		// } catch(e) {
		// 	H9377.footerInfo();
		// 	$('.wrapper').css({'marginBottom':'80px'});
		// 	// console.log(e);
		// }
	},
	setSlide: function(){
		// 首页幻灯
		if($('#slideBox .bd li').length > 1){
			C9377.include_once(C9377.resource+'/js/2017/h5/TouchSlide.1.1.js',function(){
				TouchSlide({slideCell:"#slideBox", titCell:".hd ul", mainCell:".bd ul", effect:"leftLoop", interTime:7000, autoPage:true, autoPlay:true });
				document.getElementById('slideBox').getElementsByTagName('img')[0].onload = function(){
					$('#slideBox .hd').css({'bottom':'10px'});
				}
			})
		}
		var nh = $('#slideBox img').eq(0).height();
		$('#slideBox, #slideBox .bd').height(nh);
	},
	setIndexTab: function(){
		$('#Js-nav li').click(function(){
			var navi = $(this).index();
			$(this).addClass('active').siblings().removeClass('active');
			$('#Js-navitem-box .Js-navitem').hide().eq(navi).show();
		})
	},
	setTab: function(tri, cnt){
		$('.Js-pubtab li').click(function() {
			var pti = $(this).index();
			$(this).addClass('active').siblings().removeClass('active');
			$(this).closest('.Js-pubtab-wrap').find('.Js-tabitem-box .Js-tabitem').hide().eq(pti).show();
		});
	},
	showFocus: function(){
		var html = '<div class="mask"> <div class="dialog-box"> <a href="javascript:;" title="关闭" class="dialog-close icon-close"></a> <div class="login-hd mx10"><img src="'+C9377.resource+'/images/2017/h5/logo.png?'+C9377.build+'" alt=""></div> <div class="qr"> <img src="'+C9377.resource+'/images/2017/h5/qr.jpg?'+C9377.build+'" alt=""> </div> </div> </div>';

		$('#btn-focus').click(function(){ 
			$('body').append(html);
		});
	},
	getGift: function(){
		H9377.confirmDialog({txt:'<label>礼包码：</label><span>caaabf345c06a4af</span><br>每个账号只能领取一次'})
	},
	confirmDialog: function(obj){
		var params = {
				txt: obj.txt || null,
				oklabel: obj.oklabel || '确定',
				cancelable: obj.cancelable || '取消',
				okcallback: obj.okcallback || null,
				cancelcallback: obj.cancelcallback || null
			}
		var html = '<div class="mask" id="confirmDialog"> <div class="dialog-box"> <p class="title">提示信息</p> <div class="info"> '+params.txt+' </div> <div class="flex opt"> <a href="javascript:;" class="flex-list ok" data-opt="ok">'+params.oklabel+'</a><a href="javascript:;" class="flex-list cancel" data-opt="cancel">关闭</a> </div> </div> </div>';

		$('body').append(html);
		$('#confirmDialog .opt a').click(function(){
			var opt = $(this).attr('data-opt');
			if (opt == "ok") {
				if (obj.okcallback) {
					obj.okcallback();
				}
			}else if (opt == "cancel"){
				if (obj.cancelcallback) {
					obj.cancelcallback();
				}
			}
			$('#confirmDialog').remove();
		})
	},
	dialog: function(txt, callback){
		var html = '<div class="mask" id="dialog"> <div class="dialog-box"> <p class="title">提示信息</p> <div class="info"> '+txt+' </div> <div class="flex opt"><a href="javascript:;" class="flex-list cancel">确定</a></div> </div> </div>';
		$('body').append(html);
		$('#dialog .cancel').click(function(){
			$('#dialog').remove();
		});
		if (callback) {
			callback();
		}
	},
	userImei : $_GET['device_imei'] ? $_GET['device_imei'] : ($_COOKIE['imei'] ? $_COOKIE['imei'] : ''),
	goUrl : $_GET['gourl'] ? $_GET['gourl'] : '',
	loadLoginMode: function(mode){
		var modeHtml = '';
		switch (mode) {
			case 'phone':
				modeHtml = loadPhoneMode();
				break;
			case '9377':
				modeHtml = load9377Mode();
				break;
			case 'reg':
				modeHtml = loadRegMode('reg');
				break;
			case 'simplereg':
				modeHtml = loadRegMode('simplereg');
				break;
			case 'regV2':
				modeHtml = loadRegModeV2();
				break;
			case 'phoneV2':
				modeHtml = loadPhoneModeV2();
				break;
			case 'forgetpass':
				modeHtml = loadForgetPass();
				break;
			default:
				modeHtml = load9377ModeV2();
				break;
		}


		if ($('#login-pop').length) {
			$('#login-pop').html(modeHtml);
		}else{
			var boxwrap  = '<div class="mask" id="login-pop">';
				boxwrap += modeHtml;
				boxwrap += '</div>';
			$('body').append(boxwrap);
		}
		if (mode == 'regV2') {
			// 快速注册
			H9377.createAccount();
			$('.btn-clear').click(function() {
				var opt = $(this).attr('opt');
				if (opt == 'all') {
					// 点击清空帐号，顺便删除密码、关闭提示
					$('.w-item input').val('');
					$('.place-pass').hide();
					$('.dialog-message').hide();
				}else{
					// 单个清空
					$(this).siblings('input').val('');
					$('.place-pass').hide();
				}
			});
		}
		if (!mode) {
			H9377.getLoginList('.w-item');
		}

		// 模块按钮事件 V1
		$('.third-login-mod a').click(function(){
			var opt = $(this).attr('data-opt');

			if (opt == 'loadPhoneMode') {
				H9377.loadLoginMode('phone');
			}else if(opt == 'qq'){
				window.location.href = C9377.app_url+'/api/qq.php?_qq_action=login';
				return false;
			}else if(opt == 'wb'){
				window.location.href = C9377.app_url+'/api/weibo.php?_wb_action=login';
				return false;
			}else if(opt == 'wx'){
				if(C9377.wechat){
					var param = {
						appid: 'wxddfee21452d1c59b',
						scope: 'snsapi_userinfo',
						mini:1,
						_9377_forward: H9377.goUrl
					};
					window.location.href = C9377.app_url+'/api/wx_login.php?_wx_action=login&'+ajax_parameters(param);
				}else{
					window.location.href = C9377.app_url+'/api/wx_login.php?_wx_action=login';
				}
			}else{
				H9377.loadLoginMode();
			}
		});
		// V1
		$('.login-btn-grunp a').click(function(){
			var opt = $(this).attr('data-opt');
			if (opt == 'login') {
				H9377.loadLoginMode('9377');

				$('#J-login-submit').click(function(){
					H5Login();
				});
			}else if(opt == 'simplereg'){
				// 简单注册
				H9377.loadLoginMode('simplereg');

				$('#J-reg-submit').click(function(){
					H5Register();
				});
			}else if(opt == 'register'){
				// 带身份验证
				H9377.loadLoginMode('reg');

				$('#J-reg-submit').click(function(){
					H5Register();
				});
			}
		});
		// V2
		$('#J-form-submit').click(function() {
			var opt = $(this).attr('data-opt');
			if (opt == 'login') {
				H5Login();
			}else if(opt == 'simpleregister'){
				H5SimpleRegister();
			}else if(opt == 'phone'){
				H5PhoneLogin();
			}else if(opt == 'forgetpass'){

			}
		});

		function loadPublicMode(){
			var html = '<div class="dialog-box mod-login"> <a href="javascript:;" title="关闭" class="dialog-close icon-close"></a> <div class="login-hd"><img src="'+C9377.resource+'/images/2017/h5/logo.png?'+C9377.build+'" alt=""></div>';
				html += loadThirdMode('一键登陆后即可继续操作');
				html += ' <div class="login-btn-grunp"> <a href="javascript:;" data-opt="login" class="btn-9377login">9377账号登陆</a> <a href="javascript:;" data-opt="simplereg" class="btn-toreg">一键注册</a> </div> </div>';
			return html;
		}
		function loadPhoneMode(){
			var html = '<div class="dialog-box mod-login mod-login-module"> <a href="javascript:;" title="关闭" class="dialog-close icon-close"></a> <div class="login-hd"><img src="'+C9377.resource+'/images/2017/h5/logo.png?'+C9377.build+'" alt=""></div> <div class="login-form"> <form action=""> <div class="w-item"> <i class="icon-mobile"></i> <input id="" pattern="[0-9]*" maxlength="11" type="tel" required placeholder="请填写手机号码"> <a href="javascript:;" class="btn-send">发送验证码</a> </div> <div class="w-item"> <i class="icon-lock"></i> <input id="" pattern="[0-9]*" type="text" required placeholder="请输入4位短信验证码"> </div> <a href="javascript:;" class="btn-submit">马上登陆</a> <div class="none"><input type="submit" value="马上登陆"></div> </form> </div>';
				html += loadThirdMode();
				html += ' </div>';
			return html;
		}
		function load9377Mode(){
			var html = '<div class="dialog-box mod-login mod-login-module"> <a href="javascript:;" title="关闭" class="dialog-close icon-close"></a> <div class="login-hd"><img src="'+C9377.resource+'/images/2017/h5/logo.png?'+C9377.build+'" alt=""></div> <div class="login-form"> <form action=""> <div class="w-item"> <i class="icon-user"></i> <input id="J-username" pattern="\w{4,20}" type="text" required placeholder="请填写账号"> </div> <div class="w-item"> <i class="icon-lock"></i> <input id="J-password" pattern="\w{6,}" type="password" required placeholder="请填写密码"> </div> <a href="javascript:;" class="btn-submit" id="J-login-submit">马上登陆</a> <div class="none"><input type="submit" value="马上登陆"></div> </form> <div class="tar"> <a href="http://wvw.9377.com/getpass.php" target="_blank">忘记密码&gt;&gt;</a> </div> </div>';
				html += loadThirdMode();
				html += ' </div>';
			return html;
		}
		function loadRegMode(valid){
			// 带身份证输入
			var html = '<div class="dialog-box mod-login mod-login-module"> <a href="javascript:;" title="关闭" class="dialog-close icon-close"></a> <div class="login-hd"><img src="'+C9377.resource+'/images/2017/h5/logo.png?'+C9377.build+'" alt=""></div> <div class="login-form"> <form action=""> <div class="w-item"> <i class="icon-user"></i> <input id="J-username" pattern="\w{4,20}" type="text" required placeholder="填写4-20位帐号"> </div> <div class="w-item"> <i class="icon-lock"></i> <input id="J-password" pattern="\w{6,}" type="password" required placeholder="填写6-20位密码"> </div>';
				if (valid != 'simplereg') {
					html += '<div class="w-item"> <i class="icon-name"></i> <input id="J-name" type="text" required placeholder="姓名"> </div> <div class="w-item"> <i class="icon-idc"></i> <input id="J-idc" type="text" placeholder="身份证"> </div>';
				}
				html += '<a href="javascript:;" class="btn-submit" id="J-reg-submit">注册并登陆</a> <div class="none"><input type="submit" value="注册并登陆"></div> </form> </div>'
				html += loadThirdMode();
				html += ' </div>';
			return html;
		}
		function loadThirdMode(title){
			var tit = title ? title : '其他登陆方式';
			var html = '<div class="third-login-mod"> <div class="hd"><span>'+tit+'</span></div> <ul class="bd third-login-list tc"> <li class="none"><a href="javascript:;" class="phone" data-opt="loadPhoneMode"><i class="icon-phone"></i></a></li> <li><a href="javascript:;" class="qq" data-opt="qq"><i class="icon-qqs"></i></a></li> <li><a href="javascript:;" class="wb" data-opt="wb"><i class="icon-wbs"></i></a></li>';
			if (C9377.wechat) {
				html += '<li><a href="javascript:;" class="wx" data-opt="wx"><i class="icon-wx"></i></a></li>'
			}
				html += '</ul> </div>';
			return html;
		}
		function load9377ModeV2(){
			var html = '<div class="dialog-box mod-login mod-login-module"> <a href="javascript:;" title="关闭" class="dialog-close icon-close"></a> <div class="login-hd"> <img src="'+C9377.resource+'/images/2017/h5/logo.png?'+C9377.build+'" alt=""> <a href="javascript:H9377.loadLoginMode(\'phoneV2\');" class="btn-loginmod"><i class="icon-mobile"></i>手机验证登陆</a> </div> <div class="login-form"> <div class="w-form"> <div class="w-item"> <i class="icon-user"></i> <input id="J-username" type="text" placeholder="请输入账号"> <b class="more"></b> </div> <div class="w-item"> <i class="icon-lock"></i> <input id="J-password" type="password" placeholder="请输入密码"> </div> <div class="login-fun"> <a href="javascript:H9377.dialog(\'联系客服QQ：2850907640\');" class="fl"><i class="icon-qs"></i> 帮助</a> <a href="http://wvw.9377.com/getpass.php" target="_blank" class="fr col-blue">忘记密码&gt;&gt;</a> </div> <a href="javascript:;" class="btn-submit" data-opt="login" id="J-form-submit">开始游戏</a> <a href="javascript:H9377.loadLoginMode(\'regV2\');" class="btn-switch">快速注册</a> <div class="none"><input type="submit" value="马上登陆"></div> </div> </div> </div>';
			return html;
		}
		function loadRegModeV2(){
			var html = '<div class="dialog-box-wp"><div class="dialog-box mod-login mod-login-module"> <a href="javascript:;" title="关闭" class="dialog-close icon-close"></a> <div class="login-hd"> <img src="'+C9377.resource+'/images/2017/h5/logo.png?'+C9377.build+'" alt=""> <a href="javascript:H9377.loadLoginMode(\'phoneV2\');" class="btn-loginmod"><i class="icon-mobile"></i>手机快捷注册</a> </div> <div class="login-form"> <div class="w-form"> <div class="w-item"> <i class="icon-user"></i> <input id="J-username" type="text" placeholder="请输入账号"> <a href="javascript:;" opt="all" class="btn-clear icon-close"></a> </div> <div class="w-item"> <i class="icon-lock"></i> <input id="J-password" type="password" placeholder="请输入密码"> <p class="place place-pass"></p> <a href="javascript:;" class="btn-clear icon-close"></a> </div> <div class="login-fun"> <a href="javascript:H9377.dialog(\'联系客服QQ：2850907640\');" class="fl"><i class="icon-qs"></i> 帮助</a> <a href="http://www.9377.com/yhxy.html" target="_blank" class="fr col-blue"><i class="icon-sel"></i> 用户注册服务协议>></a> </div> <a href="javascript:;" class="btn-submit" data-opt="simpleregister" id="J-form-submit">注册并登陆</a> <div class="none"><input type="submit" value="马上登陆"></div> </div> </div> </div> <div class="dialog-message">系统分配的随机账号密码，将自动截屏保存到手机相册，请妥善保管！</div> </div>';
			return html;
		}
		function loadPhoneModeV2(){
			var html = '<div class="dialog-box mod-login mod-login-module"> <a href="javascript:;" title="关闭" class="dialog-close icon-close"></a> <div class="login-hd"> <img src="'+C9377.resource+'/images/2017/h5/logo.png?'+C9377.build+'" alt=""> <a href="javascript:H9377.loadLoginMode();" class="btn-loginmod"><i class="icon-user"></i> 账号登录</a> </div> <div class="login-form"> <div class="w-form"> <div class="w-item"> <i class="icon-mobile"></i> <input id="J-cellphone" type="phone" placeholder="请输入手机号"> <button class="w-button J-sendcaptcha" onClick="H9377.sendCaptcha();">发送验证码</button> </div> <div class="w-item"> <i class="icon-lock"></i> <input id="J-captcha" type="text" placeholder="请输入验证码"> </div> <div class="login-fun"> <a href="javascript:H9377.dialog(\'联系客服QQ：2850907640\');" class="fl"><i class="icon-qs"></i> 帮助</a> </div> <a href="javascript:;" class="btn-submit" data-opt="phone" id="J-form-submit">开始游戏</a> <a href="javascript:H9377.loadLoginMode();" class="btn-switch">账号登录</a> <div class="none"><input type="submit" value="马上登陆"></div> </div> </div> </div>';
			return html;
		}
		function loadForgetPass(){
			var html = '<div class="dialog-box mod-login mod-login-module mod-login-red"> <a href="javascript:;" title="关闭" class="dialog-close icon-close"></a> <div class="login-hd"> <a href="javascript:H9377.loadLoginMode();" class="dialog-back icon-arrl"></a> 忘记密码 </div> <div class="login-form"> <div class="w-form"> <div class="w-item"> <i class="icon-mobile"></i> <input id="J-cellphone" type="text" placeholder="请输入手机号"> <button class="w-button J-sendcaptcha" onClick="H9377.sendCaptcha(\'forgetpass\');">发送验证码</button> </div> <div class="w-item"> <i class="icon-lock"></i> <input id="J-captcha" type="text" placeholder="请输入短信验证码"> </div> <div class="w-item"> <i class="icon-lock"></i> <input id="J-password" type="password" placeholder="请重新设置密码（6-20位字符）"> </div> <a href="javascript:;" class="btn-submit" data-opt="forgetpass" id="J-form-submit">确定</a> <div class="none"><input type="submit" value="马上登陆"></div> </div> <div class="tips"> <p>若您遇到任何账号问题，请及时添加客服QQ进行咨询处理！</p> <p>客服QQ：2850907640</p> </div> </div> </div>'
			return html;
		}
		function H5Login(){
			var urn = $('#J-username').val(),
				psw = $('#J-password').val();
			if (!CSRegular.uname(urn) || !CSRegular.pass(psw)) {
				H9377.dialog('请输入正确信息');
				return false;
			}
			var param = {
				'do' : 'login',
				'username' : urn,
				'password' : psw,
				'gourl' : H9377.goUrl,
				'device_imei' : H9377.userImei,
				'gid' : C9377.gid,
				'login_save' : 50,
				'return_json' : 1
			}
			getJson(param, function(result){
				if (result.status == 0) {
					if (window['isRefresh']) {
						window.location.reload();
					}else{
						if (H9377.goUrl) {
							window.location.href = H9377.goUrl;
						}else{
							$('.dialog-close').trigger('click');
							H9377.checkUserLogin();
						}
					}
				}else{
					H9377.dialog(result.msg);
					return false;
				}
			}, '/h5/login.php','POST');
		}
		function H5SimpleRegister(){
			var urn = $('#J-username').val(),
				psw = $('#J-password').val();

			if (!CSRegular.uname(urn) || !CSRegular.pass(psw)) {
				H9377.dialog('请输入正确信息');
				return false;
			}
			var param = {
				'do' : 'register',
				'LOGIN_ACCOUNT' : urn,
				'PASSWORD' : psw,
				'PASSWORD1' : psw,
				'login_save' : 50,
				'device_imei' : H9377.userImei,
				'gid' : C9377.gid,
				'client' : 1,
				'is_ajax' : 1
			}
			getJson(param, function(result){
				if (result.msg == '注册成功, 正在为您跳转' || result.msg == '登录成功') {
					PrtSc(1); // 安卓截屏
					if (window['isRefresh']) {
						window.location.reload();
					}else{
						if (H9377.goUrl) {
							window.location.href = H9377.goUrl;
						}else{
							$('.dialog-close').trigger('click');
							H9377.checkUserLogin();
						}
					}
				}else{
					H9377.dialog(result.msg);
					return false;
				}
			}, '/h5/register.php','POST');
		}
		function H5Register(){
			var urn = $('#J-username').val(),
				psw = $('#J-password').val(),
				name = $('#J-name').val(),
				idc = $('#J-idc').val();

			if (urn.length < 4 || psw.length < 6 || name.length < 1 || idc.length < 15) {
				H9377.dialog('请输入正确信息');
				return false;
			}
			var param = {
				'do' : 'register',
				'LOGIN_ACCOUNT' : urn,
				'PASSWORD' : psw,
				'PASSWORD1' : psw,
				'NAME' : name,
				'ID_CARD_NUMBER' : idc,
				'gid' : C9377.gid,
				'login_save' : 50,
				'device_imei' : H9377.userImei,
				'client' : 1,
				'is_ajax' : 1
			}
			getJson(param, function(result){
				if (result.msg == '注册成功, 正在为您跳转' || result.msg == '登录成功') {
					if (H9377.goUrl) {
						window.location.href = H9377.goUrl;
					}else{
						$('.dialog-close').trigger('click');
						H9377.checkUserLogin();
					}
				}else{
					H9377.dialog(result.msg);
					return false;
				}
			}, '/h5/register.php','POST');
		}
		function H5PhoneLogin(){
			var cellphone = $('#J-cellphone').val(),
				captcha = $('#J-captcha').val();
			if (!CSRegular.phone(cellphone) || !CSRegular.captcha(captcha)) {
				H9377.dialog('请输入正确信息');
				return false;
			}
			var param = {
				'do' : 'register',
				'LOGIN_ACCOUNT' : cellphone,
				'cellphone' : 1,
				'captcha' : captcha,
				'gid' : C9377.gid,
				'login_save' : 50,
				'device_imei' : H9377.userImei,
				'client' : 1,
				'is_ajax' : 1,
				'return_json' : 1
			}
			getJson(param, function(result){
				if (result.status == 0) {
					if (window['isRefresh']) {
						window.location.reload();
					}else{
						if (H9377.goUrl) {
							window.location.href = H9377.goUrl;
						}else{
							$('.dialog-close').trigger('click');
							H9377.checkUserLogin();
						}
					}
				}else{
					H9377.dialog(result.msg);
					return false;
				}
			}, '/h5/register.php','POST');
		}
	},
	getLoginList: function(ele){
		var vresult = window['userLoginList']; //读取存储的全局信息
		if (!vresult) {
			var param = {
				'device_imei' : H9377.userImei,
				'list' : 1
			}
			getJson(param, function(result){
				window['userLoginList'] = result;
				relList(result);
			}, '/api/openid_imei.php', 'GET', 'jsonp');
		}else{
			var result = vresult;
			relList(result);
		}
		
		function relList(result){
			if(result.length && result[0].username){
			var tpl = '';
			var ull_len = result.length > 3 ? 3 : result.length;
			for(var i = 0; i < ull_len; i++){
				if (result[i].username) {
					tpl += '<li><span>'+result[i].username+'</span> <em class="del icon-close"></em></li>';
				}
			}
			if (tpl) {
				tpl = '<ul class="userlogin-list">'+tpl+'</ul>';
				$(ele).eq(0).append(tpl);
				var ew = $(ele).eq(0).width();
				$('.userlogin-list').width(ew);

				// 点击事件
				$('.w-item .more').click(function() {
					$('.userlogin-list').toggle();
				});
				$('.userlogin-list li span').click(function() {
					var val = $(this).html();
					$('#J-username').val(val);
					$('#J-password').val(H9377.userImei);
					$('.userlogin-list').hide();
				}).eq(0).trigger('click');
				$('.userlogin-list .del').click(function() {
					var uid = $(this).siblings('span').html(),
						_li = $(this).parent();

					var param = {
						'device_imei' : H9377.userImei,
						'list' : 1,
						'del' : uid
					}
					$.getJSON('/api/openid_imei.php', param, function(result){
						_li.remove();
					});
				});
			}
		}
		}
	},
	createAccount : function(){
		// 帐号规则 日期加随机字母
		var str1 = 'abcdefghijklmnopqrxtuvwxyz',
			str2 = 'abcdefghijklmnopqrxtuvwxyz0123456789',
			myacc = {account:'',password:''},
			now = new Date;
		myacc.account += parseInt( now.getTime() / 1000);
		for(var i = 0; i < 4; i++){
			myacc.account += str1.charAt(Math.floor (Math.random () * str1.length));
		}

		for(var i = 0; i < 8; i++){
			myacc.password += str2.charAt(Math.floor (Math.random () * str2.length))
		}
		$('#J-username').val(myacc.account);
		$('#J-password').val(myacc.password);
		$('.place-pass').html(myacc.password);
		if (H9377.OS().name == 'PC') { $('.dialog-message').hide(); } //PC上不显示截屏提示
		return myacc;
	},
	sendCaptcha : function(mod){
		var cellphone = $('#J-cellphone').val(),
			url = '';
		if (!CSRegular.phone(cellphone)) {
			H9377.dialog('请输入正确的手机号码');
			return false;
		}
		if (mod == 'bindphone') {
			// 绑定手机
			var param = {
				'do' : 'bind_cellphone',
				'step' : '1',
				'cellphone' : cellphone,
				'json' : 1
			}
			url = '/users/users_do.php';
		}else if(mod == 'forgetpass'){
			// 忘记密码 todo
			var param = {
				'do' : 'cellphone',
				'step' : '2',
				'type' : '2',
				'cellphone' : cellphone,
				'json' : 1
			}
			url = '/getpass.php';
		}else{
			// 手机注册
			var param = {
				'LOGIN_ACCOUNT' : cellphone,
				'cellphone' : 1,
				'send_captcha' : 'send'
			}
			url = '/h5/register.php';
		}
		if (mod == 'bindphone') {
			// 绑定手机返回参数不同
			getJson(param, function(result){
				if (result.status == 1) {
					$('.J-sendcaptcha').attr('disabled','disabled').addClass('w-button-disabled');
					capt_cd = 60;
					var capt_timer = setInterval(function(){
						capt_cd--;
						$('.J-sendcaptcha').text(capt_cd+'秒后重试');
						if (capt_cd == 1) {
							$('.J-sendcaptcha').text('发送验证码').removeAttr('disabled').removeClass('w-button-disabled');
							clearInterval(capt_timer);
						}
					},1000)
				}else{
					H9377.dialog('发送失败');
				}
			}, url,'POST');
		}else{
			getJson(param, function(result){
				if (result.status == 0) {
					$('.J-sendcaptcha').attr('disabled','disabled').addClass('w-button-disabled');
					capt_cd = 60;
					var capt_timer = setInterval(function(){
						capt_cd--;
						$('.J-sendcaptcha').text(capt_cd+'秒后重试');
						if (capt_cd == 1) {
							$('.J-sendcaptcha').text('发送验证码').removeAttr('disabled').removeClass('w-button-disabled');
							clearInterval(capt_timer);
						}
					},1000)
				}else{
					H9377.dialog(result.msg);
				}
			}, url,'POST');
		}
	},
	checkUserLogin : function(){
		$.getJSON(C9377.app_url+'/api/user_info_jsonp.php?level=1&last_game=1&num=3&callback=?', function(json){
			H9377.Uinfo = json;
			if(!json.LOGIN_ACCOUNT) {
				H9377.selectLoginMod();
				return;
			}else{
				var json_name = json.BBS_NAME ? json.BBS_NAME : (!json.IS_OPENID ? json.LOGIN_ACCOUNT : (json.openid && json.openid.nickname ? json.openid.nickname : json.LOGIN_ACCOUNT));

				var avatar = $_COOKIE['user_avatar_big'] || 'http://bbs.9377.com/uc_server/images/noavatar_big.gif';
				$('.avatar').attr('src', avatar);
				// 首页登录信息
				$('.nick-name').text(json_name);
				$('.uid').text('UID: '+json.ID);
				if( json.last_games != '' ) {
					var html = '';
					html += '<h2 class="played-tit">我玩过的</h2>'+
					'<div class="played-list">'+
					'<div class="played-lists">'+
					'<ul class="flex">';
					for( i in json.last_games ) {
						if( !json.last_games[i].NAME ) continue;
						html += '<li>';
						html +='<a href="'+json.last_games[i].site+'">';
						html +=' <img src="'+C9377.resource+'/images/2017/h5/icon/'+json.last_games[i].ALIAS+'.png?'+C9377.build+'">';
						html += '<span>'+json.last_games[i].NAME+'</span> </a>';
						html += '</li>';
					}
					html +='</ul></div></div>';

					$('.played').html(html);
				}
				// 个人中心
				if (json.PHONE) {
					var ns = json.PHONE.replace(/^(\d{3})\d{4}(\d+)/,"$1****$2");
					$('.btn-bindphone span').text(ns);
				}else {
					$('.btn-bindphone').click(function() {
						H9377.bindPhone();
					});
				}
				if (json.ID_CARD_NUMBER) {
					var ns = json.ID_CARD_NUMBER.replace(/^(\d{4})\d{12}(\d+)/,"$1****$2");
					$('.btn-bindidc span').text(ns);
				}else {
					$('.btn-bindidc').click(function() {
						H9377.bindIdc();
					});
				}
			}
		});
	},
	getUserInfo : function(){
		if(!$('#pay-form').length && !$('.login-bg').length){
			// 充值页面|登陆界面，不在这里获取用户数据	
			$.getJSON(C9377.app_url+'/api/user_info_jsonp.php?level=1&last_game=1&num=3&callback=?', function(json){
				H9377.Uinfo = json;
			});
		}
	},
	selectLoginMod : function(){
		// 检测是否有IMEI登陆过的帐号，选择对应登录弹窗
		var param = {
			'device_imei' : H9377.userImei,
			'list' : 1
		}
		getJson(param, function(result){
			window['userLoginList'] = result; // 存储用户登录数据列表
			if (result.length && result[0].username) {
				// 如果有信息，加载旧帐号
				H9377.loadLoginMode();
				$('#J-username').val(result[0].username);
				$('#J-password').val(H9377.userImei);
			}else{
				// 如果没信息，加载快速注册
				H9377.loadLoginMode('regV2');
			}
		}, '/api/openid_imei.php', 'GET', 'jsonp');
	},
	bindIdc: function(){
		var html = '<div class="mask"><div class="dialog-box mod-login mod-login-module"> <a href="javascript:;" title="关闭" class="dialog-close icon-close"></a> <div class="login-hd">绑定身份证</div> <div class="login-form"> <form action=""> <div class="w-item"> <i class="icon-user"></i> <input id="J-idcname" type="text" required placeholder="姓名"> </div> <div class="w-item"> <i class="icon-idc"></i> <input id="J-idc" type="text" required placeholder="身份证"> </div> <a href="javascript:;" class="btn-submit" id="J-idc-submit">确定</a> <div class="none"><input type="submit" value="确定"></div> </form> </div></div>';
		$('body').append(html);
		$('#J-idc-submit').click(function() {
			var idcname = $('#J-idcname').val(),
				idc = $('#J-idc').val();
			if (idcname.length < 1 || idc.length < 15) {
				H9377.dialog('请输入正确信息');
				return false;
			}
			var param = {
				'do' : 'fcm',
				'return_json' : '1',
				'name' : idcname,
				'id_card_number' : idc
			}
			getJson(param, function(result){
				if (result.showmsg) {
					window.location.reload();
				}else{
					H9377.dialog(result.msg);
				}
			},'/users/users_do.php','POST');
		});
	},
	modifyPass: function(){
		var html = '<div class="mask" id="login-pop"> <div class="dialog-box mod-login mod-login-module dialog-modifypass"> <a href="javascript:;" title="关闭" class="dialog-close icon-close"></a> <div class="login-hd tc"> <img src="http://static.9377s.com/images/2017/h5/logo.png?20170510171355" alt=""> </div> <div class="login-form"> <div class="w-form"> <div class="myacc"> 您的账号为：<span class="col-red" id="myacc"></span> </div> <div class="w-item"> <i class="icon-lock"></i> <input id="J-password-old" type="password" placeholder="原密码"> </div> <div class="w-item"> <i class="icon-lock"></i> <input id="J-password-n1" type="password" placeholder="新密码（6-20位字符）"> </div> <div class="w-item"> <i class="icon-lock"></i> <input id="J-password-n2" type="password" placeholder="确认密码"> </div> <a href="javascript:;" class="btn-submit" data-opt="modifypass" id="J-form-submit">修改密码</a> </div> </div> </div> </div>';
		$('body').append(html);
		var uid = getCookie('login_name');
		$('#myacc').html(uid);
		if (H9377.userImei) {
			$('#J-password-old').val(H9377.userImei);
			$('#J-password-old').parent().hide();
		}

		$('#J-form-submit').click(function() {
			var pass_old = $('#J-password-old').val(),
				pass_n1 = $('#J-password-n1').val(),
				pass_n2 = $('#J-password-n2').val();
			if (!CSRegular.pass(pass_old) || !CSRegular.pass(pass_n1) || !CSRegular.pass(pass_n2)) {
				H9377.dialog('请输入正确信息');
				return false;
			}
			var param = {
				'do' : 'pwd_up',
				'password_old' : pass_old,
				'password' : pass_n1,
				'password1' : pass_n2,
				'device_imei' : H9377.userImei,
				'return_json' : 1
			}
			getJson(param, function(result){
				if (result.status == "1") {
					$('.dialog-close').trigger('click');
				}
				H9377.dialog(result.msg);
			},'/users/users_do.php','POST');
		});
	},
	bindPhone: function(){
		var html = '<div class="mask"><div class="dialog-box mod-login mod-login-module mod-login-red"> <a href="javascript:;" title="关闭" class="dialog-close icon-close"></a> <div class="login-hd"> 绑定手机 </div> <div class="login-form"> <div class="w-form"> <div class="w-item"> <i class="icon-mobile"></i> <input id="J-cellphone" type="text" placeholder="请输入手机号"> <button class="w-button J-sendcaptcha" onClick="H9377.sendCaptcha(\'bindphone\');">发送验证码</button> </div> <div class="w-item"> <i class="icon-lock"></i> <input id="J-captcha" type="text" placeholder="请输入短信验证码"> </div> <a href="javascript:;" class="btn-submit" data-opt="bindphone" id="J-form-submit">确定</a> <div class="none"><input type="submit" value="马上登陆"></div> </div> <div class="tips"> <p>绑定手机成功，即可领取元宝大礼包！</p> <p>客服QQ：2850907640</p> </div> </div> </div></div>';
		$('body').append(html);

		$('#J-form-submit').click(function() {
			var cellphone = $('#J-cellphone').val(),
				captcha = $('#J-captcha').val();
			if (!CSRegular.phone(cellphone) || !CSRegular.captcha(captcha)) {
				H9377.dialog('请输入正确信息');
				return false;
			}
			var param = {
				'do' : 'bind_cellphone',
				'step' : '2',
				'cellphone' : cellphone,
				'captcha' : captcha,
				'json' : 1
			}
			getJson(param, function(result){
				if (result.status == "0") {
					$('.dialog-close').trigger('click');
        			$('.box-item-1 .tip, .box-item-1 .btn-bindphone').hide();
					H9377.Uinfo.BIND_CELLPHONE = '1';
					H9377.Uinfo.PHONE = cellphone;
					// 弹出礼包弹窗
					$('.btn-getBPcard').trigger('click');
 				}else{
					H9377.dialog(result.message);
 				}
			},'/users/users_do.php','POST');
		});
	},
	footerInfo: function(){
		var html = '<footer id="footer"> <p>上海誉点信息技术有限公司</p> <p>沪网文【2015】0075-025号 沪ICP备14052946号-5</p> <p>增值电信业务经营许可证沪B2-20150073</p> </footer>';
		$('body').append(html);
	},
	OS : function(){
		var ua = navigator.userAgent,
			iPad = ua.match(/(iPad).*OS\s([\d_]+)/),
			isIphone = !iPad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
			isAndroid = ua.match(/(Android)\s+([\d_]+)/),
			isMobile = isIphone || isAndroid;
		if (isAndroid) {
			return {name:'Android', ver : isAndroid};
		}else if(iPad){
			return {name:'iPad', ver : iPad};
		}else if(isIphone){
			return {name:'iPhone', ver : isIphone};
		}else{
			return {name: 'PC', ver : ua};
		}
	},
	getCard : function(vcid, vbp, vtid){
		if (H9377.Uinfo && H9377.Uinfo.LOGIN_ACCOUNT) {
			var cid = vcid, isBP = vbp, tid = vtid;
			if (cid) {
				// 普通礼包
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
				if (!isBP || (isBP && H9377.Uinfo.BIND_CELLPHONE == '1' && H9377.Uinfo.PHONE)) {
					$.getJSON('/h5/game_card.php?card_type='+tid+'&sign=1', function(json){
						if (json.status == 1) {
							H9377.dialog('卡号：'+ json.msg);
						}else if(json.status == -12){
							H9377.bindPhone();
						}else{
							H9377.dialog(json.msg);
						}
					}); 
				}else{
					H9377.bindPhone();
				}
			}
		}else {
			H9377.selectLoginMod();
			return;
		}
	},
	userRegister : function(ele, mod, terms, pass2, ifrp){
		var _form = $(ele).closest('.mod-login-module');

		if (mod == 'phone') {
			// 手机注册
			var cellphone = _form.find('input[name=cellphone]').val(),
				psw = _form.find('input[name=password]').val(),
				captcha = _form.find('input[name=captcha]').val();
			if (!CSRegular.phone(cellphone)) {
				H9377.dialog('请输入正确手机号码');
				return false;
			}
			if (!CSRegular.pass(psw)) {
				H9377.dialog('请输入6~20位密码');
				return false;
			}
			if (!CSRegular.captcha(captcha)) {
				H9377.dialog('请输入正确验证码');
				return false;
			}
			var param = {
				'do' : 'register',
				'LOGIN_ACCOUNT' : cellphone,
				'PASSWORD' : psw,
				'PASSWORD1' : psw,
				'cellphone' : 1,
				'captcha' : captcha,
				'gid' : C9377.gid,
				'login_save' : 50,
				'device_imei' : H9377.userImei,
				'device_model' : getCookie('device_model'),
				'device_network' : getCookie('device_network'),
				'client' : 1,
				'is_ajax' : 1,
				'return_json' : 1
			}
			getJson(param, function(result){
				if (result.status == 0) {
					try {window.AndroidUtils.todayCollectRegister(); } catch(e) {console.log(e); } //统计注册
					if (window['isRefresh']) {
						window.location.reload();
					}else{
						if (H9377.goUrl) {
							window.location.href = H9377.goUrl;
						}else{
							$('.dialog-close').trigger('click');
							H9377.checkUserLogin();
						}
					}
				}else{
					H9377.dialog(result.msg);
					return false;
				}
			}, '/h5/register.php','POST');
		}
		if (mod == 'reg' || mod == 'onekey') {
			// 普通注册
			var urn = _form.find('input[name=username]').val(),
				psw = _form.find('input[name=password]').val();
			if (!CSRegular.uname(urn)) {
				H9377.dialog('请输入6~20位帐号');
				return false;
			}
			if (!CSRegular.pass(psw)) {
				H9377.dialog('请输入6~20位密码');
				return false;
			}
			if (pass2) {
				var psw2 = _form.find('input[name=password2]').val();
				if (!CSRegular.pass(psw2)) {
					H9377.dialog('请输入6~20位密码');
					return false;
				}
				if (psw != psw2) {
					H9377.dialog('两次密码输入不一致');
					return false;
				}
			}
			if (terms) {
				var ts = _form.find('input[name=terms]').attr('checked');
				if (!ts) {
					H9377.dialog('同意用户协议才能注册哦！');
					return false;
				}
			}
			if (ifrp) {
				var param = {
					'do' : 'register',
					'LOGIN_ACCOUNT' : urn,
					'PASSWORD' : psw,
					'PASSWORD1' : psw,
					'login_save' : 50,
					'gid' : C9377.gid,
					'client' : 1,
					'is_ajax' : 1
				}
				var xurl = C9377.app_url +'/register.php';
				iframeP(xurl, 'fakereg', param);

			}else{

				var param = {
					'do' : 'register',
					'LOGIN_ACCOUNT' : urn,
					'PASSWORD' : psw,
					'PASSWORD1' : psw,
					'login_save' : 50,
					'device_imei' : H9377.userImei,
					'device_model' : getCookie('device_model'),
					'device_network' : getCookie('device_network'),
					'gid' : C9377.gid,
					'client' : 1,
					'is_ajax' : 1
				}
				getJson(param, function(result){
					if (result.msg == '注册成功, 正在为您跳转' || result.msg == '登录成功') {
						try {window.AndroidUtils.todayCollectRegister(); } catch(e) {console.log(e); } //统计注册
						if (mod == 'onekey') {
							// PrtSc(1); // 一键注册+安卓截屏
							if (H9377.OS().name == 'Android') {
								PrtSc(1, urn, psw); //2017.12.08之前双端截屏
							}else{
								try {
									calliPhoneNative('PrtSc',{'status':1,'msg':'success'}); //2017.12.08之后ios端使用
								} catch(e) {
									PrtSc(1, urn, psw); //2017.12.08之前双端截屏
									console.log(e);
								}
							}
							var cd = 3, cdinter, ebtn = $('.mod-reg-onekey .btn-enter');
							cdinter = setInterval(function(){
								cd--;
								if (cd < 1) {
									regJump();
								}else{
									ebtn.html('进入游戏（'+cd+'）');
								}
							}, 1000);
							ebtn.click(function() {
								clearInterval(cdinter);
								regJump();
							});
						}else{
							regJump();
						}

						
						function regJump(){
							if (window['isRefresh']) {
								window.location.reload();
							}else{
								if (H9377.goUrl) {
									window.location.href = H9377.goUrl;
								}else{
									$('.dialog-close').trigger('click');
									H9377.checkUserLogin();
								}
							}
						}
					}else{
						H9377.dialog(result.msg);
						return false;
					}
				}, '/h5/register.php','POST');
			}
		}
	},
	maskClose : function(ele){
		var m = $(ele).closest('.mask');
		m.hide();
	}
}
H9377.init();

var CSRegular = {
	uname : function(v){
		var rule1 = /^[a-zA-Z0-9\_]{4,20}$/.test(v);
		var rule2 = !/9377/.test(v);
		return rule1 && rule2;
	},
	pass : function(v){
		return /^.{6,}$/.test(v);
	},
	phone : function(v){
		return /^\d{11}$/.test(v);
	},
	captcha : function(v){
		return /^\d{4,6}$/.test(v);
	}
}

// 获取json数据
function getJson(data, callback, url, type, dType){
	$.ajax({
		'url': url ? url : 'index.php',
		'type': type ? type : 'GET',
		'data': data,
		'dataType': dType ? dType : 'json',
		'async': true,
		'cache': false,
		success: function(info){
			callback(info);
			return false;
		},
		error: function(e){
			alert('网络繁忙！');
		}
	})
}

function PrtSc(status){
	try {
		window.PrtScFun.add(status);
	} catch(e) {
		console.log(e);
	}
}

function iframeP(url, fixname, param){
	var fixhtml = '<form method="post" action="'+url+'" target="'+fixname+'_iframe" id="'+fixname+'_form">';
	fixhtml += '<input type="hidden" name="js_callback" value="'+fixname+'_fixcb" />';
	for( var i in param){
		fixhtml += '<input type="hidden" name="'+i+'" value="'+param[i]+'" />';
	}
	fixhtml += '</form>';
	fixhtml += '<iframe id="'+fixname+'_iframe" name="'+fixname+'_iframe" class="none"></iframe>';
	$('body').append(fixhtml);
	$('#'+fixname+'_form').submit();
	setTimeout(function(){
		$('#'+fixname+'_form').remove();
	}, 3000);
}
function fakereg_fixcb(result){
	//游客注册失败
	if (result.msg == '注册成功, 正在为您跳转' || result.msg == '登录成功') {
		window.location.reload();
	}else{
		alert(result.msg);
	}
}
function register_callback(result){
	//游客注册成功
	if (result) {
		var url = window.top.location.href;
		url = url.replace(/fake=[^&]+/, 'fake=0');
		window.top.location.href = url;
	}
}

// 登录注册参数
var timestamp = (new Date).getTime()/1000 + 3600;
if ($_GET['lm']) {
	C9377.setcookie('lm', $_GET['lm'], timestamp);
}