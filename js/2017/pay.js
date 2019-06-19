/**
 * @WebSite   :http://wvw.9377.com/pay_index.php
 * @DateTime  :2017-11-06 10:57:27
 * 平台充值 2017
**/
	var CSPay = {
		init : function(){
			CSPay.sideFun();
			CSPay.unameFun();
			CSPay.paytypeFun();
			CSPay.selectRole();
			CSPay.selectMoney();
			CSPay.loadUrlParam();
			CSPay.payforFun();
		},
		getUserCdt : function(uname, callback){
			// 获取帐号充值条件是否达标
			$.ajax({
				'url': C9377.app_url+'/api/user_info_jsonp.php?user_name='+uname,
				'type': 'GET',
				'dataType': 'json',
				'async': false,
				'cache': false,
				success: function(json){
					C9377.userInfoJson = json;
					if (callback) {
						callback();
					}
				}
			});
		},
		loadUrlParam : function(){
			var logstatus = getCookie('login_name');
			if (payParam.pid) {
				$('.pay-list .item-'+payParam.pid).click();
			}
			var urlgid = $_GET['gid'] ? $_GET['gid'] : ( $_GET['game'] ? 'isalias' : '');

			if (urlgid == 'isalias') {
				var xgame = $.trim($_GET['game']);
				for(var i in games_pay_list){
					if (games_pay_list[i].ALIAS == xgame) {
						urlgid = i;
						break;
					}
				}
			}

			if (urlgid) {
				if (urlgid == 118) {
					$('.pay-for-platform').click();
				}else{
					if ($_GET['server']) {
						$('.gid-'+urlgid).click();
						$('.select-wp .close').click();
						payParam.server = default_server ? default_server.SID : 0;
						if (payParam.server) {
							$('.j-select-serv').html(default_server.SERVER_NAME);
							CSPay.check_game_user(payParam.uname);
						}
					}else{
						$('.gid-'+urlgid).click();
					}
				}
			}
			// 设置页面高度
			var win_h = $(window).height(), body_h = $('body').height();
			var hd_h = $('.pay-header').outerHeight(true), ft_h = $('.footer').height(), fix_h = win_h - hd_h - ft_h - (12*2);
			$('.pay-right').css('min-height', fix_h);
		},
		sideFun : function(){
			// 侧边切换
			$('.pay-list li').click(function() {
				var i = $(this).index(), a = $(this).find('a'), pid = a.attr('pid'), name = a.find('span').text();
				$('.pay-list a').removeClass('active');
				a.addClass('active');
				payParam.pid = pid;
				payParam.money = payParam.money2 = 0;
				// 右侧联调
				$('.order-tit').attr('class','order-tit o-tit-'+pid).html('<i></i>'+name);
				$('.other-money').val('');
				if (pid == 4) {
					// 人工充值
					$('.o-table').hide();
					$('.o-rgpay').show();
				}else{
					$('.o-rgpay').hide();
					$('.o-table').show();
					if (pid == 16) {
						$('#tr-pay-for').hide();
						$('.pay-for-game').click();
					}else{
						$('#tr-pay-for').show();
					}
					// 设置可充值金额选项
					var paobj = pay_array[pid];
					if (paobj && paobj['amount_list']) {
						var html = '', 
							palobj = paobj['amount_list'], 
							len = palobj.length,
							def = paobj['default'],
							unit = pid == 16 ? '游戏币' : '元';
						for(var i = 0; i < len; i++){
							html += '<a href="javascript:;" mid="'+palobj[i]+'" class="money-item"> '+palobj[i]+unit+' <i></i></a>';
						}
						$('.pay-money-list').html(html);
						if (def) {
							$('.money-item[mid='+def+']').click();
							payParam.money = def;
						}
						if (paobj.inputable == "0") {
							$('.other-money-wp').hide();
						}else{
							$('.other-money-wp').show();
						}
					}
					CSPay.getGameCoin();
				}

				$('#tip-wp .tip-box').hide();
				$('#tip-wp .tip-'+payParam.pid).show();
			});
		},
		unameFun : function(){
			// 充值帐号
			$('.btn-edit').click(function() {
				payParam.uname = '';
				$('.name-confirm').hide();
				$('.name-fill').show();
				$('#uname2').focus();
			});
			$('#uname2').blur(function() {
				$('.btn-confirm').click();
			});
			$('.btn-confirm').click(function(){
				var username = $('#uname2').val();
				var gid = payParam.gid;
				var sid = payParam.server;
				if (username.length < 4) { CSPay.popTips('请输入您要充值的帐号。'); return false;}
				CSPay.check_game_user(username);
				$('.name-confirm').show();
				$('#pay-account').html(username);
				$('.name-fill').hide();
				payParam.uname = username;
			});
		},
		check_game_user : function(username) {
			var ret = false;
			if( username ) {
				$.ajax({
					url: C9377.app_url+'/api/check_game_user.php',
					type: 'GET',
					dataType: 'json',
					async: false,
					cache: false,
					data: {
						gid: payParam.gid,
						server: payParam.server,
						username: username,
						_ajax:1,
						json: 1
					},
					beforeSend: function(){
						$('#tr-select-type .role-status').html('<i></i>角色查询中').attr('class','role-status role-status-load');
					},
					success: function(data){
						if( data == true ) {
							$('#tr-select-type .role-status').html('<i></i>').attr('class','role-status role-status-ok');
							ret = true;
						}else{
							$('#tr-select-type .role-status').html('<i></i>无角色').attr('class','role-status role-status-ng');
							CSPay.emptyRole();
						}
					}
				});
			}else{
				$('#uname2').focus();
			}
			return ret;
		},
		payforFun : function(){
			// 充值到
			var tmp_gid = payParam.gid, tmp_server = payParam.server;
			$('.pay-for').click(function() {
				if (payParam.gid != 118) {
					tmp_gid = payParam.gid;
					tmp_server = payParam.server;
					tmp_money = payParam.money ? payParam.money : payParam.money2;
				}

				$(this).addClass('active').siblings().removeClass('active');
				var pay_to = $(this).attr('pid');
				if (pay_to == 1) {
					payParam.gid = 118;
					payParam.server = 1;
					payParam.pay_to = 1;
					$('.pay-for-tip').show();
					$('#tr-select-type, #tr-select-role').hide();
					CSPay.getGameCoin();
					$('div[id^="ascrail"]').remove();
				}else{
					if (tmp_gid) {payParam.gid = tmp_gid; }else{payParam.gid = 0; }
					if (tmp_server) {payParam.server = tmp_server; }else{payParam.server = 0; }
					if (tmp_money) {CSPay.getGameCoin(); }
					$('.pay-for-tip').hide();
					$('#tr-select-type').show();
					if (games_pay_list[payParam.gid] && games_pay_list[payParam.gid].CONFIG.pay_role) {$('#tr-select-role').show(); }
				}
			});
		},
		paytypeFun : function(){
			// 选择游戏 x 选择区服
			$('.j-select-game').click(function() {
				$('.select-game-wp').show();
				$('.select-serv-wp').hide();
				// 判断是否有最近玩过的游戏
				if (last_game_data && last_game_data.length != 0) {
					$('.select-game-wp .hd li').eq(0).click();
				}else{
					$('.select-game-wp .hd li').eq(1).click();
				}
			});
			$('.j-select-serv').click(function() {
				if(payParam.gid && payParam.gid != 0){
					$('.gid-'+payParam.gid).click();
				}else{
					$('.select-game-wp').show();
				}
			});
			$('.select-wp .close').click(function() {
				$(this).parent().hide();
				$('div[id^="ascrail"]').remove();
			})
			$('.select-game-wp .hd li').live('click',function() {
				var i = $(this).index(), obj = $('.select-game-wp .bd .select-box');
				$(this).addClass('active').siblings().removeClass('active');
				obj.hide().eq(i).show();
				$('div[id^="ascrail"]').remove();
				if (!$.browser.msie || ($.browser.msie == true && parseInt($.browser.version) >= 9)) {
					obj.eq(i).niceScroll({
						cursorcolor: "#CACACA",
						cursoropacitymax: 1,
						cursorwidth: "6px",
						cursorborder: "0",
						cursorborderradius: "5px",
						zindex: 90
					});	
				}
			});

			$('.gid-item').click(function(event){
				var gid = $(this).attr('gid'), ali = $(this).attr('ali'), max = $(this).attr('max');
				if( gid > 0) {
					payParam.gid = gid;
					payParam.server = 0;
					$('.gid-item').removeClass('active');
					$(this).addClass('active');
					$('.j-select-game').html($(this).html());
					$('.j-select-serv').html('选择充值区服');
					CSPay.getGameCoin();
					var hasrole = games_pay_list[gid].CONFIG.pay_role
					if (hasrole) {
						$('#tr-select-role').show();
					}else{
						$('#tr-select-role').hide();
					}

					CSPay.emptyRole();
					$('#tr-select-type .role-status').html('').attr('class','role-status');
					$('#search-sers-id').attr('ali',ali).val('');
				}
				CSPay.getGameSerList(gid, max);
				$('.select-game-wp').hide();
				$('.select-serv-wp').show();
			});

			//选服
			$('.sid-item').live('click',function(event){
				var sid = $(this).attr('sid');
				if( sid > 0 ) {
					payParam.server = sid;
					$('.sid-item').removeClass('active');
					$(this).addClass('active');
					CSPay.check_game_user(payParam.uname);
					$('.j-select-serv').html($(this).html());
					$('.select-serv-wp .close').click();
					event.preventDefault();
				}
				CSPay.emptyRole();
			});
			// 搜索服
			var searchdelay;
			$('#search-sers-id').keyup(function(){
				clearTimeout(searchdelay);
				searchdelay = setTimeout(function(){
					var key = $('#search-sers-id').val(), ali = $('#search-sers-id').attr('ali');
					key && getSearchData(ali, key);
				},300);
			});
			$('.btn-search').click(function() {
				$('#search-sers-id').keyup();
			});
			function getSearchData (ali,key,index) {
				if (serverData[payParam.gid].searchdata && serverData[payParam.gid].searchdata[key]) {
					// 如果已经请求过数据
					$('.select-serv-wp .bd').html('<div class="select-box servers-box">'+serverData[payParam.gid].searchdata[key]+'</div>')
				}else{
					var search_data = {
						game : ali,
						is_ajax : 1,
						page : index ? index : 1,
						q : key
					}
					$.ajax({
						url : C9377.app_url+'/client/yxdt/game_box.php',
						data : search_data,
						type : 'GET',
						dataType : 'json',
						success : function(json){
							var server = {
								data : json.data,
								len : json.data.length,
								tpl : ''
							}
							for(var i = 0; i < server.len; i++){
								server.tpl += '<a href="javascript:;" sid="'+server.data[i].SID+'" class="sid-item sid-'+server.data[i].SID+'">'+server.data[i].SERVER_NAME+'</a>'
							}
							if (!serverData[payParam.gid].searchdata) {
								serverData[payParam.gid].searchdata = []
								serverData[payParam.gid].searchdata[key] = new Array();
							};
							server.tpl = server.tpl != '' ? server.tpl : '<span class="noserver">区服不存在</span>'; //没数据也存起来，防止空数据时重复请求
							serverData[payParam.gid].searchdata[key] = server.tpl;
							$('.select-serv-wp .bd').html('<div class="select-box servers-box">'+server.tpl+'</div>')
							CSPay.delscl();
						}
					});  
				}
			}
		},
		getGameSerList : function(gid, max){
			// 获取最近玩过
			if (serverData[gid] && serverData[gid].last) {
				setSerTab();
			}else{
				var url = C9377.app_url+'/api/user_recent_game_jsonp.php?callback=?&game_id='+gid;
				$.ajax({
					url: url,
					type: 'GET',
					dataType: 'json',
					async: false, //同步，方便下面选择栏目判断
					success: function(json){
						if (!serverData[gid]) {
							serverData[gid] = {};
							json = json ? json : 'empty'; //如果没最近玩过，保存empty字符
							serverData[gid]['last'] = json;
						}
						setSerTab();
					}
				});
			}
			function setSerTab(){
				// 获取游戏列表
				var count = max, // 区服总数
					per = 3,	// 一个几页
					num = 20, //每页个数
					page_range = '<li onClick="CSPay.loadServer(0,'+gid+')">最近玩过</li>', //区间数据
					part = games_pay_list[gid].PART_NEW_SERVER; //地区服
					if (count <= 20) {
						per = 1;
						num = 20;
					}else if(count <= 40){
						per = 2;
						num = 20;
					}else{
						per = 3;
						num = Math.ceil(count/per);
					}
				$('.select-serv-wp .hdmenu').remove();
				if (part) {
					var ind = 0;
					for(var i in part){
						ind++;
						page_range += '<li onClick="CSPay.loadServer('+ind+','+gid+',1,999999,\''+i+'\')">'+i+'</li>'
					}
					page_range = '<div class="hdmenu"><ul style="width:'+85*(ind+1)+'px">'+page_range+'</ul></div>';
					$('.select-serv-wp .hd').prepend(page_range);
					if (ind > 3) {
						if ($.browser.version != '6.0') {
							$('.select-serv-wp .hdmenu').niceScroll({
								cursorcolor: "#d1d1d1",
								cursoropacitymax: 1,
								touchbehavior: 0,
								cursorwidth: "6px",
								cursorborder: 0,
								cursorborderradius: "6px",
								zindex: 95,
								autohidemode: 0
							});
						}
					}
				}else{
					for(var i = per-1; i >= 0; i--){
						var first = i*num+1, last = num*(i+1) > count ? count : num*(i+1);
						page_range += '<li onClick="CSPay.loadServer('+(per-i)+','+gid+','+first+','+last+')">'+first+'-'+last+'</li>'
					}
					page_range = '<div class="hdmenu"><ul style="width:390px">'+page_range+'</ul></div>';
					$('.select-serv-wp .hd').prepend(page_range);
				}
				// 如果有最近玩过，显示最近栏，否则
				if (serverData[gid] && serverData[gid]['last'] && serverData[gid]['last'] != 'empty') {
					CSPay.loadServer(0,gid);
				}else{
					$('.select-serv-wp .hd li').eq(1).click();
				}
			}
		},
		loadServer : function(ind,gid,min,max,part){
			$('.select-serv-wp .hd li').removeClass('active').eq(ind).addClass('active');
			if (!min && !max) {
				// 没有min，max参数时是格式化最近玩过
				var html = '',
					obj = serverData[gid] ? (serverData[gid]['last'] != 'empty' ? serverData[gid]['last'] : '') : '',
					len = obj != '' ? obj.length : 0;
				if (len < 1) {
					if (getCookie('login_name')) {
						html = '<span class="noserver">没有最近玩过的区服</span>'
					}else{
						html = '<span class="noserver">登录后可查看最近玩过的游戏及区服</span>'
					}
				}else {
					for(var i = 0; i < len; i++){
						html += '<a href="javascript:;" sid="'+obj[i].sid+'" class="sid-item sid-'+obj[i].sid+'">'+obj[i].name+'</a>'
					}
				}
				setSerBox(html);
			}else{
				var sdata = '';
				var part = part ? part : '';

				if (serverData[gid] && serverData[gid][min+'_'+max+'_'+part]) {
					sdata = serverData[gid][min+'_'+max+'_'+part];

					var html = '', len = sdata.length;
					for(var i = 0; i < len; i++){
						html += '<a href="javascript:;" sid="'+sdata[i].SID+'" class="sid-item sid-'+sdata[i].SID+'">'+sdata[i].NAME+'</a>'
					}
					setSerBox(html);
				}else {
					var xpart = part ? '&part='+ encodeURIComponent(part) : '';
					var url = C9377.app_url+'/api/game_server_jsonp.php?gid='+gid+'&from='+ min +'&to='+ max +'&reverse=1&opened=1'+xpart+'&callback=?';
					$.ajax({
						url: url,
						type: 'GET',
						dataType: 'json',
						async: true,
						success: function(json){
							serverData[gid] = serverData[gid] ? serverData[gid] : gid;
							serverData[gid][min+'_'+max+'_'+part] = json;

							var html = '', len = json.length;
							for(var i = 0; i < len; i++){
								html += '<a href="javascript:;" sid="'+json[i].SID+'" class="sid-item sid-'+json[i].SID+'">'+json[i].NAME+'</a>'
							}
							setSerBox(html);
						}
					});
				}
			}
			function setSerBox(html){
				CSPay.delscl();
				$('.select-serv-wp .bd').html('<div class="select-box servers-box">'+html+'</div>');
				if (!$.browser.msie || ($.browser.msie == true && parseInt($.browser.version) >= 9)) {
				// if ($.browser.version != '6.0') {
					$('.select-serv-wp .bd .servers-box').niceScroll({
						cursorcolor: "#d1d1d1",
						cursoropacitymax: 1,
						touchbehavior: 0,
						cursorwidth: "6px",
						cursorborder: 0,
						cursorborderradius: "6px",
						zindex: 90,
						autohidemode: 0
					});
				}
			}
		},
		delscl: function(){
			$('div[id^="ascrail"]').each(function(index, el) {
				var zid = $(this).css('z-index');
				if (zid != 97) {$(this).remove(); }
				// 切换区服时，不删除菜单滚动条
			});
		},
		selectRole : function(){
			// 游戏角色
			$('.j-select-role').click(function() {
				$('#role-list').toggle();
			});
			$('#role-list li').live('click',function(){
				var role = $(this).html();
				$('.j-select-role').html(role);
				$('#role-list').toggle();
				payParam.role = role;
			});
		},
		getRole : function(ele){
			if(!payParam.server){
				CSPay.popTips('请先选择服');
				$('.j-select-serv').click();
				return;
			}
			
			$.ajax({
				url: C9377.app_url+'/api/get_role_data.php',
				cache: false,
				dataType: 'json',
				data: {
					'username': payParam.uname,
					'gid': payParam.gid,
					'server_id': payParam.server
				},
				beforeSend: function(){
					$(ele).val('正在获取').attr('disabled', true);
					$('#tr-select-role .role-status').html('<i></i>角色查询中').attr('class','role-status role-status-load');
				},
				success: function(json){
					$(ele).val('获取角色').attr('disabled', false);
					if(!json.data){$('#tr-select-role .role-status').html('<i></i>无角色').attr('class','role-status role-status-ng'); return; }
					var list = '', len = '';
					for(var i in json.data){
						list += '<li>'+json.data[i]+'</li>';
						len++;
					}
					$('#role-list').html(list);
					if (len == 1) {$('#role-list li').eq(0).click(); }
					$('#tr-select-role .role-status').html('<i></i>').attr('class','role-status role-status-ok');
					$('.j-select-role').click();
				}
			});
		},
		emptyRole : function(){
			$('.j-select-role').html('请选择角色名');
			$('#role-list').hide().empty();
			$('#tr-select-role .role-status').attr('class','role-status').empty();
			payParam.role = '';
		},
		selectMoney : function(){
			// 选择金额
			$('.pay-money-list .money-item').live('click', function() {
				$(this).addClass('active').siblings().removeClass('active');
				var mid = $(this).attr('mid');
				payParam.money = mid;
				$('.other-money').val('');
				CSPay.getGameCoin();
			});
			$('.other-money').keyup(function() {
				$(this).val($(this).val().replace(/[^0-9]/g, ''))
				CSPay.getGameCoin();
			});
		},
		getGameCoin : function(){
			// 设置兑换比例
			var a = 0,//渠道radio
				b = 0,//游戏radio
				c = 0,//总radio
				d = 0,//获得的资源
				ybname = '元宝';
			if(payParam.pid){
				a = pay_array[payParam.pid].ratio / 10
			}
			if(payParam.gid != 0){
				b = games_pay_list[payParam.gid].COIN_RADIO
				ybname = games_pay_list[payParam.gid].COIN_NAME;
			}
			c = a * b;
			payParam.ratio = c;
			// 充值所得游戏币
			var money = parseInt($('.other-money').val());
			if(!money){
				money = payParam.money;
				$('.other-money-box').removeClass('active');
			}else{
				$('.pay-money-list .money-item').removeClass('active');
				$('.other-money-box').addClass('active');
				payParam.money = 0;
				payParam.money2 = money;
			}
			if(isNaN(money)) money = 0;
			if (!money || !b) {
				$('#user-getcoin').hide();
			}else{
				$('#user-getcoin').css('display','inline-block');
			}
			d = money * c;
			$('#user-getcoin').html('您将获得 <strong class="col1" id="game-coin">'+d+'</strong> '+ybname+' (兑换比例 1:<span id="coin-radio">'+c+'</span>)')
			payParam.game_coin = d;
		},
		confirmOrder : function(){
			if (!payParam.uname) { CSPay.popTips('请填写需要充值的帐号！'); return;}
			if (!parseInt(payParam.gid)) { CSPay.popTips('请选择需要充值的游戏！'); return;}
			if (payParam.gid != 118) {
				if (!parseInt(payParam.server)) { CSPay.popTips('请选择需要充值的区服！'); return;}
				if (games_pay_list[payParam.gid].CONFIG.pay_role && !payParam.role) { CSPay.popTips('请选择需要充值的角色！'); return;}
				if( !CSPay.check_game_user(payParam.uname)) { CSPay.popTips('您所在的区没有角色'); return;}
			}
			if (!payParam.money && !payParam.money2) { CSPay.popTips('请选择需要充值的金额！'); return;}
			if (!payParam.money && payParam.money2 < 5) { CSPay.popTips('至少充值5元！'); return;}

			// 实名认证验证

			CSPay.getUserCdt(payParam.uname); //请求充值用户的充值条件

			if (!C9377.userInfoJson.ID_CARD_NUMBER && C9377.userInfoJson.BIND_CELLPHONE != '1') {
				if (payParam.uname != getCookie('login_name')) {
					// 登录帐号!=充值帐号，并且要充值的帐号没有实名
					var tpl = '<div style="font-size:12px;">按照政府部门关于实名注册的要求，您要充值的账号 <em class="col1">'+payParam.uname+'</em> 在未绑定<em class="col1">有效身份证</em>之前，该账号无法充值，敬请谅解！<div class="tc"><a href="javascript:;" class="pop-button w-pop-close">我知道了</a><a href="javascript:CSPay.toLogin();" class="pop-button pop-button-red">完善资料</a></div></div>'
					CSPay.popTips(tpl);
					$('#login-pop input[name=username]').val(payParam.uname);
				}else{
					// 登录帐号=充值帐号，并且帐号没有实名
					CSPay.popSelect('#ubind-pop');
					$('.ubind-tab li').click(function() {
						$(this).addClass('active').siblings().removeClass('active');
						$('.ubind-wp .ubind-box').hide().eq($(this).index()).show();
					});
					C9377.include_once(C9377.resource+'/js/jquery.validator.js?2018',function(){
						CSPay.bindIDC();
					});
				}
				return;
			}
			// 实名认证验证
			
			var pidname = $('.pay-list .active span').html(),
				paygame = payParam.gid == 118 ? '9377游戏币' : $('.j-select-game').html(),
				paymoney = payParam.money ? payParam.money : payParam.money2,
				payyb = $('#game-coin').html(),
				ybname = games_pay_list[payParam.gid].COIN_NAME,
				credit = paymoney * 10;

			var html = '<li> <label class="x-label">充值账号：</label> <p class="x-p">'+payParam.uname+'</p> </li> <li> <label class="x-label">支付方式：</label> <p class="x-p">'+pidname+'</p> </li> <li> <label class="x-label">充值游戏：</label> <p class="x-p">'+paygame+'</p> </li> <li> <label class="x-label">充值金额：</label> <p class="x-p">'+paymoney+'元</p> </li> <li> <label class="x-label">获得'+ybname+'数量：</label> <p class="x-p">'+payyb+ybname+'</p> </li> <li> <label class="x-label">获得积分数量：</label> <p class="x-p">'+credit+'积分</p> </li>';
			$('#confirm-pop .confirm-list').html(html);
			CSPay.popSelect('#confirm-pop');
		},
		submitOrder : function(){
			$('#confirm-pop, #mask').hide(); //扫码支付的时候，隐藏确认弹窗
			// 提交订单
			var url = C9377.app_url+'/pay/paygourl.php?'+$.param(payParam);
			if (payParam.pid == 16) {
				// 9377游戏币充值，二级密码确认
				CSPay.get9377Coin();
			}else if($.inArray(parseInt(payParam.pid), [32,37,49]) > -1){
				// 扫码支付
				overlay({'opacity':'0.8','backgroundColor':'#000'});
				$('#pay_window').css({width: 480, height: 490}).attr('src',url).show();
				element_to_center($('#pay_window'));
				setTimeout(function(){
					$(document).bind('click', close_window);
				}, 0);
			}else{
				// 跳转支付
				CSPay.fillForm();
				$('#payform').submit();
			}
		},
		fillForm : function(){
			$('input[name="pid"]').val(payParam.pid);
			$('input[name="uname"]').val(payParam.uname);
			$('input[name="pay_to"]').val(payParam.pay_to);
			$('input[name="money"]').val(payParam.money);
			$('input[name="money2"]').val(payParam.money2);
			$('input[name="game_coin"]').val(payParam.game_coin);
			$('input[name="gid"]').val(payParam.gid);
			$('input[name="server"]').val(payParam.server);
		},
		verPass2 : function(){
			// 验证二级密码
			var password2 = $('#J-psw2').val();
			if( password2 ) {
				var gold = payParam.money ? payParam.money : payParam.money2;
				$.ajax({
					url: '/market/api/api.php',
					type: "POST",
					data: {
						'ac': 'check_pwd2',
						'credit':gold,
						'password2':password2
					},
					timeout : 60000, //超时时间设置,单位毫秒
					dataType: "json",
					async: false,//异步
					cache:false, 
					success: function(result){
						if( result.status == 1) {
							if( confirm('确定要使用游戏币充值？') ) {
								CSPay.fillForm();
								$('#payform').submit();
							}else {
								$('#pass2-pop .pop-close').click();
							}
						}else {
							$('#J-psw2-tips').html(result.msg);
						} 
						
						return;
					}
				});
			}else {
				$('#J-psw2-tips').html('请输入二级密码');
			} 
			$('#J-psw2').val('');
		},
		get9377Coin : function(){
			var gold = payParam.money ? payParam.money : payParam.money2;
			$.ajax({
				url: C9377.app_url+'/market/api/api.php',
				type: "POST",
				data: {
					'ac': 'check_pwd2',
					'credit':gold,
					'password2':'check'
				},
				timeout : 60000, //超时时间设置，单位毫秒
				dataType: "json",
				success: function(result){
					if( result.data  == 'nologin' ) {
						CSPay.popTips('请先登录再进行充值');
						return false;
					}else if( result.status == 'not_ength' ) {
						CSPay.popTips(result.msg+'<br/><a href="'+C9377.app_url+'/pay_index.php?pid=32&pay_to=1" class="pop-button pop-button-red">前往充值</a>');
						return false;
					} else if( result.status != 1 ) {
						$('#J-psw2-tips').html(result.msg);
						CSPay.popSelect('#pass2-pop');
						return false;
					}else if( result.status == 1 ){
						if( confirm('确定要使用游戏币充值？') ) {
							CSPay.fillForm();
							$('#payform').submit();
						}
					}
				}
			}); 
		},
		popTips : function(txt, custom, tit){
			if (!custom) {
				// 纯文字模式
				$('#tips-pop .bd').html('<div class="bd-txt"> <p>'+txt+'</p> </div>');
			}else{
				// 自定义模式
				$('#tips-pop .bd').html(txt);
			}
			var vtit = tit ? tit : '提示';
			$('#tips-pop .hd').html(vtit);
			CSPay.popSelect('#tips-pop');
		},
		popSelect : function(ele){
			$('#mask, '+ele).show();
			$('.w-pop-close').click(function() {
				$('#mask, '+ele).hide();
			});
			$('.w-close-reload').click(function() {
				window.location.reload();
			});
			$(document).keyup(function(event) {
				// Esc关闭弹窗
				if (event.keyCode == 27) {
					$('#mask, '+ele).hide();
					$(document).unbind('keyup');
				}
			});
		},
		sendCaptcha : function(ele){
			var vbtn = $(ele),
				form = $('#form-mibao-Phone'),
				cellphone = form.find('input[name=cellphone]'),
				vcellphone = cellphone.val(),
				code = form.find('input[name=code]'),
				vcode = code.val();
			if (!/^1\d{10}$/.test(vcellphone)) {
				alert('手机格式不正确');
				cellphone.focus();
				return false;
			}
			if (vcode.length < 4) {
				alert('验证码错误');
				code.focus();
				return false;
			}
			var param = {
				'do': 'bind_cellphone',
				'step': 1, 
				'cellphone': vcellphone, 
				'code': vcode
			}
			$.post('/users/users_do.php', param, function(result) {
				if (result.status == '1') {
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
					alert('发送太频繁，请稍后再试');
				}else if(result.status == -4) {
					$('.php-code').eq(0).trigger('click');
					alert('请输入正确的验证码。');
				}else{
					alert(result.msg);
				}
			}, 'json');
		},
		bindPhone : function(){
			var form = $('#form-mibao-Phone'),
				cellphone = form.find('input[name=cellphone]'),
				vcellphone = cellphone.val();
				captcha = form.find('input[name=captcha]'),
				vcaptcha = captcha.val();
			if (!/^1\d{10}$/.test(vcellphone)) {
				alert('手机格式不正确');
				cellphone.focus();
				return;
			}
			if (!vcaptcha) {
				alert('请输入短信验证码');
				captcha.focus();
				return;
			}
			var param = {
				'do' : 'bind_cellphone',
				'step' : 2,
				'cellphone' : vcellphone,
				'captcha' : vcaptcha,
				'json' : 1,
				'return_json' : 1
			}
			$.post('/users/users_do.php', param, function(result) {
				if (result.status == 0) {
					C9377.userInfoJson.BIND_CELLPHONE = 1;
					$('.w-pop-close').click();
					CSPay.popTips('恭喜您绑定成功 <div class="tc"><a href="javascript:;" class="pop-button pop-button-red w-pop-close">确定</a></div>');
				}else{
					alert(result.message);
				}
			}, 'json');
		},
		bindIDC : function(){
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
					idc: {
						required: true,
						valid_id_card_number: true
					}
				},
				messages: {
					name: {
						required: '请填写真实姓名',
						valid_name: '姓名填写错误，必须为中文'
					},
					idc: {
						required: '输入你的身份证',
						valid_id_card_number: '请填写真实的身份证号码'
					}
				},
				submitHandler: function(form){
					var name = $('.form-mibao-idcard input[name="name"]').val(),
						idc = $('.form-mibao-idcard input[name="idc"]').val(),
						param = {
							'do' : 'fcm',
							'name' : name,
							'id_card_number' : idc,
							'return_json' : 1
						}
					$.post('/users/users_do.php', param, function(result) {
						if (result.msg == '修改成功!') {
							C9377.userInfoJson.ID_CARD_NUMBER = idc;
							$('.w-pop-close').click();
							CSPay.popTips('恭喜您绑定成功 <div class="tc"><a href="javascript:;" class="pop-button pop-button-red w-pop-close">确定</a></div>');
						}else{
							alert(result.msg);
						}
					}, 'json');
				},
				success: function(error, element){
					// error.removeClass('error').addClass('correct').html('&nbsp;');
				},
				errorClass: 'error',
				validClass: 'correct',
				errorPlacement: function(error, element) {
					// element.closest('.w-item').find('.w-tips').empty().append(error);
				},
				invalidHandler: function(event, validator){
					// validator.element(validator.errorList[0].element);
					alert(validator.errorList[0].message);
				},
				onkeyup: false
			});
		},
		toLogin : function(){
			$('.w-pop-close').click();
			CSPay.popSelect('#login-pop');
			C9377.login_save = 1;
			$('#form-login .login-save').click(function() {
				var isChk = $(this).find('i').hasClass('icon-cbed');
				$(this).find('i').toggleClass('icon-cbed');
				C9377.login_save = isChk ? 0 : 1;
			});
		},
		submitLogin : function(ele){
			var form = $('#form-login'),
				user = form.find('input[name=username]'),
				pass = form.find('input[name=password]'),
				vuser = user.val(),
				vpass = pass.val(),
				tips = form.find('.login-tip');
			if ($.trim(vuser).length < 4) {
				tips.html('您输入的帐号有误！');
				user.focus();
				return;
			}
			if ($.trim(vpass).length < 4) {
				tips.html('您输入的密码有误！');
				pass.focus();
				return;
			}
			var param = {
				'do' : 'login',
				'username' : vuser,
				'password' : vpass,
				'login_save' : C9377.login_save ? C9377.login_save : 0,
				'return_json' : 1,
				'_ajax' : 1
			}
			$.ajax({
				'url': C9377.app_url+'/login.php',
				'type': 'POST',
				'dataType': 'json',
				'data': param,
				'async': true,
				'cache': false,
				success: function(result){
					if (result.status >= 0) {
						tips.html('');
						$('.w-pop-close').click();
						var headtpl = '<p class="item"> <a href="'+C9377.app_url+'/users/users_index.php" target="_blank">'+result.username+'</a> <a href="'+C9377.app_url+'/login.php?do=logout" rel="nofollow" class="pdh10">[退出]</a> | <a href="{{$CONFIG.url}}/kefu/" target="_blank" class="ml10">联系客服</a> </p> ';
						$('.pay-header .info').html(headtpl);
					}else{
						tips.html(result.msg);
					}
				},
				error: function(e){
					tips.html('登录失败！请重试');
				}
			});
		}
	}
	CSPay.init();