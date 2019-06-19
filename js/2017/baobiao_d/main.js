(function(window) {
	var main = {
		init: function() {
			var that = this;
			that.href = location.href;
			that.switch();
			that.btnFn();
		},
		switch: function() {
			var obj = document.body,
				pressX = 0,
				pressY = 0,
				directSign = "none",
				num = 0,
				wrapObj = document.getElementById("js-screen-wrap"),
				screenObj = document.getElementsByClassName("screen"),
				screenArr = Array.prototype.slice.call(screenObj),
				len = screenArr.length,
				arrows = document.getElementById("js-arrows-tip"),
				touchSign = false;

			obj.addEventListener('touchmove', function(event) {
				event.preventDefault();
				// 如果这个元素的位置内只有一个手指的话
				if (event.targetTouches.length == 1) {
					var touch = event.targetTouches[0],
						spanX = touch.pageX - pressX,
						spanY = touch.pageY - pressY,
						direct = "none";
					if (touchSign === true) return;
					if (Math.abs(spanX) > Math.abs(spanY)) {
						//水平方向
						if (spanX > 0) {
							direct = "right"; //向右
							//do right function
						} else {
							direct = "left"; //向左
							//do left function
						}
					} else {
						//垂直方向
						if (spanY > 0) {
							direct = "down"; //向下
							//do down function
						} else {
							direct = "up"; //向上
							//do up function
						}
					}
					if (Math.abs(spanY) > 150) {
						if ((num === 0 && direct === "down") || (num === len - 1 && direct === "up")) {

						} else {
							wrapObj.className = "screen-wrap screen-wrap-min";
						}
						directSign = direct;
						touchSign = true;

					} else {
						directSign = "none";
					}
				}
			}, false);
			obj.addEventListener('touchstart', function(event) {
				event.preventDefault();
				// 如果这个元素的位置内只有一个手指的话
				if (event.targetTouches.length == 1) {
					var touch = event.targetTouches[0];
					// 把元素放在手指所在的位置
					pressX = touch.pageX;
					pressY = touch.pageY;
					directSign = "none";
					touchSign = false;
				}
			}, false);

			obj.addEventListener('touchend', function(event) {
				event.preventDefault();
				var sign = ["up", "down"].indexOf(directSign),
					dir = directSign;
				if (sign > -1) {
					if (sign === 1) {
						num = num - 1;
						if (num < 0) {
							num = 0;
							dir = "none";
						}
					}
					if (sign === 0) {
						num = num + 1;
						if (num > len - 1) {
							num = len - 1;
							dir = "none";
						}
					}
					arrows.className = "arrows-tip-blk arrows-tip-blk-" + num;
					screenArr.forEach(function(item) {
						item.style.display = "none";
					});
					screenArr[num].style.display = "block";
					wrapObj.className = "screen-wrap screen-wrap-" + dir + " screen-wrap-" + num;
				}
				directSign = "none";
			}, false);
		},
		btnFn: function() {
			var that = this,
				btnObj = document.getElementsByClassName("s0_btn"),
				wxTip = document.getElementById("js-weixin-tip"),
				btnArr = Array.prototype.slice.call(btnObj),
				u = navigator.userAgent,
				isWeixin = u.toLowerCase().match(/MicroMessenger/i) == 'micromessenger' ? true : false,
				isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
				isIpone = (!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) || u.indexOf('iPhone') > -1) ? true : false;

			wxTip.addEventListener('touchstart', function() {
				event.preventDefault();
				event.stopPropagation();
				wxTip.className = "weixin-tip";
			}, false);
			if (!isAndroid && !isIpone) {
				btnArr.forEach(function(item) {
					item.className = item.className + " s0_btn_none";
					var a = item.getElementsByTagName("a")[0];
					a.innerHTML = "暂不支持当前手机系统";
				});
			} else {
				btnArr.forEach(function(item) {
					item.addEventListener('touchstart', function() {
						event.preventDefault();
						event.stopPropagation();
						if (isIpone) {
							if (isWeixin) {
								wxTip.className = "weixin-tip weixin-tip-show";
								location.href = "#isIpone";
							} else {
								location.href = "#isIpone";
							}
						} else if (isAndroid) {
							if (isWeixin) {
								wxTip.className = "weixin-tip weixin-tip-show";
								location.href = "#Android";
							} else {
								location.href = "http://wvw.9377.com/downloads.php?game=yxbb&item=mini&url=https%3A%2F%2Fcdnsjzs.9377.com%2Fyxbb%2F9377guardsV1.01.apk&lm=9377yxltzt&platform=3";
							}
						}
					}, false);
				});
				if (isIpone) {
					if (isWeixin) {
					}else{
						btnArr.forEach(function(item) {
							var a = item.getElementsByTagName("a")[0];
							a.className = "ios_btn";
							a.innerHTML = "ios暂未开放";
						});
					}
				}
			}
		},
		openLink: function(url, target) { //js打开新连接
			target = target || "_blank";
			var a = document.createElement("a"),
				body = document.body;
			a.setAttribute("href", url);
			a.setAttribute("target", target);
			a.style.display = "none";
			body.appendChild(a);
			a.click();
			body.removeChild(a);
		}
	};
	main.init();
})(window);