import React from 'react';
import common from '@common';

export default class Root extends React.Component {
  render() {
    const { constants } = common;
    return (
      <div style={{marginTop: '10px'}}>
        这句话是跑在localhost:4002 的project1的项目,
        4002端口的服务也能读取公共端口的变量 a:{constants.a}
      </div>
    );
  }
}
