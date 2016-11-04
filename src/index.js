import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import './css/reset.css';
import './css/index.css';

let root = 'https://raw.githubusercontent.com/facebook/react/';
let urls = [
  'facts/fiber-tests.txt',
  'master/scripts/fiber/tests-failing.txt',
  'master/scripts/fiber/tests-passing.txt'
];

Promise.all(urls.map(url => fetch(root + url).then(resp => resp.text())))
.then(function(values) {
  let [data, failingTests, passingTests] = values;
  ReactDOM.render(
    <App data={data} failingTests={failingTests} passingTests={passingTests} />,
    document.getElementById('root')
  );
});
