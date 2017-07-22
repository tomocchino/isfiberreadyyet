import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import rawGraphData from './data/fiber-tests.js';
import passing from './data/tests-passing.js';
import failingInDev from './data/tests-passing-except-dev.js';
import failing from './data/tests-failing.js';

import './css/reset.css';
import './css/index.css';

let root = 'https://raw.githubusercontent.com/facebook/react/';
let urls = [
  'facts/fiber-tests.txt',
  'master/scripts/fiber/tests-passing.txt',
  'master/scripts/fiber/tests-passing-except-dev.txt',
  'master/scripts/fiber/tests-failing.txt'
];

function processGraphData(rawGraphData) {
  let toInt = (str) => parseInt(str, 10);
  return rawGraphData.trim().split('\n').map((string, index) => {
    let [gitHash, dateStr, progress] = string.split(/[\t]/);
    let dateParts = dateStr.split(/[ :-]/).map(toInt);
    let [year, month, day, hours, minutes, seconds] = dateParts;
    let date = new Date(year, month - 1, day, hours, minutes, seconds);
    let timestamp = date.getTime();
    let [passing, total] = progress.split(/\//).map(toInt);
    let percent = parseFloat(((passing / total) * 100).toFixed(1), 10);
    return {index, gitHash, date, dateStr, timestamp, total, passing, percent, x: date, y: percent};
  });
}

function renderEverything([rawGraphData, passing, failingInDev, failing]) {
  let root = document.getElementById('root');
  let testData = {passing, failingInDev, failing};
  let graphData = processGraphData(rawGraphData);
  let render = () => {
    ReactDOM.render(
      <App
        width={root.clientWidth}
        testData={testData}
        graphData={graphData}
        mostRecent={graphData[graphData.length - 1]}
      />,
      root
    );
  }
  window.addEventListener('resize', render, false);
  render();
}

let useLocal = false;
if (useLocal) {
  renderEverything([rawGraphData, passing, failingInDev, failing]);
} else {
  Promise
    .all(urls.map(url => fetch(root + url).then(resp => resp.text())))
    .then(renderEverything);
}
