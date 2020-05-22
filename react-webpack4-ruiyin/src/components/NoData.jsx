import React from 'react';
import nodata from '../static/img/nodata.png';

class NoData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  
  render() {
    return (
        <div style={{ backgroundColor: 'white', height: '100%', textAlign: 'center' }}>
            {/* <p>No Internet</p> */}
            <img  src={nodata} alt="" style={{width:"1.31rem",height:"1.06rem",marginTop:"2rem"}}/>
            <p style={{fontSize:"18px",color:"rgba(153,153,153,1)",marginTop:"0.3rem"}}>暂无数据</p>
        </div>
    );
  }
}

export default NoData;