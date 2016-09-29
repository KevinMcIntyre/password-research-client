import React from 'react';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
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
            <NavItem eventKey={1}>Run a Test</NavItem>
          </LinkContainer>
          <NavDropdown eventKey={2} title='Administration' id='basic-nav-dropdown'>
            <LinkContainer to={{pathname: '/subjects'}}>
              <MenuItem eventKey={2.1}>Subjects</MenuItem>
            </LinkContainer>
            <LinkContainer to={{pathname: '/collections'}}>
              <MenuItem eventKey={2.2}>Image Collections</MenuItem>
            </LinkContainer>
            <LinkContainer to={{pathname: '/configurations'}}>
              <MenuItem eventKey={2.3}>Test Configurations</MenuItem>
            </LinkContainer>
            <MenuItem eventKey={2.4} onClick={() => {
              window.location.href='http://localhost:7000/export'
            }}>Export Data</MenuItem>
          </NavDropdown>
        </Nav >
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
        { this.props.isTesting ? '' : navItems }
      </Navbar>
    );
  }
}
