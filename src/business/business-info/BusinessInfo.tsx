import React from 'react';
import Carousel from 'react-material-ui-carousel';
import { LocationOn } from '@material-ui/icons';
import { Rating } from '@material-ui/lab';
import {
  Avatar,
  CircularProgress,
  Paper,
  withStyles,
  createStyles,
  Theme,
} from '@material-ui/core';

import { firestore } from '../../config/FirebaseConfig';
import { connect } from 'react-redux';
import { updateBusinessName } from '../../shared/store/actions';
import { StoreState } from '../../shared/store/types';
import BusinessInfoDetails from './business-info-details/BusinessInfoDetails';
import cat1 from '../../assets/business-pictures/cat1.jpg';
import cat2 from '../../assets/business-pictures/cat2.jpg';
import cat3 from '../../assets/business-pictures/cat3.jpg';
import MapsContainer from './MapsContainer';
import { LoadScript } from '@react-google-maps/api';
import { Business } from '../../models/Business.interface';
import { Review } from '../../models/Review.interface';
import { User } from '../../models/User.interface';

type BusinessInfoState = {
  businessKey: string;
  businessInfo: Business;
  businessName: string;
  businessReviews: Review[];
};

function mapStateToProps(state: StoreState) {
  return {
    business: state.business,
  };
}

class BusinessInfo extends React.Component<any, BusinessInfoState> {
  constructor(props: any) {
    super(props);
    this.state = {
      businessKey: this.props.selectedBusinessKey,
      businessInfo: this.props.selectedBusinessInfo,
      businessName: props.business.businessName,
      businessReviews: []
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
      .doc(`${this.state.businessKey}`);

    businessData
      .get()
      // Get business reviews
      .then(() => {
        this.state.businessInfo.reviews.forEach((reviewId: any) => {
          let tempBusinessReview;

          firestore.collection('reviews').doc(`${reviewId}`).get()
            .then((review) => {
              tempBusinessReview = review.data() as Review;
            })
            .then(() => {
              firestore.collection('users').where('customerId', '==', `${tempBusinessReview.customerId}`).get()
                .then((querySnapshot) => {
                  querySnapshot.forEach((doc) => {
                    tempBusinessReview.poster = (doc.data() as User).firstName;
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
        {this.state.businessInfo !== undefined ? (
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
              <h5>{this.state.businessInfo.name}</h5>
              <h6>
                {this.state.businessInfo.about.address},{' '}
                {this.state.businessInfo.about.city},{' '}
                {this.state.businessInfo.about.state}{' '}
                {this.state.businessInfo.about.zipcode}
              </h6>
              <div className={classes.distanceContainer}>
                <LocationOn />
                <p className={classes.distanceToBusiness}>0.02 Mi</p>
              </div>
              <div className={classes.mapContainerStyle}>
                <LoadScript googleMapsApiKey={`${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`} libraries={["places"]}>
                  <MapsContainer businessLocation={this.state.businessInfo.about.location}></MapsContainer>
                </LoadScript>
              </div>
            </div>

            <div className={classes.aboutBusiness}>
              <h6>
                <b>ABOUT US</b>
              </h6>
              <div className={classes.aboutContent}>
                {this.state.businessInfo.description}
              </div>
            </div>

            <div className={classes.reviewsContainer}>
              <div className={classes.overallReview}>
                <h6>
                  <b>REVIEWS</b>
                </h6>
                <Rating
                  size="medium"
                  value={this.state.businessInfo.performance.rating}
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
        <BusinessInfoDetails props={this.state.businessInfo} />
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
