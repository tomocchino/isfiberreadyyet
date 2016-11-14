import React from 'react';

let testStatus = {
  '+': {className: 'passing', string: '\u2705 passing'},
  '-': {className: 'failing', string: '\u274C failing'},
  '~': {className: 'failingInDev', string: '\uD83D\uDEA7 passing, except dev-only behavior'}
};

function getTooltipContent(testString) {
  let [file, test] = testString.split('::::');
  let fileparts = file.split('/');
  let filename = fileparts.pop();
  let filepath = fileparts.join('/').replace(/\/__tests__/, '');
  let testname = test.slice(2);
  let passfail = testStatus[test.slice(0, 1)].string;
  let tooltip = `${filename}\n→ ${filepath}\n\nit("${testname}")\n${passfail}`;
  return tooltip;
}

class HeatMap extends React.Component {

  shouldComponentUpdate() {
    return false;
  }

  render() {
    let testData = this.props.testData;
    let index = 0;
    let items = testData.map((testString) => {
      let [file, test] = testString.split('::::');
      let href = 'https://github.com/facebook/react/blob/master/' + file;
      let status = test.slice(0, 1);
      let className = "Test " + testStatus[status].className;
      return <a key={index++} href={href} className={className} target="_blank" />;
    });

    let handleMouseOver = (event) => {
      let node = event.target;
      if (node.nodeName === 'A') {
        let index = Array.prototype.slice.call(node.parentNode.children).indexOf(node);
        this.props.onMouseOver(event, getTooltipContent(testData[index]));
      }
    };

    return (
      <div
        className="HeatMap"
        onMouseOut={this.props.onMouseOut}
        onMouseOver={handleMouseOver}>
        {items}
      </div>
    );
  }
}

export default HeatMap;
