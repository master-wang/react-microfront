/* eslint-disable no-loop-func */
import React from 'react';
import ReactDOM from 'react-dom';
import * as singleSpa from 'single-spa';
import axios from 'axios';
import SystemJS from 'systemjs';
import _ from 'lodash';
import common from '@common';
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

var _LOADED_SCRIPTS_MAP = {};
var head = document.querySelector('head');
      var body = document.querySelector('body');
      function loadCss(urls) {
        for (var i = 0, len = urls.length; i < len; i++) {
          var link = document.createElement('link');
          link.rel= "stylesheet";
          link.href = urls[i];
          head.appendChild(link);
        }
      }
      function loadJs(urls, callback) {
        urls = typeof urls === 'string' ? [urls] : urls;
        var scripts = [];
        for (var i = 0, len = urls.length; i < len; i++) {
          if (!_LOADED_SCRIPTS_MAP[urls[i]]) {
            _LOADED_SCRIPTS_MAP[urls[i]] = true;
            scripts.push(urls[i]);
          }
        }
        var index = 0;
        var total = scripts.length;
        return new Promise(function(resolve, reject) {
          for (var j = 0; j < total; j++) {
            var script = document.createElement('script');
            script.onload = script.onreadystatechange = function() {
              var rs = this.readyState;
              if ('undefined' === typeof rs || 'loaded' === rs || 'complete' === rs) {
                index++;
                this.onload = script.onreadystatechange = null;
                if (index === total) {
                  callback && callback();
                  resolve();
                }
              }
            }
            script.src = scripts[j];
            body.appendChild(script);
          }
        });
      }

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
    // () => import('./app1/app1'),
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

