import React, { Component } from 'react';
// import { CarouselItem, CarouselCaption, Carousel, CarouselControl, CarouselIndicators } from '../../customer/customer-signup/node_modules/reactstrap';
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
} from '@material-ui/core';

import { firestore } from '../../config/FirebaseConfig';

// import './BusinessInfo.css';

type BusinessInfoState = {
  business: any;
};

interface Props extends WithStyles<typeof styles> {}

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
      padding: '2.5rem'
    },
    businessPicture: {
      width: '100%'
    },
    carouselContainer: {
      marginBottom: '1rem'
    },
    businessInformation: {
      color: 'black'
    },
    distanceContainer: {
      display: 'flex',
      justifyContent: 'center',
      color: 'red'
    },
    distanceToBusiness: {
      marginLeft: '0.25rem'
    },
    aboutBusiness: {
      color: 'black',
      padding: '0.5rem',
      backgroundColor: 'lightgray',
      border: 'darkgray solid 1',
      marginBottom: '1rem'
    },
    aboutContent: {
      textAlign: 'start'
    },
    reviewsContainer: {
      color: 'black'
    },
    overallReview: {
      marginBottom: '0.5rem'
    },
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
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%'
    }
  });

class BusinessInfo extends React.Component<Props, BusinessInfoState> {
  constructor(props: any) {
    super(props);
    this.state = {
      business: undefined,
    };
  }

  componentDidMount() {

    firestore.collection('businesses').onSnapshot((snapshot) => {
      const selectedBusiness = snapshot.docs[0].data();

      console.log(selectedBusiness);

      this.setState({
        business: selectedBusiness,
      });
    });
  }

  render() {

    const { classes } = this.props;

    const businessPictures = [
      {imageUrl: 'cat1.jpg' },
      {imageUrl: 'cat2.jpg' },
      {imageUrl: 'cat3.jpg' }
    ];

    return (
      <div className={classes.businessInfoPage}>
        {this.state.business !== undefined ? (
          <div className={classes.businessOverview}>
            <div className={classes.carouselContainer}>
              <Carousel navButtonsAlwaysVisible={true}>
                {businessPictures.map((businessPicture, i) => (
                  <Paper key={i}>
                    <img className={classes.businessPicture} src={businessPicture.imageUrl} />
                  </Paper>
                ))}
              </Carousel>
            </div>

            <div className={classes.businessInformation}>
              <h5>
                {this.state.business.businessName}
              </h5>
              <h6>
                {this.state.business.address}, {this.state.business.city},{' '}
                {this.state.business.state} {this.state.business.zipcode}
              </h6>
              <div className={classes.distanceContainer}>
                <LocationOn />
                <p className={classes.distanceToBusiness}>0.02 Mi</p>
              </div>
            </div>

            <div className={classes.aboutBusiness}>
              <h6>
                <b>ABOUT US</b>
              </h6>
              <div className={classes.aboutContent}>
                {this.state.business.aboutBusiness}
              </div>
            </div>

            <div className={classes.reviewsContainer}>
              <div className={classes.overallReview}>
                <h6>
                  <b>REVIEWS</b>
                </h6>
                <Rating
                  size="medium"
                  value={this.state.business.businessRating}
                  precision={0.5}
                  readOnly
                />
              </div>

              <div>
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
                    <Rating size="small" value={2.5} precision={0.5} readOnly />
                  </div>
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

export default withStyles(styles, { withTheme: true })(BusinessInfo);
