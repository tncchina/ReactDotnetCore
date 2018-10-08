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
                        <LinkContainer exact to="/" className="home-nav" onClick={this.onNavItemClick}>
                            <NavItem>Home</NavItem>
                        </LinkContainer>
                        <NavDropdown id="label-dropdown" onClick={this.onNavDropdownClick} eventKey={3} title="Wildlife Label">
                            <LinkContainer exact to="/AnimalLabel" className="label-nav">
                                <MenuItem onClick={this.onLabelItemsClick} eventKey={3.1}>Predict</MenuItem>
                            </LinkContainer>
                        </NavDropdown>
                        <LinkContainer exact to="/Reports" onClick={this.onNavItemClick}>
                            <NavItem>Reports</NavItem>
                        </LinkContainer>
                        <LinkContainer exact to="/Contact" onClick={this.onNavItemClick}>
                            <NavItem>Contact</NavItem>
                        </LinkContainer>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }

    private onNavItemClick() {
        document.getElementById("label-dropdown")!.style.backgroundColor = "";
    }

    private onNavDropdownClick() {
        $(".home-nav").removeClass('active');
    }

    private onLabelItemsClick() {
        debugger;
        setTimeout(() => {
            $(".label-nav").removeClass('active');
            document.getElementById("label-dropdown")!.style.backgroundColor = "#e7e7e7";
        });
    }
}