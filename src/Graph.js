import React from 'react';
import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryScatter,
} from 'victory';

// const GREEN = "#8ec56a";
const BLACK = "#262626";
const DGRAY = "#666";
const LGRAY = "#ccc";

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

function Graph(props) {
  let start = props.data[0].date;
  let end = props.data[props.data.length - 1].date;
  let tickValues = [start, end];
  return (
    <div className="Graph">
      <svg viewBox={`0 0 ${props.width - 30} 230`}>
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
            data={props.data}
            domain={{x: [start, end], y: [0, 100]}}
            interpolation="basis"
            scale={{x: "time", y: "linear"}}
            style={styles.line}
          />
          <VictoryScatter
            events={[{
              target: "data",
              eventHandlers: {
                onMouseOver: (event, data) => {
                  console.log(event.pageX, event.pageY, data);
                }
              }
            }]}
            data={props.data}
            domain={{x: [start, end], y: [0, 100]}}
            scale={{x: "time", y: "linear"}}
          />
        </VictoryChart>
      </svg>
    </div>
  );
}

export default Graph;
