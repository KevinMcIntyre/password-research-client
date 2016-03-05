import React from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

export default class TopNav extends React.Component {
  constructor() {
    super();
  }

  render() {
    let navItems = (
        <Navbar.Collapse>
        <Nav pullRight={true}>
          <LinkContainer to={{pathname: '/'}}>
            <NavItem eventKey={1}>Home</NavItem>
          </LinkContainer>
          <LinkContainer to={{pathname: '/upload'}}>
            <NavItem eventKey={2}>Upload</NavItem>
          </LinkContainer>
          <LinkContainer to={{pathname: '/test'}}>
            <NavItem eventKey={3}>Test</NavItem>
          </LinkContainer>
        </Nav>
      </Navbar.Collapse>
    );
    return (
      <Navbar inverse={true} className='nav'>
        <Navbar.Header>
          <Navbar.Brand>
            <a href='#'>Temple University Password Research</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        {this.props.testing ? null : navItems}
      </Navbar>
    );
  }
}
