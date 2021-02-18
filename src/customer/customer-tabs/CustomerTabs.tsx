import React from 'react';
// import { Dropdown, Nav, NavItem } from "react-bootstrap";
// import {
//   AiOutlineUser,
//   AiOutlineSearch,
//   AiOutlineInbox,
//   AiOutlineFilter,
// } from "react-icons/ai";
// import { BiMap } from "react-icons/bi";
// import 'font-awesome/css/font-awesome.min.css';
import './Header.css';

class Header extends React.Component {
  render() {
    return (
      <>
        <div className="header">
          {/* <Nav navbar className="navBar row col-10 offset-1">
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
        </Nav> */}

          <div className="input-group row col-10 col-sm-3 offset-1">
            <input
              type="search"
              id="navSearch"
              className="form-control"
              placeholder="Search"
              aria-label="Search"
              aria-describedby="search-addon"
            />
          </div>

          <div className="navBottom row col-10 col-sm-10 offset-1">
            <div className="location col-6 col-sm-6">
              <span>
                Location <i className="fa fa-map-marker"></i>
              </span>
            </div>
            <div className="col-6 col-sm-6">
              <select
                className="form-select form-select-sm"
                aria-label="Default select example"
              >
                <option selected>&nbsp;Sort By: Near me </option>
                <option value="Name">&nbsp;Sort By: Name </option>
                <option value="Rating">&nbsp;Sort By: Rating </option>
              </select>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Header;
