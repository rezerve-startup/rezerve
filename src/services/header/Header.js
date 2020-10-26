import React, { Component } from 'react';
import './Header.css'

class Header extends Component { 
    render() {
        return (
            <div class="header">
                <div class="icons">
                    <p>icons</p>
                </div>
                <div class="nav">
                    <div class="forum">
                        <p>Forum</p>
                    </div>
                    <div class="book">
                        <p>Book</p>
                    </div>
                </div>
                <div class="search">
                    <input class="search-bar" placeholder="Search"></input>
                </div>
            </div>
        )
    }
}

export default Header