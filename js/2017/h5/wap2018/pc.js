// h5.9377.com PC显示模块功能
var PSder = {
	init : function(){
		window.addEventListener('message', function(e){
			try {
				var json = $.parseJSON(e.data);
				if('synUser' == json.event){
					C9377.synUser = json;
					// 进入游戏时自动全屏
					$('#fullsrc').removeClass('none');
					setTimeout(function(){$('#fullsrc').click(); }, 500);
					C9377.gid = json.gid;
					getGameQR();
				}
			} catch(e) {
				console.log(e);
			}
		}, false);
		
		if (!C9377.ujson) {
			setTimeout(PSder.setUpanel, 500);
		}

		$('.ps-fun-tab li').click(function() {
			var i = $(this).index();
			$(this).addClass('active').siblings().removeClass('active');
			$('.ps-fun-wrap .ps-fun-box').hide().eq(i).show();
		});
	},
	setUpanel : function(){
		if (getCookie('login_name') && C9377.ujson && C9377.ujson != 'nologin') {
			getUserJson(); // 设置页面登录信息
		}
	},
	open : function(){
		$('.mask, .pc-sidebar').show();
		// 请求礼包列表
		if (!C9377.Xclist) {
			PSder.getXcardList(C9377.synUser.gid);
		}
	},
	shut : function(){
		$('.mask, .pc-sidebar').hide();
	},
	refresh : function(){
		PSder.shut();
		setTimeout(function(){
			$('#iframe-game').attr('src', C9377.synUser.gameurl);
		}, 300)
	},
	home : function(){
		PSder.shut();
		$('#zoomout').click();
		$('#iframe-game').attr('src', 'http://h5.9377.com/?type=mobile');
	},
	getXcardList : function(gid){
		// 获取指定id礼包列表
		$.getJSON(C9377.app_url+'/api/game_card_json.php?gid='+gid+'&callback=?', function(json, textStatus) {
			var tpl = '';
			if (json.msg == '暂无礼包') {
				tpl = '<li style="text-align:center; line-height:96px;">暂无礼包</li>';
			}else{
				var list = json.msg.list;
				for(var i in list){
					tpl += '<li> <img src="/images/2017/h5/icon/'+json.msg.game.ALIAS+'.png" width="66"> <div class="info"> <h3>'+list[i].name+'</h3> <div class="desc">'+list[i].description+'</div> </div> <a href="javascript:;" class="btn-get btn-more">查看礼包</a> <a href="javascript:;" cid="'+list[i].id+'" sign="'+list[i].sign+'" class="btn-get btn-getcard none">领取</a> <div class="desc-more none"> '+list[i].description+' </div> </li>';
				}
			}
			$('#ps-fun-card .item-list').html(tpl);
			$('.btn-more').click(function() {
				$(this).hide().siblings('.desc-more, .btn-getcard').show();
			});
			$('.btn-getcard').click(function() {
				var cid = $(this).attr('cid'),
					txt = $(this).siblings('.desc-more').html();
				PSder.getXcard(cid, txt);
			});
			C9377.Xclist = true;
		});
	},
	enterGame : function(gid){
		PSder.shut();
		$('#zoomout').click();
		$('#iframe-game').attr('src', C9377.app_url+'/game_login.php?gid='+gid+'&sid=1');
	},
	getXcard : function(cid, txt){
		$.getJSON(C9377.app_url+'/game_card.php?card_type='+cid+'&gid='+C9377.gid+'&sign=1&callback=?', function(json){
			if (json.status == 1) {
				PSder.cardDialog(json.msg, txt);
				C9377.include_once(C9377.resource+'/js/plugin/clipboard.min.js?2018', function(){

					var clipboard = new ClipboardJS('.ps-copy');
					clipboard.on('success', function(e) {e.trigger.innerHTML = '复制成功'; });
					clipboard.on('error', function(e) {e.trigger.innerHTML = '复制失败'; });

				});
			}else if(json.status == -12){
				PSder.dialog(json.msg); // 绑定手机
			}else{
				PSder.dialog(json.msg);
			}
		}); 
	},
	cardDialog : function(cid, txt, callback){
		var html = '<div class="mask ps-mask ps-mask-card" id="dialog"> <div class="dialog-box"> <i class="dialog-close">x</i> <p class="title"><i class="i-suc"></i>领取成功</p> <div class="info"> '+txt+' </div> <div class="opts"> <div class="box-cid" id="box-cid">'+cid+'</div> <a href="javascript:;" class="btn ps-copy" data-clipboard-action="copy" data-clipboard-target="#box-cid">复制礼包码</a> </div> </div> </div>';
		$('body').append(html);

		$('#dialog .dialog-close').click(function(){
			$('#dialog').remove();
		});
		if (callback) {
			callback();
		}
	},
	confirmDialog : function(obj){
		var params = {
				txt: obj.txt || null,
				oklabel: obj.oklabel || '确定',
				cancelable: obj.cancelable || '取消',
				okcallback: obj.okcallback || null,
				cancelcallback: obj.cancelcallback || null
			}
		var html = '<div class="mask ps-mask" id="confirmDialog"> <div class="dialog-box"> <p class="title">提示信息</p> <div class="info"> '+params.txt+' </div> <div class="flex opt"> <a href="javascript:;" class="flex-list ok" data-opt="ok">'+params.oklabel+'</a><a href="javascript:;" class="flex-list cancel" data-opt="cancel">关闭</a> </div> </div> </div>';

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
	dialog : function(txt, callback, tit){
		var xtit = tit ? tit : '提示信息';
		var html = '<div class="mask ps-mask" id="dialog"> <div class="dialog-box"> <p class="title">'+xtit+'</p> <div class="info"> '+txt+' </div> <div class="flex opt"><a href="javascript:;" class="flex-list cancel">确定</a></div> </div> </div>';
		$('body').append(html);
		$('#dialog .cancel').click(function(){
			$('#dialog').remove();
		});
		if (callback) {
			callback();
		}
	}
}
PSder.init();