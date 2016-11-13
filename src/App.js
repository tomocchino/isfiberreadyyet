import React from 'react';
import ProgressBar from './ProgressBar';
import IsItReady from './IsItReady';
import Graph from './Graph';
import HeatMap from './HeatMap';

function processGraphData(rawData) {
  let toInt = (str) => parseInt(str, 10);
  return rawData.trim().split('\n').map((string) => {
    let [gitHash, dateStr, progress] = string.split(/[\t]/);
    let dateParts = dateStr.split(/[ :-]/).map(toInt);
    let [year, month, day, hours, minutes, seconds] = dateParts;
    let date = new Date(year, month - 1, day, hours, minutes, seconds);
    let timestamp = date.getTime();
    let [passing, total] = progress.split(/\//).map(toInt);
    let percent = parseFloat(((passing / total) * 100).toFixed(1), 10);
    return {gitHash, date, timestamp, total, passing, percent, x: date, y: percent};
  });
}

function processTestData(passingTests, failingTests) {
  let groups = {};
  let groupsList = (
    passingTests.replace(/\n\*/g, "\n+") + "\n\n" +
    failingTests.replace(/\n\*/g, "\n-")
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

  return groups;
}

class App extends React.Component {

  render() {
    let props = this.props;
    let graphData = processGraphData(props.rawGraphData);
    let mostRecent = graphData[graphData.length - 1];
    let testData = processTestData(props.passingTests, props.failingTests);
    return (
      <div>
        <ProgressBar data={mostRecent} />
        <IsItReady data={mostRecent} />
        <Graph data={graphData} width={props.width} />
        <HeatMap testData={testData} />
      </div>
    );
  }

}

export default App;
