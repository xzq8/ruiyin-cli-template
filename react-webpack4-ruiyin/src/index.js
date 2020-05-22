import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import configStore from "./redux/configStore";
import { login , getOpenId } from './redux/modules/index';
import { parseQuery } from "./utils"
import './index.css';
import "./css/index.scss";
import "./static/font/iconfont.css"
// import VConsole from '../node_modules/vconsole/dist/vconsole.min.js';

import App from './App';
import * as serviceWorker from './serviceWorker';
// var paramsJson = parseQuery(window.location.search)
// var CODE = paramsJson.code;
// CODE && getOpenId(CODE)
// // let vConsole = new VConsole();
// login(()=>{
//   console.log("获取微信成功")
// })
const store = configStore()

ReactDOM.render(<Provider store={store}>
    <App />
  </Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
