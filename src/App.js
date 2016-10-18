import React, { Component } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
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

class App extends Component {
  render() {
    return (
      <div className="Container">
        <AreaChart
          data={processData(this.props.data)}
          width={800}
          height={200}
          stackOffset="expand"
          margin={{top: 20, right: 30, left: 0, bottom: 0}}>
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop stopColor="#8884d8" stopOpacity={0.8} offset="0%"/>
              <stop stopColor="#8884d8" stopOpacity={0.2} offset="100%"/>
            </linearGradient>
            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
              <stop stopColor="#82ca9d" stopOpacity={0.8} offset="0%"/>
              <stop stopColor="#82ca9d" stopOpacity={0.2} offset="100%"/>
            </linearGradient>
          </defs>
          <XAxis dataKey="title" />
          <YAxis tickFormatter={toPercent} />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip content={renderTooltipContent} />
          <Area type='monotone' dataKey='failing' stackId="1" stroke='#8884d8' fill="url(#colorUv)" />
          <Area type='monotone' dataKey='passing' stackId="1" stroke='#82ca9d' fill="url(#colorPv)" />
        </AreaChart>
      </div>
    );
  }
}

export default App;
