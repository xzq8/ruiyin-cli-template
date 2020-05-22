import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getShopDetailsList } from "../redux/modules/index"
import { Carousel } from 'antd-mobile';
import { wxSetDocumentTitle } from '../utils/wxSetDocumentTitle';

import "../css/details.scss";

class Details extends Component {
    constructor(props) {
        super(props)
        this.state = {
            imgHeight: "4.5rem",
            details: {}
        }
    }
    componentDidMount() {
        wxSetDocumentTitle("商家");
        this.setState({
            details: JSON.parse(sessionStorage.getItem("storeInfo") || "{}")
        })
        let { Index, match, getShopDetailsList } = this.props
        let currentshopDetails = Index.shopDetailsList.filter((v) => v.id == match.params.id)[0]
        !currentshopDetails && getShopDetailsList(match.params.id)
    }


    render() {
        let details = this.state.details
        let bannerlist = details.shopPhotos ? details.shopPhotos.split(",") : []
        let shopDetailsList = this.props.Index.shopDetailsList.filter(v => v.id == this.props.match.params.id)[0]
        return (
            <div className="reserveDetail">
                <Carousel
                    autoplay={false}
                    infinite
                    beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
                    afterChange={index => console.log('slide to', index)}
                >
                    {bannerlist.map((val, index) => (
                        <a
                            key={index}
                            href="javascript:void(0);"
                            style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
                        >
                            <img
                                src={`/res/oss/file/v1/getFile/${val}?width=750&height=566`}
                                alt=""
                                style={{ width: '100%', verticalAlign: 'top' }}
                                onLoad={() => {
                                    // fire window resize event to change height
                                    window.dispatchEvent(new Event('resize'));
                                    this.setState({ imgHeight: this.state.imgHeight });
                                }}
                            />
                        </a>
                    ))}

                </Carousel>
                <div className="maincontainer">
                    <div className="storeMessage">
                        <h3 className="storeName">{details.shopName}</h3>
                        <div className="jiankgn">
                            <img src={require("../static/img/jiankang.png")} alt="" />
                            <ul className="jiankang_body">
                                <li>
                                    <img src={require("../static/img/right.png")} alt="" />
                                    <p>全面消毒</p>
                                </li>
                                <li>
                                    <img src={require("../static/img/right.png")} alt="" />
                                    <p>佩戴口罩</p>
                                </li>
                                <li>
                                    <img src={require("../static/img/right.png")} alt="" />
                                    <p>全员测温</p>
                                </li>
                            </ul>
                            {/* <img src={require('../static/img/gg.png')} style={{ width: ".1rem" }} alt="" /> */}
                        </div>
                        <div className="storeOpen">
                            <div className="openImg">
                                <img alt="" src={require("../static/img/time.png")} />
                            </div>
                            <p className="openTime">营业时间: <span className="openTimeCont">{details.openTime}</span></p>
                        </div>
                        <div className="mystar">
                            <div className="star-component star-readonly" data-rate="5"></div>
                        </div>

                        <div className="distanceMsg">
                            <div className="disContent">
                                <div className="disHeader">
                                    <p className="distance">{details.distance + "km"}</p>
                                    <p className="address">{details.shopAddress}</p>
                                </div>
                            </div>
                            <a className="phoneImg" href={`tel:${details.tel}`} >
                                <img alt="" src={require("../static/img/phone.png")} />
                            </a>
                        </div>
                    </div>
                    <div className="pro_detail_1" onClick={() => this.props.history.push("/Submit/" + details.id)}>
                        <div className="pro_detailImg">
                            <img src={require('../static/img/ding.png')} alt="" />
                            <div>立即预约</div>
                        </div>
                        <div>
                            <img src={require('../static/img/gg.png')} style={{ width: ".1rem" }} alt="" />
                        </div>
                    </div>
                    <div className="reserveContent">
                        <div className="reserveHeader">
                            <h3>预订服务</h3>
                            <div className="reserveState">
                                <img alt="" src={require("../static/img/okay.png")} />
                                <p className="stateTxt">随时可约</p>
                            </div>
                        </div>
                        <div className="yudingbox">
                            {shopDetailsList && shopDetailsList.data.map((item, index) => {
                                return <div className="reserveMsg" key={index}>
                                    <div className="resImg">
                                         <img src={`/res/oss/file/v1/getFile/${item.probPhotos}?width=180&height=180`} alt="" />
                                    </div>
                                    <div className="resTxt">
                                        <p>{item.prodName}</p>
                                        <p>预定时间<i>{item.subscribeTime}</i></p>
                                        <p>已约{item.bills}</p>
                                    </div>
                                </div>
                            })}
                        </div>

                    </div>
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
})(Details)
