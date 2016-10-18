import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import './css/reset.css';
import './css/index.css';

fetch('https://raw.githubusercontent.com/facebook/react/facts/fiber-tests.txt')
.then(response => response.text())
.then((data) => {
  ReactDOM.render(
    <App data={data} />,
    document.getElementById('root')
  );
});
