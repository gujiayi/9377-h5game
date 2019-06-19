if($_COOKIE['Puser']){
	$('#username').val($_COOKIE['Puser']);
}
$('.login-save').click(function() {
	var save = $('#login-save').val();
	if (save == 1) {
		$('#login-save').val(0);
		$(this).find('i').removeClass('icon-cbed');
	}else{
		$('#login-save').val(1);
		$(this).find('i').addClass('icon-cbed');
	}
});
function _login_form(form) {
	var form = $(form);
	var label_acc = form.find('input[name=username]');
	var label_psw = form.find('input[name=password]');
	var username = label_acc.val();
	var pwd = label_psw.val();
	
	if(username.length < 4 || username.length > 30) {
		$('#tips').html('账户名不存在，请重新输入');
		label_acc.focus();
		return false;
	}
	if(pwd.length < 4){
		$('#tips').html('账号与密码不匹配，请重新输入');
		label_psw.focus();
		return false;
	}
	return true;
}