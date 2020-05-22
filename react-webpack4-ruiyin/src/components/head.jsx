import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'

import { SearchBar } from 'antd-mobile';
import '../css/header.scss'
import { getJingDianList } from "../redux/modules/index"
import SearchResult from "../components/search"

class header extends Component {
    constructor(props) {
        super(props)
        this.state = {
            value: ""
        };
    }

    search = (value) => {
        const { getJingDianList } = this.props
        getJingDianList(value, (num) => {
        })
    }
    onChange = (value) => {
        this.setState({ value });
    };
    clear = () => {
        this.setState({ value: '' });
    };
    render() {
        let children = this.props.children
        let {value} = this.state
        return <Fragment ><div className="myheader">
            <div className="leftBack" onClick={() => { this.props.history.go(-1) }}>
                <i className={"iconfont icon-fanhui1"}></i>
            </div>
            {
                children ? children : <SearchBar
                    value={this.state.value}
                    onClear={this.clear}
                    onChange={this.onChange}
                    placeholder="Search"
                    maxLength={8}
                    onSubmit={this.search}
                />
            }
        </div>
            {value && <SearchResult  {...this.props} />}
        </Fragment>
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

export default connect(mapStateToProps, mapDispatchToProps)(header)