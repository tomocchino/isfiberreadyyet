import React from 'react';

class IsItReady extends React.Component {

  shouldComponentUpdate() {
    return false;
  }

  render() {
    let data = this.props.data;
    let warnings = this.props.numWarnings;
    let decision = data.passing === data.total && warnings === 0;
    let passing = data.percent === 100 ? 'All' : data.percent + '% of';

    let mainText = decision ?
      <h1 className="IsItReadyText">Yes<i>{'\ud83c\udf89'}</i></h1> :
      <h1 className="IsItReadyText">No</h1>;

    let details = decision ? null :
      <p className="IsItReadyDetails">
        but there are still {warnings} warnings left to fix
      </p>;

    return (
      <div className="IsItReady">
        {mainText}
        <p>
          {passing} tests are passing and it's out to 100% of facebook
          <i>{'\u2705'}</i>
        </p>
        {details}
      </div>
    );
  }
}

export default IsItReady;
