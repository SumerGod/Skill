var ERROR = {
    'ILLEGAL_OPERATION': '您的操作非法',
    'ILLEGAL_VALUE': '您输入的值为空或非法'
};

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
// 去除字符串前后两端空格
function trim (str) {
    return str.replace(/^\s+|\s+$/g, '');
}

// ------------------------------------------------

// 盛放队列数据的数组
var queue = [];

// 获取文本框的值，处理并返回数组
function getValues () {
    var values = trim($('queue-input').value.replace(/[^\da-zA-Z\u4E00-\u9FA5]+/g, ' '));
    if (values) {
        return values.split(' ');
    }
    throw new Error(ERROR.ILLEGAL_VALUE);
}

// 渲染显示视图
function renderList () {
    var i = 0, html = '', ul = $('queue-list'), flag = false, arr = arguments[0];
    if (arr) {
        flag = true;
    }
    for ( ; i < queue.length; i ++) {
        if (flag && i === arr[0]) {
            arr.shift();
            html += '<li class="highlight">' + queue[i] + '</li>';
        } else {
            html += '<li>' + queue[i] + '</li>';
        }
    }
    ul.innerHTML = html;
}

// 队列增删操作
function clickHandler (e) {
    var _this = getTarget(e), fnName, values = [], i, j, length;
    if (_this.tagName === 'BUTTON') {
        fnName = _this.id.split('-')[1];
        try {
            values = getValues();
            switch (fnName) {
                case 'unshift': // left in
                    queue = values.concat(queue);
                    break;
                case 'shift': // left out
                    for (i = 0; i < values.length; i ++) {
                        length = queue.length;
                        for (j = 0; j < length; j ++) {
                            if (values[i] === queue[j]) {
                                queue.splice(j, 1);
                                break;
                            }
                        }
                    }
                    break;
                case 'push': // right in
                    queue = queue.concat(values);
                    break;
                case 'pop': // right out
                    for (i = 0; i < values.length; i ++) {
                        length = queue.length;
                        for (j = length; j >= 0; j --) {
                            if (values[i] === queue[j]) {
                                queue.splice(j, 1);
                                break;
                            }
                        }
                    }
                    break;
                default:
                    throw new Error(ERROR.ILLEGAL_OPERATION);
            }
        } catch (e) {
            window.alert(e.message);
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

// 模糊查询
function searchHandler () {
    var keywords = trim($('queue-keywords').value), i, indexArr = [];
    if (keywords) {
        for (i = 0; i < queue.length; i ++) {
            if (queue[i].indexOf(keywords) !== -1) {
                indexArr.push(i);
                console.log(i);
            }
        }
    }
    renderList(indexArr);
}

function init () {
    renderList();
    on($('queue-operate'), 'click', clickHandler);
    on($('queue-list'), 'click', delHandler);
    on($('queue-search'), 'click', searchHandler);
}

on(window, 'load', init);