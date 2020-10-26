import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import Header from "./header/Header";
import "./Services.css";

class Services extends Component {
  render() {
    return (
      <div class="services-page">
        <Header />
        <Card>
          <Card.Img src="assets/cat1.jpg" alt="Card image" />
          <Card.ImgOverlay
            style={{ padding: "1%", background: "rgba(0,0,0,0.75)" }}
          >
            <div class="business">
              <Card.Text>Business Name</Card.Text>
            </div>
            <div class="links">
              <Card.Link class="distance">Distance</Card.Link>
              <Card.Link class="rating">Rating</Card.Link>
            </div>
          </Card.ImgOverlay>
        </Card>
      </div>
    );
  }
}

export default Services;
