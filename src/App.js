import React from 'react';
import ProgressBar from './ProgressBar';
import IsItReady from './IsItReady';
import Graph from './Graph';
import HeatMap from './HeatMap';
import Footer from './Footer';

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
  let contentStyle = {
    right: props.flip ? -15 : 'auto',
    left: props.flip ? 'auto' : -15
  };
  return (
    <div className="Tooltip" style={{left: props.left, top: props.top}}>
      <span className="TooltipContent" style={contentStyle}>{props.content}</span>
    </div>
  );
}

class App extends React.Component {

  state = {
    tooltipData: null
  }

  handleMouseOver = (event, content) => {
    let rect = event.target.getBoundingClientRect();
    let left = Math.round(rect.left + (rect.width / 2) + window.scrollX);
    let top = Math.round(rect.top + window.scrollY);
    let flip = event.clientX > document.documentElement.clientWidth / 2;
    this.setState({tooltipData: {left, top, content, flip}});
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
        <Footer />
        {tooltip}
      </div>
    );
  }

}

export default App;
