import React from 'react';

function getTooltipContent(testString) {
  let [file, test] = testString.split('::');
  let fileparts = file.split('/');
  let filename = fileparts.pop();
  let filepath = fileparts.join('/').replace(/\/__tests__/, '');
  let testname = test.slice(2);
  let passfail = test.slice(0, 1) === '+' ? "\u2705 passing" : "\u274C failing";
  let tooltip = `${filename}\n→ ${filepath}\n\nit("${testname}")\n${passfail}`;
  return tooltip;
}

class HeatMap extends React.Component {

  shouldComponentUpdate() {
    return false;
  }

  render() {
    let props = this.props;
    let index = 0;
    let items = props.testData.map((testString) => {
      let [file, test] = testString.split('::');
      let href = 'https://github.com/facebook/react/blob/master/' + file;
      let className = "Test" + (test.slice(0, 1) === '+' ? ' passing' : '');
      return <a key={index++} href={href} className={className} target="_blank" />;
    });

    function handleMouseOver(event) {
      let node = event.target;
      if (node.nodeName === 'A') {
        let index = Array.prototype.slice.call(node.parentNode.children).indexOf(node);
        props.onMouseOver(event, getTooltipContent(props.testData[index]));
      }
    }

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
