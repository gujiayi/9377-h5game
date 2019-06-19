// 2017平台礼包

// 首页
if($('#hotgift-list').length){
	$('#hotgift-list').slideBox({mode: 'show',autoPlay:false})
}
if ($('#filter-scroll').length) {
	$('#filter-scroll').niceScroll({cursorcolor: "#f2f2f2", cursoropacitymax: 1, cursorwidth: "5px", cursorborderradius: "5px", cursorborder:0, autohidemode: false, zindex:"2"});
}

// 首页
	// 数据变量
	var serarcData = {}, //搜索数据
		filterData = {}, //过滤过的数据
		filterParam = {}; //过滤筛选记录

	if ($('#gift-recom').length) {
		// 幻灯大小图切换
		function toggleKvImg(){
			var ww = $(window).width();
			if (ww < 1200) {
				$('#gift-recom .simg').each(function() {
					if ($(this).attr('_src')) {
						$(this).attr('src', $(this).attr('_src')).removeAttr('_src');
					}
					$(this).show().siblings('.bimg').hide();
				});
			}else{
				$('#gift-recom .simg').each(function() {
					$(this).hide().siblings('.bimg').show();
				});
			}
		}
		$(window).resize(function(){
			C9377.scrWidth = $(window).width(); //页面尺寸变化，重新获取width
			if (C9377.scrWidth >= 1200) {
				C9377.num = 16;
			}else{
				C9377.num = 12;
			}
			
			toggleKvImg(); // 推荐礼包
			loadGiftList(); // 加载游戏礼包

		}).trigger('resize');
	}

	// 分页操作
	$('.mod-pages .pagex').live('click',function() {
		if ($(this).hasClass('on')) { return false;}
		var pid = $(this).attr('pid');
		if (!pid || pid == 0) { return false; }
		var param = {
			'num' : C9377.num,
			'p' : pid
		}
		$.getJSON('/gift/index.php', param, function(result) {
			$('.hotgame-list .bd').html(result.html);
		});
		return false;
	});

	// 加载礼包
	function loadGiftList(){
		var param = {
			'num' : C9377.num,
			'p' : 1
		}
		if (filterData[C9377.num]) {
			$('.hotgame-list .bd').html(filterData[C9377.num].html);
		}else{
			filterData[C9377.num] = 1; //强制填充数据，避免重复请求；
			$.getJSON('/gift/index.php', param, function(result) {
				filterData[C9377.num] = result;
				$('.hotgame-list .bd').html(result.html);
			});
		}
	}

	function giftSearch(_form){
		var _form = $(_form),
			key = _form.find('.key'),
			vkey = key.val();
		
		var param = {
			'q' : vkey
		}
		if (serarcData[vkey]) {
			$('.hotgame-list .bd').html(serarcData[vkey].html)
		}else{
			$.post('/gift/index.php', param, function(result) {
				serarcData[vkey] = result;
				$('.hotgame-list .bd').html(result.html)
			},'json');
		}
		return false;
	}
// 详情页
	// 领取礼包
	// 需要加区服才能领取礼包的游戏
	var needSerCardList = ['3019', '1927', '103', '2041', '961', '3340', '3784'];
	var card_type;
	$('.btn-get').click(function() {
		var sign = $(this).attr('sign');
		card_type = $(this).attr('card_type');
		if( !sign ) {
			window.location.href = C9377.app_url +'/login.php';
			return;
		}else {
			// 如果礼包需要填写区服领取，弹窗选区窗口
			if ($.inArray(card_type, needSerCardList) > -1) {
				$.getJSON('/api/user_recent_game_jsonp.php?game_id='+cardGid, function(json){
					var last_ser_txt = '', ser_select = '<option value="0">请选择区服</option>';
					if (json) {
						last_ser_txt += '最近玩过：';
						for(var i in json){
							if (i > 1) { break;}
							last_ser_txt += '<a href="javascript:;" sid="'+json[i].sid+'" class="">'+json[i].name+'</a>';
						}
					}else{
						last_ser_txt = '请选择区服';
					}
					$.getJSON('/api/game_server_jsonp.php?alias='+cardAlias+'&reverse=1', function(json){
						if (json) {
							for(var i in json){
								ser_select += '<option value='+json[i].ID+' sid='+json[i].SID+'>'+json[i].NAME+'</option>';
							}
							var tpl = '<div class="ser-select-bd"> <p class="ser-lastplay">'+last_ser_txt+'</p> <div class="w-item"> <select id="sid-select" class="w-select">'+ser_select+'</select> </div> </div> <a href="javascript:;" class="pop-button pop-button-green btn-getSerCard">确定</a>';
							popTips(tpl,1, '领取礼包');
						}
					});
				});
			}else{
				getGiftCard(card_type, sign);
			}
		}
	});

	$('.ser-lastplay a').live('click', function(){
		$(this).addClass('active').siblings().removeClass('active');
		var sid = $(this).attr('sid');
		$('#sid-select option[sid='+sid+']').attr('selected','selected');
	});
	$('#sid-select').live('change', function() {
		$('.ser-lastplay a').removeClass('active');
	});
	$('.btn-getSerCard').live('click', function(){
		var sid = $('#sid-select').val();
		if (sid && sid != 0) {
			getGiftCard(card_type, '', sid);
		}else{
			alert('请选择要领取的区服！');
		}
	})
	// 领取礼包
	function getGiftCard(cid, sign, sid){
		if (sid) {
			var url = '/getcard_content_data.php',
				param = {
					'game' : cardAlias,
					'cardType' : cid,
					'serverid' : sid
				}
			$.post(url, param, function(json) {
				if( json === ' 很抱歉，该类卡已领完了！' ) {
					popTips(json);
				}else {
					var tpl = '<div class="bd-txt"> <p>礼包码：'+json+'</p> </div> <a href="javascript:;" class="pop-button pop-button-green btn-copy">复制</a>';
					popTips(tpl,1, '领取礼包');
					setCopyTxt('.btn-copy', json, function(txt){
						var tpl = '<div class="bd-txt"> <p>'+txt+'</p> </div> <a href="javascript:;" class="pop-button pop-button-green w-pop-close">确定</a>';
						popTips(tpl,1);
					});
				}
			});
		}else{
			var url = '/api/get_new_card.php',
				param = {
					'card_type' : cid,
					'sign' : sign
				}
			$.getJSON(url, param, function(json){
				if( json.status != 1 ) {
					popTips(json.msg);
				}else {
					var tpl = '<div class="bd-txt"> <p>礼包码：'+json.msg+'</p> </div> <a href="javascript:;" class="pop-button pop-button-green btn-copy">复制</a>';
					popTips(tpl,1, '领取礼包');
					setCopyTxt('.btn-copy', json.msg, function(txt){
						var tpl = '<div class="bd-txt"> <p>'+txt+'</p> </div> <a href="javascript:;" class="pop-button pop-button-green w-pop-close">确定</a>';
						popTips(tpl,1);
					});
				}
			});
		}
	}

// 礼包记录
	// 筛选下拉
	$('.gift-type-list').hover(function(){
		$(this).find('ul').toggle()
	});
	// 领取礼包
	$('.gift-record-item .btn-get').each(function(){
		var cid = $(this).attr('cid');
		setCopyTxt(this, cid, function(txt){
			var tpl = '<div class="bd-txt"> <p>'+txt+'</p> </div><a href="javascript:;" class="pop-button pop-button-green w-pop-close">确定</a> ';
			popTips(tpl,1, '领取礼包');
		});
	});
	
	if ($('.gift-type-filter').length) {
		// 设置页面最小高度
		function setPageHeight(){
			var h = $(window).height(),
				th = $('.header').outerHeight(),
				fh = $('.footer').outerHeight(),
				vh = h - th - fh - 53 - 50 - 10;
			$('.gift-main .mod').eq(0).css('min-height',vh+'px');
		}
		$(window).resize(function(){
			setPageHeight();
		}).trigger('resize');
	}



function setCopyTxt(elem, code, cb){
	var clip = new ZeroClipboard.Client();
	var w = $(elem).innerWidth();
	var h = $(elem).innerHeight();
	$(elem).append(clip.getHTML(w,h));
	clip.setText(code);
	clip.addEventListener('onComplete', function(){
		var tip = tip ? tip : '复制成功！请在游戏中用ctrl+v进行粘贴。';
		if(cb){
			cb(tip);
		}else{
			alert(tip);
		}
		return false;
	});
}