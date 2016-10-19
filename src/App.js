import React from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const processData = function(rawData) {
  return rawData
    .replace(/\n$/) // remove trailing newline
    .split('\n')
    .map((string) => {
      let [hash, date, time, passingString, totalString] = string.split(/\s+|\//);
      let title = date.split('-').slice(1).join('/');
      let total = parseInt(totalString, 10);
      let passing = parseInt(passingString, 10);
      let failing = total - passing;
      return {title, failing, passing, total, hash, date, time};
    });
}

const toPercent = (decimal, fixed = 0) => {
  return (decimal * 100).toFixed(fixed) + '%';
};

const getPercent = (value, total) => {
  let ratio = total > 0 ? value / total : 0;
  return toPercent(ratio, 2);
};

const renderTooltipContent = (object) => {
  let {payload} = object;
  let data = payload[0].payload;
  let total = data.total;
  let dateArray = data.date.split('-');
  let date = dateArray.slice(1).concat(dateArray[0]).join('/');

  return (
    <div className="tooltip">
      <p className="total">{date} - {total} tests</p>
      <ul>
        {
          payload.map((entry, index) => (
            <li key={index} style={{color: entry.color}}>
              {entry.name}: {entry.value} ({getPercent(entry.value, total)})
            </li>
          ))
        }
      </ul>
    </div>
  );
};

function ProgressBar(props) {
  return (
    <div className="ProgressBar">
      <div style={{width: props.percentage}} />
    </div>
  );
}

function Graph(props) {
  return (
    <div className="Graph">
      <ResponsiveContainer>
        <AreaChart
          data={props.data}
          height={300}
          stackOffset="expand"
          margin={{top: 10, right: 20}}>
          <defs>
            <linearGradient id="purple" x1="0" y1="0" x2="0" y2="1">
              <stop stopColor="#8884d8" stopOpacity={0.8} offset="0%"/>
              <stop stopColor="#8884d8" stopOpacity={0.2} offset="100%"/>
            </linearGradient>
            <linearGradient id="green" x1="0" y1="0" x2="0" y2="1">
              <stop stopColor="#82ca9d" stopOpacity={0.8} offset="0%"/>
              <stop stopColor="#82ca9d" stopOpacity={0.2} offset="100%"/>
            </linearGradient>
          </defs>
          <XAxis dataKey="title" />
          <YAxis tickFormatter={toPercent} />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip content={renderTooltipContent} />
          <Area type='monotone' dataKey='failing' stackId="1" stroke='#8884d8' fill="url(#purple)" />
          <Area type='monotone' dataKey='passing' stackId="1" stroke='#82ca9d' fill="url(#green)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function IsItReady(props) {
  let subtext = props.decision ?
    `Holy shit!` :
    `But it's like ${props.percentage} done though.`;
  return (
    <div className="IsItReady">
      <h1>{props.decision ? 'Yes' : 'No'}</h1>
      <p>{subtext}</p>
    </div>
  );
}

function App(props) {
  let data = processData(props.data);
  let mostRecent = data[data.length - 1];
  let {passing, total} = mostRecent;
  let percent = getPercent(passing, total);
  return (
    <div className="Container">
      <IsItReady decision={passing === total} percentage={percent} />
      <ProgressBar percentage={percent} />
      <Graph data={data} />
    </div>
  );
}

export default App;
