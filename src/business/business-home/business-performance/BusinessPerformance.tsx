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
  value: number;
  business: {
    abandonedCarts: number;
    bookingPercentage: number;
    profileViews: number;
  }
};

interface Props extends WithStyles<typeof styles> {}

class BusinessPerformance extends React.Component<any, BusinessPerformanceState> {
  constructor(props: any) {
    super(props);
    this.state = {
      value: 0,
      loading: false,
      business: {
        abandonedCarts: 5,
        bookingPercentage: 80,
        profileViews: 180
      }
    };
  }

  handleChange = (_event: any, newValue: number) => {
    this.setState({
      value: newValue
    });
  };

  render() {

    const { classes } = this.props;

    return (
      <div className={classes.businessInfoPage}>
        {this.state.loading === false ? (
          <div className={classes.businessOverview}>
              
              <Tabs value={this.state.value} onChange={this.handleChange} aria-label="ant example">
                <Tab label="Day" />
                <Tab label="Week" />
                <Tab label="Month" />
                <Tab label="Year" />
              </Tabs>

              <div className={classes.sectionTitle}>
                <div>Marketing</div>
              </div>
              <div>
                  <div className={classes.businessPerformanceItem}>
                    <div>Profile Views</div>
                    <div>{this.state.business.profileViews}</div>
                  </div>
                  <div className={classes.businessPerformanceItemContainer}>
                      <div className={classes.businessPerformanceItem}>
                        <div>Abandoned Carts</div>
                        <div>{this.state.business.abandonedCarts}</div>
                      </div>
                      <div className={classes.businessPerformanceItem}>
                        <div>Booking Percentage</div>
                        <div>{this.state.business.bookingPercentage}%</div>
                      </div>
                  </div>
              </div>

              <div className={classes.sectionTitle}>
                <div>Reviews & Rating</div>
              </div>
              <h2>3.5</h2>
              <p>Rating</p>
              <Rating
                  size="medium"
                  value={3.5}
                  precision={0.5}
                  readOnly={true}
                  classes={{
                    iconFilled: classes.starRatingFilled,
                    iconHover: classes.starRatingHover
                  }}
                />

              <div>
                <div className={classes.sectionTitle}>
                  <div>Reviews</div>
                </div>
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
                      <Rating 
                        size="small" 
                        value={2.5} 
                        precision={0.5} 
                        readOnly={true}
                        classes={{
                          iconFilled: classes.starRatingFilled,
                          iconHover: classes.starRatingHover
                        }} 
                      />
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
    businessInfoPage: {
      textAlign: 'center',
      alignItems: 'center'
    },
    businessOverview: {
      padding: ' 0.5rem 2.5rem 2.5rem 2.5rem'
    },
    businessPerformanceItemContainer: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    businessPerformanceItem: {
      borderStyle: 'solid',
      borderWidth: 1,
      borderRadius: '0.25rem',
      margin: '0.25rem',
      padding: '0.25rem',
      flex: 1
    },
    starRatingFilled: {
      color: theme.palette.primary.main,
    },
    starRatingHover: {
      color: theme.palette.primary.light
    },
    sectionTitle: {
      textAlign: 'left',
      fontSize: 20,
      fontWeight: 800,
      margin: '0.5rem 0.25rem 0.5rem 0.25rem'
    },
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
    businessReview: {
      display: 'flex',
      justifyContent: 'space-around',
      textAlign: 'start'
    },
    reviewAvatar: {
      flex: 1,
      marginRight: '0.5rem'
    },
    reviewContent: {
      flex: 5,
      marginRight: '0.5rem'
    },
    reviewRating: {
      flex: 2,
      marginLeft: '0.25rem'
    },
    // loadingContainer: {
    //   display: 'flex',
    //   justifyContent: 'center',
    //   alignItems: 'center',
    //   height: '100%'
    // }
  });

export default connect(null, null)(withStyles(styles, { withTheme: true })(BusinessPerformance));
