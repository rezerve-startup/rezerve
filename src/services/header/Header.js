import React, { Component } from "react";
import { FormControl, InputGroup, Nav } from "react-bootstrap";
import "./Header.css";

class Header extends Component {
  render() {
    return (
      <div class="header">
        <div class="icons">
          <p>icons</p>
        </div>
        <Nav justify class="nav justify-content-center">
          <Nav.Item>
            <Nav.Link href="/forum">Forum</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="/book">Book</Nav.Link>
          </Nav.Item>
        </Nav>
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text id="search">@</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            placeholder="Search"
            aria-label="Search"
            aria-describedby="search"
          />
        </InputGroup>
      </div>
    );
  }
}

export default Header;
