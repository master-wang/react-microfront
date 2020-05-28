import axios from 'axios';
import { COMMON_BASE_URL, COMMON_BASE_URL2 } from './constants/index';

// function loadJs(urls, callback) {
//   var scripts = [];
//   var index = 0;
//   var total = scripts.length;
//   return new Promise(function(resolve, reject) {
//     for (var j = 0; j < total; j++) {
//       var script = document.createElement('script');
//       script.onload = script.onreadystatechange = function() {
//         var rs = this.readyState;
//         if ('undefined' === typeof rs || 'loaded' === rs || 'complete' === rs) {
//           index++;
//           this.onload = script.onreadystatechange = null;
//           if (index === total) {
//             callback && callback();
//             resolve();
//           }
//         }
//       }
//       script.src = scripts[j];
//       body.appendChild(script);
//     }
//   });
// }

const getRes = () => {
  axios.get(COMMON_BASE_URL + '/asset-manifest.json').then(function(res) {
    const main  =COMMON_BASE_URL+res.data['main.js'];
    const jsFiles = [COMMON_BASE_URL+res.data['runtime~main.js'],COMMON_BASE_URL+res.data['static/js/0.chunk.js']]
    console.log(res.data)
    console.log(main)
    console.log(jsFiles)
    // for (let j = 0; j < jsFiles.length; j++) {
    //   // var script = document.createElement('script');
    //   // script.src = jsFiles[j];
    //   // document.body.appendChild(script);
     
    // }
    // let script = document.createElement('script');
    // script.type = 'text/javascript';
    // script.src = 'http://localhost:4001/static/js/bundle.js';
    // document.body.appendChild(script); 
    // let script2 = document.createElement('script');
    // script2.type = 'text/javascript';
    // script2.src = 'http://localhost:4001/static/js/0.chunk.js';
    // document.body.appendChild(script2); 
  })
  axios.get(COMMON_BASE_URL2 + '/asset-manifest.json').then(function(res) {
    console.log(res)
  })
}

export {
  getRes
}