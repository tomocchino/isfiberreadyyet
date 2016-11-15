import React from 'react';

const testStatus = {
  passing:'\u2705 passing',
  failingInDev: '\uD83D\uDEA7 passing, except dev-only behavior',
  failing: '\u274C failing',
};

function getTooltipContent(data) {
  let fileparts = data.file.split('/');
  let filename = fileparts.pop();
  let filepath = fileparts.join('/').replace(/\/__tests__/, '');
  let testname = data.test.slice(2);
  return `${filename}\n→ ${filepath}\n\nit("${testname}")\n${testStatus[data.status]}`;
}

class HeatMap extends React.Component {

  shouldComponentUpdate() {
    return false;
  }

  render() {
    let props = this.props;
    let index = 0;
    let testData = {};

    Object.keys(props.rawTestData).forEach((status) => {
      props.rawTestData[status].split("\n\n").forEach((testGroup) => {
        let lines = testGroup.split("\n");
        let file = lines[0];
        let tests = lines.slice(1);
        if (!testData[file]) { testData[file] = {}; }
        testData[file][status] = tests.map((test) => {
          return (
            <a
              key={index++}
              target="_blank"
              data-tooltip={getTooltipContent({file, test, status})}
              className={`Test ${status}`}
              href={`https://github.com/facebook/react/blob/master/${file}`}
            />
          );
        });
      });
    });

    let items = [];
    Object.keys(testData).forEach((file) => {
      let testList = testData[file];
      items = items.concat(Object.keys(testList).map((status) => {
        return testList[status];
      }));
    });

    let handleMouseOver = (event) => {
      let node = event.target;
      if (node.nodeName === 'A') {
        props.onMouseOver(event, node.getAttribute('data-tooltip'));
      }
    };

    return (
      <div
        className="HeatMap"
        onMouseOut={props.onMouseOut}
        onMouseOver={handleMouseOver}>
        {items}
      </div>
    );
  }
}

export default HeatMap;
