import * as API from "../../api"
import { post, postGETAPPInfo } from "../../utils/index"

const initialState = {
  shopList: [],
  shopDetailsList: [],
  TimeDatasysSubSer: [],
  TimeDataweekDay: [],
  userLon: "",
  userLat: "",
  labelTime: []
}

const actionTypes = {
  REQUEST_SHOP_LIST: 'request shop list',
  REQUEST_TIME_LIST: 'request TIME list',
  REQUEST_SHOP_DETAILS_LIST: 'request shop details list',
  REQUEST_LOCATION: 'request location'
}

export function getShopList(pageIndex, NUM_ROWS, CB = () => { }) {
  return async (dispatch, getState) => {
    let { userLon, userLat } = await getlocationWX()
    post(API.getshopAPI, { userLon: userLon, userLat: userLat, pageNum: pageIndex, pageSize: NUM_ROWS })
      .then(data => {
        dispatch({
          type: actionTypes.REQUEST_SHOP_LIST,
          data: data.data,
          pageIndex
        })
        CB && CB(true, data.data.total);
      })
  }
}

export function getShopDetailsList(id) {
  return (dispatch, getState) => {
    post(API.getshopDetailsAPI, { id })
      .then(data => {
        dispatch({
          type: actionTypes.REQUEST_SHOP_DETAILS_LIST,
          data: { id, details: data.data }
        })
      })
  }
}

export function getDatasList(id, serviceId, cb) {
  return (dispatch, getState) => {
    post(API.listDataProdSub, {
      shopId: id,
      serviceId,
    })
      .then(data => {
        dispatch({
          type: actionTypes.REQUEST_TIME_LIST,
          data: data.data
        })
        cb && cb()
      })
  }
}

function getlocationWX() {
  return new Promise((resolve, reject) => {
    try {
      window.wx.ready(function () {
        window.wx.getLocation({
          type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
          success: function (res) {
            console.log(res);
            let userLat = res.latitude; // 纬度，浮点数，范围为90 ~ -90
            let userLon = res.longitude; // 经度，浮点数，范围为180 ~ -180。
            resolve({ userLat, userLon })
          },
          fail: function (res) {
            let userLat = '39.9073660600'; // 纬度，浮点数，范围为90 ~ -90
            let userLon = '116.4119052900'; // 经度，浮点数，范围为180 ~ -180。
            resolve({ userLat, userLon })
          }
        });
      });
      window.wx.error(function (res) {
        console.log('-----------------------------');
        console.log("errorMSG:" + res);
      });
    } catch (error) {
      let userLat = '39.9073660600'; // 纬度，浮点数，范围为90 ~ -90
      let userLon = '116.4119052900'; // 经度，浮点数，范围为180 ~ -180。
      resolve({ userLat, userLon })
    }

  });
}


function checkMobile(userPhone, yzmcode) {
  return postGETAPPInfo(API.checkMobile, {
    mobile: userPhone,
    code: yzmcode,
    type: "checkMobile"
  })
    .then(data => {
      return data
    })
}

export function login(cb) {
  return postGETAPPInfo(API.login, {
    url: window.location.href
  })
    .then(res => {
      if (cb) {
        window.wx.config({
          debug: false,
          appId: res.appId,
          timestamp: res.timestamp,
          nonceStr: res.noncestr,
          signature: res.signature,
          jsApiList: [
            'getLocation',
            'updateAppMessageShareData',
            'updateTimelineShareData'
          ]
        });
        window.wx.ready(function () {      //需在用户可能点击分享按钮前就先调用
          window.wx.updateTimelineShareData({
            title: '立即预约', // 分享标题
            link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: 'https://demo.jsruiyin.com/imgIcon/share.png', // 分享图标
            success: function () {
              // 设置成功
            }
          })
          window.wx.updateAppMessageShareData({
            title: '立即预约', // 分享标题
            desc: '惊爆优惠, 立即预约, 提前预约，享受优质优惠服务', // 分享描述
            link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: 'https://demo.jsruiyin.com/imgIcon/share.png', // 分享图标
            success: function () {
              // 设置成功
            }
          })
        });
        cb && cb()
      } else {
        let appID = res.appId;
        let indexpage = window.location.origin + "/BookGYM/"
        var url = decodeURIComponent(indexpage)   // 验证后要跳转的地址
      }
    })
}

export function loginforOpenid(query) {
  return postGETAPPInfo(API.login, {
    url: window.location.href
  })
    .then(res => {
      let appID = res.appId;
      let indexpage = window.location.origin + "/BookGYM"
      // let indexpage = window.location.origin + "/BookGYM/"
      var url = decodeURIComponent(indexpage)   // 验证后要跳转的地址
      window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + appID + "&redirect_uri=" + url + "&response_type=code&scope=snsapi_userinfo&state=STATE&component_appid=wx9a97f4498ab5f2e1#wechat_redirect"
      // window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + 'wxaa84e0338222f222' + "&redirect_uri=" + url + "&response_type=code&scope=snsapi_userinfo&state=STATE&component_appid=wx983fd91c35e89e98#wechat_redirect"
    })
}

export function getlocation(latitude, longitude) {
  return (dispatch, getState) => {
    dispatch({
      type: actionTypes.REQUEST_LOCATION,
      data: {
        latitude,
        longitude
      }
    })
  }
}

export function getOpenId(CODE) {
  return postGETAPPInfo(API.openid, {
    code: CODE
  })
    .then(res => {
      if (res.openId != "null" && res.openId) {
        sessionStorage.setItem('openId', JSON.stringify(res));
      }
    })
}



export function sendMsg(userPhone) {
  return post(API.sendMsg, {
    mobile: userPhone,
    type: "checkMobile"
  })
    .then(data => {
      return data
    })
}

export async function submit(obj) {
  let { userPhone, yzmcode } = obj
  let isSuccess = await checkMobile(userPhone, yzmcode);
  if (isSuccess.success) {
    return post(API.saveShopSubscribe, obj)
      .then(data => {
        return data
      })
  } else {
    throw new Error(isSuccess.data.msg);
  }
}

function combine(state, action) {
  state.shopDetailsList.push({
    id: action.data.id,
    data: action.data.details
  })
  return state.shopDetailsList;
}

function setTimeLabel(data) {
  let { sysSubSer, weekDay } = data;
  let DataTime = [];
  let children = sysSubSer.map((v, i) => {
    return {
      value: v.subscribeTime,
      label: v.subscribeTime,
    }
  });
  return weekDay.filter(v => v.status).map((v, i) => {
    if (i == 0) {
      return {
        value: v.date,
        label: v.date,
        children: setChildrenToday(v.date, sysSubSer)
      }
    }
    return {
      value: v.date,
      label: v.date,
      children: children
    }
  })
}

function setChildrenToday(day, sysSubSer) {
  return sysSubSer.map((v, i) => {
    return {
      value: v.subscribeTime,
      label: v.subscribeTime,
      disabled: validTime(day, v.subscribeTime.split("-")[1]),
    }
  });
}

function validTime(day, startTime) {
  var date1 = new Date(day.slice(0, 11) + " " + startTime);
  var date2 = new Date();
  if (date1.getTime() > date2.getTime()) {
    return false;
  } else {
    return true;
  }
  return false;
}

export default function reducer(state = initialState, action) {
  switch (action.type) {

    case actionTypes.REQUEST_SHOP_LIST:
      if (action.pageIndex == 1) {
        state = Object.assign({}, state, {
          shopList: action.data.rows,
          hasMore: action.data.total > action.pageIndex ? true : false
        })
      } else if (action.pageIndex > 1) {
        state = Object.assign({}, state, {
          shopList: state.shopList.concat(action.data.rows),
        })
      }
      break;

    case actionTypes.REQUEST_SHOP_DETAILS_LIST:
      state = Object.assign({}, state, {
        shopDetailsList: combine(state, action)
      })
      break;

    case actionTypes.REQUEST_LOCATION:
      state = Object.assign({}, state, {
        userLon: action.data.latitude,
        userLat: action.data.longitude,
      })
      break;

    case actionTypes.REQUEST_TIME_LIST:
      // state = Object.assign({}, state, {
      //   TimeDatasysSubSer: action.data.sysSubSer,
      //   TimeDataweekDay: action.data.weekDay
      // })
      state = Object.assign({}, state, {
        TimeDatasysSubSer: action.data.sysSubSer,
        TimeDataweekDay: action.data.weekDay,
        labelTime: setTimeLabel(action.data)
      })
      break;

    default:
      return state
  }
  return state
}