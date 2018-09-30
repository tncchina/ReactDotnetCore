import * as React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

export class NavMenu extends React.Component {
    public render() {

        return (
            <Navbar fluid collapseOnSelect>
                <Navbar.Header>
                    <Navbar.Brand>
                        <Link to="/">Wildlife Labelling</Link>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav pullRight>
                        <LinkContainer to="/">
                            <NavItem>Home</NavItem>
                        </LinkContainer>
                        <NavDropdown eventKey={3} title="Wildlife Label" id="basic-nav-dropdown">
                            <LinkContainer to="/AnimalLabel">
                                <MenuItem eventKey={3.1}>Predict</MenuItem>
                            </LinkContainer>
                        </NavDropdown>
                        <LinkContainer to="/Reports">
                            <NavItem>Reports</NavItem>
                        </LinkContainer>
                        <LinkContainer to="/Contact">
                            <NavItem>Contact</NavItem>
                        </LinkContainer>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}