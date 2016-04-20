var ERROR = {
    'IS_NOT_A_NUMBER': '这不是一个数字',
    'IS_NOT_A_AVAILABLE_NUMBER': '请输入一个10~100之间的数',
    'ARRAY_OUT_OF_BOUND': '队列长度超出限制'
};
// 验证数字
//function isNumber (num) {
//    return /^(0|-?([1-9]\d*\.?|0\.)\d+)$/.test(num);
//}
// 根据id获取元素
function $ (id) {
    return typeof id === 'string' ? document.getElementById(id) : id;
}
// 事件绑定函数
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
// 获取事件源对象
function getTarget (e) {
    e = window.event || e;
    return e.srcElement || e.target;
}
// 数字数组快速排序
function quickSort (arr) {
    if (arr.length <= 1) {
        return arr;
    }
    var pivotIndex = Math.floor(arr.length / 2);
    var pivot = arr.splice(pivotIndex, 1)[0];
    var left = [], right = [];
    var i;
    for (i = 0; i < arr.length; i ++) {
        if (arr[i] < pivot) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }
    return quickSort(left).concat([pivot], quickSort(right));
}

// -----------------------------------------------------------

// 获取数字
function getNumber () {
    var number = $('queue-element').value;
    try {
        number = parseFloat(number);
        if (isNaN(number)) {
            throw new Error(ERROR.IS_NOT_A_NUMBER);
        }
    } catch (e) {
        throw new Error(ERROR.IS_NOT_A_NUMBER);
    }
    if (number < 10 || number > 100) {
        throw new Error(ERROR.IS_NOT_A_AVAILABLE_NUMBER);
    }
    return number;
}

// 盛放队列数据的数组
var queue = [];

// 渲染显示视图
function renderList () {
    var i = 0, html = '', ul = $('queue-list');
    for ( ; i < queue.length; i ++) {
        html += '<li style="height: ' + queue[i] + 'px;"></li>';
    }
    ul.innerHTML = html;
}

// 数组操作处理函数
function clickHandler (e) {
    var _this = getTarget(e), fnName, fn;
    if (_this.tagName === 'BUTTON') {
        fnName = _this.id.split('-')[1];
        fn = Array.prototype[fnName];
        if (fnName === 'push' || fnName === 'unshift') {
            try {
                if (queue.length >= 60) {
                    throw new Error(ERROR.ARRAY_OUT_OF_BOUND);
                }
                fn.apply(queue, [getNumber()]);
            } catch (e) {
                window.alert(e.message);
            }
        } else {
            fn.apply(queue);
        }
        renderList();
    }
}

// 删除指定位置元素
function delHandler (e) {
    var target = getTarget(e), index;
    if (target.tagName === 'LI') {
        index =  [].indexOf.call(target.parentNode.childNodes, target);
        queue.splice(index, 1);
    }
    renderList();
}

// 排序操作处理函数
function sortHandler () {
    queue = quickSort(queue);
    renderList();
}

function init () {
    renderList();
    on($('queue-operate'), 'click', clickHandler);
    on($('queue-list'), 'click', delHandler);
    on($('queue-sort'), 'click', sortHandler);
}

on(window, 'load', init);