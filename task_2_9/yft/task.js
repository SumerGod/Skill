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
var Queue = {
    'tags' : [],
    'hobbies' : [],
    // tag输入时的分隔符
    'separators' : [32, 188, 229, 13], // 空格 半角逗号 全角逗号 回车
};

// 获取文本框的值，处理并返回数组
function getValues () {
    var values = trim($('queue-input').value.replace(/[^\da-zA-Z\u4E00-\u9FA5]+/g, ' '));
    if (values) {
        return values.split(' ');
    }
    throw new Error(ERROR.ILLEGAL_VALUE);
}

// 渲染显示视图
function renderList (obj, datas) {
    var i, html = '';
    for (i = 0; i < datas.length; i ++) {
        html += '<li>' + Queue[i] + '</li>';
    }
    obj.innerHTML = html;
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
                    Queue = values.concat(Queue);
                    break;
                case 'shift': // left out
                    for (i = 0; i < values.length; i ++) {
                        length = Queue.length;
                        for (j = 0; j < length; j ++) {
                            if (values[i] === Queue[j]) {
                                Queue.splice(j, 1);
                                break;
                            }
                        }
                    }
                    break;
                case 'push': // right in
                    Queue = Queue.concat(values);
                    break;
                case 'pop': // right out
                    for (i = 0; i < values.length; i ++) {
                        length = Queue.length;
                        for (j = length; j >= 0; j --) {
                            if (values[i] === Queue[j]) {
                                Queue.splice(j, 1);
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
        Queue.splice(index, 1);
    }
    renderList();
}

function addTagHandler (e) {
    var keyCode = e.keyCode, tag;
    if (Queue.separators.indexOf(keyCode) !== -1) {
        tag = trim(this.value);
        if (tag) {
            if (Queue.tags.indexOf(tag) !== -1) {
                Queue.tags.push(tag);
                while (Queue.tags.length > 10) {
                    Queue.tags.shift();
                }
                renderList(this, Queue.tags)
            }
        }
    }
}

function init () {
    //renderList();
    //on($('queue-operate'), 'click', clickHandler);
    //on($('queue-list'), 'click', delHandler);
    //on($('queue-search'), 'click', searchHandler);

    on($('tags_input'), 'keydown', addTagHandler);
}

on(window, 'load', init);