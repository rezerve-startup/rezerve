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

import { firestore } from '../../../config/FirebaseConfig';
import { connect } from 'react-redux';

type BusinessPerformanceState = {
  loading: boolean;
  tabSelected: number;
  businessPerformance: {
    abandonedCarts: number;
    bookingPercentage: number;
    profileViews: number;
    rating: number
  },
  businessReviews: any[]
};

interface Props extends WithStyles<typeof styles> {}

class BusinessPerformance extends React.Component<any, BusinessPerformanceState> {
  constructor(props: any) {
    super(props);
    this.state = {
      tabSelected: 0,
      loading: false,
      businessPerformance: {
        abandonedCarts: 0,
        bookingPercentage: 0,
        profileViews: 0,
        rating: 0
      },
      businessReviews: []
    };
  }

  componentDidMount() {
    const businessData = firestore.collection('businesses').doc('98amGMWjvPkULXgBerJq');

    businessData.get().then((val) => {
      const businessInfo = val.data();

      if (businessInfo !== undefined) {
        this.setState({
          businessPerformance: businessInfo.performance
        })
      }

    }).then(() => {
      const businessReviews: any[] = []

      businessData.collection('reviews').onSnapshot((snapshot) => {
        const review = snapshot.forEach((reviewDoc) => {
          const businessReview = reviewDoc.data();

          businessReviews.push(businessReview);
        });

        const sortedReviews = businessReviews.slice().sort((a, b) => {
          return b.date - a.date
        });
    
        this.setState({
          businessReviews: sortedReviews
        });
      });
    })
  }

  handleChange = (_event: any, newTabSelected: number) => {
    this.setState({
      tabSelected: newTabSelected
    });
  };

  render() {

    const { classes } = this.props;

    return (
      <div className={classes.businessInfoPage}>
        {this.state.loading === false ? (
          <div className={classes.businessOverview}>
              
              <Tabs value={this.state.tabSelected} onChange={this.handleChange} aria-label="ant example">
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
                    <div>{this.state.businessPerformance.profileViews}</div>
                  </div>
                  <div className={classes.businessPerformanceItemContainer}>
                      <div className={classes.businessPerformanceItem}>
                        <div>Abandoned Carts</div>
                        <div>{this.state.businessPerformance.abandonedCarts}</div>
                      </div>
                      <div className={classes.businessPerformanceItem}>
                        <div>Booking Percentage</div>
                        <div>{this.state.businessPerformance.bookingPercentage}%</div>
                      </div>
                  </div>
              </div>

              <div className={classes.sectionTitle}>
                <div>Reviews & Rating</div>
              </div>
              <h2>{this.state.businessPerformance.rating}</h2>
              <p>Rating</p>
              <Rating
                  size="medium"
                  value={this.state.businessPerformance.rating}
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
                {this.state.businessReviews.map((review, i) => {
                  return (
                    <div className={classes.businessReview} key={i}>
                      <div className={classes.reviewAvatar}>
                        <Avatar />
                      </div>
                      <div className={classes.reviewContent}>
                        <div>
                          <b>{review.poster}</b>
                        </div>
                        <div>
                          {review.content}
                        </div>
                      </div>
                      <div className={classes.reviewRating}>
                        {new Date(review.date.toDate()).toLocaleDateString()}
                        <Rating size="small" value={review.rating} precision={0.5} readOnly={true} 
                          classes={{
                            iconFilled: classes.starRatingFilled,
                            iconHover: classes.starRatingHover,
                          }} />
                      </div>
                    </div>
                  )
                })}
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
      textAlign: 'start',
      marginBottom: '0.5rem'
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