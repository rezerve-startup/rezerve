import React, { Component } from "react";
import { FormControl, InputGroup, Nav, NavItem } from "react-bootstrap";
import {
  AiOutlineUser,
  AiOutlineSearch,
  AiOutlineInbox,
  AiOutlineFilter,
} from "react-icons/ai";
import { NavLink } from 'react-router-dom';
import { BiMap } from "react-icons/bi";
import 'font-awesome/css/font-awesome.min.css';
import "./Header.css";
import Sidebar from '../../sidebar.js'


class Header extends Component {
  render() {
    return (
      <>

      <div class="header">
        <div class="icons"> 
          <AiOutlineUser class="left-icon" />
          <AiOutlineInbox class="left-icon" />
          <BiMap class="right-icon" />
        </div>

        <Nav navbar className="navBar row col-10 offset-1">
          <NavItem className="navItem col-3 col-sm-3">
            <NavLink className="nav-link" to="#">
                Hair
            </NavLink>
          </NavItem>

          <NavItem className="navItem col-3 col-sm-3" id="leftBorder">
            <NavLink className="nav-link" to="#">
                Nail
            </NavLink>
          </NavItem>

          <NavItem className="navItem col-3 col-sm-3" id="leftBorder">
            <NavLink className="nav-link" to="#">
                Barber
            </NavLink>
          </NavItem>
          
          <NavItem className="navItem col-3 col-sm-3" id="leftBorder">
            <NavLink className="nav-link" to="#">
                <span className="fa fa-home fa-lg"></span> <br/>
                House&nbsp;Calls
            </NavLink>
          </NavItem>
        </Nav>

        <div className="row">
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

        
      </div>

      </>
    );
  }
}

export default Header;
