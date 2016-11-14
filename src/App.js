import React from 'react';
import ProgressBar from './ProgressBar';
import IsItReady from './IsItReady';
import Graph from './Graph';
import HeatMap from './HeatMap';

function processGraphData(rawData) {
  let toInt = (str) => parseInt(str, 10);
  return rawData.trim().split('\n').map((string, index) => {
    let [gitHash, dateStr, progress] = string.split(/[\t]/);
    let dateParts = dateStr.split(/[ :-]/).map(toInt);
    let [year, month, day, hours, minutes, seconds] = dateParts;
    let date = new Date(year, month - 1, day, hours, minutes, seconds);
    let timestamp = date.getTime();
    let [passing, total] = progress.split(/\//).map(toInt);
    let percent = parseFloat(((passing / total) * 100).toFixed(1), 10);
    return {index, gitHash, date, dateStr, timestamp, total, passing, percent, x: date, y: percent};
  });
}

function processTestData(passingTests, failingTests, failingInDevTests) {
  let groups = {};
  let groupsList = (
    passingTests.replace(/\n\*/g, "\n+").trim() + "\n\n" +
    failingInDevTests.replace(/\n\*/g, "\n~").trim() + "\n\n" +
    failingTests.replace(/\n\*/g, "\n-").trim()
  ).split("\n\n");

  for (var ii = 0; ii < groupsList.length; ii++) {
    let group = groupsList[ii].split("\n");
    let file = group[0];
    let tests = group.slice(1).map((test) => {
      return file + '::::' + test;
    });
    if (!groups[file]) { groups[file] = []; }
    groups[file] = groups[file].concat(tests).sort((line1, line2) => {
      return line1.slice(2) < line2.slice(2) ? -1 : 1;
    });
  }

  return Object.keys(groups)
    .map(group => groups[group])
    .reduce((a, b) => a.concat(b));
}

function Tooltip(props) {
  return (
    <div className="Tooltip" style={{left: props.left, top: props.top}}>
      <span>{props.content}</span>
    </div>
  );
}

class App extends React.Component {

  state = {
    tooltipData: null
  }

  handleMouseOver = (event, content) => {
    event.clientX > document.documentElement.clientWidth / 2 ?
      document.body.classList.add('flip') :
      document.body.classList.remove('flip');
    let rect = event.target.getBoundingClientRect();
    let left = rect.left + (rect.width / 2) + window.scrollX;
    let top = rect.top + window.scrollY;
    this.setState({tooltipData: {left, top, content}});
  }

  handleMouseOut = (event) => {
    this.setState({tooltipData: null});
  }

  render() {
    let props = this.props;
    let testData = processTestData(props.passingTests, props.failingTests, props.failingInDevTests);
    let graphData = processGraphData(props.rawGraphData);
    let mostRecent = graphData[graphData.length - 1];
    let tooltipData = this.state.tooltipData;
    let tooltip = tooltipData ? <Tooltip {...tooltipData} /> : null;

    return (
      <div>
        {tooltip}
        <ProgressBar data={mostRecent} />
        <IsItReady data={mostRecent} />
        <Graph
          width={props.width}
          graphData={graphData}
          onMouseOut={this.handleMouseOut}
          onMouseOver={this.handleMouseOver}
        />
        <HeatMap
          testData={testData}
          onMouseOut={this.handleMouseOut}
          onMouseOver={this.handleMouseOver}
        />
      </div>
    );
  }

}

export default App;
