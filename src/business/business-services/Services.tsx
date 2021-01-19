import React, { Component } from 'react';
import Header from '../../customer/customer-tabs/CustomerTabs';
import BusinessCard from '../business-card/BusinessCard';
import './Services.css';

class Services extends Component {
  render() {
    return (
      <div className="services-page">
        <Header />

        <div className="business-list">
          <div />
          <div className="item">
            <BusinessCard
              business="Business #1"
              distance="0.02"
              rating="four_half"
              img="assets/cat1.jpg"
            />
          </div>

          <div className="item">
            <BusinessCard
              business="Business #2"
              distance="0.3"
              rating="five"
              img="assets/cat2.jpg"
            />
          </div>

          <div className="item">
            <BusinessCard
              business="Business #3"
              distance="1.2"
              rating="three_half"
              img="assets/cat3.jpg"
            />
          </div>

          <div className="item">
            <BusinessCard
              business="Business #4"
              distance="1.4"
              rating="four"
              img="assets/cat4.jpg"
            />
          </div>

          <div className="item">
            <BusinessCard
              business="Business #5"
              distance="3.4"
              rating="one_half"
              img="assets/cat4.jpg"
            />
          </div>

          <div className="item">
            <BusinessCard
              business="Business #6"
              distance="3.9"
              rating="three"
              img="assets/cat4.jpg"
            />
          </div>

          <div className="item">
            <BusinessCard
              business="Business #7"
              distance="4.7"
              rating="half"
              img="assets/cat4.jpg"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Services;
