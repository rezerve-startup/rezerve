import React, { Component } from 'react';
import Carousel from 'react-material-ui-carousel';
import { LocationOn } from '@material-ui/icons';
import { Rating } from '@material-ui/lab';
import {
  Avatar,
  CircularProgress,
  Paper,
  withStyles,
  createStyles,
  WithStyles,
  Theme,
  Grid,
  Button,
} from '@material-ui/core';

import { firestore } from '../../config/FirebaseConfig';
import { connect } from 'react-redux';
import { updateBusinessName } from '../../shared/store/actions';
import { BusinessState, StoreState } from '../../shared/store/types';
import BusinessInfoDetails from './business-info-details/BusinessInfoDetails';
import cat1 from '../../assets/business-pictures/cat1.jpg';
import cat2 from '../../assets/business-pictures/cat2.jpg';
import cat3 from '../../assets/business-pictures/cat3.jpg';
import MapsContainer from './MapsContainer';
import { LoadScript } from '@react-google-maps/api';

type BusinessInfoState = {
  business: any;
  businessName: string;
  businessReviews: any[];
  mapCenter: any;
};

function mapStateToProps(state: StoreState) {
  return {
    business: state.business,
  };
}

interface Props extends WithStyles<typeof styles> {}

class BusinessInfo extends React.Component<any, BusinessInfoState> {
  constructor(props: any) {
    super(props);
    this.state = {
      business: undefined,
      businessName: props.business.businessName,
      businessReviews: [],
      mapCenter: {
        lat: -3.475,
        lng: -38.523
      }
    };
  }

  dispatchUpdateBusinessName = () => {
    this.props.updateBusinessName('Hello World!');
  };

  componentDidMount() {
    this.getBusinessInfoData();
  }

  getBusinessInfoData() {
    const businessData = firestore
      .collection('businesses')
      .doc('98amGMWjvPkULXgBerJq');

    businessData
      .get()
      // Get business info data
      .then((val) => {
        const businessInfo = val.data();
        this.setState({
          business: businessInfo,
        });
      })
      // Get business reviews
      .then(() => {
        this.state.business.reviews.forEach((reviewId: any) => {
          let tempBusinessReview;

          firestore.collection('reviews').doc(`${reviewId}`).get()
            .then((review) => {
              tempBusinessReview = review.data();
            })
            .then(() => {
              firestore.collection('users').where('customerId', '==', `${tempBusinessReview.customerId}`).get()
                .then((querySnapshot) => {
                  querySnapshot.forEach((doc) => {
                    tempBusinessReview.poster = doc.data().firstName;
                  })
                })
                .then(() => {
                  this.setState({
                    businessReviews: [...this.state.businessReviews, tempBusinessReview]
                  })
                });
            })
        });
      })
  }

  render() {
    const { classes } = this.props;

    const businessPictures = [
      { imageUrl: cat1 },
      { imageUrl: cat2 },
      { imageUrl: cat3 },
    ];

    return (
      <div className={classes.businessInfoPage}>
        {this.state.business !== undefined ? (
          <div className={classes.businessOverview}>
            <div className={classes.carouselContainer}>
              <Carousel navButtonsAlwaysVisible={true}>
                {businessPictures.map((businessPicture, i) => (
                  <Paper key={i}>
                    <img
                      className={classes.businessPicture}
                      src={businessPicture.imageUrl}
                      alt=""
                    />
                  </Paper>
                ))}
              </Carousel>
            </div>

            <div className={classes.businessInformation}>
              {/* The value that is being updated dynamically via state changes */}
              <h5>{this.props.business.businessName}</h5>
              <h6>
                {this.state.business.about.address},{' '}
                {this.state.business.about.city},{' '}
                {this.state.business.about.state}{' '}
                {this.state.business.about.zipcode}
              </h6>
              <div className={classes.distanceContainer}>
                <LocationOn />
                <p className={classes.distanceToBusiness}>0.02 Mi</p>
              </div>
              <div className={classes.mapContainerStyle}>
                {/* <div> */}
                <LoadScript googleMapsApiKey="" libraries={["places"]}>
                  <MapsContainer></MapsContainer>
                </LoadScript>
                {/* </div> */}
              </div>
            </div>

            <div className={classes.aboutBusiness}>
              <h6>
                <b>ABOUT US</b>
              </h6>
              <div className={classes.aboutContent}>
                {this.state.business.description}
              </div>
            </div>

            <div className={classes.reviewsContainer}>
              <div className={classes.overallReview}>
                <h6>
                  <b>REVIEWS</b>
                </h6>
                <Rating
                  size="medium"
                  value={this.state.business.performance.rating}
                  precision={0.5}
                  readOnly={true}
                />
              </div>

              <div>
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
                        <div>{review.message}</div>
                      </div>
                      <div className={classes.reviewRating}>
                        <div>
                          {new Date(review.date.toDate()).toLocaleDateString()}
                        </div>
                        <div>
                          <Rating
                            size="small"
                            value={review.rating}
                            precision={0.5}
                            readOnly={true}
                            classes={{
                              iconFilled: classes.starRatingFilled,
                              iconHover: classes.starRatingHover,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className={classes.loadingContainer}>
            <CircularProgress size={75} />
          </div>
        )}
        <BusinessInfoDetails props={this.state.business} />
      </div>
    );
  }
}

const styles = (theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    businessInfoPage: {
      backgroundColor: '#ffffff',
      height: '100%',
      color: 'white',
      textAlign: 'center',
      alignItems: 'center'
    },
    businessOverview: {
      padding: '2.5rem',
    },
    businessPicture: {
      width: '100%',
    },
    carouselContainer: {
      marginBottom: '1rem',
    },
    businessInformation: {
      color: 'black',
      justifyContent: 'center'
    },
    distanceContainer: {
      display: 'flex',
      justifyContent: 'center',
      color: 'red',
    },
    distanceToBusiness: {
      marginLeft: '0.25rem',
    },
    aboutBusiness: {
      color: 'black',
      padding: '0.5rem',
      backgroundColor: 'lightgray',
      border: 'darkgray solid 1',
      marginBottom: '1rem',
    },
    aboutContent: {
      textAlign: 'start',
    },
    reviewsContainer: {
      color: 'black',
    },
    overallReview: {
      marginBottom: '0.5rem',
    },
    businessReview: {
      display: 'flex',
      justifyContent: 'space-around',
      textAlign: 'start',
      marginBottom: '0.5rem',
    },
    reviewAvatar: {
      flex: 1,
      marginRight: '0.5rem',
    },
    reviewContent: {
      flex: 5,
      marginRight: '0.5rem',
    },
    reviewRating: {
      flex: 2,
      marginLeft: '0.25rem',
      textAlign: 'center',
      alignContent: 'center'
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
    },
    starRatingFilled: {
      color: theme.palette.primary.main,
    },
    starRatingHover: {
      color: theme.palette.primary.light,
    },
    mapContainerStyle: {
      marginTop: '1rem',
      marginBottom: '1rem',
      paddingLeft: '1rem',
      paddingRight: '1rem'
    }
  });

export default connect(mapStateToProps, { updateBusinessName })(
  withStyles(styles, { withTheme: true })(BusinessInfo)
);
