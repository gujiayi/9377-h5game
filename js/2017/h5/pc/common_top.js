$(function(){
	var username = getCookie('login_name'), gtrem_in;
	// 我的设置
	if( !username ) {
		$('#game_top_relog').css('display','block');
		$('#game_top_loged').css('display','none');
	}else {
		// 已登录
		$('#game_top_uname').text(username);
		$('#game_top_relog').css('display','none');
		$('#game_top_loged').css('display','block');
	}
	var setup_click = true;
	
	$('.game_top_loged').toggle(function() {
		if (setup_click) {
			setup_click = false;
			$(this).addClass('game_top_loged_hover');
			$('.game_top_setup').fadeIn(300,function(){setup_click=true;});
		};
	},function(){
		if (setup_click) {
			setup_click = false;
			$(this).removeClass('game_top_loged_hover');
			$('.game_top_setup').fadeOut(300,function(){setup_click=true;});
		}
	});
	// 导航推广大图
	$('#game_top_rem').hover(function(){
		gtrem_in = setTimeout(function(){
			$('#game_top_rem_pop').fadeIn(300);
		},100)
	},function(){
		clearTimeout(gtrem_in);
	});
	$('#game_top_rem_pop').mouseleave(function(){
		$('#game_top_rem_pop').fadeOut(300);
	});
	// 二维码
	var qr_in, qr_out;
	$('#game_top_qr, #game_top_qr_pop').hover(function(){
		clearTimeout(qr_out);
		qr_in = setTimeout(function(){
			$('#game_top_qr a').addClass('qr_hover');
			$('#game_top_qr_pop').fadeIn();
		},100)
	},function(){
		clearTimeout(qr_in);
		qr_out = setTimeout(function(){
			$('#game_top_qr a').removeClass('qr_hover');
			$('#game_top_qr_pop').fadeOut();
		},100)
	});
	// 导航游戏列表
	var glist_out, glist_in, glist_flag=true;
	$('#game_top_hgame, #game_top_glist').hover(function() {
		clearTimeout(glist_out);
		glist_in = setTimeout(function(){
			$('#game_top_hgame').addClass('game_top_hgame_hover');
			if (glist_flag) {
				glist_flag = false;
				$('#game_top_glist').stop(false,false).animate({'top':'51px','opacity':'1'},300,function(){glist_flag=true;});
			}
		},300);
	},function(){
		clearTimeout(glist_in);
		glist_out = setTimeout(function(){
			$('#game_top_glist').stop(false,false).animate({'top':'-340px','opacity':'0'},300,function(){glist_flag=true;});
			$('#game_top_hgame').removeClass('game_top_hgame_hover');
		},300);
	});
	
	$('html').click(function(){
		var obj = $('.game_top_setup');
		if (obj.is(':visible')) {
			$('.game_top_loged').trigger('click');
		};
	});
	
	//input默认值
	var text_val=$('.input_focus').val();
	$('.input_focus').focus(function(){
		if(this.value==text_val)this.value='';
	}).blur(function(){
		if(this.value=='')this.value=text_val;
	});
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