// 加载收获地址
var opt_tmp_nor = '<a href="javascript:;" class="btn-modify">编辑</a> | <a href="javascript:;" class="btn-del">删除</a> | <a href="javascript:;" class="btn-default">默认<span class="w-switch"><i></i></span></a>';
var opt_tmp_def = '<a href="javascript:;" class="btn-modify">编辑</a> | <a href="javascript:;" class="btn-del">删除</a> | <a href="javascript:;" class="btn-default">默认<span class="w-switch w-switch-act"><i></i></span></a>';
// 获取用户地址
checkToShow(function(json){
	// 二级密码存在才显示地址
	if (json.status > 0) {
		showUserAddress();
		$('.user-mod-addr .opt').show();
	}else{
		$('.address-table tbody').addClass('offline').html('<tr> <td colspan="6"> <p>为了您的账号安全，此处需要输入二级密码</p> <a href="javascript:;" class="btn btn-l btn-red J-btn-to2pass">输入二级密码</a> </td> </tr>');
	}
})

// 设置默认地址
$('.btn-default').live('click', function(){
	var _this = $(this),
		_tr = _this.closest('tr'),
		_aid = _tr.attr('aid');
	if (_tr.hasClass('addr-default')) { return false;}
	setAddressDefault(_aid, function(result){
		if( result == 1 ) {
			$('.address-table .w-switch-act').removeClass('w-switch-act');
			$('.address-table .addr-default').removeClass('addr-default');
			_tr.addClass('addr-default').find('.w-switch').addClass('w-switch-act');
		}
	});
});
// 删除
$('.btn-del').live('click', function(){
	var _this = $(this);
	var _sid = _this.parent().parent().attr('aid');
	var tpl = '<div class="bd-txt"> <p>确定要删除该地址？</p> </div> <a href="javascript:;" aid="'+_sid+'" class="pop-button pop-button-green btn-msgdel-submit">确定</a> <a href="javascript:;" class="pop-button pop-button-gray w-pop-close">取消</a>'
	popTips(tpl,1);
});
$('.btn-msgdel-submit').live('click', function(){
	var _aid = $(this).attr('aid');
	deleteAddress(_aid, function(result){
		if ( result == 1 ) {
			$('tr[aid="'+_aid+'"]').remove();
			$('.w-pop-close').click();
			var adrl = getAddressNum();
			if (adrl <= 0) {
				$('.address-table tbody').addClass('offline').html('<tr> <td colspan="6"> <p> 您还没有添加收货地址！ </p> </td> </tr>');
			}
		};
	});
});
// 新增地址
var addr_id = ''; // 存在id是编辑，不存在是添加
$('.setdef').live('click', function() {
	var _h = $(this).hasClass('setdef-y');
	if (_h) {
		$(this).removeClass('setdef-y');
	}else{
		$(this).addClass('setdef-y');
	}
});
/*
 * .btn-addr-opt 地址编辑按钮
 * 确认按钮： opt=1 是新增，opt=2 是编辑
 */
var submit_opt = 0;
$('.btn-addr-opt').live('click', function(){
	var opt = $(this).attr('opt');  // 检测是新增还是编辑 'modify' : 'add'
	
	var city_df = '<option value="">请选择城市</option>',
		area_df = '<option value="">请选择地区</option>';
	var province_id = 0, city_id = 0, area_id = 0;
	if( opt == 'modify' ) {
		submit_opt = 2;
		var _aid = $(this).parent().parent().attr('aid');
		var json_data = window['address'];
		addr_id = _aid; // 设置地址ID，给提交表单时使用。
		console.log(addr_id); 
		console.log(json_data); 
		province_id = json_data[_aid].info.province_id;
		city_id = json_data[_aid].info.city_id;
		area_id = json_data[_aid].info.area_id;
		$('#item-id').val(json_data[_aid].id);  // 设置地址ID
		//设置是否为默认地址
		if ($(this).siblings('.btn-default').find('.w-switch').hasClass('w-switch-act')) {
			$('.setdef').addClass('setdef-y');
		}else{
			$('.setdef').removeClass('setdef-y');
		}
		for(i in json_data[_aid].info) {
			if( $.inArray(i,['province_id', 'city_id', 'phone']) > -1 ) {
				continue;
			}else{
				$('input[name="'+i+'"]').val(json_data[_aid].info[i]);
			}
		}
	}else{
		var adrl = getAddressNum();
		if (adrl >= 6) {
			popTips('最多可创建6个收货地址！');
			return false;
		};
		submit_opt = 1;
		$('.setdef').addClass('setdef-y'); //强制选中默认
		$('#form-addr-opt')[0].reset(); //清空表单
		$('#item-id').val('0');
	}

	!window['citys'] && $.ajax({
		url: '/market/api/api.php',
		type: "POST",
		async: false,
		data: {
			'ac': 'get_citys'
		},
		dataType: "json",
		cache: false,
		success: function (json) {
			window['citys'] = json;
		},
		error: function (err) {
			alert('网络繁忙，请稍后重试');
		}
	});

	$('#province').html('<option value="">请选择省份</option>').append(get_city_select(0, province_id));
	$('#area').html(area_df);

	$('#province').change(function() {
		city_id = 0;
		province_id = $(this).val();
		var html = city_df;
		if( province_id != '') {
			html += get_city_select(province_id, city_id);
		}
		$('#city').html(html);
		$('#area').html(area_df);
	});
	$('#city').change(function() {
		area_id = 0;
		city_id = $(this).val();
		var html = area_df;
		if( city_id != '') {
			html += get_area_select(city_id, area_id);
		}
		$('#area').html(html);
	});

	if( city_id > 0 ) {
		var html = city_df;
		html += get_city_select(province_id, city_id);
		$('#city').html(html);
		// 触发地区数据
		var ahtml = area_df;
		ahtml += get_area_select(city_id, area_id);
		$('#area').html(ahtml);
	}else{
		// 如果用户未填城市，既触发省份选择事件
		$('#province').change();
	}

	// 弹出界面
	popSelect('#addr-opt-pop');
});
function get_city_select(parent_id, df) {
	nodes = null;
	if( parent_id == 0 ) {
		nodes = window['citys'];
	}else {
		for( i in window['citys'] ) {
			if( window['citys'][i].id == parent_id ) nodes = window['citys'][i].nodes;
		}
	}

	if( !nodes ) return ;
	html = '';
	for(i in nodes) {
		selected = nodes[i].id == df ? 'selected' : '';
		html += '<option value="'+nodes[i].id+'" '+selected+'>'+nodes[i].name+'</option>';
	} 

	return html;
}
function get_area_select(parent_id, df){
	nodes = null;
	if( parent_id == 0 ) {
		nodes = window['citys'];
	}else {
		for( i in window['citys'] ) {
			var _this = window['citys'][i].nodes;
			if (_this != '') {
				for( y in _this){
					if( _this[y].id == parent_id ){
						nodes = _this[parent_id].nodes;
					}
					
				}
			}
		}
	}
	if( !nodes ) return ;
	html = '';
	for(i in nodes) {
		selected = nodes[i].id == df ? 'selected' : '';
		html += '<option value="'+nodes[i].id+'" '+selected+'>'+nodes[i].name+'</option>';
	} 

	return html;
}

// 提交新地址 (新增/编辑)
$('#addr-opt-submit').click(function(){
	var addrobj = {
		'realname' : $.trim($('#realname').val()),
		'province' : $('#province').val(),
        'area' : $('#area').val(),
		'city' : $('#city').val(),
		'address' : $.trim($('#address').val()),
		'tel' : $.trim($('#tel').val()),
		'postnum' : $.trim($('#postnum').val()),
		'def' : $('.setdef').hasClass('setdef-y') == true ? 1 : 0
	}
	if (!addrobj.realname || !addrobj.province || !addrobj.address || !addrobj.tel || !addrobj.postnum) {
		alert('请填写完整信息！');
		return false;
	};
	var param = {
		'ac': 'express',
		'id': addr_id,
		'realname': addrobj.realname,
		'province': addrobj.province,
        'area': addrobj.area,
		'city': addrobj.city,
		'address': addrobj.address,
		'tel': addrobj.tel,
		'post_no': addrobj.postnum,
		'default': addrobj.def,
		'dosubmit': '1',
		'is_ajax': '1'
	}
	if (submit_opt == 1) {
		// 如果是新增
		getJson(param, function(result){
			if (result.status == 1) {
				if ($('.address-table tbody').hasClass('offline')) {
					$('.address-table tbody').html('').removeClass('offline');
				}
				// 追加到页面上
				var txt_province = $('#province option[value="'+addrobj.province+'"]').html(),	// 根据ID获取省份、城市的名字
					txt_city = addrobj.city > 0 ? $('#city option[value="'+addrobj.city+'"]').html() : '';
					txt_city += addrobj.area > 0 ? $('#area option[value="'+addrobj.area+'"]').html() : '';

				var new_addr_temp = '<tr aid="'+result.id+'"> <td>'+addrobj.realname+'</td> <td>'+txt_province+txt_city+'</td> <td class="col_addr">'+addrobj.address+'</td> <td>'+addrobj.postnum+'</td> <td>'+addrobj.tel+'</td> <td class="opt"><a href="javascript:;" opt="modify" class="btn-addr-opt">编辑</a> | <a href="javascript:;" class="btn-del">删除</a> <a href="javascript:;" class="btn-default">默认 <span class="w-switch"><i></i></span></a></td> </tr>';

				$('.address-table tbody').append(new_addr_temp);
				if (addrobj.def == 1) {
					$('tr[aid="'+result.id+'"] .btn-default').click();
				};
			}else{
				alert('网络繁忙！');
			}
		}, '/market/center.php', 'POST');
	}else if(submit_opt == 2){
		getJson(param, function(result){
			if (result.status == 1) {
				// 地址编辑成功后的操作
				var txt_province = $('#province option[value="'+addrobj.province+'"]').html(),	// 根据ID获取省份、城市的名字
					txt_city = addrobj.city > 0 ? $('#city option[value="'+addrobj.city+'"]').html() : '';
					txt_city += addrobj.area > 0 ? $('#area option[value="'+addrobj.area+'"]').html() : '';

				var modify_addr_temp = '<td>'+addrobj.realname+'</td> <td>'+txt_province+txt_city+'</td> <td>'+addrobj.address+'</td> <td>'+addrobj.postnum+'</td> <td>'+addrobj.tel+'</td> <td class="opt"><a href="javascript:;" opt="modify" class="btn-addr-opt">编辑</a> | <a href="javascript:;" class="btn-del">删除</a> <a href="javascript:;" class="btn-default">默认 <span class="w-switch"><i></i></span></a></td>';

				$('tr[aid="'+result.id+'"]').html(modify_addr_temp);
				if (addrobj.def == 1) {
					$('tr[aid="'+result.id+'"] .btn-default').click();
				};
				getUserAddress(function(){});  // 重新获取全局地址信息。否则再次编辑时，信息获取出错；
			}else{
				alert('网络繁忙！');
			}
		}, '/market/center.php', 'POST');
	}
	// 操作成功后的关闭弹窗
	$('.w-pop-close').trigger('click');
	return false;
});
// 重新获取收货地址数量
function getAddressNum(){
	var addr_length = $('.address-table tbody tr').length;
	return addr_length;
}
// 方法
function deleteAddress(sid, callback){
	var param = {
		'ac' : 'express',
		'do' : 'del',
		'sid' : sid
	}
	getJson(param, function(result){
		callback(result);
	}, '/market/center.php', 'POST');
}
// 地址设置为默认
function setAddressDefault(sid, callback){
	var param = {
		'ac' : 'express',
		'do' : 'set_default',
		'id' : sid
	}
	getJson(param, function(result){
		callback(result);
	}, '/market/center.php', 'POST');
}
// // 获取用户收货地址
function getUserAddress(callback){
	var param = {
		'ac': 'get_user_express'
	}
	getJson(param, function(result){
		window['address'] = result;
		callback(result);
	}, '/market/api/api.php', 'POST');
}
// 展示用户收货地址
function showUserAddress(){
	getUserAddress(function(result){
		if (result != '') {
			var adr_temp = '', address_def = 0;
			for( var i in result){
				if(result[i].def == 1){
					address_def = result[i].id;
				}
				adr_temp += '<tr aid="'+result[i].id+'"> <td>'+result[i].info.realname+'</td> <td>'+result[i].info.city+'</td> <td>'+result[i].info.address+'</td> <td>'+result[i].info.post_no+'</td> <td>';

					if (result[i].info.tel) { adr_temp += result[i].info.tel;};
					if (result[i].info.phone) { adr_temp += '</br>'+result[i].info.phone; };

					adr_temp += '</td> <td class="opt"><a href="javascript:;" opt="modify" class="btn-addr-opt">编辑</a> | <a href="javascript:;" class="btn-del">删除</a> <a href="javascript:;" class="btn-default">默认 <span class="w-switch"><i></i></span></a></td> </tr>'
			}
			$('.address-table tbody').html(adr_temp);
			$('#address-table tr[aid='+address_def+']').addClass('addr-default').find('.w-switch').addClass('w-switch-act');
		}else{
			$('.address-table tbody').addClass('offline').html('<tr> <td colspan="6"> <p> 您还没有添加收货地址！ </p> </td> </tr>');
		}
	});
}