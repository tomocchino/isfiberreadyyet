import React from 'react';

function handleMouseOver(event) {
  event.clientX > document.documentElement.clientWidth / 2 ?
    document.body.classList.add('flip') :
    document.body.classList.remove('flip');
}

function HeatMap(props) {
  let groups = props.testData;
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

export default HeatMap;
