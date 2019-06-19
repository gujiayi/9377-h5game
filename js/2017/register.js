// 普通注册，手机注册切换
	$('.register-tab li').click(function() {
		var lid = $(this).index();
		$(this).addClass('active').siblings().removeClass('active');
		$('.register-tab-con .register-item').hide().eq(lid).show().find('.php-code').click();
	});
	if ($_GET['mod'] == 'phone') {
		$('.register-tab li').eq(1).click();
	}else{
		$('.register-tab li').eq(0).click();
	}
	
// 同意用户协议
	$('#agreement-reg,#agreement-phone').click(function(){
		var isCheck = $(this).hasClass('icon-cbed');
		if (isCheck) {
			$(this).removeClass('icon-cbed');
			$('.ckterms').attr('checked',false);
		}else{
			$(this).addClass('icon-cbed');
			$('.ckterms').attr('checked',true);
		}
	});

// 普通注册验证
$.validator.addMethod('valid_username', function(value, element){
	return /^[a-zA-Z0-9\_]{4,20}$/.test(value);
});

$.validator.addMethod('valid_9377_username', function(value, element){
	return !/9377/.test(value);
});

$.validator.addMethod('valid_name', function(value, element){
	str=value.replace(/ /g,"")
	if (str==''|| DataLength(str)<4 || DataLength(str)>16){return false}
	var reg = /^[\u4E00-\u9FA5]+$/; 
	if(!reg.test(str)){return false}
	return true;
});

//身份证验证
var aCity={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"} 

$.validator.addMethod('valid_id_card_number', function(sId, element){
	var iSum=0
	var info=""
	if(!/^\d{17}(\d|x)$/i.test(sId))return false;
	sId=sId.replace(/x$/i,"a");
	if(aCity[parseInt(sId.substr(0,2))]==null)return false;
	sBirthday=sId.substr(6,4)+"-"+Number(sId.substr(10,2))+"-"+Number(sId.substr(12,2));
	var d=new Date(sBirthday.replace(/-/g,"/"))
	if(sBirthday!=(d.getFullYear()+"-"+ (d.getMonth()+1) + "-" + d.getDate()))return false;
	for(var i = 17;i>=0;i --) iSum += (Math.pow(2,i) % 11) * parseInt(sId.charAt(17 - i),11)
	if(iSum%11!=1)return false;
	return true;
});

//汉字长度判断
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
// 普通注册验证
$('#register-form').validate({
	rules: {
		LOGIN_ACCOUNT: {
			required: true,
			rangelength: [4, 20],
			valid_username: true,
			valid_9377_username: true,
			remote: {
				url: '/check_user.php',
				cache: false,
				data: {'do': 'user', 'new': 1, username: function(){ return $('#username').val(); }},
				beforeSend: function(){}
			}
		},
		
		PASSWORD: {
			required: true,
			rangelength: [6, 20]
		},
		PASSWORD1: {
			required: true,
			rangelength: [6, 20],
			equalTo: '#password'
		},
		NAME: {
			required: true,
			valid_name: true
		},
		ID_CARD_NUMBER: {
			required: true,
			valid_id_card_number: true
		},
		phone: {
			required: true,
			rangelength: [11,11]
		},
		code: {
			required: true,
			remote: {
				url: '/check_user.php',
				cache: false,
				data: {'do': 'code', 'new': 1, code: function(){ return $('#code').val(); }},
				beforeSend: function(){}
			}
		},
		captcha: {
			required: true,
			rangelength: [6, 6],
		},
		TERMS: {
			required: true
		}
	},
	
	messages: {
		LOGIN_ACCOUNT: {
			required: '请填写账号名',
			rangelength: '请填写4-20长度范围的用户名',
			valid_username: '账号名只能由数字或字母组成',
			valid_9377_username: '账号名不能包含9377',
			remote: '账号名已存在'
		},
		PASSWORD: {
			required: '请填写密码',
			rangelength: '请输入6-20位范围的密码'
		},
		PASSWORD1: {
			required: '请再次输入密码',
			rangelength: '请输入6-20位范围的密码',
			equalTo: '请确认两次输入的密码一致'
		},
		NAME: {
			required: '请填写真实姓名',
			valid_name: '真实姓名填写错误，必须为中文'
		},
		ID_CARD_NUMBER: {
			required: '输入您的身份证',
			valid_id_card_number: '请填写真实的身份证号码'
		},
		phone: {
			required: '输入您的手机号码',
			rangelength: '请填写正确的手机号码'
		},
		code: {
			required: '请填写验证码',
			remote: '请填写正确的验证码'
		},
		captcha: {
			required: '输入短信验证码',
			rangelength: '请填写正确的短信验证码'
		},
		TERMS: {
			required: '请阅读注册协议并勾选同意'
		}
	},

	submitHandler: function(form){
		var real_name = $('input[name="NAME"]').val();
		var card_id = $('input[name="ID_CARD_NUMBER"]').val();
		$('#submit-reg').val('注册中...');
		$.ajax({
			url: '/api/idcard_check_interface.php',
			type: "POST",
			data: {
				'username': real_name,
				'id_card':card_id
			},
			timeout : 60000, //超时时间设置，单位毫秒
			dataType: "json",
			async: true,
			cache:false,
			success: function(result){
				if (!result) {
					registerAccount();
				}else{
					if( result.status == -2 ) {
						alert('身份证号码格式不正确。');
						$('input[name="ID_CARD_NUMBER"]').focus();
						return false;
					}else if( result.status == -1 ) {
						alert('身份证号码和姓名不符。');
						$('input[name="ID_CARD_NUMBER"]').focus();
						return false;
					}else {
						registerAccount();
					}	
				}
			}
		}); 
	},
	
	success: function(error, element){
		error.removeClass('error').addClass('correct').html('&nbsp;');
	},
	
	errorClass: 'error',
	validClass: 'correct',
	
	errorPlacement: function(error, element) {
		element.closest('.w-item').find('.w-tips').empty().append(error);
	},
	
	invalidHandler: function(event, validator){
		validator.element(validator.errorList[0].element);
	},
	
	onkeyup: false
});

function registerAccount(){
	var param = {
		'do' : 'register',
		'sub_account' : $('.register-account input[name=sub_account]').val(),
		'gourl' : $('.register-account input[name=gourl]').val(),
		'LOGIN_ACCOUNT' : $('.register-account input[name=LOGIN_ACCOUNT]').val(),
		'PASSWORD' : $('.register-account input[name=PASSWORD]').val(),
		'PASSWORD1' : $('.register-account input[name=PASSWORD1]').val(),
		'NAME' : $('.register-account input[name=NAME]').val(),
		'ID_CARD_NUMBER' : $('.register-account input[name=ID_CARD_NUMBER]').val(),
		'tel' : $('.register-account input[name=phone]').val(),
		'captcha' : $('.register-account input[name=captcha]').val(),
		'cellphone' : 1,
		'register' : 1,
		'is_ajax' : 1
	}
	$.post('/register.php', param, function(result) {
		if (result.msg == '注册成功, 正在为您跳转' || result.msg == '登录成功') {
			var vurl = $('.register-account input[name=gourl]').val(), vurl = vurl ? vurl : window.location.origin;
			var tpl = '<div class="bd-txt"> <p>注册成功, 正在为您跳转</p> </div> <a href="'+vurl+'" class="pop-button pop-button-green">确定</a>'
			popTips(tpl,1);
			setTimeout(function(){
				window.location.href = vurl;
			}, 10*1000);
		}else if(result.status == 4){
			$('.register-account input[name=captcha]').html('').parent().siblings('.w-tips').html('<label for="phone" generated="true" class="error">验证码错误，请重新获取</label>');
			$('.register-account input[name=code]').html('');
			$('.register-account .php-code').click();
			$('#submit-reg').val('立即注册');
			return false;
		}else{
			alert(result.msg);
			$('#submit-reg').val('立即注册');
			return false;
		}
	},'json');
}
// 帐号注册 发送短信

function sendCaptchaX(btn){
	var phone = $('#register-form input[name=phone]'), vphone = phone.val(), ptip = phone.closest('.w-item').find('.w-tips'),
		code = $('#register-form input[name=code]'), vcode = code.val(), ctip = code.closest('.w-item').find('.w-tips'), 
		vbtn = $(btn);
	if (vphone.length < 11) {
		ptip.html('<label for="phone" generated="true" class="error">请填写正确手机号</label>')
		return false;
	}else{
		// ptip.html('');
	}
	if (vcode.length != 4) {
		ctip.html('<label for="code" generated="true" class="error">请填写验证码</label>')
		return false;
	}else{
		// ctip.html('');
	}

	var param = {
		'do' : 'register',
		'tel' : vphone,
		'cellphone' : 1,
		'check_code' : 1,
		'code' : vcode,
		'send_captcha' : 'send',
		'is_ajax' : 1
	}
	$.post('/register.php', param, function(result) {
		if (result.status == 0) {
			vbtn.attr('disabled','disabled').addClass('w-button-disabled');
			capt_cd = 60;
			var capt_timer = setInterval(function(){
				capt_cd--;
				vbtn.val(capt_cd+'秒后重试');
				if (capt_cd == 0) {
					vbtn.val('发送验证码').removeAttr('disabled').removeClass('w-button-disabled');
					clearInterval(capt_timer);
				}
			},1000);
		}else{
			ctip.html('<label for="code" generated="true" class="error">'+result.msg+'</label>');
		}
	},'json');
}
// 手机注册验证
$('#register-phone').validate({
	rules: {
		LOGIN_ACCOUNT: {
			required: true,
			rangelength: [11, 12],
			valid_username: true,
			valid_9377_username: true,
			remote: {
				url: '/check_user.php',
				cache: false,
				data: {'do': 'user', 'new': 1, username: function(){ return $('#phone').val(); }},
				beforeSend: function(){}
			}
		},
		captcha: {
			required: true,
			rangelength: [6, 6]
		},
		PASSWORD: {
			required: true,
			rangelength: [6, 20]
		},
		PASSWORD1: {
			required: true,
			rangelength: [6, 20],
			equalTo: '.register-phone input[name=PASSWORD1]'
		},
		NAME: {
			required: true,
			valid_name: true
		},
		ID_CARD_NUMBER: {
			required: true,
			valid_id_card_number: true
		},
		code: {
			required: true,
			rangelength: [4, 4],
			remote: {
				url: '/check_user.php',
				cache: false,
				data: {'do': 'code', 'new': 1, code: function(){ return $('#pcode').val(); }},
				beforeSend: function(){}
			}
		},
		TERMS: {
			required: true
		}
	},
	
	messages: {
		LOGIN_ACCOUNT: {
			required: '请填写手机号',
			rangelength: '请填写11位手机号',
			valid_username: '账号名只能由数字组成',
			valid_9377_username: '账号名不能包含9377',
			remote: '账号名已存在'
		},
		captcha: {
			required: '请填写短信验证码',
			rangelength: '请输入6位短信验证码'
		},
		PASSWORD: {
			required: '请填写密码',
			rangelength: '请输入6-20位范围的密码'
		},
		PASSWORD1: {
			required: '请再次输入密码',
			rangelength: '请输入6-20位范围的密码',
			equalTo: '请确认两次输入的密码一致'
		},
		NAME: {
			required: '请填写真实姓名',
			valid_name: '真实姓名填写错误，必须为中文'
		},
		ID_CARD_NUMBER: {
			required: '输入您的身份证',
			valid_id_card_number: '请填写真实的身份证号码'
		},
		code: {
			required: '请填写验证码',
			rangelength: '请填写验证码',
			remote: '验证码不正确'
		},
		TERMS: {
			required: '请阅读注册协议并勾选同意'
		}
	},

	submitHandler: function(form){
		var real_name = $('input[name="NAME"]').val();
		var card_id = $('input[name="ID_CARD_NUMBER"]').val();
		$('#submit-phone').val('注册中...');
		$.ajax({
			url: '/api/idcard_check_interface.php',
			type: "POST",
			data: {
				'username': real_name,
				'id_card':card_id
			},
			timeout : 60000, //超时时间设置，单位毫秒
			dataType: "json",
			async: true,//异步
			cache:false, 
			success: function(result){
				if( result.status == -2 ) {
					alert('身份证号码格式不正确。');
					$('input[name="ID_CARD_NUMBER"]').focus();
					return false;
				}else if( result.status == -1 ) {
					alert('身份证号码和姓名不符。');
					$('input[name="ID_CARD_NUMBER"]').focus();
					return false;
				}else {
					registerPhoneAccount();
				}
			}
		}); 
	},
	
	success: function(error, element){
		error.removeClass('error').addClass('correct').html('&nbsp;');
	},
	
	errorClass: 'error',
	validClass: 'correct',
	
	errorPlacement: function(error, element) {
		element.closest('.w-item').find('.w-tips').empty().append(error);
	},
	
	invalidHandler: function(event, validator){
		validator.element(validator.errorList[0].element);
	},
	
	onkeyup: false
});
// 手机注册发送短信
function sendCaptcha(btn){
	var checkU = $('#phone').siblings('.w-tips').html();
	if (checkU.indexOf('已存在') != -1) {
		return false;
	}
	var phone = $('#phone'), vphone = phone.val(), ptip = phone.closest('.w-item').find('.w-tips'),
		code = $('#pcode'), vcode = code.val(), ctip = code.closest('.w-item').find('.w-tips'), 
		vbtn = $(btn);
	if (vphone.length < 11) {
		ptip.html('<label for="phone" generated="true" class="error">请填写正确手机号</label>')
		return false;
	}else{
		// ptip.html('');
	}
	if (vcode.length != 4) {
		ctip.html('<label for="code" generated="true" class="error">请填写验证码</label>')
		return false;
	}else{
		// ctip.html('');
	}

	var param = {
		'do' : 'register',
		'LOGIN_ACCOUNT' : vphone,
		'cellphone' : 1,
		'check_code' : 1,
		'code' : vcode,
		'send_captcha' : 'send',
		'is_ajax' : 1
	}
	$.post('/register.php', param, function(result) {
		if (result.status == 0) {
			vbtn.attr('disabled','disabled').addClass('w-button-disabled');
			capt_cd = 60;
			var capt_timer = setInterval(function(){
				capt_cd--;
				vbtn.val(capt_cd+'秒后重试');
				if (capt_cd == 0) {
					vbtn.val('发送验证码').removeAttr('disabled').removeClass('w-button-disabled');
					clearInterval(capt_timer);
				}
			},1000);
		}else{
			ctip.html('<label for="code" generated="true" class="error">'+result.msg+'</label>');
		}
	},'json');
}

function registerPhoneAccount(){
	var param = {
		'do' : 'register',
		'sub_account' : $('.register-phone input[name=sub_account]').val(),
		'gourl' : $('.register-phone input[name=gourl]').val(),
		'cellphone' : 1,
		'captcha' : $('.register-phone input[name=captcha]').val(),
		'LOGIN_ACCOUNT' : $('.register-phone input[name=LOGIN_ACCOUNT]').val(),
		'PASSWORD' : $('.register-phone input[name=PASSWORD]').val(),
		'PASSWORD1' : $('.register-phone input[name=PASSWORD1]').val(),
		'NAME' : $('.register-phone input[name=NAME]').val(),
		'ID_CARD_NUMBER' : $('.register-phone input[name=ID_CARD_NUMBER]').val(),
		'code' : $('.register-phone input[name=code]').val(),
		'is_ajax' : 1
	}
	$.post('/register.php', param, function(result) {
		if (result.msg == '注册成功, 正在为您跳转' || result.msg == '登录成功') {
			var vurl = $('.register-phone input[name=gourl]').val(), vurl = vurl ? vurl : window.location.origin;
			var tpl = '<div class="bd-txt"> <p>注册成功, 正在为您跳转</p> </div> <a href="'+vurl+'" class="pop-button pop-button-green">确定</a>'
			popTips(tpl,1);
			setTimeout(function(){
				window.location.href = vurl;
			}, 10*1000);
		}else{
			alert(result.msg);
			$('#submit-phone').val('立即注册');
			return false;
		}
	},'json');
}
// 设置页面最小高度
function setPageHeight(){
	var h = $(window).height(),
		th = $('.normal-header').outerHeight(),
		fh = $('.footer').outerHeight(),
		vh = h - th - fh - 67 - 40;
	$('.mod-register-wp').eq(0).css('min-height',vh+'px');
}
$(window).resize(function(){
	setPageHeight();
}).trigger('resize');