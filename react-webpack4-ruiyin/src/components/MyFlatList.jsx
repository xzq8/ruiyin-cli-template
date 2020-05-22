import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import { PullToRefresh, ListView, Button } from 'antd-mobile';
import NoData from "./NoData"
export default class MyFlatList extends Component {
    constructor(props) {
        super(props);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });

        this.state = {
            dataSource,
            refreshing: true,
            hasMore: true,
            isLoading: true,
            height: document.documentElement.clientHeight,
            useBodyScroll: true,
        };
        this.NUM_ROWS = 10;
        this.pageIndex = 1;
    }

    // genData(pIndex = 0) {
    //     const dataArr = [];
    //     for (let i = 0; i < this.props.BaseData.length; i++) {
    //         dataArr.push(`row - ${(this.pIndex * this.props.BaseData.length) + i}`);
    //     }
    //     return dataArr;
    // }

    componentDidMount() {
        const hei = this.state.height - ReactDOM.findDOMNode(this.lv).offsetTop;
        this.props.getData(this.pageIndex, this.NUM_ROWS, (ok, total) => {
            this.pageIndex++
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.props.BaseData),
                height: hei,
                refreshing: false,
                hasMore: total < this.pageIndex ? false : true,
                isLoading: false,
            });
        })
    }
    // componentWillReceiveProps(nextProps) {
    //     if (nextProps.BaseData !== this.props.BaseData) {
    //         this.setState({
    //             dataSource: this.state.dataSource.cloneWithRows(nextProps.dataSource),
    //         });
    //     }
    // }
    onRefresh = () => {
        this.setState({ refreshing: true, isLoading: true });
        // simulate initial Ajax
        this.pageIndex = 1
        setTimeout(() => {
            this.props.getData(this.pageIndex, this.NUM_ROWS, (ok, total) => {
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(this.props.BaseData),
                    refreshing: false,
                    hasMore: total < this.pageIndex ? false : true,
                    isLoading: false,
                });
            })
        }, 600);

    };
    onEndReached = (event) => {
        // load new data
        // hasMore: from backend data, indicates whether it is the last page, here is false
        if (this.state.isLoading || !this.state.hasMore) {
            return;
        }
        console.log('reach end', event);
        this.setState({ isLoading: true });
        setTimeout(() => {
            this.props.getData(this.pageIndex, this.NUM_ROWS, (ok, total) => {
                this.pageIndex++
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(this.props.BaseData),
                    isLoading: false,
                    hasMore: total < this.pageIndex ? false : true,
                });
            })
        }, 600);
    };


    render() {
        let { renderItem, BaseData } = this.props
        const row = (rowData, sectionID, rowID) => {
            return (
                <div key={rowID}
                    style={{
                        backgroundColor: 'white',
                    }}
                >
                    {renderItem(rowData, rowID)}
                </div>
            );
        };

        return (
            <div>
                {BaseData.length > 0 ? <ListView
                    key={'0'}
                    ref={el => this.lv = el}
                    dataSource={this.state.dataSource.cloneWithRows(this.props.BaseData)}
                    // renderHeader={() => <span>Pull to refresh</span>}
                    renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
                        {this.state.isLoading ? '正在加载...' : '加载完成'}
                    </div>)}
                    renderRow={row}
                    useBodyScroll={true}
                    style={{
                        height: this.state.height,
                    }}
                    pullToRefresh={<PullToRefresh
                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefresh}
                    />}
                    onEndReached={this.onEndReached}
                    pageSize={10}
                />
                    : <PullToRefresh
                        ref={el => this.lv = el}
                        direction={'down'}
                        refreshing={this.state.refreshing}
                        className="jindianlist"
                        onRefresh={this.onRefresh}
                    ><NoData
                        />
                    </PullToRefresh>
                }
            </div>
        )
    }
}
