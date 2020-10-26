import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import "./BusinessCard.css";

class BusinessCard extends Component {
  render() {
    return (
      <Card>
        <Card.Img src={this.props.img} alt="Card image" />
        <Card.ImgOverlay
          style={{ padding: "1%", background: "rgba(0,0,0,0.75)" }}
        >
          <div class="business">
            <Card.Text>{this.props.business}</Card.Text>
          </div>
          <div class="links">
            <Card.Link class="distance">{this.props.distance}</Card.Link>
            <Card.Link class="rating">{this.props.rating}</Card.Link>
          </div>
        </Card.ImgOverlay>
      </Card>
    );
  }
}

export default BusinessCard;
