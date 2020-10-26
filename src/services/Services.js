import React, { Component } from "react";
import Header from "./header/Header";
import BusinessCard from "./business-card/BusinessCard";
import "./Services.css";

class Services extends Component {
  render() {
    return (
      <div class="services-page">
        <Header />
        <BusinessCard
          business="Business #1"
          distance="Distance #1"
          rating="Rating #1"
        />
        <BusinessCard
          business="Business #2"
          distance="Distance #2"
          rating="Rating #2"
        />
        <BusinessCard
          business="Business #3"
          distance="Distance #3"
          rating="Rating #3"
        />
        <BusinessCard
          business="Business #4"
          distance="Distance #4"
          rating="Rating #4"
        />
      </div>
    );
  }
}

export default Services;
