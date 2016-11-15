import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import './css/reset.css';
import './css/index.css';

let root = 'https://raw.githubusercontent.com/facebook/react/';
let urls = [
  'facts/fiber-tests.txt',
  'master/scripts/fiber/tests-passing.txt',
  'master/scripts/fiber/tests-passing-except-dev.txt',
  'master/scripts/fiber/tests-failing.txt'
];

Promise.all(
  urls.map(
    url => fetch(root + url).then(resp => resp.text())
  )
).then(([rawGraphData, passing, failingInDev, failing]) => {
  let root = document.getElementById('root');
  let rawTestData = {passing, failingInDev, failing};
  let render = () => {
    ReactDOM.render(
      <App
        width={root.clientWidth}
        rawTestData={rawTestData}
        rawGraphData={rawGraphData}
      />,
      root
    );
  }
  window.addEventListener('resize', render, false);
  render();
});
