import * as React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import * as $ from "jquery";

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
                        <LinkContainer exact to="/" className="home-nav">
                            <NavItem>Home</NavItem>
                        </LinkContainer>
                        <LinkContainer exact to="/AnimalLabel">
                            <NavItem>Predict</NavItem>
                        </LinkContainer>
                        {/* <LinkContainer exact to="/Reports">
                            <NavItem>Reports</NavItem>
                        </LinkContainer> */}
                        <LinkContainer exact to="/Contact">
                            <NavItem>Contact</NavItem>
                        </LinkContainer>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}