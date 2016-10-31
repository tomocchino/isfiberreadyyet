import React from 'react';
import {
  CartesianGrid,
  Dot,
  Line,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
} from 'recharts';

function processData(rawData) {
  return rawData.trim().split('\n').map((string) => {
    let [githash, date, passingStr, totalStr] = string.split(/\t|\//);
    let timestamp = new Date(date).getTime();
    let label = date.split(' ')[0].split('-').slice(1).join('/');
    let total = parseInt(totalStr, 10);
    let passing = parseInt(passingStr, 10);
    let percent = parseFloat(((passing / total) * 100).toFixed(1), 10);
    return {label, total, passing, percent, githash, date, timestamp};
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

function IsItReady(props) {
  let data = props.data;
  let decision = data.passing === data.total;
  let subtext = decision ?
    `Holy shit!` :
    `It's like ${data.percent}% done, though.`;
  return (
    <div className="IsItReady">
      <h1>{decision ? 'Yes' : 'No'}</h1>
      <a href="https://github.com/facebook/react/issues/7925" target="_blank">
        {subtext}
      </a>
    </div>
  );
}

function Graph(props) {
  return (
    <div className="Graph">
      <ResponsiveContainer>
        <ScatterChart data={props.data} height={300} margin={{top: 10, right: 10}}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" domain={['dataMin', 'dataMax']} tickCount={0} />
          <YAxis dataKey="percent" domain={[0,100]} tickFormatter={(num) => num + '%'} />
          <Scatter
            data={props.data}
            shape={<Dot r={5} className="Dot" />}
            isAnimationActive={false}
            line={
              <Line
                dot={false}
                type="basis"
                dataKey="percent"
                isAnimationActive={false}
                style={{stroke: "#666", strokeWidth: 3}}
              />
          }/>
        </ScatterChart>
      </ResponsiveContainer>
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
