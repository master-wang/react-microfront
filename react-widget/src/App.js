import React, { Component } from 'react';
// import { constants } from '@common';
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
    // console.log(constants)
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.l
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn Reactsdad------
          </a>
          <Test />
        </header>
      </div>
    );
  }
}

export default App;
