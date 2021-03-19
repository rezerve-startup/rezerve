import React, { Component } from 'react';
import Header from '../../customer/customer-tabs/CustomerTabs';
import { Card, CardContent } from '@material-ui/core';
import BusinessCard from '../business-card/BusinessCard';
import './Services.css';

class Services extends Component {
  render() {
    return (
      <div className="services-page">
        <div className="business-list">
          <div />
          <div className="item">
            <Card>
              <CardContent> Item One </CardContent>
            </Card>
          </div>

          <div className="item">
            <Card>
              <CardContent> Item Two </CardContent>
            </Card>
          </div>

          <div className="item">
            <Card>
              <CardContent> Item Three </CardContent>
            </Card>
          </div>

          <div className="item">
            <Card>
              <CardContent> Item Four </CardContent>
            </Card>
          </div>

          <div className="item">
            <Card>
              <CardContent> Item Five </CardContent>
            </Card>
          </div>

          <div className="item">
            <Card>
              <CardContent> Item Six </CardContent>
            </Card>
          </div>

          <div className="item">
            <Card>
              <CardContent> Item Seven </CardContent>
            </Card>
          </div>

          <div className="item">
            <Card>
              <CardContent> Item Eight </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }
}

export default Services;
