import React, { Component } from 'react'
import { HashRouter, BrowserRouter, Route, Switch } from 'react-router-dom'
import './App.css';
import { connect } from 'react-redux';
import RouterProvider from './containers/RouterProvider';
import indexPage from "./containers/indexPage"
import Details from './containers/details'
import Submit from './containers/submit'
import Login from './containers/Login'
import { parseQuery } from "./utils"
import { getOpenId, login, getlocation } from './redux/modules/index'

export class App extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentWillMount() {
    var paramsJson = parseQuery(window.location.search)
    var CODE = paramsJson.code;
    CODE && getOpenId(CODE)
    let { getlocation } = this.props
    // login((userLat,userLon)=>{
    //   getlocation(userLat,userLon)
    // })
  }
  componentDidMount() {

  }

  render() {

    return <BrowserRouter
      basename="/BookGYM"
    >
      <div className="rootdiv">
        <Switch>
          <RouterProvider exact path="/" component={indexPage}>
          </RouterProvider>
          <RouterProvider path="/Details/:id" component={Details}></RouterProvider>
          <RouterProvider path="/Submit/:id" component={Submit}></RouterProvider>
          <Route path="/Login" component={Login}></Route >
        </Switch>
      </div>
    </BrowserRouter>

  }
}
function mapStateToProps(state) {
  return {
    Index: state.Index
  }
}

export default connect(mapStateToProps, { getlocation })(App)