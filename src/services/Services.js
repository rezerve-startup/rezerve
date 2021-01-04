import React, { Component } from "react";
import Header from "./header/Header";
import BusinessCard from "./business-card/BusinessCard";
import "./Services.css";

class Services extends Component {
  render() {
    return (
      <div class="services-page">
        <Header />
        <div class="business-list">
          <div/>
          <div class="item">
            <BusinessCard
              business="Business #1"
              distance="Distance #1"
              rating="Rating #1"
              img="assets/cat1.jpg"
            />
          </div> 
            
          <div class="item">  
            <BusinessCard
              business="Business #2"
              distance="Distance #2"
              rating="Rating #2"
              img="assets/cat2.jpg"
            />

          </div>
            
          <div class="item">  
            <BusinessCard
              business="Business #3"
              distance="Distance #3"
              rating="Rating #3"
              img="assets/cat3.jpg"
            />
          </div>

          <div class="item">
            <BusinessCard
              business="Business #4"
              distance="Distance #4"
              rating="Rating #4"
              img="assets/cat4.jpg"
            />
          </div>

          <div class="item">
            <BusinessCard
              business="Business #5"
              distance="Distance #5"
              rating="Rating #4"
              img="assets/cat4.jpg"
            />
          </div>

          <div class="item">
            <BusinessCard
              business="Business #6"
              distance="Distance #6"
              rating="Rating #6"
              img="assets/cat4.jpg"
            />
          </div>

          <div class="item">
            <BusinessCard
              business="Business #7"
              distance="Distance #7"
              rating="Rating #7"
              img="assets/cat4.jpg"
            />
          </div>
        
         <div class="item"> fasdfas</div>
          </div>
      </div>
    );
  }
}

export default Services;
