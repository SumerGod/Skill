// 验证数字
function isNumber (num) {
    return /^(0|-?([1-9]\d*\.?|0\.)\d+)$/.test(num);
}
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
    var e = window.event || e;
    return e.srcElement || e.target;
}
// 基础异常类
function BaseException () {
    this.name = 'BaseException';
    this.message = "base exception";
}
BaseException.prototype = new Error();
BaseException.prototype.constructor = BaseException;
BaseException.prototype.toString = function () {
    return this.name + ": " + this.message;
};
// 非数字异常
function NANException () {
    this.name = "NANException";
    this.message = "这不是一个数字";
}
NANException.prototype = BaseException;
NANException.prototype.constructor = NANException;

// -----------------------------------------------------------

// 获取数字
function getNumber () {
    var number = $('queue-element').value;
    if (!isNumber(number)) {
        throw new NANException();
    }
    return number;
}

// 盛放队列数据的数组
var queue = [];

// 渲染显示视图
function renderList () {
    var i = 0, html = '', ul = $('queue-list');
    for ( ; i < queue.length; i ++) {
        html += '<li>' + queue[i] + '</li>'
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

function init () {
    renderList();
    on($('queue-operate'), 'click', clickHandler)
    on($('queue-list'), 'click', delHandler);
}

on(window, 'load', init);