import React, { Component } from 'react';
import './App.css';

import {
AreaChart,
XAxis,
YAxis,
CartesianGrid,
Tooltip,
Area,
} from 'recharts';

let content = `\
84f8df1f891285b8ff85880631d7882c30b2ced3	2016-09-26 22:05:31	663/1434
59ff7749eda0cd858d5ee568315bcba1be75a1ca	2016-09-28 02:52:46	663/1438
f6fdfd1bf0d13e51098a6009c2c85687b1245c9b	2016-10-03 15:00:24	663/1439
b77a96e49645cb14254da47065f89e934274df16	2016-10-11 18:13:24	662/1439
b728fa0c1796f1050399386d168816654c76c1c1	2016-10-12 09:22:19	662/1441
3b708728b011fdab90c1bcb27d40837de1393cac	2016-10-12 09:24:05	662/1439
f38e0cb6ac73d6a5538497b7a40c73e278230913	2016-10-13 08:33:18	662/1441
0d20dcf9108811f632bfeb76a6bd3bf05d11865b	2016-10-14 10:38:13	662/1442
f33f03e3572d11e6810f4ce110eb3af97cbd24a8	2016-10-15 17:23:07	660/1463\
`;

content = content.split('\n');
console.log(content);

const data = [
  { name: 'Page A', value: 4000},
  { name: 'Page B', value: 3000},
  { name: 'Page C', value: 2000},
  { name: 'Page D', value: 2780},
  { name: 'Page E', value: 1890},
  { name: 'Page F', value: 2390},
  { name: 'Page G', value: 3490},
];

class App extends Component {
  render() {
    return (
      <AreaChart width={730} height={250} data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <XAxis dataKey="name" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Area type="monotone" dataKey="value" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
      </AreaChart>
    );
  }
}

export default App;
