import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import "./BusinessCard.css";

class BusinessCard extends Component {
  render() {
    return (
      <Card style={{height: '207px', width: '437px', margin: 'auto'}}>
        <Card.Img  style={{height: '204px', width: '434px'}} src={this.props.img} alt="Card image" />
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
