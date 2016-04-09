/**
 * dom节点的获取
 */
function $ (id) {
    return typeof id === 'string' ? document.getElementById(id) : id;
}
function tags (tagname) {
    return typeof tagname === 'string' ? document.getElementsByTagName(tagname) : tagname;
}
/**
 * 事件绑定函数
 */
function on (node, ev, fn, scope) {
    node = $(node);
    scope = scope || node;
    if (document.all) {
        node.attachEvent('on'+ev, function () {
            fn.apply(scope, arguments);
        });
    } else {
        node.addEventListener(ev, function () {
            fn.apply(scope, arguments);
        }, false);
    }
}
/**
 * 获取事件源对象
 */
function getEventTarget (e) {
    e = window.event || e;
    return e.srcElement || e.target;
}
/**
 * 获取单选框的值
 */
function getRadioValue () {
    var radios = tags('input'), i = 0;
    for ( ; i < radios.length; i ++) {
        if (true === radios[i].checked) {
            return radios[i].value;
        }
    }
    return -1;
}
/**
 * 将字符串转换为时间
 */
function strtotime (str) {
    str = str.replace(/-/g, '/');
    return new Date(str);
}
/**
 * 获取数组或对象数组平均值
 */
function getAvg (arr) {
    var i, sum = 0;
    for (i in arr) {
        sum += arr[i];
    }
    return sum / i;
}
/**
 * 获取标签样式
 */
function getStyle (node) {
    var style;
    if (window.getComputedStyle) {
        style = window.getComputedStyle(node, null);
    } else { // IE
        style = node.currentStyle;
    }
    return style;
}
/**
 * 判断是否为数组
 */
function isArray (obj) {
    return Object.prototype.toString.apply(obj) === '[object Array]';
}

/* 数据格式演示
 var aqiSourceData = {
 "北京": {
 "2016-01-01": 10,
 "2016-01-02": 10,
 "2016-01-03": 10,
 "2016-01-04": 10
 }
 };
 */

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
    var y = dat.getFullYear();
    var m = dat.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = dat.getDate();
    d = d < 10 ? '0' + d : d;
    return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
    var returnData = {};
    var dat = new Date("2016-01-01");
    var datStr = '';
    for (var i = 1; i < 92; i++) {
        datStr = getDateStr(dat);
        returnData[datStr] = Math.ceil(Math.random() * seed);
        dat.setDate(dat.getDate() + 1);
    }
    return returnData;
}

var aqiSourceData = {
    "北京": randomBuildData(500),
    "上海": randomBuildData(300),
    "广州": randomBuildData(200),
    "深圳": randomBuildData(100),
    "成都": randomBuildData(300),
    "西安": randomBuildData(500),
    "福州": randomBuildData(100),
    "厦门": randomBuildData(100),
    "沈阳": randomBuildData(500)
};
// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
    nowSelectCity: -1, // 目前选择的城市
    nowGraTime: "day" // 目前选择的时间
};

/**
 * 渲染图表
 */
function renderChart() {
    var ul = $('chart'), item, html = '', i = 0, j = 0, left,
        ulStyle = getStyle(ul),
        ulHeight = parseInt(ulStyle.height),
        length = 0, width, height, minValue,  maxValue = 0, scale, colorLevelScale,
        color, colors = {0:'green', 100:'blue', 200:'red', 300:'purple', 400:'black'};
    for (item in chartData) {
        length ++;
        maxValue = chartData[item] > maxValue ? chartData[item] : maxValue;
        minValue = !minValue || chartData[item] < minValue ? chartData[item] : minValue;
    }
    width = parseInt(ulStyle.width) / length;
    scale = ulHeight / maxValue;
    for (item in chartData) {
        for (i in colors) {
            color = i;
            if (chartData[item] < i) {
                break;
            }
        }
        left = width * j++;
        height = scale * chartData[item];
        html += '<li title="' + item + '" style="width: ' + width + 'px; height: ' + height + 'px; left: ' + left + 'px; background: ' + colors[color] + ';"></li>';
    }
    ul.innerHTML = html;
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange() {
    // 确定是否选项发生了变化
    var time = getRadioValue();
    if (pageState.nowGraTime === time) { // 如果时间选项没有变化，则直接退出
        return;
    }
    // 设置对应数据
    pageState.nowGraTime = time;
    initAqiChartData();
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
    // 确定是否选项发生了变化
    var city = $('city-select').value;
    if (pageState.nowSelectCity === city) {
        return;
    }
    // 设置对应数据
    pageState.nowSelectCity = city;
    initAqiChartData();
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
    on($('form-gra-time'), 'click', function (e) {
        var target = getEventTarget(e);
        if ('INPUT' === target.tagName) {
            graTimeChange();
        }
    });
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
    var item, html = '',
        selector = $('city-select');
    // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
    for (item in aqiSourceData) {
        html += '<option>' + item + '</option>';
    }
    selector.innerHTML = html;
    // 给select设置事件，当选项发生变化时调用函数citySelectChange
    on(selector, 'change', citySelectChange);
    citySelectChange();
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
    var data = aqiSourceData[pageState.nowSelectCity], // 要处理的数据
        item, day, month, title = '', key,
        toBeDealtData = {}, // 盛放某一时间粒度下的数据
        dealtData = {}; // 盛放经处理的数据
    // 将原始的源数据处理成图表需要的数据格式
    switch (pageState.nowGraTime) {
        case 'day':
            dealtData = data;
            break;
        case 'week':
            for (item in data) {
                title = '';
                day = strtotime(item).getDay();
                if (title === '') title = item;
                toBeDealtData[day] = data[item];
                if (0 === day) {
                    title += '~' + item;
                    dealtData[title] = getAvg(toBeDealtData);
                    toBeDealtData = {};
                }
            }
            break;
        case 'month':
            for (item in data) {
                key = /^\d{4}-\d{2}/.exec(item)[0];
                if (!isArray(dealtData[key])) {
                    dealtData[key] = [];
                }
                dealtData[key].push(data[item]);
            }
            for (item in dealtData) {
                dealtData[item] = getAvg(dealtData[item]);
            }
    }
    // 处理好的数据存到 chartData 中
    chartData = dealtData;
    console.log(chartData);
    renderChart();
}

/**
 * 初始化函数
 */
function init() {
    initGraTimeForm();
    initCitySelector();
    initAqiChartData();
}

on(window, 'load', init);