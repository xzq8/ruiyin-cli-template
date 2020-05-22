import React from 'react'
import {connect} from 'react-redux'
import { ListView } from 'antd-mobile';
import { getJingDianList ,genData} from "../redux/modules/index"

class ListViewPage extends React.Component {
    constructor(props) {
        super(props);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.state = {
            dataSource,
            isLoading: true,
        };
    }

    componentDidMount() {
        let {getJingDianList,Index} = this.props;
        const {NUM_ROWS,pageIndex} = Index;
        getJingDianList(pageIndex,NUM_ROWS,(num) => {
            this.rData = genData(pageIndex,num);
            this.setState({
              dataSource: this.state.dataSource.cloneWithRows(this.rData),
              isLoading: false,
            });
          });
    }

  componentWillReceiveProps(nextProps) {
    if (nextProps.dataSource !== this.props.dataSource) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(nextProps.dataSource),
      });
    }
  }
    onEndReached = (event) => {
        console.log('reach end', event);
        let {getJingDianList,Index} = this.props;
        const {NUM_ROWS,pageIndex,hasMore} = Index;
        if (this.state.isLoading || !hasMore) {
            return;
        }
        this.setState({ isLoading: true });
        getJingDianList(pageIndex,NUM_ROWS,(num) => {
            this.rData = { ...this.rData, ...genData(pageIndex,num)};
            this.setState({
              dataSource: this.state.dataSource.cloneWithRows(this.rData),
              isLoading: false,
            })
        });
    }

    render() {
        const {Index} = this.props
        const separator = (sectionID, rowID) => (
            <div
                key={`${sectionID}-${rowID}`}
                style={{
                    backgroundColor: '#F5F5F9',
                    height: 8,
                    borderTop: '1px solid #ECECED',
                    borderBottom: '1px solid #ECECED',
                }}
            />
        );
        const data = Index.jingDianList;
        let index = 0;
        const row = (rowData, sectionID, rowID) => {
            if (index >=data.length ) {
                return
            }
            const obj = data[index++];
            return (
                <div key={rowID} style={{ padding: '0 15px' }} onClick={() => { this.props.history.push(obj.scenicSpotType == 2 ? `/hotelorder/${obj.scenicSpotNo}` : `/jingdian/${obj.scenicSpotNo}`); }}>
                    <div style={{ display: 'flex', padding: '15px 0' }}>
                        <img  className="pic" src={obj.filePath} alt="" />
                        <div className="listBody">
                            <div className="title">{obj.scenicSpotName+`(${Index.pingfen[obj.grade-0]})`}</div>
                            <div className="dec"><span></span>{obj.title}</div>
                            <div className="dec"><span>开放时间：</span>{obj.openTime}</div>
                            <div className="dec"><span>景点地址：</span>{obj.scenicSpotUrl}</div>
                            <div><span className="money">{obj.price}¥</span>起  随买随用</div>
                        </div>
                    </div>
                </div>
            );
        };
        return (
            <ListView
                ref={el => this.lv = el}
                dataSource={this.state.dataSource}
                renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
                    {this.state.isLoading ? 'Loading...' : 'Loaded'}
                </div>)}
                renderRow={row}
                renderSeparator={separator}
                className="am-list jindianlist"
                pageSize={10}
                useBodyScroll
                onScroll={() => { console.log('scroll'); }}
                scrollRenderAheadDistance={500}
                onEndReached={this.onEndReached}
                onEndReachedThreshold={10}
            />
        );
    }
}


function mapStateToProps(state) {
    return {
      Index:state.Index
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getJingDianList: (pageIndex,NUM_ROWS,cb) =>{
            dispatch(getJingDianList(pageIndex,NUM_ROWS,cb))
        }
      }
  }
  
  export default connect(mapStateToProps,mapDispatchToProps)(ListViewPage)