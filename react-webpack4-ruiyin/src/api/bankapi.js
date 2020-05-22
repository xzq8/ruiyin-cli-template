import { getOrderDetail } from "../redux/modules/order";

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


// 跟银行app 获取信息 支付接口
export function pay(msg) {
    let platform = parseMobileOS();
    msg = msg.replace(/\"/g, "'");
    if (platform == "android") {
        // msg = msg.replace(/\"/g, "'");
        window.SendMsgJS.sendMsg(msg, "YZGP");
    } else if (platform == "iphone") {
        let params = {
            "orderStr": msg,
            "transId": "YZGP"
            }
        window.getOrder =() =>{
            let params = {
                "orderStr": msg,
                "transId": "YZGP"
                }
           return  JSON.stringify(params)
        }
        
        setWebitEvent("getOrder()", "TK01")
    }

}

export function getUserTokn(str) {
    window.SendMsgJS.getTelFromBank(str)
}

// export function getUserToknIOS(str) {
//     setWebitEvent(str, '45');
// }
let _mevents = []
export function setWebitEvent(evtName, evtCode) {
    if (evtName == "") {
        return;
    }
    _mevents.push(JSON.stringify({
        code: evtCode,
        name: evtName
    }));
}

export function getWebkitEventCode() {   // 获取EventCode
    return _mevents.length > 0 ? _mevents.shift() : "0";
}
// 获取EventCode
export function getWebkitEvent() {
    return _mevents.length > 0 ? _mevents.shift() : "0";
}