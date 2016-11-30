import React from 'react';

class IsItReady extends React.Component {

  shouldComponentUpdate() {
    return false;
  }

  render() {
    let data = this.props.data;
    let decision = data.passing === data.total;
    let subtext = decision ?
      `Holy shit!` :
      `It's like ${data.percent}% done, though.`;
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
