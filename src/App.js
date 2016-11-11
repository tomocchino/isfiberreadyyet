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

function handleMouseOver(event) {
  event.clientX > document.documentElement.clientWidth / 2 ?
    document.body.classList.add('flip') :
    document.body.classList.remove('flip');
}

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

function HeatMap(props) {
  let groups = {};
  let groupsList = (
    props.passingTests.replace(/\n\*/g, "\n+") + "\n\n" +
    props.failingTests.replace(/\n\*/g, "\n-")
  ).trim().split("\n\n");

  for (var ii = 0; ii < groupsList.length; ii++) {
    let group = groupsList[ii].split("\n");
    let file = group[0];
    let tests = group.slice(1);
    if (!groups[file]) { groups[file] = []; }
    groups[file] = groups[file].concat(tests).sort((line1, line2) => {
      return line1.slice(2) < line2.slice(2) ? -1 : 1;
    });
  }

  let index = 0;
  let items = [];
  Object.keys(groups).forEach((file) => {
    items = items.concat(groups[file].map((test) => {
      let filename = file.replace(/^src\//, '').replace('/__tests__/', "\n→ ");
      let testname = test.slice(2);
      let passfail = test.slice(0, 1) === '+' ? "\u2705 passing" : "\u274C failing";
      let className = "Test " + passfail;
      let tooltip = `→ ${filename} \n→ ${testname} \n\n${passfail}`;
      let href = 'https://github.com/facebook/react/blob/master/' + file;
      return (
        <a key={index++} className={className} href={href} target="_blank">
          <span className="Tooltip">
            <span>{tooltip}</span>
          </span>
        </a>
      );
    }));
  });

  return <div className="HeatMap" onMouseOver={handleMouseOver}>{items}</div>;
}

function App(props) {
  let data = processData(props.data);
  let mostRecent = data[data.length - 1];
  return (
    <div className="Container">
      <ProgressBar data={mostRecent} />
      <IsItReady data={mostRecent} />
      <Graph data={data} />
      <HeatMap failingTests={props.failingTests} passingTests={props.passingTests} />
    </div>
  );
}

export default App;
