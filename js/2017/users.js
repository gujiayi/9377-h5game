/**
 * @WebSite   :http://www.9377.com/
 * @DateTime  :2017-08-16 15:57:27
 * 用户中心2017
 **/
// 个人资料
	isExist('#user-mod-info', function(){
		$('.radio-item').click(function(){
			var sid = $(this).attr('sid');
			$('#sex').val(sid);
			$(this).addClass('selected').siblings().removeClass('selected');
		});
		// 编辑状态切换
		$('.btn-tomodinfo').click(function() {
			$('.userinfo-default').hide();
			$('.userinfo-modify').show();
		});
		$('.btn-back-def').click(function() {
			$('.userinfo-modify').hide();
			$('.userinfo-default').show();
		});
	});
	// 保存操作
	function saveUserInfo(){
		var param = {
			'do' : 'userinfo_up',
			'name' : $('.userinfo-modify input[name=name]').val(),
			'sex' : $('.userinfo-modify input[name=sex]').val(),
			'idCardNumber' : $('.userinfo-modify input[name=idCardNumber]').val(),
			'birth_year' : $('.userinfo-modify select[name=birth_year]').val(),
			'birth_month' : $('.userinfo-modify select[name=birth_month]').val(),
			'birth_day' : $('.userinfo-modify select[name=birth_day]').val(),
			'qq' : $('.userinfo-modify input[name=qq]').val(),
            'CONFIG' : {'wechat':$('.userinfo-modify input[name=wechat]').val()},
			'return_json' : 1
		}
		getJson(param, function(result){
			if (result.status == "1") {
				window.location.href = C9377.app_url+'/users/users_index.php?type=0';
			}else{
				popTips(result.msg);
			}
		},'/users/users_do.php','POST');
		return false;
	}

// 我的积分
	isExist('#user-mod-credit', function(){
		checkToShow();
	});

// 9377游戏币
	isExist('#user-mod-mycoin', function(){
		checkToShow();
	});

// 二级密码
	$('#btn-set2pass').click(function() {
		$('.table-2pass, .list-2pass').hide();
		$('#setting-2pass').show();
	});
	$('#btn-reset2pass').click(function() {
		$('.table-2pass, .list-2pass').hide();
		$('#reset-2pass').show();
	});
	$('.btn-back-2pass').click(function() {
		$('#reset-2pass, #setting-2pass').hide();
		$('.table-2pass, .list-2pass').show();
	});
	// 修改二级密码
	var myPass2 = {
		setNew : function(){
			var password = $('input[name="password"]').val(),
				password1 = $('input[name="password1"]').val();
			if (!password || !password1) {
				myPass2.wtip('请输入完整信息')
				return false;
			}
			if (password.length < 6) {
				myPass2.wtip('长度不能小于6位');
				return false;
			}
			if (password != password1) {
				myPass2.wtip('两次密码输入不一致');
				return false;
			}
			var param = {
				'ac':'security',
				'dosubmit':1,
				'password':password,
				'password1':password1,
				'js_callback':''
			}
			getJson(param, function(result){
				if (result.status == 1) {
					$('.w-tips-old').html('');
					var tpl = '<div class="bd-txt"> <p>二级密码设置成功,请紧记新密码!</p> </div> <a href="javascript:;" class="pop-button pop-button-green w-pop-close">确定</a>'
					popTips(tpl,1);
					$('.w-pop-close').click(function() {
						window.location.reload();
					});
				}else{
					myPass2.wtip(result.msg);
				}
			},'/market/center.php', 'POST');
			return false;
		},
		modify : function(){
			var password_old = $('input[name="password_old"]').val(),
				password = $('input[name="password_new"]').val(),
				password1 = $('input[name="password_new1"]').val();

			if( !password_old || !password || !password1) {
				myPass2.wtip('请输入完整信息')
				return false;
			}else{
				myPass2.wtip('')
			}
			if (password != password1) {
				myPass2.wtip('两次密码输入不一致',2)
				return false;
			}else{
				myPass2.wtip('',2)
			}
			if (password_old == password) {
				myPass2.wtip('新密码与老密码不能相同',2)
				return false;
			}

			var param = {
				'ac':'security',
				'do':'pwd_up',
				'password_old':password_old,
				'password':password,
				'password1':password1,
				'dosubmit':1,
				'js_callback':''
			}
			getJson(param, function(result){
				if (result.status == 1) {
					$('.w-tips-old').html('');
					var tpl = '<div class="bd-txt"> <p>'+result.msg+'</p> </div> <a href="javascript:;" class="pop-button pop-button-green w-pop-close">确定</a>'
					popTips(tpl,1);
					$('.w-pop-close').click(function() {
						$('#form-mod2pass')[0].reset();
						$('.btn-back-2pass').click();
					});
				}else{
					myPass2.wtip(result.msg);
				}
			},'/market/center.php', 'POST');
			return false;
		},
		wtip : function(txt,id){
			var id = id ? id : '1';
			$('.w-tips'+id).html('<span class="error">'+txt+'</span>');
		}
	}

// 商城订单
	isExist('#user-mod-orders', function(){
		checkToShow();
		$('.btn-getcard').live('click',function(){
			var cid = $(this).attr('cid');
			var tpl = '<div class="bd-txt"> <p>礼包码：'+cid+'</p> </div> <a href="javascript:;" class="pop-button pop-button-green btn-ocid-copy">复 制</a>'
			popTips(tpl,1);
			try {
	            include_once(C9377.resource + '/js/plugin/ZeroClipboard.js', function() {
					setCopyTxt('.btn-ocid-copy', cid, function(){
						var tpl = '<div class="bd-txt"> <p>复制成功！请在游戏中用ctrl+v进行粘贴。</p> </div> <a href="javascript:;" class="pop-button pop-button-green w-pop-close">确 定</a>'
						popTips(tpl,1);
					});
				});
			} catch (e) {}
		});
	});

// 我的信息
	$('.btn-selall').toggle(function() {
		$(this).toggleClass('active');
		$('.mymsg-list .btn-cb').addClass('active');
		$('.mymsg-list li').each(function(index, el) {
			var _this = $(this),
				mid = _this.attr('mid');
			msgFun.seled.push(mid);
		})
	},function(){
		$(this).toggleClass('active');
		$('.mymsg-list .btn-cb').removeClass('active');
		msgFun.seled = [];
	});
	$('.mymsg-list .btn-cb').click(function() {
		// 选择
		$(this).toggleClass('active');
		var mid = $(this).closest('li').attr('mid');
		var ischeck = $(this).hasClass('active');
		if (ischeck) {
			msgFun.seled.push(mid);
		}else{
			for(var i = 0; i < msgFun.seled.length; i++){
				if (msgFun.seled[i] == mid) {
					msgFun.seled.splice(i, 1);
				}
			}
		}
	});
	var msgFun = {
		del : function(id){
			var param = {
				'do' : 'delete_msg',
				'is_ajax' : 1,
				'msg_id' : id
			}
			getJson(param, function(result){
				if (id == 'readed') {
					// 删除已读信息
					$('.mymsg-list li').each(function(index, el) {
						var _this = $(this),
							st = _this.attr('data-status');
						if (st == 0) {
							_this.slideUp(function(){
								_this.remove();
								var list_len = $('.mymsg-list li').length;
								if (!list_len) {
									$('.mymsg-list').html('<div class="tc mgv40">暂无消息</div>');
								}
							});
						}
					});
				}else{
					if ($.isArray(id)) {
						// 删除选中的信息	
						for(var i = 0; i < id.length; i++){
							var _this = $('.msg-'+id[i]);
							(function(ele){
								ele.slideUp(function(){
									ele.remove();
									var list_len = $('.mymsg-list li').length;
									if (!list_len) {
										$('.mymsg-list').html('<div class="tc mgv40">暂无消息</div>');
									}
								});
							})(_this)
						}
					}else{
						// 删除单条信息
						var _this = $('.msg-'+id);
						if (result.status == '1') {
							_this.slideUp(function(){
								_this.remove();
								var list_len = $('.mymsg-list li').length;
								if (!list_len) {
									$('.mymsg-list').html('<div class="tc mgv40">暂无消息</div>');
								}
							});
						}
					}
				}
			},'users_do.php','POST');
		},
		read : function(id, cb){
			var param = {
				'do' : 'read_msg',
				'msg_id' : id
			}
			getJson(param, function(result){
				var _this = $('.msg-'+id);
				if (result.status == '1') {
					_this.attr('data-status', 0);
					_this.find('.J-tag').html('已读').attr('class','tag tag-gray');
				}
			},'users_do.php','POST');
		},
		seled : []
	}
	$('.mymsg-list .btn-del').click(function() {
		var mid = $(this).attr('mid');
		msgFun.del(mid);
	});
	$('.btn-del-sel').click(function() {
		if (msgFun.seled.length) {
			msgFun.del(msgFun.seled);
		}
	});
	$('.btn-del-readed').click(function() {
		msgFun.del('readed');
	});

	$('.mymsg-list .btn-read').click(function() {
		var mid = $(this).attr('mid');
		msgFun.read(mid);
	});

// 积分卡兑换
	isExist('#user-mod-exc', function(){
		var param = {
			'sel' : '#user-mod-exc .user-select-hd li.item',
			'obj' : '#user-mod-exc .J-exc-item'
		}
		setTab(param,function(result){
			$('#user-mod-exc .user-mod-bd').attr('class','user-mod-bd user-mod-bd'+result);
		});
	});

// 二级密码弹窗
	$('.J-btn-to2pass').live('click', function() {
		var tar = $(this).attr('data-tar');
		$('#J-psw2-submit').attr('data-tar', tar);
		popSelect('#pass2-pop');
	});
	$('#J-psw2-submit').click(function() {
		var pass2 = $('#J-psw2').val();
		var tar = $(this).attr('data-tar');
		if (!pass2) {
			$('#J-psw2-tips').html('请输入二级密码！')
		}else{
			post2psw(pass2, function(result){
				if (result.status == 1) {
					$('.w-pop-close').trigger('click');
					// 收货地址特殊处理
					var is_address = $('#user-mod-addr').length;
					if (is_address) {
						showUserAddress();
						$('.user-mod-addr .opt').show();
						$('.user-mod-addr .offline').attr('class','table-data');
					}else{
						$('.table-data').html(tableData).show();
						$('.offline').remove();
						$('.mod-pages').show();
					}
				}else{
					$('#J-psw2-tips').html(result.msg)
				}
			})
		}
	});

// 检查二级密码是否在存活期
	function check2psw(callback,url){
		var param = {
			'ac': 'check_pwd2',
			'password2': 'check'
		}
		getJson(param, function(result){
			// result.status == 1 在存活期
			callback(result);
		}, url ? url : '/market/api/api.php', 'POST');
	}

// 提交二级密码
	function post2psw(psw, callback, url){
		if (psw.length < 6) {
			$('#J-psw2-tips').html('您的输入有误！请重新输入！')
			$('#J-psw2').focus();
			return false;
		}else{
			var param = {
					'ac': 'check_pwd2',
					'password2': psw
				}
			getJson(param, function(result){
				// result.status == 1 输入正确
				callback(result);
			}, url ? url : '/market/api/api.php', 'POST');
		}
	}

// 二级密码是否存在暂时数据表
	function checkToShow(cb){
		check2psw(function(json){
			if (json.status > 0) {
				$('.table-data, .mod-pages').show();
			}else{
				tableData = $('.table-data').html();
				$('.table-data').html('');
				$('.offline').show();
				$('.mod-pages').hide();
			}
			if (cb) {cb(json); }
		});
	}

// 登录状态判断
	function checkUserLoginStatus(){
		var session_id = $_GET['session_id'] || '';
		$.getJSON(C9377.app_url+'/api/user_info_jsonp.php?callback=?&session_id='+ session_id, function(json){
			if (!json.LOGIN_ACCOUNT || json.LOGIN_ACCOUNT == '') {
				var statusCode = -1;
			}else{
				var statusCode = 1;
			}
		});	
	}
	
// 获取json数据
	function getJson(data, callback, url, type, dt){
		$.ajax({
			'url': url ? url : '/users/users_do.php',
			'type': type ? type : 'POST',
			'data': data,
			'dataType': dt ? dt : 'json',
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

// 判断元素是否存在
	function isExist(ele, succb, falcb){
		var obj = $(ele);
		if(obj.length){
			if (succb) {
				succb(true);
			}
		}else{
			if (falcb) {
				falcb(false);
			}
		}
	}

// 密保问题
	var bindQue = {
		setNew : function(){
			// 设置新密保问题
			var que = $('#question').val(),
				ans = $('#answer'),
				vans = ans.val();
			if (!que) {
				bindQue.wtip('请选择密保问题', 1);
				return false;
			}else{
				bindQue.wtip('', 1);
			}
			if (!vans) {
				ans.focus();
				bindQue.wtip('请输入密保答案', 2);
				return false;
			}else{
				bindQue.wtip('', 2);
			}
			var param = {
				'do' : 'pwd_bh',
				'question' : que,
				'answer' : vans,
				'return_json' : 1
			}
			getJson(param, function(result){
				if (result.msg == "密码保护修改成功！") {
					window.location.href = result.gourl;
				}else{
					bindQue.wtip(result.msg,2);
				}
			},'/users/users_do.php','POST');
		},
		modQue : function(){
			// 修改密保问题
			var old_answer = $('input[name="old_answer"]'),
				vo_answer = old_answer.val(),
				new_que = $('#question').val(),
				new_answer = $('#answer'),
				vn_answer = new_answer.val();
			if (!vo_answer) {
				old_answer.focus();
				bindQue.wtip('请输入原密保答案', 1);
				return false;
			}else{
				bindQue.wtip('', 1);
			}
			if (!new_que) {
				bindQue.wtip('请选择新密保问题',2);
				return false;
			}else{
				bindQue.wtip('', 2);
			}
			if (!vn_answer) {
				new_answer.focus();
				bindQue.wtip('请输入新密保答案',3);
				return false;
			}else{
				bindQue.wtip('', 3);
			}
			var param = {
				'do' : 'pwd_bh',
				'old_answer' : vo_answer,
				'question' : new_que,
				'answer' : vn_answer,
				'return_json' : 1
			}
			getJson(param, function(result){
				if (result.msg == "密码保护修改成功！") {
					window.location.href = result.gourl;
				}else{
					bindQue.wtip(result.msg,1);
				}
			},'/users/users_do.php','POST');
		},
		wtip : function(txt,id){
			var id = id ? id : '';
			$('.w-tips'+id).html('<span class="error">'+txt+'</span>');
		}
	}

// 绑定手机
	var bindPhone = {
		_form : $('.form-mibao-phone'),
		sendCaptcha : function(btn, isReset){
			// 绑定手机发送短信
			var vbtn = $(btn),
				cellphone = bindPhone._form.find('input[name=cellphone]'),
				vcellphone = cellphone.val(),
				step = isReset ? isReset : 1;
			if (!/^1\d{10}$/.test(vcellphone)) {
				bindPhone.wtip('手机格式不正确');
				cellphone.focus();
				return false;
			}
			var code = $('.form-mibao-phone').find('input[name=code]'), //重新获取相关元素，不使用存储的变量
				vcode = code.val();
			if (vcode.length < 4) {
				bindPhone.wtip('验证码错误',2);
				code.focus();
				return false;
			}
			var param = {
				'do': 'bind_cellphone',
				'step': step, 
				'cellphone': vcellphone, 
				'code': vcode
			}
			bindPhone.sendSMS(param,vbtn);
		},
		bind : function(cb){
			var cellphone = bindPhone._form.find('input[name=cellphone]'),
				vcellphone = cellphone.val();
				captcha = $('.form-mibao-phone').find('input[name=captcha]'), //重新获取相关元素，不使用存储的变量
				vcaptcha = captcha.val();
			if (!/^1\d{10}$/.test(vcellphone)) {
				bindPhone.wtip('手机格式不正确');
				cellphone.focus();
				return false;
			}
			if (!vcaptcha) {
				bindPhone.wtip('请输入短信验证码',3);
				captcha.focus();
				return false;
			}
			var param = {
				'do' : 'bind_cellphone',
				'step' : 2,
				'cellphone' : vcellphone,
				'captcha' : vcaptcha,
				'json' : 1,
				'return_json' : 1
			}
			getJson(param, function(result){
				if (result.status == 0) {
					if (cb) {
						cb();
					}else{
						window.location.href = C9377.app_url+'/users/users_index.php?type=6';
					}
				}else{
					bindPhone.wtip(result.message, 3);
				}
			},'/users/users_do.php','POST');
		},
		unBindCaptcha : function(btn){
			// 解绑发送验证码
			var code = bindPhone._form.find('input[name=code]'),
				vcode = code.val(),
				vbtn = $(btn);
			if (!vcode) {
				bindPhone.wtip('请输入验证码',2);
				return false;
			}
			var param = {
				'do': 'bind_cellphone',
				'step': 3, 
				'code': vcode
			}
			bindPhone.sendSMS(param,vbtn,function(result){
				if (result.status > 0) {
					// 成功后操作
				}else{
					$('.php-code').eq(0).click();
					code.val('').focus();
				}
			});
		},
		unBind : function(){
			// 解绑验证
			var captcha = bindPhone._form.find('input[name=captcha]'),
				vcaptcha = captcha.val();
			if (vcaptcha.length != 6) {
				bindPhone.wtip('请输入验证码',3);
				return false;
			}
			var param = {
				'do' : 'bind_cellphone',
				'step' : 4,
				'captcha' : vcaptcha
			}
			getJson(param, function(result){
				if (result.status > 0) {
					// 进入设置新密保手机，取消step2，合并到step1；直接进入step3设置新手机
					$('#form-rephone-step1').remove();
					$('#form-rephone-step3').show();
					$('.php-code').eq(0).click();
				}else{
					bindPhone.wtip(result.msg, 3);
				}
			});
		},
		reBindCaptcha : function(btn){
			// 重新绑定发送短信，{只需要手机号码}  失效，不使用这个接口
			var cellphone = $('#form-mibao-rephone input[name=cellphone]'),
				vcellphone = cellphone.val(),
				vbtn = $(btn);
			if (vcellphone.length < 11) {
				bindPhone.wtip('请输入新手机号码');
				return false;
			}
			var param = {
				'do': 'bind_cellphone',
				'cellphone' : vcellphone,
				'step': 3
			}
			bindPhone.sendSMS(param,vbtn);
		},
		reBind : function(){
			// 重新绑定新手机  失效，不使用这个接口
			var cellphone = $('#form-mibao-rephone input[name=cellphone]'),
				vcellphone = cellphone.val(),
				captcha = $('#form-mibao-rephone input[name=captcha]'),
				vcaptcha = captcha.val();
			if (!vcellphone) {
				bindPhone.wtip('请输入新手机号码');
				return false;
			}
			if (!vcaptcha) {
				bindPhone.wtip('请输入短信验证码',2);
				return false;
			}
			var param = {
				'do': 'bind_cellphone',
				'cellphone' : vcellphone,
				'captcha' : vcaptcha,
				'step': 4
			}
			getJson(param, function(result){
				if (result.status > 0) {
					// 新密保手机设置成功
					window.location.href = C9377.app_url+'/users/users_index.php?type=6';
				}else{
					bindPhone.wtip(result.msg,2);
				}
			});
		},
		sendSMS : function(param,vbtn,cb){
			getJson(param, function(result){
				if (result.status > 0) {
					bindPhone.wtip('');
					vbtn.attr('disabled','disabled').addClass('w-button-disabled');
					capt_cd = 60;
					var capt_timer = setInterval(function(){
						capt_cd--;
						vbtn.val(capt_cd+'秒后重试');
						if (capt_cd < 1) {
							vbtn.val('发送验证码').removeAttr('disabled').removeClass('w-button-disabled');
							clearInterval(capt_timer);
						}
					},1000);
				}else if(result.status == -2) {
					$('.php-code').eq(0).trigger('click');
					bindPhone.wtip('发送太频繁，请稍后再试',2);
				}else if(result.status == -4) {
					$('.php-code').eq(0).trigger('click');
					bindPhone.wtip('请输入正确的验证码。',2);
				}else{
					bindPhone.wtip(result.msg,2);
				}
				if (cb) {
					cb(result);
				}
			},'/users/users_do.php','POST');
		},
		wtip : function(txt, id){
			var i = id ? id : 1;
			bindPhone._form.find('.w-tips').html('')
			bindPhone._form.find('.w-tips'+i).html('<span class="error">'+txt+'</span>')
		}
	}

// 绑定邮箱
	var bindEmail = {
		getCode : function(){
			var email = $('input[name=email]'), vemail = email.val();
				window['vemail'] = vemail;
			if (!vemail) {
				bindEmail.wtip('请输入邮箱');
				email.focus();
				return false;
			}else{
				var param = {
					'do' : 'send_mail',
					'email' : vemail
				}
				getJson(param, function(result){
					if (result.status == 0) {
						// 发送成功后的操作
						$('#form-mail-step1').hide();
						$('#form-mail-step2').show();

						$('#qemail').html(vemail);
						$('.J-tomail').attr('href', result.msg).click(function() {
							$('#form-mail-step2').hide();
							$('#form-mail-step3').show();
						});
						var cd = 120, cdtimer = '';
						cdtimer = setInterval(function(){
							$('#cd').html(cd);
							if (cd <= 0) {
								clearInterval(cdtimer);
							}
							cd--;
						}, 1000);
					}else{
						bindEmail.wtip('发送失败！');
					}
				});
				bindEmail.wtip('');
			}
		},
		bind : function(){
			var code = $('input[name=code]'), vcode = code.val();
			if (!vcode) {
				bindEmail.wtip('请输入验证码');
				code.focus();
				return false;
			}else{
				var param = {
					'do' : 'code_mail',
					'email' : vemail,
					'code' : vcode
				}
				getJson(param, function(result){
					if (result.status == 0) {
						window.location.href = C9377.app_url+'/users/users_index.php?type=20';
					}else{
						bindEmail.wtip(result.msg);
						return false;
					}
				});
			}
		},
		reset1 : function(){
			// 重置1
			var code = $('input[name=code]'), vcode = code.val();
			if (!vcode) {
				bindEmail.wtip('请输入验证码');
				code.focus();
				return false;
			}
			// 验证码输入正确，向邮箱发送邮件
			var param = {
				'do' : 'send_mail',
				'code' : vcode
			}
			getJson(param, function(result){
				if (result.status == 0) {
					// 发送成功后的操作
					$('#form-remail-step1').hide();
					$('#form-remail-step2').show();

					$('.J-tomail').attr('href', result.msg).click(function() {
						window.location.href = '/users/users_index.php?type=20&t=3';
					});
					var cd = 120, cdtimer = '';
					cdtimer = setInterval(function(){
						$('#cd').html(cd);
						if (cd <= 0) {
							clearInterval(cdtimer);
						}
						cd--;
					}, 1000);
				}else{
					bindEmail.wtip(result.msg);
				}
			});
		},
		verRemCode : function(){
			// 验证已绑定邮箱的验证码
			var code = $('input[name=email-code]'), vcode = code.val();
			if (!vcode) {
				bindEmail.wtip('请输入验证码');
				code.focus();
				return false;
			}else{
				var param = {
					'do' : 'code_mail',
					'code' : vcode
				}
				getJson(param, function(result){
					if (result.status == 0) {
						$('#form-remail-step3').hide();
						$('#form-mail-step1').show();
						bindEmail.wtip('');
					}else{
						bindEmail.wtip(result.msg);
						return false;
					}
				});
			}
		},
		wtip : function(txt){
			$('.form-mibao-email').find('.w-tips').html('<span class="error">'+txt+'</span>')
		}
	}

// 修改头像
	function avapopOpen(){
		$('#mask, #avatar-pop').show();
		getAvaList();
	}
	function uploadevent(data){
		if (data == 1) {
			window.location.reload();
		};
	}
	function avapopClose(){
		$('#mask, #avatar-pop').hide();
	}
	function getAvaList(){
		$.getJSON('http://bbs.9377.com/api/get_9377_avatar.php?callback=?',function(json){
			var avahtml = '';
			for(var i in json){
				avahtml += '<a href="javascript:;" class="item" isrc="'+json[i].name+'"><img src="'+json[i].path+'" alt=""></a>'
			}
			$('#sys-ava-list').html(avahtml);
		})
	}
	$('.ava-uptype a').click(function(){
		$(this).addClass('active').siblings().removeClass('active');
		$('.ava-upwrap .ava-upbox').eq($(this).index()).show().siblings().hide();
	});
	$('.sys-ava-list .item').live('click', function(){
		var nsrc = $(this).find('img').attr('src');
		$('#curavatar img').attr('src', nsrc);
		$(this).addClass('active').siblings().removeClass('active');
	});
	$('#sys-ava-submit').click(function(){
		var aobj = $('.sys-ava-list .active'), aolen = aobj.length;
		if (aolen) {
			var isrc = aobj.attr('isrc');
			var data = {
				'mod': 'spacecp',
				'ac': 'avatar',
				'do': 'avatar9377',
				'file': isrc
			}
			$.ajax({
				'url': '/users/users_do.php',
				'type': 'GET',
				'data': data,
				'async': false,
				'cache': false,
				success: function(info){
					if (info == 1) {
						$('#s-tips').text('保存成功！');
						window.location.reload();
					}else if( info == -3) {
						$('#s-tips').html('<a href="/users/users_index.php?type=4">请先激活论坛账号！</a>');
					}else{
						$('#s-tips').text('保存失败，请重试');
					}
				},
				error: function(e){
					alert('网络繁忙！');
				}
			});
		}else{
			$('#s-tips').text('请选择要更换的头像！');
		}
	});
	// 修改头像前，需激活论坛
	var bindBBS = {
		bind : function(){
			var gourl = $('input[name=gourl]').val();
			var param = {
				'do' : 'bbs_up',
				'gourl' : gourl,
				'bbs_name' : $('#bbs_name').val(),
				'return_json' : 1
			}
			getJson(param, function(result){
				if (result.msg.indexOf('论坛激活成功') > -1) {
					if (gourl) {
						window.location.href = gourl;
					}else{
						window.location.reload();
					}
				}else{
					$('.w-tips1').html(result.msg);
				}
			});		
			return false;
		}
	}

// 复制功能
	function setCopyTxt(elem, code, cb){
		var clip = new ZeroClipboard.Client();
		var w = $(elem).innerWidth();
		var h = $(elem).innerHeight();
		$(elem).append(clip.getHTML(w,h));
		clip.setText(code);
		clip.addEventListener('onComplete', function(){
			if (cb) {
				cb();
			}else{
				popTips('复制成功！请在游戏中用ctrl+v进行粘贴。');
				return false;
			}
		});
	}

// 第三方帐号绑定
	isExist('#user-mod-bindacc', function(){
		if (!window['openid_nickname']) {
			var oncd = setInterval(function(){
				if (window['openid_nickname']) {
					// 获取ajax拿到的nickname
					$('.name-third-x').html(window['openid_nickname']);
					clearInterval(oncd);
				}
			},200);
		}
		var openAction = $_COOKIE['openid_type'], openType;
		if(openAction=='qq'){
			openType = 'QQ';
			$('.level-tips span').html('QQ登录');
			$('.i-third-x').addClass('i-third-qq');
		}else if(openAction=='weibo'){
			openType = '微博';
			$('.level-tips span').html('新浪微博');
			$('.i-third-x').addClass('i-third-wb');
		}else{
			openType = '微信';
			$('.level-tips span').html('微信登录');
			$('.i-third-x').addClass('i-third-wx');
		};
		// 同意用户协议
		$('#agreement-bindacc').click(function() {
			var isCheck = $(this).hasClass('icon-cbed');
			if (isCheck) {
				$(this).removeClass('icon-cbed');
				$(this).parent().siblings('.w-tips').html('<span class="error">请阅读注册协议并勾选同意</span>');
				$('#submit-reg').attr('disabled','disabled');
			}else{
				$(this).addClass('icon-cbed');
				$(this).parent().siblings('.w-tips').html('');
				$('#submit-reg').removeAttr('disabled');
			}
		});
		// 普通注册验证
		$.validator.addMethod('valid_username', function(value, element){return /^[a-zA-Z0-9\_]{4,20}$/.test(value); });
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
						data: {'do': 'user', 'new': 1, username: function(){ return $('#username-bindacc').val(); }},
						beforeSend: function(){}
					}
				},
				password: {required: true, rangelength: [6, 20] },
				password1: {required: true, rangelength: [6, 20], equalTo: '#password-bindacc'}
			},
			messages: {
				new_username: {
					required: '请填写账号名',
					rangelength: '请填写4-20长度范围的用户名',
					valid_username: '账号名只能由数字或字母组成',
					valid_9377_username: '账号名不能包含9377',
					remote: '账号名已存在'
				},
				password: {required: '请填写密码', rangelength: '请输入6-20位范围的密码'},
				password1: {required: '请再次输入密码', rangelength: '请输入6-20位范围的密码', equalTo: '请确认两次输入的密码一致'}
			},
			submitHandler: function(form){
				$.ajax({
					url: "/users/users_do.php",
					type: 'POST',
					dataType: "jsonp",
					data:  $('#form-bindacc').serialize(),						 
					success: function( data ) {
						if( typeof(data.status) != 'undefined' &&  data.status == 1) {					
							$('#bindacc-pop .bd').prepend('<p>绑定'+openType+'为：'+window["openid_nickname"]+' </p><p> 绑定账号为：'+data.new_username+'</p>');
							$('#pop-bind-user').hide();	
							popSelect('#bindacc-pop');
						}
						else {
							popTips(data.msg);
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
	});

// 身份验证字段判断
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
	// 防沉迷认证表单
	$('.form-mibao-idcard').validate({
		rules: {
			name: {
				required: true,
				valid_name: true
			},
			id_card_number: {
				required: true,
				valid_id_card_number: true
			}
		},
		messages: {
			name: {
				required: '请填写真实姓名',
				valid_name: '姓名填写错误，必须为中文'
			},
			id_card_number: {
				required: '输入你的身份证',
				valid_id_card_number: '请填写真实的身份证号码'
			}
		},
		submitHandler: function(form){
			var real_name = $('input[name="name"]').val();
			var card_id = $('input[name="id_card_number"]').val();
			var cb = $('.form-mibao-idcard').attr('cb');
			var param = {
				'do' : 'fcm',
				'name' : real_name,
				'id_card_number' : card_id,
				'return_json' : 1
			}
			getJson(param, function(result){
				if (result.msg == '修改成功!') {
					if (cb) {
						idCardCb();
					}else{
						window.location.reload();
					}
				}else{
					alert(result.msg);
				}
			},'/users/users_do.php','POST');
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

// 帐号注销
	var userLogOff = {
		_form : $('.form-logoff'),
		xparam : {},
		confirm : function(){
			var lo_captcha = userLogOff._form.find('input[name=captcha]').val(),
				el_name = userLogOff._form.find('input[name=name]'),
				el_idc = userLogOff._form.find('input[name=idc]'),
				lo_name = el_name.val(),
				lo_idc = el_idc.val();
			if (!lo_captcha) {
				userLogOff.wtip('请输入短信验证码',2);
				return false;
			}
			if (el_name.length > 0) {
				if (lo_name.length < 2) {
					userLogOff.wtip('请输入真实姓名',3);
					return false;
				}
			}
			if (el_idc.length > 0) {
				if (lo_idc.length < 18) {
					userLogOff.wtip('请输入身份证号码',4);
					return false;
				}
			}

			userLogOff.xparam = {
				'do' : 'account_logout',
				'captcha': lo_captcha,
				'name': lo_name,
				'id_card_number': lo_idc
			}
			var tpl = '<div class="bd-txt"> <p>账号一旦注销则无法恢复，请仔细确认!</p> </div> <a href="javascript:userLogOff.off();" class="pop-button pop-button-green w-pop-close">确定</a> <a href="javascript:;" class="pop-button pop-button-gray w-pop-close">取消</a>'
			popTips(tpl,1);
		},
		sendCaptcha : function(btn){
			// 发送短信
			var vbtn = $(btn),
				cellphone = userLogOff._form.find('.phone-row'),
				vcellphone = cellphone.val();
			if (cellphone.html().indexOf('绑定手机') > -1) {
				userLogOff.wtip('请先绑定手机');
				return false;
			}
			var code = $('.form-logoff').find('input[name=code]'), //重新获取相关元素，不使用存储的变量
				vcode = code.val();
			if (vcode.length < 4) {
				userLogOff.wtip('验证码错误');
				code.focus();
				return false;
			}
			var param = {
				'do': 'send_sms',
				'code': vcode,
				'msg_type': 8 
			}
			getJson(param, function(result){
				if (result.status == '0') {
					userLogOff.wtip('');
					vbtn.attr('disabled','disabled').addClass('w-button-disabled');
					capt_cd = 60;
					var capt_timer = setInterval(function(){
						capt_cd--;
						vbtn.val(capt_cd+'秒后重试');
						if (capt_cd < 1) {
							vbtn.val('发送验证码').removeAttr('disabled').removeClass('w-button-disabled');
							clearInterval(capt_timer);
						}
					},1000);
				}else if(result.status == -2) {
					$('.php-code').eq(0).trigger('click');
					userLogOff.wtip('发送太频繁，请稍后再试',2);
				}else if(result.status == -4) {
					$('.php-code').eq(0).trigger('click');
					userLogOff.wtip('请输入正确的验证码。',2);
				}else{
					userLogOff.wtip(result.msg);
				}
			},'/users/users_do.php','POST');
		},
		off : function(){
			$.post('/users/users_do.php', userLogOff.xparam, function(json) {
				alert(json.msg);
				if (json.status == 0) {
					window.location.href = C9377.url;
				}
			},'json');
		},
		wtip : function(txt, id){
			var i = id ? id : 1;
			userLogOff._form.find('.w-tips').html('')
			userLogOff._form.find('.w-tips'+i).html('<span class="error">'+txt+'</span>')
		}
	}
// 手机验证弹窗-
var userVphone = {
		_form : $('.vphone-form'),
		push : function(url){
			C9377.vurl = url;
			if (verification == '1' || users_pf != '5') {
				window.location.href = C9377.vurl;
			}else{
				if (C9377.userInfoJson.BIND_CELLPHONE == '1' && C9377.userInfoJson.PHONE != '') {
					popSelect('#vphone-pop');
				}else{
					var tpl = '<div class="bd-txt"> <p>该操作需要验证手机，请先进行绑定</p> </div> <a href="'+C9377.app_url+'/users/users_index.php?type=6" class="pop-button pop-button-red">前往绑定</a>'
					popTips(tpl,1);
				}
			}
		},
		sendCaptcha : function(btn){
			// 发送短信
			var vbtn = $(btn),
				code = $('.vphone-form').find('input[name=code]'),
				vcode = code.val();
			if (vcode.length < 4) {
				userVphone.wtip('验证码错误');
				return false;
			}
			var param = {
				'do': 'send_sms_cn',
				'code': vcode
			}
			getJson(param, function(result){
				if (result.status == '0') {
					userVphone.wtip('');
					vbtn.attr('disabled','disabled').addClass('w-button-disabled');
					capt_cd = 60;
					var capt_timer = setInterval(function(){
						capt_cd--;
						vbtn.val(capt_cd+'秒后重试');
						if (capt_cd < 1) {
							vbtn.val('发送验证码').removeAttr('disabled').removeClass('w-button-disabled');
							clearInterval(capt_timer);
						}
					},1000);
				}else if(result.status == -2) {
					userVphone.wtip('发送太频繁，请稍后再试');
				}else if(result.status == -4) {
					$('.php-code').eq(0).trigger('click');
					userVphone.wtip('请输入正确的验证码。');
				}else{
					userVphone.wtip(result.msg);
				}
			},'/users/users_modpass.php','POST');
		},
		ver : function(){
			var captcha = userVphone._form.find('input[name=captcha]').val();
			if (!captcha) {
				userVphone.wtip('请输入短信验证码');
				return false;
			}

			param = {
				'do' : 'phone_cn',
				'captcha': captcha
			}
			getJson(param, function(result){
				if (result.status == 0) {
					window.location.href = C9377.vurl;
				}else{
					userVphone.wtip(result.msg);
				}
			}, '/users/users_modpass.php','POST');
		},
		wtip : function(txt){
			userVphone._form.find('.w-tips').html(txt)
		}
	}