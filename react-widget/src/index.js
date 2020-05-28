import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

export const init = (config) => {
  ReactDOM.render(<App/>, document.getElementById('root'));
}
init()
