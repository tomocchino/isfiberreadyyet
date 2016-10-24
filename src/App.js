import React from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

const processData = function(rawData) {
  return rawData
    .replace(/\n$/) // remove trailing newline
    .split('\n')
    .map((string) => {
      let [githash, date, time, passingStr, totalStr] = string.split(/\s+|\//);
      let label = date.split('-').slice(1).join('/');
      let total = parseInt(totalStr, 10);
      let passing = parseInt(passingStr, 10);
      let percent = ((passing / total) * 100).toFixed(1);
      return {label, total, passing, percent, githash, date, time};
    });
}

function ProgressBar(props) {
  let data = props.data;
  return (
    <div className="ProgressBar">
      <div style={{width: data.percent + "%"}}>
        {`${data.passing} of ${data.total} unit tests passing`}
      </div>
    </div>
  );
}

function Graph(props) {
  return (
    <div className="Graph">
      <ResponsiveContainer>
        <AreaChart data={props.data} height={300} margin={{top: 10, right: 20}}>
          <XAxis dataKey="label" />
          <YAxis domain={[0,100]} tickFormatter={(num) => num + '%'} />
          <Area type='monotone' dataKey='percent' stroke='#262626' fill="#000000" isAnimationActive={false} />
          <CartesianGrid strokeDasharray="3 3" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function IsItReady(props) {
  let data = props.data;
  let decision = data.passing === data.total;
  let subtext = decision ?
    `Holy shit!` :
    `But it's like ${data.percent}% done though.`;
  return (
    <div className="IsItReady">
      <h1>{decision ? 'Yes' : 'No'}</h1>
      <p>{subtext}</p>
    </div>
  );
}

function App(props) {
  let data = processData(props.data);
  let mostRecent = data[data.length - 1];
  return (
    <div className="Container">
      <ProgressBar data={mostRecent} />
      <IsItReady data={mostRecent} />
      <Graph data={data} />
    </div>
  );
}

export default App;
