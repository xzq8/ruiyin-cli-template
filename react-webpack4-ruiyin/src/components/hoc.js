import React, { Component } from 'react';

// 详情页 需要id 和status
export function orderDetailsIsRender(WrappedComponent) {
    return class Warpper extends Component {
        componentDidMount() {
            const { getOrderDetail, match, order } = this.props;
            let id = match.params.id;
            let current = order.OrderDetail[id]
            if (!current) {
                getOrderDetail(match.params.id)
            }
        }

        render() {
            const { match, order } = this.props;
            let {id,status} = match.params;
            let current = order.OrderDetail[id] || {}
            if (!current) return null;
            return <WrappedComponent {...this.props} status={status} current={current} ></WrappedComponent>
        }
    }
}