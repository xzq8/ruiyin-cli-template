import React, {Component} from 'react'
import { NavLink } from "react-router-dom";

import '../css/footer.scss';

export default class FooterMenu extends Component {
  constructor (props){
   super(props)
   this.state= {
     menu:[{
      title: '景点',
      icon: 'jingdian',
      link: '/',
      src : '',
      exact: true

    },{
      title: '订单',
      icon: 'lvsefenkaicankaoxianban-',
      link: '/order',
      exact: false
    }]
   }

}
   render() {
   return  <div className="footer-menu">
        <div className="footer-menu-items">
          {this.state.menu.map( (item, index) => {
            return (<div key={index} className="menu-item">
              <NavLink exact={item.exact} activeClassName={'active'} to={item.link}>
                <i className={"iconfont icon-" + item.icon}></i>
                <p>{item.title}</p>
              </NavLink>
            </div>);
          })}
        </div>
      </div>
   }
}