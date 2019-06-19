// 9377 H5
var H9377 = {
	init: function(){
		H9377.setSlide();
		H9377.setIndexTab();
		H9377.setTab();
		H9377.showFocus();
		H9377.getUserInfo();
		// H9377.checkUserLogin();
		$('.dialog-close').live('click', function() {
			$(this).closest('.mask').hide(); 
			if ($('#floatmod').length) {
				$('#floatmod').show();
				$('#floaticon').trigger('touchend');
			}
		});

	
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
		
		// 自动登录
		if ($_GET['auto']) {
			setTimeout(function(){
				H9377.loadLoginMode('onekey');
			},300)
		}
		// IOS提审链接
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


//有登录账号就自动登录
		try {
			if(	window.CSMasterJSUtils.isAutoLogin() &&  C9377.gid==919){
				setTimeout(function(){
					H9377.autoLogin();
				},1000)
			}
		} catch(e) {console.log(e); }
	},
//有登录账号就自动登录
	autoLogin:function(){
		if($('.userlogin-list').length>0){
			H9377.userLogin('.btn-submit')
		}
	},
	//验证码
	VerCode:false,
	VerCode1:false,
	inputCode:'',
	getImg:function(ele){
		var img = document.getElementById(ele);
		console.log(img)
		img.src ="/csi/ImageVerify/getImageCode?"+Math.random();
	},
	createCode:function(){
		H9377.getImg('validateCode')
	},
	createCode1:function(){
		H9377.getImg('validateCode1')

	},
	Verification :function(ele,code) {
		ele.bind('input propertychange',function () {
			var tx = ele.val();
			H9377.inputCode=tx;
			var param = {
				'code' : tx,
			}
			if(tx.length>=4){
				getJson(param, function(result){
						if(result.errno!=0){
							H9377.dialog(result.msg);
							return false;
						}else{
							if(code=='H9377.VerCode1'){
								H9377.VerCode1=true
							}else{
								H9377.VerCode=true
							}
						}
				}, '/csi/ImageVerify/checkImageCode','POST');
			}
		})
	},
	setSlide: function(){
		// 首页幻灯
		if($('#slideBox .bd li').length > 1){
			C9377.include_once(C9377.resource+'/js/2017/h5/TouchSlide.1.1.js',function(){
				TouchSlide({slideCell:"#slideBox", titCell:".hd ul", mainCell:".bd ul", effect:"leftLoop", interTime:7000, autoPage:true, autoPlay:true });
				document.getElementById('slideBox').getElementsByTagName('img')[0].onload = function(){
					var nh = $('#slideBox img').eq(0).height();
					$('#slideBox, #slideBox .bd').height(nh);
					$('#slideBox .hd').css({'bottom':'10px'});
				}
			})
		}
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
	dialog: function(txt, callback, tit){
		var xtit = tit ? tit : '提示信息';
		var html = '<div class="mask" id="dialog"> <div class="dialog-box"> <p class="title">'+xtit+'</p> <div class="info"> '+txt+' </div> <div class="flex opt"><a href="javascript:;" class="flex-list cancel">确定</a></div> </div> </div>';
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
		$('#login-pop .mod-login-module').hide();
		switch (mode) {
			case 'guide':
				$('#login-pop .mod-login-guide').show();
				break;
			case 'phone':
				$('#login-pop .mod-reg-phone').show();
				break;
			case 'reg':
				$('#login-pop .mod-reg-pub').show();
				break;
			case 'onekey':
				$('#login-pop .mod-reg-onekey').show();
				break;
			case 'normal':
				$('#login-pop .mod-login-ulogin').show();
				break;
			default:
				if (C9377.wechat || $_GET['openid'] == 1) {
					H9377.loadLoginMode('guide');
				}else{
					$('#login-pop .mod-login-ulogin').show();
					$('.mod-login-ulogin input[name=username]').keydown(function(event) {
						if (event.keyCode == 8) {
							$('.mod-login-ulogin input[name=username], .mod-login-ulogin input[name=password]').val('')
						}
					});
					$('.mod-login-ulogin input[name=password]').keydown(function(event) {
						if (event.keyCode == 8) {
							$(this).val('')
						}
					});
				}
				break;
		}
		$('#login-pop').show();

		if (mode == 'onekey') {
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
			setTimeout(function(){
				H9377.userRegister($('.mod-reg-onekey'),'onekey');
			}, 1000)
		}
		if (!mode) {
			H9377.getLoginList('.w-item');
		}

		// 正常注册 [备用]
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
	},
	userLogin : function(ele){
		var _form = $(ele).closest('.mod-login-module'),
			urn = _form.find('input[name=username]').val(),
			psw = _form.find('input[name=password]').val();
		if (!CSRegular.uname(urn)) {
			H9377.dialog('请输入正确帐号');
			return false;
		}
		
		if (!CSRegular.pass(psw)) {
			H9377.dialog('请输入正确密码');
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
		
		// 调用手游sdk接口
		try {
			window.CSMasterJSUtils.switchLoginCallBack(JSON.stringify(param));
			return false;
		} catch(e) {console.log(e); }
	},
	userRegister : function(ele, mod, terms, pass2){
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

			// 调用手游sdk接口
			try {
				window.CSMasterJSUtils.switchPhoneRegisterCallBack(JSON.stringify(param));
				return false;
			} catch(e) {console.log(e); }
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
			// 调用手游sdk接口
			try {
				if (mod == 'onekey') {
					PrtSc(1, urn, psw); //2017.12.08之前双端截屏
				}
				window.CSMasterJSUtils.switchAccoutRegisterCallBack(JSON.stringify(param));
				return false;
			} catch(e) {console.log(e); }
		}
	},
	getLoginList: function(ele){
		if (!H9377.userImei) { return false;}
		var param = {
			'device_imei' : H9377.userImei,
			'list' : 1,
            gid : C9377.gid
		}
		getJson(param, function(result){
			relList(result);
		}, '/api/openid_imei.php', 'GET', 'jsonp');
		
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
						$('.mod-login-ulogin input[name=username]').val(val);
						$('.mod-login-ulogin input[name=password]').val(H9377.userImei);
						$('.userlogin-list').hide();
					});
					// 指定游戏id不自动填充帐号密码
					if ($.inArray(parseInt(C9377.gid), [538]) == -1) {
						$('.userlogin-list li span').eq(0).trigger('click');
					}
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
			myacc = {account:'',password:'123456789'},
			now = new Date;
		myacc.account = 'qy'+ randomNum(10000000,99999999);
		
		function randomNum(minNum,maxNum){ 
			switch(arguments.length){ 
				case 1: 
					return parseInt(Math.random()*minNum+1,10); 
					break; 
				case 2: 
					return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
					break; 
				default: 
					return 0; 
					break; 
			} 
		} 

		$('.mod-reg-onekey .aitem').eq(0).html('账号：'+myacc.account);
		$('.mod-reg-onekey input[name=username]').val(myacc.account);
		$('.mod-reg-onekey input[name=password]').val(myacc.password);
		if (H9377.OS().name == 'PC') { $('.dialog-message').hide(); } //PC上不显示截屏提示

		return myacc;
	},
	sendCaptcha : function(ele, mod){
		var cellphone = $(ele).closest('.dialog-box').find('input[name=cellphone]').val(),
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
				'send_captcha' : 'sent'
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
				H9377.loadLoginMode();
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
						H9377.selectUcMod('bindphone');
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
	selectUcMod : function(mode){
		$('#floatmod').hide();
		// 游戏界面弹窗
		$('#uc-pop .mod-uc').hide();
		switch (mode) {
			case 'ctl':
				$('#uc-pop .mod-uc-ctl').show();
				break;
			case 'pass':
				$('#uc-pop .mod-uc-pass').show();
				
				$('input[name=newpassword]').keyup(function() {
					var pass = $(this).val();
					if (pass) {
						$(this).siblings('.place').html(pass);
					}else{
						$(this).siblings('.place').html('请输入新密码');
					}
				});
				$('.mod-uc-pass .place').click(function() {
					$('input[name=newpassword]').focus();
				});
				$('.J-eye').click(function() {
					var cls = $(this).hasClass('icon-oeye');
					if (cls) {
						$(this).attr('class','icon-ceye J-eye');
						$(this).siblings('.place').show();
						$('input[name=newpassword]').focus();
					}else{
						$(this).attr('class','icon-oeye J-eye');
						$(this).siblings('.place').hide();
						$('input[name=newpassword]').focus();
					}
				});
				break;
			case 'idv':
				$('#uc-pop .mod-uc-idv').show();
				break;
			case 'bindphone':
				$('#uc-pop .mod-uc-bindphone').show();
				break;
			case 'gift':
				$('#uc-pop .mod-uc-gift').show();
				break;
			case 'kf':
				$('#uc-pop .mod-uc-kf').show();
				break;
			case 'gg':
				$('#uc-pop .mod-uc-gg').show();
				break;
			case 'ggc':
				$('#uc-pop .mod-uc-ggc').show();
				moveStop(); //关闭页面滚动
				break;
			default:
				$('#uc-pop .mod-uc-ctl').show();
				break;
		}
		$('#uc-pop').show();
	},
	bindIdc: function(ele){
		var obj = $(ele), part = obj.closest('.mod-uc');
		var aCity={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"} 

		var idcname = part.find('input[name=realname]').val(),
			idc = part.find('input[name=idc]').val();
		if (!verName(idcname)) {
			H9377.dialog('请输入正确姓名');
			return false;
		}
		if (!verName(idcname) || !verIdc(idc)) {
			H9377.dialog('请输入正确身份证');
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
				// window.location.reload();
				// part.find('input[name=realname]').attr('disabled','disabled');
				// part.find('input[name=idc]').attr('disabled','disabled');
				part.find('.btn-submit').attr('onClick','').html('认证成功');
			}else{
				H9377.dialog(result.msg);
			}
		},'/users/users_do.php','POST');
		function verName(value){
			var str=value.replace(/ /g,"")
			if (str==''|| DataLength(str)<4 || DataLength(str)>16){return false}
			var reg = /^[\u4E00-\u9FA5]+$/; 
			if(!reg.test(str)){return false}
			return true;
		}
		function DataLength(fData){
		    var intLength=0
		    for (var i=0;i<fData.length;i++)
		    {
		        if ((fData.charCodeAt(i) < 0) || (fData.charCodeAt(i) > 255))
		            intLength=intLength+2
		        else
		            intLength=intLength+1    
		    }
		    return intLength
		}
		function verIdc(sId){
			var iSum=0
			if(!/^\d{17}(\d|x)$/i.test(sId))return false;
			sId=sId.replace(/x$/i,"a");
			if(aCity[parseInt(sId.substr(0,2))]==null)return false;
			sBirthday=sId.substr(6,4)+"-"+Number(sId.substr(10,2))+"-"+Number(sId.substr(12,2));
			var d=new Date(sBirthday.replace(/-/g,"/"))
			if(sBirthday!=(d.getFullYear()+"-"+ (d.getMonth()+1) + "-" + d.getDate()))return false;
			for(var i = 17;i>=0;i --) iSum += (Math.pow(2,i) % 11) * parseInt(sId.charAt(17 - i),11)
			if(iSum%11!=1)return false;
			return true;
		}
	},
	modifyPass: function(ele){
		var obj = $(ele), part = obj.closest('.mod-uc');
		
		var pass_old = part.find('input[name=oldpassword]').val(),
			pass_new = part.find('input[name=newpassword]').val();
		if (!CSRegular.pass(pass_old)) {
			H9377.dialog('请输入旧密码');
			return false;
		}
		if (!CSRegular.pass(pass_new)) {
			H9377.dialog('请输入6~20位新密码');
			return false;
		}
		var param = {
			'do' : 'pwd_up',
			'password_old' : pass_old,
			'password' : pass_new,
			'password1' : pass_new,
			'device_imei' : H9377.userImei,
			'return_json' : 1
		}
		getJson(param, function(result){
			if (result.status == "1") {
				$('.dialog-close').trigger('click');
				part.find('input[name=oldpassword]').val(''); //清空输入的密码
				part.find('input[name=newpassword]').val(''); //清空输入的密码
			}
			H9377.dialog(result.msg);
		},'/users/users_do.php','POST');
	},
	bindPhone: function(ele){
		var obj = $(ele), part = obj.closest('.mod-uc');

		var cellphone = part.find('input[name=cellphone]').val(),
			captcha = part.find('input[name=captcha]').val();
		if (!CSRegular.phone(cellphone)) {
			H9377.dialog('请输入正确手机号');
			return false;
		}
		if (!CSRegular.captcha(captcha)) {
			H9377.dialog('请输入正确验证码');
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
				H9377.selectUcMod();
				// $('.dialog-close').trigger('click');
				H9377.Uinfo.BIND_CELLPHONE = '1';
				H9377.Uinfo.PHONE = cellphone;
				H9377.dialog(result.message);
				$('.mod-uc-bindphone .w-item-wp').hide();
				$('.mod-uc-bindphone .btn-submit').hide();
				// 弹出礼包弹窗
				// $('.btn-getBPcard').trigger('click');
			}else{
				H9377.dialog(result.message);
			}
		},'/users/users_do.php','POST');
	},
	kfOnline: function(){
		$('.mod-uc-kf .dialog-close').click();
		$('.kf-wp').show();
    	$('.kf-wp iframe').attr('src', 'https://tb.53kf.com/code/client/10165082/1');
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
						H9377.selectUcMod('bindphone');
					}
				}else{
					if (cid == 'yTyxp01v') {
						H9377.dialog('<p style="color:#666;">激活码：'+ cid + '</p><p style="font-size:12px;margin-top: 6px;">长按激活码复制，登陆游戏打开福利界面兑换</p>','','恭喜您！获得企鹅网吧特权！');
					}else{
						H9377.dialog('卡号：'+ cid);
					}
				}
			}else{
				// 系统礼包
				if (!isBP || (isBP && H9377.Uinfo.BIND_CELLPHONE == '1' && H9377.Uinfo.PHONE)) {
					$.getJSON(C9377.app_url+'/game_card.php?card_type='+tid+'&gid='+C9377.gid+'&sign=1', function(json){
						if (json.status == 1) {
							if ($.inArray(tid, [3289,3286,3313,3370,3379,3406,3508]) > -1) {
								if ($.inArray(tid, [3508]) > -1) {
									H9377.dialog('<p style="color:#666;">激活码：'+ json.msg + '</p><p style="font-size:12px;margin-top: 6px;">长按激活码复制，登陆游戏-完成新手指导任务-打开福利界面兑换</p>','','恭喜您！获得专享礼包特权！');
								}else{
									H9377.dialog('<p style="color:#666;">激活码：'+ json.msg + '</p><p style="font-size:12px;margin-top: 6px;">长按激活码复制，登陆游戏打开福利界面兑换</p>','','恭喜您！获得企鹅网吧特权！');
								}
							}else{
								H9377.dialog('卡号：'+ json.msg);
							}
						}else if(json.status == -12){
							H9377.selectUcMod('bindphone');
						}else{
							H9377.dialog(json.msg);
						}
					}); 
				}else{
					H9377.selectUcMod('bindphone');
				}
			}
		}else {
			H9377.loadLoginMode();
			return;
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
		var rule1 = /^[a-zA-Z0-9\_]{4,20}$/.test($.trim(v));
		var rule2 = !/9377/.test($.trim(v));
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

function PrtSc(status, acc, psw){
	try {
		window.PrtScFun.add(status); //2017.11.23之前的端使用
		window.PrtScFun.screenShot(1, acc, psw); 
	} catch(e) {
		console.log(e);
	}
}

// 登录注册参数
var timestamp = (new Date).getTime()/1000 + 3600;
if ($_GET['lm']) {
	C9377.setcookie('lm', $_GET['lm'], timestamp);
}


function calliPhone(handlerInterface,handlerMethod,parameters){
	//handlerInterface由iOS addScriptMessageHandler与andorid addJavascriptInterface 代码注入而来。
	var dic = {'handlerInterface':handlerInterface,'function':handlerMethod,'parameters': parameters};
	if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)){
		window.webkit.messageHandlers[handlerInterface].postMessage(dic);
	}
	// else{
	// 	//安卓传输不了js json对象
	// 	window[handlerInterface][handlerMethod](JSON.stringify(dic));
	// }
}
function calliPhoneNative(handlerMethod,parameters){
	calliPhone("Native",handlerMethod,parameters);
}