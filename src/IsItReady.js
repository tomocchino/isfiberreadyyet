import React from 'react';

function IsItReady(props) {
  let data = props.data;
  let decision = data.passing === data.total;
  let subtext = decision ?
    `Holy shit!` :
    `It's like ${data.percent}% done, though.`;
  return (
    <div className="IsItReady">
      <h1>{decision ? 'Yes' : 'No'}</h1>
      <a href="https://github.com/facebook/react/issues/7925" target="_blank">
        {subtext}
      </a>
    </div>
  );
}

export default IsItReady;
