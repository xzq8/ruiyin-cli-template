import { Toast } from 'antd-mobile';

export function buildQuery(query = {}) {
    let esc = encodeURIComponent;
    return Object.keys(query).map((key) => {
        return esc(key) + '=' + esc(query[key])
    }).join('&');
}

export function parseQuery(qstr) {
    if (qstr.trim().length <= 0) {
        return {};
    }
    var query = {};
    var a = (qstr[0] === '?' ? qstr.substr(1) : qstr).split('&');
    for (var i = 0; i < a.length; i++) {
        var b = a[i].split('=');
        let v = b[1] || '';
        try {
            v = decodeURIComponent(b[1] || '');
        } catch (e) {
            // TODO::
        }

        query[decodeURIComponent(b[0])] = v;
    }
    return query;
}

let baseOptions = {
    credentials: 'same-origin'
};

export const get = (url, query = {}, options = {}) => {
    let queryUrl = url;
    if (buildQuery(query) != '') {
        queryUrl += '?' + buildQuery(query);
    }
    return fetch(queryUrl, Object.assign({}, baseOptions, options))
}

export const post = (url, form = {}, options = {}, query = {}) => {
    let formbody = Object.keys(form).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(form[key])).join('&');
    let _baseOptions = Object.assign({}, baseOptions, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formbody
    });

    let queryUrl = url;
    if (buildQuery(query) != '') {
        queryUrl += '?' + buildQuery(query);
    }
    return new Promise((resolve, reject) => {
        fetch(queryUrl, Object.assign({}, _baseOptions, options))
            .then(res => {
                if (res.ok) {
                    let json = res.clone();
                    let Prodata = json.json();
                    return Prodata.then(data => {
                        if (!(data.success)) {
                            Toast.fail(data.msg || "服务器异常")
                            // throw new Error(data.msg || '服务器异常');
                            reject(data.msg || data.detail ||  "服务器异常");
                        }
                        resolve(data)
                    })
                } else {
                    Toast.fail("服务器异常")
                    // throw new Error('服务器异常');
                }
            }).catch(err => {
                Toast.fail("网络异常")
                reject(err);
            });
    })
}


export const postGETAPPInfo = (url, form = {}, options = {}, query = {}) => {
    let formbody = Object.keys(form).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(form[key])).join('&');
    let _baseOptions = Object.assign({}, baseOptions, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formbody
    });

    let queryUrl = url;
    if (buildQuery(query) != '') {
        queryUrl += '?' + buildQuery(query);
    }
    return new Promise((resolve, reject) => {
        fetch(queryUrl, Object.assign({}, _baseOptions, options))
            .then(res => {
                if (res.ok) {
                    let json = res.clone();
                    let Prodata = json.json();
                    return Prodata.then(data => {
                        resolve(data)
                    })
                } else {
                    Toast.fail("服务器异常")
                    // throw new Error('服务器异常');
                }
            }).catch(err => {
                Toast.fail("网络异常")
                reject(err);
            });
    })
}

export function htmlencode(s) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(s));
    return div.innerHTML;
}

export function htmldecode(s) {
    var div = document.createElement('div');
    div.innerHTML = s;
    return div.innerText || div.textContent;
}

export function escape2Html(str) {
    var arrEntities = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"' };
    str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) { return arrEntities[t]; });
    return str
}

export function getDay(day) {
    var today = new Date();
    var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
    return targetday_milliseconds;
}

export function formatYMD(milliseconds) {
    var today = new Date();
    milliseconds && today.setTime(milliseconds)
    var tMonth = today.getMonth();
    var tDate = today.getDate();
    tMonth = doHandleMonth(tMonth + 1);
    tDate = doHandleMonth(tDate);
    return tMonth + "-" + tDate;
}

export function getNowHours(){
    var today = new Date();
    var hour = doHandleMonth(today.getHours());
    return hour
}

function doHandleMonth(month) {
    var m = month;
    if (month.toString().length == 1) {
        m = "0" + month;
    }
    return m;
}

//身份证验证

export function isCardNo(num) {
    num = num.toUpperCase();
    //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。   
    if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num))) {
        return false;
    }
    //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。 
    //下面分别分析出生日期和校验位 
    var len, re;
    len = num.length;
    if (len == 15) {
        re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
        var arrSplit = num.match(re);

        //检查生日日期是否正确 
        var dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
        var bCorrectDay;
        bCorrectDay = (dtmBirth.getYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) &&
            (
                dtmBirth.getDate() == Number(arrSplit[4]));
        if (!bCorrectDay) {
            return false;
        } else {
            //将15位身份证转成18位 
            //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。 
            var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
            var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
            var nTemp = 0,
                i;
            num = num.substr(0, 6) + '19' + num.substr(6, num.length - 6);
            for (i = 0; i < 17; i++) {
                nTemp += num.substr(i, 1) * arrInt[i];
            }
            num += arrCh[nTemp % 11];
            return true;
        }
    }
    if (len == 18) {
        re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
        var arrSplit = num.match(re);

        //检查生日日期是否正确 
        var dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
        var bCorrectDay;
        bCorrectDay = (dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) &&
            (dtmBirth.getDate() == Number(arrSplit[4]));
        if (!bCorrectDay) {
            return false;
        } else {
            //检验18位身份证的校验码是否正确。 
            //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。 
            var valnum;
            var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
            var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
            var nTemp = 0,
                i;
            for (i = 0; i < 17; i++) {
                nTemp += num.substr(i, 1) * arrInt[i];
            }
            valnum = arrCh[nTemp % 11];
            if (valnum != num.substr(17, 1)) {
                return false;
            }
            return true;
        }
    }
    return false;
}


export function formCheck(e) {
    let { name, ids, tel, id } = e;
    let nameValue = name.state.value.trim()
    let idsValue = ids.state.value.trim()
    let telValue = tel.state.value.trim()
    let idValue = id.state.value
    if (!nameValue || !nameValue.match(/^[\u4e00-\u9fa5]*$/g)) {
        Toast.fail("请输入正确的姓名")
        return false;
    }
    if (!idsValue || !isCardNo(idsValue)) {
        Toast.fail("请正确输入身份证号码")
        return false;
    }
    if (!telValue || !(/^1(3|4|5|6|7|8|9)\d{9}$/.test(telValue))) {
        Toast.fail("手机号码有误")
        return false;
    }
    return { nameValue, idsValue, telValue, idValue };
}

export function isObjectValueEqual(a, b) {
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);
    if (aProps.length != bProps.length) {
        return false;
    }
    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i]

        var propA = a[propName]
        var propB = b[propName]
        if (propA !== propB) {
            if ((typeof (propA) === 'object')) {
                if (isObjectValueEqual(propA, propB)) {
                    return true
                } else {
                    return false
                }
            } else {
                return false
            }
        } else {
            return false
        }
    }
    return true;
}

export function parseMobileOS() {
    var OSType = 'unknow';
    // 取得浏览器、系统版本信息
    var _ua = navigator.userAgent.toLowerCase();
    // android 的检测
    if (_ua.indexOf('android') > -1) {
        OSType = "android";
    }
    // iphone 的检测
    else if (_ua.indexOf('iphone') > -1) {
        OSType = "iphone";
    }
    else if (_ua.indexOf('ipad') > -1) {
        OSType = "ipad";
    }
    // ipod 的检测
    else if (_ua.indexOf('ipod') > -1) {
        OSType = "ipod";
    } // wp 的检测
    else {
        OSType = "wp7";
    }
    return OSType;
}
