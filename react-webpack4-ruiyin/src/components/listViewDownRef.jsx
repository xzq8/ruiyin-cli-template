import React from 'react'
import { connect } from 'react-redux'
import { PullToRefresh, Toast } from 'antd-mobile';
import { getJingDianList } from "../redux/modules/index"

class ListViewPageDownRef extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
        };
    }

    componentDidMount() {
        let { getJingDianList, Index } = this.props;
        let { pageIndex } = Index
        pageIndex === 1 && getJingDianList("", (num) => {

        });
    }

    onRefresh = () => {
        let { getJingDianList, Index } = this.props;
        const { hasMore } = Index;
        if (this.state.isLoading || !hasMore) {
            return Toast.success("没有更多内容");
        }
        this.setState({ refreshing: true });
        getJingDianList("", (num) => {
            this.setState({ refreshing: false });
        });
    }

    render() {
        const { Index } = this.props
        return (
            <PullToRefresh
                ref={el => this.ptr = el}
                direction={'up'}
                refreshing={this.state.refreshing}
                className="jindianlist"
                onRefresh={this.onRefresh}
            >
                {Index.jingDianList.map((obj, rowID) => (
                    <div key={rowID} style={{ padding: '0 .5rem', borderBottom: "1px solid #ddd" }} onClick={() => { this.props.history.push(obj.scenicSpotType == 2 ? `/hotelorder/${obj.scenicSpotNo}` : `/jingdian/${obj.scenicSpotNo}`); }}>
                        <div style={{ display: 'flex', padding: '1rem 0' }}>
                            <img className="pic" src={obj.filePath} alt="" />
                            <div className="listBody">
                                <div className="title">{obj.scenicSpotName +( obj.grade? `(${Index.pingfen[obj.grade - 1]})` : "")}</div>
                                <div className="dec ellipsis"><span></span>{obj.title}</div>
                                <div className="dec"><span>开放时间：</span>{obj.openTime}</div>
                                <div className="dec"><span>景点地址：</span>{obj.scenicSpotUrl}</div>
                                <div><span className="money">{obj.price}¥</span>起  随买随用</div>
                            </div>
                        </div>
                    </div>
                ))}

            </PullToRefresh>
        );
    }
}


function mapStateToProps(state) {
    return {
        Index: state.Index
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getJingDianList: (val, cb) => {
            dispatch(getJingDianList(val, cb))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListViewPageDownRef)