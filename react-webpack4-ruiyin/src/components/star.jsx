import React, { Component } from 'react';

export default class Star extends Component {
    constructor(props) {
        super(props)
        this.state = {
            num: this.props.num / 2,
            arr: [1, 2, 3, 4, 5]
        }
    }
    render() {
        return (

            <span>
                {
                    this.state.arr.map((ele, index) => {
                        return (
                            <span key={index}>
                                {ele > this.state.num ? <span style={{ color: "#FFAC2D", fontSize: "20px" }}>☆</span> : <span style={{ color: "#FFAC2D", fontSize: "20px" }}>★</span>}
                            </span>
                        )
                    })
                }
                {this.state.num.toFixed(1)}分
            </span>
        )
    }
}