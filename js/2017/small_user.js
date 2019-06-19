(function(){
	// 绑定小号
	var s_option = '';
	$('#add-small-account').live('click', function(){
		$('#add_sub_account').html('添加小号');
		// s_option = '<option value="">请选择服</option>';
		$.getJSON(C9377.app_url+'/api/date_game_json.php?callback=?', function(ret){
			var g_option = '<option value="">请选择游戏</option>';
			for(i in ret){
				selected  = ret[i].ID == window['df_gid'] ? 'selected' : '';
				g_option += '<option value='+ret[i].ID+' '+selected+'>'+ret[i].NAME+'</option>';
			}
			$('#s_gid').html(g_option);
		});
		// $('#s_sid').html(s_option);
		popSelect('#reg-samll-user');
	});

	$('#s_gid').live('change', function(){
		var s_gid = $('#s_gid').val() || window['df_gid'];
		if( s_gid ) {
			s_option = '<option value="">请选择服</option>';
			$.getJSON(C9377.app_url+'/api/game_server_jsonp.php?reverse=1&gid='+s_gid+'&callback=?', function(ret){
				for(i in ret){
					selected  = ret[i].SID == window['df_sid'] ? 'selected' : '';
					s_option += '<option value='+ret[i].SID+' '+selected+'>'+ret[i].NAME+'</option>';
				}
				$('#s_sid').html(s_option);
			});
		}
	});
	$('#small-account').live('click', function(){
		window['df_gid'] = window['df_sid'] = window['df_id'] = '';
		if($('#after-log').hasClass('none') ) {
			$.getJSON(C9377.app_url+'/api/sub_account.php?act=get_sub_account&callback=?', function(ret){
				var html = '';
				var tips = '';
				if( ret ) {
					for(i in ret) {
						tips = ret[i].data.tips ? ret[i].sub_account+'('+ret[i].data.tips+')' : ret[i].sub_account;
						html += '<div class="game-item">';
						html += '<p class="game-zone"><a href="'+ret[i].game_url+'" target="_blank">'+ret[i].data.game_server+'</a></p>';
						html += '<p class="game-samll" sa="'+ret[i].sub_account+'" gid="'+ret[i].gid+'" sid="'+ret[i].sid+'">';
						html += '<span class="game-con" title="'+tips+'">'+tips+'</span>';
						html += '<a href="javascript:;" class="delete-btn" title="删除">删除</a>';
						html += '<a href="javascript:;" class="edit-btn" title="编辑" vid="'+ret[i].id+'">编辑</a></p>';
						html += '<p class="game-operate"><a href="'+ret[i].game_url+'" target="_blank">进入游戏</a></p></div>';
					}
				}

				if( !html ) html = '<div class="small-notice red-no">暂无绑定小号</div>';

				$('#small_account_box').html(html);
			});


			popSelect('#after-log');
		}
		
	});

	$('#add_sub_account').live('click', function(){
		var form_data = {};
		var errors = {'s_gid':'请选择游戏', 's_sid':'请选择游戏服', 'account':'请输入帐号', 'mpassword':'请输入密码'};
		for(i in errors) {
			form_data[i] = $('#'+i).val();
			if( !form_data[i] ) {
				alert(errors[i]);
				return false;
			}
		}

		var maps = {'s_gid':'gid', 's_sid':'sid', 'account':'account', 'mpassword':'password'};
		for(i in maps) {
			form_data[maps[i]] = form_data[i];
		}

		if( window['df_id'] ) form_data['id'] = window['df_id'];
		form_data['tips'] = $('#stips').val();
		if(form_data['tips'].length>6){
			alert('备注最多可填写6个字哦!');
			return false;
		}
		form_data['game_server'] = $("#s_gid").find("option:selected").text()+'-'+$("#s_sid").find("option:selected").text();
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
				if( json.status == 1 || json.status == -5) {
					document.getElementById("form_register").reset();
					if( window['df_gid'] ) {
						$('#small-account').trigger('click');
					}
					$('#small-account').trigger('click');
				}
				if (json.status != 1) {
					alert(json.msg);
				};
			}
		}); 
	});

	$('.delete-btn').live('click', function(){
		var current_item = $(this);
		var parent_div = current_item.parent();
		var sa = parent_div.attr('sa');
		var gid = parent_div.attr('gid');
		var sid = parent_div.attr('sid');

		if( sa && gid && sid && confirm('确定要删除小号？') ) {
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
						parent_div.parent().remove();
					}else{
						alert(json.msg);
					};
				}
			}); 
		}
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