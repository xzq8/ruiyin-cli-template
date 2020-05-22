import React, { Component } from 'react'
import { connect } from 'react-redux';
import "../css/submit.scss";
import { Menu, ActivityIndicator, List, Stepper, Toast, Picker } from 'antd-mobile';
import { getShopDetailsList, sendMsg, submit, getDatasList } from "../redux/modules/index"
import { wxSetDocumentTitle } from '../utils/wxSetDocumentTitle';
import { formatYMD, getNowHours } from '../utils/index';

const Item = List.Item;
const Brief = Item.Brief;

class Submitpage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            details: {},
            num: 1, // 人数
            selectindex: 0,
            userPhone: "", // 电话
            remarks: "",
            userName: "",
            yzmcode: "",
            sValue: "",
            visible: false,
            liked: true,
            count: 60,
            today: formatYMD(),
            nowTime: getNowHours(),
        }
    }
    componentDidMount() {
        wxSetDocumentTitle("提交");

        this.setState({
            details: JSON.parse(sessionStorage.getItem("storeInfo") || "{}")
        })
        let { Index, match, getShopDetailsList } = this.props
        let currentshopDetails = Index.shopDetailsList.filter((v) => v.id == match.params.id)[0]
        !currentshopDetails && getShopDetailsList(match.params.id)
    }

    onChange = (key) => (val) => {
        this.setState({ [key]: val });
    }

    submit = () => {
        let { remarks, userName, userPhone, yzmcode, num, selectindex, sValue } = this.state
        var openIdJson = JSON.parse(sessionStorage.getItem("openId") || "{}")
        if (!(openIdJson.openId) || openIdJson.openId == "null") {
            return Toast.fail("微信授权失败")
        }
        if (!sValue) {
            return Toast.fail("请选择时间")
        }
        if (isNaN(num)) {
            return Toast.fail("请输入正确的人数")
        } else if (num <= 0) {
            return Toast.fail("人数不得为零")
        }
        if (!userName || !userPhone) {
            return Toast.fail("姓名和手机号必填")
        }
        if (!userName || !userName.match(/^[\u4e00-\u9fa5]*$/g)) {
            return Toast.fail("姓名必须为中文")
        }
        if (!(/^1[3456789]\d{9}$/.test(userPhone))) {
            return Toast.fail("手机号码有误，请重填")
        }
        if (!(/^\d{6}$/.test(yzmcode))) {
            return Toast.fail("请输入正确的验证码")
        }

        let { Index, match } = this.props
        let currentshopDetails = Index.shopDetailsList.filter((v) => v.id == match.params.id)[0]
        let yudingxiangmu = currentshopDetails.data[selectindex]
        let currentTime = sValue[1]
        let currentTimeobj = Index.TimeDatasysSubSer.filter((v) => v.subscribeTime == currentTime)[0]

        var DataSTr = sValue[0].slice(0, 11);
        // var DataSTring = new Date().getFullYear() + "-" + DataSTr;
        submit({
            shopId: currentshopDetails.id,
            serviceId: yudingxiangmu.id,
            serviceDetailId: currentTimeobj.id,
            appUserSubscribeDate: DataSTr,
            appUserSubscribeTime: currentTime,
            appUserSubscribeCount: num,
            userName, //姓名
            userPhone,
            openId: openIdJson.openId,
            nikeName: openIdJson.wxUserInfo ? openIdJson.wxUserInfo.nickname : "",
            remarks,
            yzmcode
        }).then(res => {
            Toast.success(res.data ? res.data.msg : "预约成功")
            if(res.success){
                this.props.history.replace("/")
            }
        }).catch(err => {
            return Toast.fail(err.message ? err.message : err)
        })
    }
    getCode() {
        let userPhone = this.state.userPhone
        if (!(/^1[3456789]\d{9}$/.test(userPhone))) {
            return Toast.fail("手机号码有误，请重填")
        }
        let count = this.state.count;
        if (this.timer) {
            clearInterval(this.timer);
        }
        this.setState({ liked: false })
        this.timer = setInterval(() => {
            this.setState({ count: (--count) }, () => {
                if (count === 0) {
                    clearInterval(this.timer);
                    this.setState({
                        liked: true,
                        count: 60
                    })
                }
            });
        }, 1000);
        sendMsg(this.state.userPhone).then((res) => {
            Toast.success("发送成功")
        }).catch((e) => {
            Toast.fail(e)
        })
    }
    onTimeChange = (value) => {
        this.setState({
            sValue:value,
            visible:false
        })
    }
    chooseTime = () => {
        let { selectindex } = this.state
        let { Index, match, getDatasList } = this.props
        let currentshopDetails = Index.shopDetailsList.filter((v) => v.id == match.params.id)[0]
        if (!currentshopDetails.data.length) {
            Toast.fail("该商家没有预约服务")
            return false;
        }
        !Index.labelTime.length  && getDatasList(match.params.id, currentshopDetails.data[selectindex].id, () => {
            this.setState({ visible: true })
        })
    }
    onMaskClick = () => {
        this.setState({
            visible: false,
        });
    }
    handleClick = (e) => {
        e.preventDefault(); // Fix event propagation on Android
        this.setState({
            visible: !this.state.visible,
        });
        this.chooseTime()
    }

    render() {
        let details = this.state.details
        let shopDetailsList = this.props.Index.shopDetailsList.filter(v => v.id == this.props.match.params.id)[0]
        let { labelTime } = this.props.Index
        let { selectindex, visible, liked, count, today } = this.state
        console.log(this.state.sValue)
        return (
            <div className="container">
                <div className="pagehe">
                    <div className="basepage">
                        <div className="yellow">
                            <p>近期到店前请预约，进店请佩戴口罩。特殊时期，商家可能无法100%保证预约成功，敬请谅解</p>
                        </div>
                    </div>
                    <div className="basepage">
                        <div className="xiangmu">
                            <div className="title">服务项目(选填)</div>
                            <ul className="xiangmubody">
                                {shopDetailsList && shopDetailsList.data.map((item, index) => {
                                    return <li key={index} className={selectindex == index ? "selected" : ""}
                                        onClick={() => {
                                            this.setState({
                                                selectindex: index,
                                                sValue: ""
                                            })
                                        }}
                                    >
                                        <p className="xiangmubiaoti">{item.prodName}</p>
                                        {/* <p>预定时间<i>{item.subscribeTime}</i></p> */}
                                        <p>已约{item.bills}</p>
                                    </li>
                                    // return <div className="reserveMsg">
                                    //     <div className="resImg">
                                    //         <img src={`https://demo.jsruiyin.com/res/oss/file/v1/getFile/${item.probPhotos}?width=180&height=180`} alt="" />
                                    //     </div>
                                    //     <div className="resTxt">
                                    //         <p>{item.prodName}</p>
                                    //         <p>预定时间<i>{item.subscribeTime}</i></p>
                                    //         <p>已约{item.bills}</p>
                                    //     </div>
                                    // </div>
                                })}
                            </ul>
                        </div>
                        <List className="my-list">
                            {/* <Picker
                                className="shijian"
                                visible={visible}
                                data={seasons}
                                title="选择时间"
                                cascade={false}
                                extra="请选择"
                                value={this.state.sValue}
                                onDismiss={() => this.setState({ visible: false })}
                                onChange={v => this.setState({ sValue: v })}
                                onOk={v => this.setState({ sValue: v, visible: false })}
                            >
                                <List.Item
                                    className="my-item"
                                    arrow="horizontal" onClick={this.chooseTime}>时间</List.Item>
                            </Picker> */}
                            <div className={visible ? "menu-active" : ""}>
                                <Item
                                    className="my-item top-nav-bar"
                                    arrow="horizontal"
                                    extra={this.state.sValue || "请选择时间"}
                                    onClick={this.handleClick}>时间</Item>
                                {visible ? labelTime.length ? <Menu
                                    className="foo-menu"
                                    data={labelTime}
                                    value={this.state.sValue}
                                    onChange={this.onTimeChange}
                                    height={document.documentElement.clientHeight * 0.6}
                                /> : <div style={{ width: '100%', height: document.documentElement.clientHeight * 0.6, display: 'flex', justifyContent: 'center' }}>
                                        <ActivityIndicator size="large" />
                                    </div> : null}

                            </div>
                            <Item
                                className="my-item"
                                extra={<Stepper
                                    style={{ width: '100%', minWidth: '100px' }}
                                    showNumber
                                    max={10}
                                    min={1}
                                    value={this.state.num}
                                    onChange={this.onChange("num")}
                                />}
                            >人数</Item>
                        </List>
                    </div>
                    {visible ? <div className="menu-mask" onClick={this.onMaskClick} /> : null}
                    <div className="basepage">
                        <div className="input-label">
                            <label>
                                <p className="name">手机号码：</p>
                                <input type="tel" name="userPhone" id="userPhone"
                                    value={this.state.userPhone}
                                    onChange={(e) => this.onChange("userPhone")(e.target.value)}
                                    placeholder="请输入手机号码" />
                            </label>
                        </div>
                        <div className="input-label">
                            <label>
                                <p className="name">验证码：</p>
                                <div>
                                    <input type="tel" name="yzmcode"
                                        value={this.state.yzmcode}
                                        onChange={(e) => this.onChange("yzmcode")(e.target.value)}
                                        id="yzmcode" placeholder="验证码" />
                                    {
                                        liked ? <p className="yzm" onClick={this.getCode.bind(this)}>点击获取</p>
                                            : <p className="yzm">{count + 's'}</p>
                                    }
                                    {/* <p id="onlytime">60s</p> */}
                                </div>
                            </label>
                        </div>
                        <div className="input-label">
                            <label>
                                <p className="name">姓名：</p>
                                <input type="name" name="userName"
                                    value={this.state.userName}
                                    onChange={(e) => this.onChange("userName")(e.target.value)}
                                    id="userName" placeholder="请输入完整姓名" />
                            </label>
                        </div>
                        <div className="input-label">
                            <label className="beizhu">
                                <p className="name">备注：</p>
                                <textarea type="text" name="remarks"
                                    value={this.state.remarks}
                                    onChange={(e) => this.onChange("remarks")(e.target.value)}
                                    id="remarks" placeholder="可将你的要求告知商家"></textarea>
                            </label>
                        </div>
                    </div>

                    <div className="basepage noboder">
                        <div className="xuzhi">
                            <h5>预订须知：</h5>
                            <p>支付后需要等待商家接单，预计15分钟内通知结果</p>
                        </div>
                        <div className="xuzhi">
                            <h5>退款规则：</h5>
                            <p><i id="today">今天</i>前可以取消退款</p>
                        </div>

                        {/* <div className="submit" id="submit">提交</div> */}
                    </div>
                </div>
                <div className="mfyy">
                    <p></p>
                    <div className="submit" id="submit" onClick={this.submit}>免费预约</div>
                </div>

            </div>

        )
    }
}
export default connect(state => {
    const { Index } = state;
    return {
        Index
    };
}, {
    getShopDetailsList,
    getDatasList
})(Submitpage)
