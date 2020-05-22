import React, { Component } from 'react';
import { Link } from "react-router-dom";

export default class SearchResult extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    render() {
        let {Index} = this.props
        return (
            <div className="search">
                {
                    Index.jingDianListForSearch.map((item,index)=>{
                        return <li key={index}>
                            <Link to={item.scenicSpotType == 2 ? `/hotelorder/${item.scenicSpotNo}` : `/jingdian/${item.scenicSpotNo}`}>
                            {
                                item.scenicSpotName + `(${item.grade ? Index.pingfen[item.grade - 1] : ""})`
                            }</Link>    
                        </li>
                    })
                }
            </div>
        )
    }
}