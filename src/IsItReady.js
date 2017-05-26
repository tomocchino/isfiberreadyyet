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
    let conjunction = decision ? 'and' : 'but';
    let details = decision ? null :
      <a href="https://github.com/facebook/react/issues/7925" rel="noopener noreferrer" target="_blank">
        {`${percent}% of unit tests passing, ${warnings} warnings left to fix`}
      </a>;

    return (
      <div className="IsItReady">
        <h1 className="IsItReadyText">{decision ? 'Yes' : 'No'}</h1>
        <p className="IsItReadySubtext">
          {`${conjunction} this page was rendered with it `}
          <span className="EmojiIcon">{'\u2705'}</span>
        </p>
        {details}
      </div>
    );
  }
}

export default IsItReady;
