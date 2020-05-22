// var base = "http://tpc.nat300.top"
// var base = "http://192.168.241.139:8999"
var base = process.env.NODE_ENV == 'development'  ?  "https://demo.jsruiyin.com" : ""
console.log(process.env.SECRET_CODE)
// var base = ""
//获取预约列表
export const getshopAPI = base + '/res/shop/detail/v1/getNearbyShops';
export const getshopDetailsAPI = base + '/res/shop/detail/v1/getProdSubscribe';
export const saveShopSubscribe = base + '/res/shop/ShopSubscribe/v1/saveShopSubscribe';
export const listDataProdSub = base + '/res/shop/ShopSubscribe/v1/listDataProdSub';
export const checkMobile = base + '/res/base/v1/checkMobile';
export const sendMsg = base + '/res/base/v1/sendMsg';
export const login = base + '/res/wx/wxMessage/v1/getSignature';
export const openid = base + '/res/wx/wxMessage/v1/getOpenId2';

// export const login = base + '/res/wx/wxMessage/v1/getSignatureWx';
// export const openid = base + '/res/wx/wxMessage/v1/getOpenId';
