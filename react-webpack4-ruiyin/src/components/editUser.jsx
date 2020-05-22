import React, { Component } from 'react'

import {List,InputItem } from 'antd-mobile';
import { createForm } from 'rc-form';

class editUser extends Component {
    constructor(props) {
        super(props)
        this.state = {
        };
    }

    finish = ()=>{
        if(!this.ischange()){
            return this.props.cancel()
        }
        this.props.submit(this.refs)
    }
    ischange(){
        let {user} = this.props
        let arr = ['name','ids','tel']
        for(let i = 0; i < arr.length; i++){
            let item = arr[i]
            if(!user){return true}
            if(user[item] !== this.refs[item].state.value.trim()){
                return true
            }
        }
        return false;
    }

    render() {

        let {children,title,visible,cancel,user,form} = this.props
        let userinfo = user || {} //空为新增
        if(!visible){
            return null;
        }
        const { getFieldProps } = form;
        return <div className="actionSheet"><div className="goumaixuzhi">
            <div className="title"><span className="iconfont icon-guanbi1" onClick={cancel}></span>
         <div className="title">{userinfo.id? children || title : "新增游客"}</div>
          <span  onClick={this.finish}>完成</span></div>
          <List className="my-list">
        <div className="ordertime">
        <div className="rows"  style={{display:"none"}}>
                <InputItem
                    clear
                    ref="id"
                    defaultValue={userinfo.id}
                    type="hidden"
                ></InputItem>
            </div>
            <div className="rows">
                <InputItem
                    {...getFieldProps('autofocus')}
                    clear
                    ref="name"
                    defaultValue={userinfo.name}
                >姓名</InputItem>
            </div>
            <div className="rows">
                <InputItem
                    value="身份证"
                    editable="false"
                >证件类型</InputItem>
            </div>
            <div className="rows">
                <InputItem
                    clear
                    defaultValue={userinfo.ids}
                    ref="ids"

                >身份证号</InputItem>
            </div>
            <div className="rows">
                <InputItem
                    clear
                    defaultValue={userinfo.tel}
                    ref="tel"
                >手机号码</InputItem>
            </div>
        </div>
        </List>
    </div></div>
    }
}

const EditUserWrapper = createForm()(editUser);
export default EditUserWrapper;
