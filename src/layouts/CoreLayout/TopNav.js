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
          <LinkContainer to={{pathname: '/subjects'}}>
            <NavItem eventKey={2}>Subjects</NavItem>
          </LinkContainer>
          <LinkContainer to={{pathname: '/collections'}}>
            <NavItem eventKey={3}>Collections</NavItem>
          </LinkContainer>
          <LinkContainer to={{pathname: '/test'}}>
            <NavItem eventKey={4}>Test</NavItem>
          </LinkContainer>
          <LinkContainer to={{pathname: '/admin'}}>
            <NavItem eventKey={5}>Administration</NavItem>
          </LinkContainer>
        </Nav>
      </Navbar.Collapse>
    );
    return (
      <Navbar inverse={true} className='nav'>
        <Navbar.Header>
          <Navbar.Brand>
            <LinkContainer to={{pathname: '/'}}>
              <a>Temple University Password Research</a>
            </LinkContainer>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        {this.props.testing ? null : navItems}
      </Navbar>
    );
  }
}
