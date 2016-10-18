import React, { Component } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

// Obviously temporary

let content = `\
84f8df1f891285b8ff85880631d7882c30b2ced3	2016-09-26 22:05:31	663/1434
59ff7749eda0cd858d5ee568315bcba1be75a1ca	2016-09-28 02:52:46	663/1438
f6fdfd1bf0d13e51098a6009c2c85687b1245c9b	2016-10-03 15:00:24	663/1439
b77a96e49645cb14254da47065f89e934274df16	2016-10-11 18:13:24	662/1439
b728fa0c1796f1050399386d168816654c76c1c1	2016-10-12 09:22:19	662/1441
3b708728b011fdab90c1bcb27d40837de1393cac	2016-10-12 09:24:05	662/1439
f38e0cb6ac73d6a5538497b7a40c73e278230913	2016-10-13 08:33:18	662/1441
0d20dcf9108811f632bfeb76a6bd3bf05d11865b	2016-10-14 10:38:13	662/1442
f33f03e3572d11e6810f4ce110eb3af97cbd24a8	2016-10-15 17:23:07	660/1463
9c25538e13bcd3cc473b69f6cbaec64e77ddd196	2016-10-18 03:53:31	733/1475\
`;

let data = content
  .split('\n')
  .map((string) => {
    let [hash, date, time, passingString, totalString] = string.split(/\s+|\//);
    let title = date.split('-').slice(1).join('/');
    let total = parseInt(totalString, 10);
    let passing = parseInt(passingString, 10);
    let failing = total - passing;
    return {title, failing, passing, total, hash, date, time};
  });

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
      <AreaChart
        data={data}
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
    );
  }
}

export default App;
