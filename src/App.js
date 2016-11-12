import React from 'react';
import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
} from 'victory';

function handleMouseOver(event) {
  event.clientX > document.documentElement.clientWidth / 2 ?
    document.body.classList.add('flip') :
    document.body.classList.remove('flip');
}

function processData(rawData) {
  let toInt = (str) => parseInt(str, 10);
  return rawData.trim().split('\n').map((string) => {
    let [gitHash, dateStr, progress] = string.split(/[\t]/);
    let dateParts = dateStr.split(/[ :-]/).map(toInt);
    let [year, month, day, hours, minutes, seconds] = dateParts;
    let date = new Date(year, month - 1, day, hours, minutes, seconds);
    let timestamp = date.getTime();
    let [passing, total] = progress.split(/\//).map(toInt);
    let percent = parseFloat(((passing / total) * 100).toFixed(1), 10);
    return {gitHash, date, timestamp, total, passing, percent};
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


function LineGraph(props) {
  // const GREEN = "#8EC56A";
  const BLACK = "#262626";
  const DGRAY = "#666";
  const LGRAY = "#CCC";
  let styles = {
    axisDate: {
      grid: {
        stroke: LGRAY,
        strokeWidth: 1,
        strokeDasharray: "3 3"
      },
      axis: {
        stroke: BLACK,
        strokeWidth: 0
      },
      ticks: {
        size: 5,
        stroke: LGRAY,
        strokeWidth: 1
      },
      tickLabels: {
        fill: DGRAY,
        fontFamily: "inherit",
        fontSize: 14
      }
    },
    axisPercent: {
      grid: {
        stroke: LGRAY,
        strokeWidth: 1,
        strokeDasharray: "3 3"
      },
      axis: {
        stroke: BLACK,
        strokeWidth: 1
      },
      ticks: {
        size: 5,
        stroke: BLACK,
        strokeWidth: 1
      },
      tickLabels: {
        fill: DGRAY,
        fontFamily: "inherit",
        fontSize: 14,
      }
    },
    line: {
      data: {
        stroke: DGRAY,
        strokeWidth: 3
      }
    },
  };

  let dataSetOne = [];
  props.data.forEach((item) => {
    dataSetOne.push({x: item.date, y: item.percent});
  });

  let start = props.data[0].date;
  let end = props.data[props.data.length - 1].date;
  let tickValues = [start, end];

  return (
    <svg viewBox={`0 0 ${props.width - 30} 230`}>
      <g transform={"translate(0, -40)"}>
        <VictoryChart width={props.width} height={250}>
          <VictoryAxis
            scale="time"
            standalone={false}
            style={styles.axisDate}
            tickValues={tickValues}
            tickFormat={(date) => `${date.getMonth() + 1}/${date.getDate()}`}
          />
          <VictoryAxis
            dependentAxis
            domain={[0, 100]}
            style={styles.axisPercent}
            tickValues={[0, 25, 50, 75, 100]}
            tickFormat={(x) => `${x}%`}
          />
          <VictoryLine
            data={dataSetOne}
            domain={{
              x: [start, end],
              y: [0, 100]
            }}
            interpolation="basis"
            scale={{x: "time", y: "linear"}}
            style={styles.line}
          />
        </VictoryChart>
      </g>
    </svg>
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
      <LineGraph data={data} width={props.width} />
      <HeatMap failingTests={props.failingTests} passingTests={props.passingTests} />
    </div>
  );
}

export default App;
