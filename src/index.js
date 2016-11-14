import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import './css/reset.css';
import './css/index.css';

let root = 'https://raw.githubusercontent.com/facebook/react/';
let urls = [
  'facts/fiber-tests.txt',
  'master/scripts/fiber/tests-failing.txt',
  'master/scripts/fiber/tests-passing.txt',
  'master/scripts/fiber/tests-passing-except-dev.txt'
];

Promise.all(
  urls.map(
    url => fetch(root + url).then(resp => resp.text())
  )
).then(([rawGraphData, failingTests, passingTests, failingInDevTests]) => {
  let root = document.getElementById('root');
  let render = () => {
    ReactDOM.render(
      <App
        width={root.clientWidth}
        rawGraphData={rawGraphData}
        failingTests={failingTests}
        passingTests={passingTests}
        failingInDevTests={failingInDevTests}
      />,
      root
    );
  }
  window.addEventListener('resize', render, false);
  render();
});
