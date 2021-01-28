import React, { Component } from 'react';
import Carousel from 'react-material-ui-carousel';
import { LocationOn } from '@material-ui/icons';
import { Rating } from '@material-ui/lab';
import {
  CircularProgress,
  withStyles,
  createStyles,
  WithStyles,
  Theme, 
  Avatar,
  Button,
  Box,
  AppBar,
  Tab,
  Tabs,
} from '@material-ui/core';

import { connect } from 'react-redux';

type BusinessPerformanceState = {
  loading: boolean;
};

interface Props extends WithStyles<typeof styles> {}

class BusinessPerformance extends React.Component<any, BusinessPerformanceState> {
  constructor(props: any) {
    super(props);
    this.state = {
        loading: false
    };
  }

  render() {

    const { classes } = this.props;

    return (
      <div className={classes.businessInfoPage}>
        {this.state.loading === false ? (
          <div className={classes.businessOverview}>
              
              <h1>Marketing</h1>
              <div>
                  <div>Profile Views</div>
                  <div>
                      <div>Abandoned Carts</div>
                      <div>Booking Percentage</div>
                  </div>
              </div>

              <h1>Reviews & Rating</h1>
              <h2>3.5</h2>
              <p>Rating</p>
              <Rating
                  size="medium"
                  value={3.5}
                  precision={0.5}
                  readOnly={true}
                />

              <div>
                  <h1>Reviews</h1>
                <div className={classes.businessReview}>
                  <div className={classes.reviewAvatar}>
                    <Avatar />
                  </div>
                  <div className={classes.reviewContent}>
                    <div>
                      <b>Melissa</b>
                    </div>
                    <div>
                      Brought my son for a haircut and it was perfect! He loved
                      it and we will definitely be making another appointment
                    </div>
                  </div>
                  <div className={classes.reviewRating}>
                    <div>10/17/20</div>
                    <Rating size="small" value={2.5} precision={0.5} readOnly={true} />
                  </div>
                </div>
              </div>
          </div>
        ) : (
          <div className={classes.loadingContainer}>
            <CircularProgress size={75} />
          </div>
        )}
      </div>
    );
  }
}

const styles = (theme: Theme) =>
  createStyles({
    // root: {
    //   flexGrow: 1,
    // },
    // businessInfoPage: {
    //   backgroundColor: '#ffffff',
    //   height: '100%',
    //   color: 'white',
    //   textAlign: 'center',
    //   alignItems: 'center'
    // },
    // businessOverview: {
    //   padding: '2.5rem'
    // },
    // businessPicture: {
    //   width: '100%'
    // },
    // carouselContainer: {
    //   marginBottom: '1rem'
    // },
    // businessInformation: {
    //   color: 'black'
    // },
    // distanceContainer: {
    //   display: 'flex',
    //   justifyContent: 'center',
    //   color: 'red'
    // },
    // distanceToBusiness: {
    //   marginLeft: '0.25rem'
    // },
    // aboutBusiness: {
    //   color: 'black',
    //   padding: '0.5rem',
    //   backgroundColor: 'lightgray',
    //   border: 'darkgray solid 1',
    //   marginBottom: '1rem'
    // },
    // aboutContent: {
    //   textAlign: 'start'
    // },
    // reviewsContainer: {
    //   color: 'black'
    // },
    // overallReview: {
    //   marginBottom: '0.5rem'
    // },
    // businessReview: {
    //   display: 'flex',
    //   justifyContent: 'space-around',
    //   textAlign: 'start'
    // },
    // reviewAvatar: {
    //   flex: 1,
    //   marginRight: '0.5rem'
    // },
    // reviewContent: {
    //   flex: 5,
    //   marginRight: '0.5rem'
    // },
    // reviewRating: {
    //   flex: 2,
    //   marginLeft: '0.25rem'
    // },
    // loadingContainer: {
    //   display: 'flex',
    //   justifyContent: 'center',
    //   alignItems: 'center',
    //   height: '100%'
    // }
  });

export default connect(null, null)(withStyles(styles, { withTheme: true })(BusinessPerformance));
