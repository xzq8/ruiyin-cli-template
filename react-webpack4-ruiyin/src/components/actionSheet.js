import React from 'react';

import { Button } from 'antd-mobile';

export function addAndChangeuser({visible,userList,cancel,add=()=>{},edit}) {
  return visible ?  <div className="actionSheet"><div className="goumaixuzhi">
        <div className="title"><span className="iconfont icon-guanbi1" onClick={cancel}></span> <div className="title">
            新增更换</div><span></span></div>
            <div className="add">
            <Button type="ghost" inline size="small" onClick={add} >新增游客</Button>
            </div>
            {
                userList.map((item,index)=>{
                    return    <div className="flex userinfo" key={index}>
                    <div className="left">游客</div>
                    <div className="left">
                        <p>{item.name}</p>
                        <p>身份证：{item.ids}</p>
                        <p>手机号：{item.tel}</p>

                    </div>
                    <div className="right">
                        <Button type="ghost" inline size="small" onClick={() => edit(index)} >编辑</Button>
                    </div>
                </div>
                })
            }
    </div></div>: null
}