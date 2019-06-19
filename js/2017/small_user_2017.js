(function(){
	$('#small-tab li').click(function(){
		$(this).addClass('on').siblings().removeClass('on');
        $('#small-main .small-con').hide().eq($(this).index()).show();
		var h = $('#after-log').height()/2;
		$('#after-log').css('marginTop',-h);
		
/*
sub_type = $('#small-tab ul li.on').index();
box_id = sub_type == 1 ? 'small_account_box2' : '#small_account_box';
sub_count = $(box_id + ' div').length;
if(sub_count > 7){
	$('#add-small-account').addClass('gray-btn');
	$('#add-small-account').attr('id', 'add-small-account#');
}
*/
	});
	
	$('.select-item span').click(function() {
		$('.select-item i').removeClass('seclick');
		$(this).siblings('i').addClass('seclick');
		$('.select-item ul').hide();
		$(this).siblings('ul').show();
	});
	
	// 绑定小号
	var s_option = '';
	$('#add-small-account').live('click', function(){
		$('#after-log').hide();
		$('#add_sub_account').html('添加小号');
		$('#check-tips').html('');
		$('#s_gid_name').html('请选择游戏');
		$('#s_sid_name').html('请选择服');
		$.getJSON(C9377.app_url+'/api/date_game_json.php?callback=?', function(ret){
			var g_option = '<li value="">请选择游戏</li>';
			for(i in ret){
				selected  = ret[i].ID == window['df_gid'] ? 'selected' : '';
				g_option += '<li value='+ret[i].ID+' '+selected+'>'+ret[i].NAME+'</li>';
			}
			$('#s_gid').html(g_option);
		});
		popSelect('#reg-samll-user');
	});
	
	
	$('#s_gid li').live('click',function() {
		var s_gid_name = $(this).text();
		var s_gid = $(this).attr('value') || window['df_gid'];
		$('#s_gid_name').html(s_gid_name);
		$('#s_gid_name').attr('value',s_gid);
		$('#s_gid').hide();
		$('#gid_arrow').removeClass('seclick');
		if( s_gid ) {
			s_option = '<li value="">请选择服</li>';
			$.getJSON(C9377.app_url+'/api/game_server_jsonp.php?reverse=1&gid='+s_gid+'&callback=?', function(ret){
				for(i in ret){
					selected  = ret[i].SID == window['df_sid'] ? 'selected' : '';
					s_option += '<li value='+ret[i].SID+' '+selected+'>'+ret[i].NAME+'</li>';
				}
				$('#s_sid').html(s_option);
			});
		}
	});
	
	$('#s_sid li').live('click',function() {
		var s_sid_name = $(this).text();
		var s_sid = $(this).attr('value');
		$('#s_sid_name').html(s_sid_name);
		$('#s_sid_name').attr('value',s_sid);
		$('#s_sid').hide();
		$('#sid_arrow').removeClass('seclick');
	});
	
	$('#small-account').live('click', function(){
		window['df_gid'] = window['df_sid'] = window['df_id'] = '';
		if($('#after-log').hasClass('none') ) {
			$.getJSON(C9377.app_url+'/api/sub_account.php?act=get_sub_account&callback=?', function(ret){
				var html = '';
				var tips = '';
				/*我的小号*/
				count_my = 0;
				if( ret ) {
					for(i in ret) {
						tips = ret[i].data.tips ? ret[i].sub_account+'('+ret[i].data.tips+')' : ret[i].sub_account;
						html += '<div class="game-item clearfix" id="row-'+ ret[i].id +'" data-id="'+ ret[i].id +'" data-a="'+ ret[i].account +'" data-sa="'+ ret[i].sub_account +'" data-g="'+ ret[i].gid +'" data-s="'+ ret[i].sid +'">';
						html += '<p class="game-zone"><a href="'+ret[i].game_url+'" target="_blank">'+ret[i].data.game_server+'</a></p>';
						html += '<p class="game-samll">'+tips+'</p>';
						
						if( ret[i].data.accept == 12){
							html += '<p class="game-state refuse-state">已拒绝</p>';
							html += '<p class="game-operate clearfix" sa="'+ret[i].sub_account+'" gid="'+ret[i].gid+'" sid="'+ret[i].sid+'"><a href="javascript:void(0);" class="noenter-btn">进入游戏</a>';
						}else if( ret[i].data.accept == 11 || ret[i].data.accept == 0 || typeof(ret[i].data.accept) == 'undefined' ){
							html += '<p class="game-state agree-state">已同意</p>';
							html += '<p class="game-operate clearfix" sa="'+ret[i].sub_account+'" gid="'+ret[i].gid+'" sid="'+ret[i].sid+'"><a class="enter-btn" href="'+ret[i].game_url+'" target="_blank">进入游戏</a>';
						}else{
							html += '<p class="game-state wait-state">等待中</p>';
							html += '<p class="game-operate clearfix" sa="'+ret[i].sub_account+'" gid="'+ret[i].gid+'" sid="'+ret[i].sid+'"><a href="javascript:void(0);" class="noenter-btn">进入游戏</a>';
						}
						
						html += '<a href="javascript:;" class="delete-btn" title="删除">删除</a></p></div>';
						count_my++;
					}
				}
				
				if( !html ){
					$('#game-tit').hide();
					$('#small_account_box').html('');
					$('#small-notice').html('<p class="small-img"></p><p class="no-hao">暂无小号，请先进行添加</p>');
				}else{
					$('#game-tit').show();
					$('#small_account_box').html(html);
					$('#small-notice').html('注：添加小号成功后，请登陆小号确认授权!');
				}
				$('#_my_sub').html('我的小号（'+ count_my +'）<span></span>');
				
				var h = $('#after-log').height()/2;
				$('#after-log').css('marginTop',-h);
				popSelect('#after-log');
			});
			
			$.getJSON(C9377.app_url+'/api/sub_account.php?act=get_sub_account&type=sub_account&callback=?', function(ret){
				var html = '';
				var tips = '';
				
				count_i = 0;
				//我是小号
				if( ret ) {
					for(i in ret) {
						//tips = ret[i].data.tips ? ret[i].account+'('+ret[i].data.tips+')' : ret[i].account; //小号不需要看到备注
						html += '<div class="game-item clearfix" id="row-'+ ret[i].id +'" data-id="'+ ret[i].id +'" data-a="'+ ret[i].account +'" data-sa="'+ ret[i].sub_account +'" data-g="'+ ret[i].gid +'" data-s="'+ ret[i].sid +'">';
						html += '<p class="game-zone"><a href="'+ret[i].game_url+'" target="_blank">'+ret[i].data.game_server+'</a></p>';
						html += '<p class="game-samll">'+ret[i].account+'</p>';
						
						if(ret[i].data.accept == 12){
							html += '<p class="game-state handle-state"><a class="refuse-state" href="#">已拒绝</a></p>';
						}else if(ret[i].data.accept == 11 || ret[i].data.accept == 0){
							html += '<p class="game-state handle-state"><a class="agree-state" href="#">已同意</a></p>';
						}else{
							html += '<p class="game-state handle-state"><a class="handle-agree _sub_agree" href="#">同意</a><span>|</span><a class="handle-refuse _sub_refuse" href="#">拒绝</a></p>';  //refuse-state    wait-state
						}
						
						html += '<p class="game-operate handle-operate clearfix"><a href="javascript:;" class="delete-btn _sub_delete" title="删除">删除</a></p></div>';
						count_i++;
					}
				}
				
				
				if( !html ){
					$('#game-tit').hide();
					$('#small_account_box2').html('');
					$('#small-notice2').html('<p class="small-img"></p><p class="no-hao">暂无小号，请先进行添加</p>');
				}else{
					$('#game-tit').show();
					$('#small_account_box2').html(html);
					$('#small-notice2').html('注：添加小号成功后，请登陆小号确认授权!');
				}
				$('#_i_sub').html('我是小号（'+ count_i +'）<span></span>');
			});

		}
	});
	
	
	var edit_flag = true;
	//
	$('._sub_refuse').live('click', function(){
		edit_id = $(this).parent('p').parent('div').data('id');
		if(edit_flag){
			edit_flag = false;
			$.ajax({
				url : '/api/sub_account.php',
				type : "POST",
				data : {
					'act' : 'add_sub_account',
					'_account' : $(this).parent('p').parent('div').data('a'),
					'account' : $(this).parent('p').parent('div').data('sa'),
					'gid' : $(this).parent('p').parent('div').data('g'),
					'sid' : $(this).parent('p').parent('div').data('s'),
					'accept' : 12,
					'id' : edit_id
				},
				timeout : 60000, //超时时间设置，单位毫秒
				dataType: "json",
				async: false,//异步
				cache:false, 
				success: function(json){  
					if( json.status == 1 ) {
						$('#row-'+edit_id).children('.handle-state').html('<a class="refuse-state" href="#">已拒绝</a>');
					}else{
						//alert(json.msg);
						$('#check-tips').html(json.msg);
						popTips('#check-tips');
					};
					edit_flag = true;
				}
			}); 
		}
	});	

	$('._sub_agree').live('click', function(){
		edit_id = $(this).parent('p').parent('div').data('id');
		if(edit_flag){
			edit_flag = false;
			$.ajax({
				url : '/api/sub_account.php',
				type : "POST",
				data : {
					'act' : 'add_sub_account',
					'_account' : $(this).parent('p').parent('div').data('a'),
					'account' : $(this).parent('p').parent('div').data('sa'),
					'gid' : $(this).parent('p').parent('div').data('g'),
					'sid' : $(this).parent('p').parent('div').data('s'),
					'accept' : 11,
					'id' : edit_id
				},
				timeout : 60000, //超时时间设置，单位毫秒
				dataType: "json",
				async: false,//异步
				cache:false, 
				success: function(json){  
					if( json.status == 1 ) {
						$('#row-'+edit_id).children('.handle-state').html('<a class="agree-state" href="#">已同意</a>');
					}else{
						//alert(json.msg);
						$('#check-tips').html(json.msg);
						popTips('#check-tips');
					};
					edit_flag = true;
				}
			}); 
		}
	});	



	$('#add_sub_account').live('click', function(){
		var form_data = {};
		var errors = {'s_gid_name':'请选择游戏', 's_sid_name':'请选择游戏服', 'account':'请输入帐号', 'mpassword':'请输入密码'};
		for(i in errors) {
			form_data[i] = $('#'+i).attr('value');
			if( !form_data[i] ) {
				$('#check-tips').html(errors[i]);
				return false;
			}
		}

		var maps = {'s_gid_name':'gid', 's_sid_name':'sid', 'account':'account', 'mpassword':'password'};
		for(i in maps) {
			form_data[maps[i]] = form_data[i];
		}

		if( window['df_id'] ) form_data['id'] = window['df_id'];
		form_data['tips'] = $('#stips').val();
		if(form_data['tips'].length>6){
			//alert('备注最多可填写6个字哦!');
			$('#check-tips').html('备注最多可填写6个字哦!');
			popTips('#check-tips');
			return false;
		}
		form_data['game_server'] = $("#s_gid_name").text()+'-'+$("#s_sid_name").text();
		form_data['act'] = 'add_sub_account';
		$.ajax({
			url: '/api/sub_account.php',
			type: "POST",
			data: form_data,
			timeout : 60000, //超时时间设置，单位毫秒
			dataType: "json",
			async: false,//异步
			cache:false, 
			beforeSend: function() {
			},
			success: function(json){  
				//if( json.status == 1 || json.status == -5) {
				if( json.status == 1 ){
					document.getElementById("form_register").reset();
					/*
					if( window['df_gid'] ) {
						$('#small-account').trigger('click');
					}
					*/
					$('.small-close').trigger('click');
					$('#small-account').trigger('click');
				}else {
					//alert(json.msg);
					$('#check-tips').html(json.msg);
					popTips('#check-tips');
				};
			}
		}); 
	});

	var del_e = '';
	
$('.small-real-del').live('click', function(){
	sub_type = $('#small-tab ul li.on').index();
	
	if(sub_type == 1){
		del_id = del_e.parent('p').parent('div').data('id');
		if(edit_flag){
			edit_flag = false;
			$.ajax({
				url : '/api/sub_account.php',
				type : "POST",
				data : {
					'act' : 'delete_sub_account',
					'account' : del_e.parent('p').parent('div').data('a'),
					'sub_account' : del_e.parent('p').parent('div').data('sa'),
					'gid' : del_e.parent('p').parent('div').data('g'),
					'sid' : del_e.parent('p').parent('div').data('s')
				},
				timeout : 60000, //超时时间设置，单位毫秒
				dataType: "json",
				async: false,//异步
				cache:false, 
				success: function(json){  
					if( json.status == 1 ) {
						$('.small-close').trigger('click');
						$('#small-account').trigger('click');
					}else{
						//alert(json.msg);
						$('#check-tips').html(json.msg);
						popTips('#check-tips');
					};
					edit_flag = true;
				}
			}); 
		}
	}else{
		var current_item = del_e;
		var parent_div = current_item.parent();
		var sa = parent_div.attr('sa');
		var gid = parent_div.attr('gid');
		var sid = parent_div.attr('sid');

		if( sa && gid && sid ) {
			
			$.ajax({
				url: '/api/sub_account.php',
				type: "POST",
				data: {
					'act':'delete_sub_account',
					'sub_account':sa,
					'gid':gid,
					'sid':sid
				},
				timeout : 60000, //超时时间设置，单位毫秒
				dataType: "json",
				async: false,//异步
				cache:false, 
				success: function(json){  
					if( json.status == 1 ) {
						//parent_div.parent().remove();
						$('.small-close').trigger('click');
						$('#small-account').trigger('click');
					}else{
						//alert(json.msg);
						$('#check-tips').html(json.msg);
						popTips('#check-tips');
					};
				}
			}); 
		}
	}
	
	
});


	$('.small-canel-del').live('click', function(){
		$('#small-tips').hide();
	});

	$('.tips-close').live('click', function(){
		$('#small-tips').hide();
	});

	
	$('.delete-btn').live('click', function(){
		del_e = $(this);
		popSelect('#small-tips');
	});

	$('.edit-btn').live('click', function(){
		var vid = $(this).attr('vid');
		if( vid ) {
			
			$.getJSON(C9377.app_url+'/api/sub_account.php?act=get_account_item&id='+vid+'&callback=?', function(json){
				if( json.id ) {
					window['df_gid'] = json.gid;
					window['df_sid'] = json.sid;
					window['df_id'] = json.id;

					$('#add-small-account').trigger('click');
					$('#s_gid').trigger('change');
					$('#account').val(json.sub_account);
					$('#mpassword').val('');
					json.data.tips && $('#stips').val(json.data.tips);
					$('#add_sub_account').html('修改小号');
				}else {
					alert('网络繁忙，请稍候重试。');
				}
				
			});
		}
	});

})();