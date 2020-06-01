import React, { Component } from 'react';
import logo from './logo.svg';
import Test from './Test';
import './App.css';

class App extends Component {

  strlen(str){
    var len = 0;
    for (let i=0; i<str.length; i++) {
     let c = str.charCodeAt(i);
    //单字节加1
     if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {
       len++;
     }
     else {
      len+=2;
     }
    }
    return len;
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.l
          </p>
          <Test />
        </header>
      </div>
    );
  }
}

export default App;
