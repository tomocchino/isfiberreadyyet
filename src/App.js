import React from 'react';
import ProgressBar from './ProgressBar';
import IsItReady from './IsItReady';
import Graph from './Graph';
import HeatMap from './HeatMap';

function processGraphData(rawGraphData) {
  let toInt = (str) => parseInt(str, 10);
  return rawGraphData.trim().split('\n').map((string, index) => {
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
          rawTestData={props.rawTestData}
          onMouseOut={this.handleMouseOut}
          onMouseOver={this.handleMouseOver}
        />
      </div>
    );
  }

}

export default App;
