import React from 'react';

class Footer extends React.Component {

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <div className="Footer">
        <a href="https://github.com/facebook/react/issues/7942" target="_blank">
          Principles
        </a>
        &middot;
        <a href="https://github.com/acdlite/react-fiber-architecture" target="_blank">
          What is Fiber?
        </a>
      </div>
    );
  }
}

export default Footer;
