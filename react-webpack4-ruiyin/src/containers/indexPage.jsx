// 首页
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { wxSetDocumentTitle } from '../utils/wxSetDocumentTitle';
import { getShopList } from "../redux/modules/index"
import "../css/home.scss";
import MyFlatList from '../components/MyFlatList';

class IndexPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    componentDidMount() {
        wxSetDocumentTitle("首页");
    }

    godetail(item) {
        var info = JSON.stringify(item)
        sessionStorage.setItem('storeInfo', info);
        this.props.history.push("/Details/" + item.id)
    }

    render() {
        const { getShopList, Index } = this.props;
        const { shopList } = Index;
        console.log(shopList)
        return <div className="scroller">
            <ul className="wrapper_ul">
                <MyFlatList
                    BaseData={shopList}
                    getData={(pageNum, pageSize, cb) => getShopList(pageNum, pageSize, cb)}
                    renderItem={(item, index) => {
                        return <li key={item.id + index}>
                            <div className="pro">
                                <div onClick={() => { this.godetail(item) }}>
                                    <div className="pro_container">
                                        {
                                            item.shopPhotos ?
                                                <img src={`/res/oss/file/v1/getFile/${item.shopPhotos.split(",")[0]}?width=170&height=170`} alt="" /> :
                                                <img src={require('../static/img/reservePic.png')} alt="" />
                                        }

                                        <div className="pro_body">
                                            <div className="pro_title">{item.shopName}</div>
                                            <div className="pro_introduce">
                                                <img src={require('../static/img/time.png')} alt="" className="timeicon" />
                                                <div><i></i>营业时间：{item.openTime}</div>
                                            </div>
                                            <div className="pro_introduce juli">
                                                <img src={require('../static/img/yyan.png')} alt="" className="yuyueicon" />
                                                <p >{item.distance}km</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pro_detail">
                                        <div className="pro_addr">
                                            <div>{item.shopAddress}</div>
                                        </div>
                                        <div className="phone">
                                            <a href={`tel:${item.tel}`}>
                                                <img src={require('../static/img/dh1.png')} alt="" className="phoneicon" />
                                            </a>
                                        </div>

                                    </div>
                                    {/* <div className="pro_img">
                                        {
                                            item.shopPhotos && item.shopPhotos.split(",").map((photoimg, photoindex) => {
                                                return <img key={photoindex} src={`${photoimg}?width=170&height=170`} alt="" />
                                            })
                                        }
                                    </div> */}
                                </div>
                                <div className="pro_detail_1" onClick={() => this.props.history.push("/Submit/" + item.id)}>
                                    <div className="pro_detailImg">
                                        <img src={require('../static/img/ding.png')} alt="" />
                                        <div>立即预约</div>
                                    </div>
                                    <div>
                                        <img src={require('../static/img/gg.png')} style={{ width: ".1rem" }} alt="" />
                                    </div>
                                </div>
                            </div>
                        </li>
                    }
                    }
                />
            </ul>
        </div>
    }
}

export default connect(state => {
    const { Index } = state;
    return {
        Index
    };
}, {
    getShopList,
})(IndexPage)