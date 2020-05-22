// 首页
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { wxSetDocumentTitle } from '../utils/wxSetDocumentTitle';
import { loginforOpenid } from "../redux/modules/index"
import { parseQuery } from '../utils'
export default class IndexPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    componentDidMount() {
        wxSetDocumentTitle("登录");
        let RedirectUrl = this.props.location.state ? this.props.location.state.from.pathname : '/'
        console.log(RedirectUrl)
        // let query = parseQuery(this.props.location.search)
        // if(query && query.from){
        //     loginforOpenid("#"+query.from)
        // }else{
            loginforOpenid(RedirectUrl)
        // }
    }

    

    render() {
        return <div className="scroller">
                <p style={{textAlgin:"center"}}>
                    微信授权登录中。。。
                </p>
        </div>
    }
}