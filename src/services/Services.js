import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import Header from "./header/Header";
import "./Services.css";

class Services extends Component {
  render() {
    return (
      <div class="services-page">
        <Header />
        <div class="card-container">
          <Card>
            <Card.Img src="assets/cat1.jpg" alt="Card image" />
            <Card.ImgOverlay>
              <Card.Text class="business-name">Business Name</Card.Text>
              <Card.Text class="distance">Distance</Card.Text>
              <Card.Text class="rating">Rating</Card.Text>
            </Card.ImgOverlay>
          </Card>
        </div>
      </div>
    );
  }
}

export default Services;
