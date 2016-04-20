function trim (str) {
	return str.replace(/^\s+|\s+$/g, '');
}
function isEmptyObject (obj) {
	for (var i in obj) {
		return false;
	}
	return true;
}
function validate (city, value) {
	var result = {};
	var cityReg = /^([\u4e00-\u9fa5a-zA-Z])+$/g,
		valueReg = /^[1-9]\d*$/g;
	if (!cityReg.test(city)) {
		result['city'] = ("城市名称格式错误");
	}
	if (!valueReg.test(value)) {
		result['value'] = "空气质量指数格式错误";
	}
	return result;
}
function on (node, ev, fn, scope) {
	node = (typeof node == "string") ? document.getElementById(node) : node;
	scope = scope || node;
	if (document.all) {
		node.attachEvent("on"+ev, function () {
			fn.apply(scope, arguments);
		});
	} else {
		node.addEventListener(ev, function () {
			fn.apply(scope, arguments);
		}, false);
	}
}
function getTarget (e) {
	e = window.event || e;
	return e.srcElement || e.target;
}
function getNextNode (node) {
	node = (typeof node == 'string') ? document.getElementById(node) : node;
	var nextNode = node.nextSibling;
	if (!nextNode) return null;
	if (!document.all) {
		while (true) {
			if (nextNode.nodeType == 1) {
				break;
			} else {
				if (nextNode.nextSibling) {
					nextNode = nextNode.nextSibling;
				} else {
					break;
				}
			}
		}
		return nextNode;
	}
}

/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {};

/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {
	var cityInput = document.getElementById('aqi-city-input'),
		valueInput = document.getElementById('aqi-value-input'),
		errorSpan = document.getElementById('aqi-error-span');
	var city = trim(cityInput.value),
		value = trim(valueInput.value),
		i, html = '';
	var result = validate(city, value);
	if (!isEmptyObject(result)) {
		for (i in result) {
			html += result[i] + ' ';
		}
		errorSpan.innerHTML = html;
		return;
	}
	errorSpan.innerHTML = '';
	aqiData[city] = value;
}

/**
 * 删除aqiData中相对应记录
 */
function delAqiData (city) {
	var item;
	for (item in aqiData) {
		if (item == city) {
			delete aqiData[city];
		}
	}
}

/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
	var item, html = '<tr><td>城市</td><td>空气质量</td><td>操作</td></tr>';
	var table = document.getElementById('aqi-table');
	for (item in aqiData) {
		html += '<tr><td>' + item + '</td><td>' + aqiData[item] + '</td><td><button>删除</button></td></tr>';
	}
	table.innerHTML = html;
}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
	addAqiData();
	renderAqiList();
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle(e) {
	// do sth.
	var target = getTarget(e);
	if (target.nodeName == 'BUTTON') {
		var cityTd = target.parentNode.parentNode.firstChild;
		if (cityTd.nodeType != 1) {
			cityTd = getNextNode(cityTd);
		}
		delAqiData(cityTd.innerText);
		renderAqiList();
	}
}

function init() {

	// 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
	on('add-btn', "click", addBtnHandle);
	// 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
	on('aqi-table', 'click', delBtnHandle);
}

on(window, 'load', init);