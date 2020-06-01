import React from 'react';
import common from '@common';
import { HashRouter as Router, Route, Link} from "react-router-dom";
import Home from './home';
import About from './about';

const Test = () => {
  console.log(common)
  const { constants, component:{ Root } } = common;

  return (
  <div>
    这是common里面的公共变量：a: {constants.a}, test: {constants.test}
    <h1>这是common的组件</h1>
    <Root />
    <div>
    <Router>
      <div>
        <Link to="/home">Home</Link>
        <br/>
        <Link to="/project1">project1</Link>
      </div>
      <Route path="/home" component={Home} />
      <Route path="/project1" component={About} />

    </Router>
    </div>
    <div id="project"></div>
  </div>
  );
}

export default Test;
