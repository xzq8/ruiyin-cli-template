// 首页
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Route, Link, Redirect, withRouter } from 'react-router-dom';
import { parseQuery } from "../utils"

export default class RouterProvider extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        var paramsJson = parseQuery(window.location.search)
        var CODE = paramsJson.code;
        let { component, path } = this.props;
        let MyComponent = component
        let openIdJson = JSON.parse(sessionStorage.getItem("openId") || "{}");
        return <Route
            path={path}
            exact
            render={(props) => {
                // return ((openIdJson.openId && openIdJson.openId != "null" )  || CODE) ? (
                    return (true) ? (
                    <MyComponent  {...props} />
                ) : (
                        <Redirect
                            to={{
                                pathname: "/Login",
                                state: { from: props.location }
                            }}
                        />
                    )
            }
            }
        />

    }
}