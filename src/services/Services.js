import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Header from "./header/Header";
import './Services.css'

class Services extends Component { 
    render() {
        return (
            <div class="services-page">
                <Header />
                <h1>Services Page</h1>
                <div class="card-container">
                    <Card>
                        <Card.Img src="assets/cat1.jpg" alt="Card image" />
                        <Card.ImgOverlay>
                            <Card.Text>
                            This is a wider card with supporting text below as a natural lead-in to
                            additional content. This content is a little bit longer.
                            </Card.Text>
                        </Card.ImgOverlay>
                    </Card>
                </div>
            </div>
        )
    }
}

export default Services;
