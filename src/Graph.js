import React from 'react';
import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryScatter,
} from 'victory';

function getTooltipContent(data) {
  let gitHash = data.gitHash.slice(0, 7);
  let progress = `${data.passing} / ${data.total}`;
  let tooltip =`${data.dateStr}\n→ ${gitHash}\n\n${data.percent}%  (${progress})`;
  return tooltip;
}

const BLACK = "#262626";
const DGRAY = "#666";
const LGRAY = "#ccc";

class Graph extends React.Component {

  shouldComponentUpdate(nextProps) {
    return nextProps.width !== this.props.width;
  }

  render() {
    let props = this.props;
    let lastIndex = props.data.length - 1;
    let start = props.data[0].date;
    let end = props.data[lastIndex].date;

    let styles = {
      xAxis: {
        grid: {
          stroke: LGRAY,
          strokeWidth: (data) => data.index === lastIndex ? 1 : 0,
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
          fontSize: 14
        }
      },
      yAxis: {
        grid: {
          stroke: LGRAY,
          strokeWidth: (data) => data === 0 ? 0 : 1,
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
      scatter: {
        data: {
          strokeWidth: 10,
          stroke: "transparent",
          fill: (data) => data.index === lastIndex ? BLACK : "transparent"
        }
      }
    };

    function getObj(props, color) {
      return {
        style: Object.assign({}, props.style, {fill: color})
      };
    }

    return (
      <div className="Graph" onMouseOut={props.onMouseOut}>
        <svg viewBox={`0 0 ${props.width - 30} 230`}>
          <VictoryChart width={props.width} height={250}>
            <VictoryAxis
              scale="time"
              standalone={false}
              style={styles.xAxis}
              tickFormat={(date, index) => {
                return index === 0 || index === props.data.length - 1 ?
                  `${date.getMonth() + 1}/${date.getDate()}` :
                  '';
              }}
              tickValues={props.data.map((d) => d.date)}
            />
            <VictoryAxis
              dependentAxis
              domain={[0, 100]}
              style={styles.yAxis}
              tickFormat={(x) => `${x}%`}
              tickValues={[0, 25, 50, 75, 100]}
            />
            <VictoryLine
              data={props.data}
              domain={{x: [start, end], y: [0, 100]}}
              interpolation="basis"
              scale={{x: "time", y: "linear"}}
              style={styles.line}
            />
            <VictoryScatter
              data={props.data}
              domain={{x: [start, end], y: [0, 100]}}
              scale={{x: "time", y: "linear"}}
              style={styles.scatter}
              events={[{
                eventHandlers: {
                  onMouseOver: (event, point) => {
                    props.onMouseOver(event, getTooltipContent(point.datum));
                    return [{
                      mutation: (props) => {
                        return getObj(props, BLACK);
                      }
                    }];
                  },
                  onMouseOut: (event, point) => {
                    return [{
                      mutation: (props) => {
                        let color = point.index === lastIndex ? BLACK : "transparent";
                        return getObj(props, color);
                      }
                    }];
                  },
                  onClick: (event, point) => {
                    let hash = point.datum.gitHash;
                    let url = `https://github.com/facebook/react/commit/${hash}`;
                    window.open(url);
                  }
                }
              }]}
            />
          </VictoryChart>
        </svg>
      </div>
    );
  }
}

export default Graph;
