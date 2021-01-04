import React, { Component } from "react";
import { FormControl, InputGroup, Nav } from "react-bootstrap";
import {
  AiOutlineUser,
  AiOutlineSearch,
  AiOutlineInbox,
  AiOutlineFilter,
} from "react-icons/ai";
import { BiMap } from "react-icons/bi";
import "./Header.css";
import Sidebar from "../sidebar"

class Header extends Component {
  render() {
    return (
      <>
      <Sidebar/>
      <div class="header">
        <div class="icons">
          <AiOutlineUser class="left-icon" />
          <AiOutlineInbox class="left-icon" />
          <BiMap class="right-icon" />
        </div>
        <Nav justify class="nav justify-content-center">
          <Nav.Item>
            <Nav.Link href="/forum">Forum</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="/book">Book</Nav.Link>
          </Nav.Item>
        </Nav>
        <InputGroup class="search">
          <InputGroup.Prepend>
            <InputGroup.Text id="search">
              <AiOutlineSearch />
            </InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            placeholder="Search"
            aria-label="Search"
            aria-describedby="search"
          />
          <InputGroup.Append>
            <InputGroup.Text>
              <AiOutlineFilter />
            </InputGroup.Text>
          </InputGroup.Append>
        </InputGroup>
      </div>
      </>
    );
  }
}

export default Header;
