import React from 'react';

class IsItReady extends React.Component {

  shouldComponentUpdate() {
    return false;
  }

  render() {
    let data = this.props.data;
    let warnings = this.props.numWarnings;
    let decision = data.passing === data.total && warnings === 0;
    let percent = data.percent;
    let subtext = decision ?
      `Holy shit!` :
      `It's ${percent}% done, though, with ${warnings} warnings left to fix.`;
    return (
      <div className="IsItReady">
        <h1 className="IsItReadyText">{decision ? 'Yes' : 'No'}</h1>
        <a href="https://github.com/facebook/react/issues/7925" target="_blank">
          {subtext}
        </a>
      </div>
    );
  }
}

export default IsItReady;
