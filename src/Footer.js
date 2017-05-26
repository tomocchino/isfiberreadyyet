import React from 'react';

function FooterLink(props) {
  let href = `https://github.com/${props.href}`;
  return (
    <a target="_blank" rel="noopener noreferrer" className="FooterLink" href={href}>
      {props.children}
    </a>
  );
}

class Footer extends React.Component {

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <div className="Footer">
        <FooterLink href="facebook/react/issues/7942">
          Principles
        </FooterLink>
        &middot;
        <FooterLink href="acdlite/react-fiber-architecture">
          What is Fiber?
        </FooterLink>
        &middot;
        <FooterLink href="tomocchino/isfiberreadyyet">
          Website Source
        </FooterLink>
      </div>
    );
  }
}

export default Footer;
