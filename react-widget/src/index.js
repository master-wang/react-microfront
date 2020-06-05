/* eslint-disable no-undef */
/* eslint-disable no-loop-func */
import React from 'react';
import ReactDOM from 'react-dom';
import * as singleSpa from 'single-spa';
import axios from 'axios';
// import SystemJS from 'systemjs';
import _ from 'lodash';
// import common from '@common';
import './index.css';
import App from './App';

ReactDOM.render(<App/>, document.getElementById('root'));

const projects = [
  {
    // project1
    name: 'project1',
    entry: 'http://localhost:4002',
    hash: true,
    prefix: ['^#/project1']
  }
];

projects.forEach(({
  name,
  entry,
  hash,
  prefix
}) => {
  singleSpa.registerApplication(
    name,
    async () => {
      const { data: entryFiles } = await axios.get(`${entry}/asset-manifest.json`);
      var main = entry+entryFiles['main.js'];
      var cssFiles = entryFiles.css || [];
      var jsFiles = [entry+entryFiles['runtime~main.js'],entry+(entryFiles['static/js/0.chunk.js'] || entryFiles['static/js/1.chunk.js'])];
      console.log(main)
      console.log(jsFiles)
      loadCss(cssFiles);
      await loadJs(jsFiles);
      return SystemJS.import(main);
    },
    (location) => {
      if (!prefix) {
        return true;
      }
      if (_.isString(prefix)) {
        prefix = [prefix];
      }
      const reg = new RegExp(prefix.join('|'));
      if (hash) {
        return reg.test(location.hash);
      }
      return reg.test(location.pathname);
    }
  );
});

singleSpa.start();

