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
  Button,
} from '@material-ui/core';

import { firestore } from '../../config/FirebaseConfig';
import { connect } from 'react-redux';
import { addEmployeeForBusiness, clearEmployeesForBusiness, setSelectedEmployee } from '../../shared/store/actions';
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
import { Employee } from '../../models/Employee.interface';

type BusinessInfoState = {
  businessKey: string;
  businessInfo: Business;
  businessName: string;
  businessReviewsShown: Review[];
  businessReviewsStored: Review[];
  businessEmployees: any[]
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
      businessReviewsShown: [],
      businessReviewsStored: [],
      businessEmployees: []
    };
  }

  dispatchAddEmployeeForBusiness = (employee) => {
    this.props.addEmployeeForBusiness(employee);
  }

  dispatchClearEmployeesForBusiness = () => {
    this.props.clearEmployeesForBusiness();
  }

  dispatchSetSelectedEmployee = (selectedEmployee) => {
    this.props.setSelectedEmployee(selectedEmployee);
  }

  componentDidMount() {
    this.getBusinessInfoData();
  }

  getBusinessInfoData() {
    this.dispatchClearEmployeesForBusiness();
    this.dispatchSetSelectedEmployee(null);

    const businessData = firestore
      .collection('businesses')
      .doc(`${this.state.businessKey}`);

    businessData
      .get()
      // Get business reviews
      .then(() => {
        let numberReviewsShown = 0;

        this.state.businessInfo.reviews.forEach((reviewId: any) => {
          let tempBusinessReview;

          firestore
            .collection('reviews')
            .doc(`${reviewId}`)
            .get()
            .then((review) => {
              tempBusinessReview = review.data() as Review;
            })
            .then(() => {
              firestore
                .collection('users')
                .where('customerId', '==', `${tempBusinessReview.customerId}`)
                .get()
                .then((querySnapshot) => {
                  querySnapshot.forEach((doc) => {
                    tempBusinessReview.poster = (doc.data() as User).firstName;
                  });
                })
                .then(() => {
                  if (numberReviewsShown < 3) {
                    this.setState({
                      businessReviewsShown: [...this.state.businessReviewsShown, tempBusinessReview]
                    });

                    numberReviewsShown += 1;
                  } else {
                    this.setState({
                      businessReviewsStored: [...this.state.businessReviewsStored, tempBusinessReview]
                    });
                  }
                });
            });
        });
      })
      // Get employees
      .then(() => {
        this.state.businessInfo.employees.forEach((employeeId, index) => {
          let tempEmployee: Employee;
          let employeeUserId: string;

          firestore.collection('employees').doc(`${employeeId}`).get()
            .then((employee) => {
              const employeeData = employee.data();

              
              if (employeeData) {
                tempEmployee = {
                  id: employee.id,
                  appointments: employeeData.appointments,
                  reviews: employeeData.reviews,
                  services: employeeData.services,
                  todos: employeeData.todos,
                  isOwner: employeeData.isOwner,
                  position: employeeData.position,
                  clients: employeeData.clients
                };
              }

              employeeUserId = employee.id;
            })
            .then(() => {
              firestore.collection('users').where('employeeId', '==', `${employeeId}`).get()
                .then((querySnapshot) => {
                  querySnapshot.forEach((doc) => {
                    const userData = doc.data();
    
                    if (userData) {
                      tempEmployee.firstName = userData.firstName;
                    }

                    this.dispatchAddEmployeeForBusiness(tempEmployee);
                  })
                });
            })
        })
      })
  }

  showMoreReviews() {
    let tempReviewsStored = this.state.businessReviewsStored.slice();
    let tempReviewsShown = this.state.businessReviewsShown.slice();

    let valuesChanged = false;

    for (let i = 0; i < 3; i++) {
      if (tempReviewsStored[i]) {
        tempReviewsShown.push(tempReviewsStored[i]);
        tempReviewsStored.splice(i, 1);

        valuesChanged = true;
      }
    }

    if (valuesChanged) {
      this.setState({
        businessReviewsShown: tempReviewsShown,
        businessReviewsStored: tempReviewsStored
      });
    }  
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
              <Carousel 
                navButtonsAlwaysVisible={true} autoPlay={false}
              >
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
              <div className={classes.businessInfoName}>{this.state.businessInfo.name}</div>
              <div className={classes.businessInfoAddress}>
                {this.state.businessInfo.about.address},{' '}
                {this.state.businessInfo.about.city},{' '}
                {this.state.businessInfo.about.state}{' '}
                {this.state.businessInfo.about.zipcode}
              </div>
              <div className={classes.distanceContainer}>
                <div>
                  <LocationOn />
                </div>
                <div className={classes.distanceToBusiness}>0.02 Mi</div>
              </div>
              <div className={classes.mapContainerStyle}>
                <LoadScript
                  googleMapsApiKey={`${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`}
                  libraries={['places']}
                >
                  <MapsContainer
                    businessLocation={this.state.businessInfo.about.location}
                  ></MapsContainer>
                </LoadScript>
              </div>
            </div>

            <div className={classes.aboutBusiness}>
              <div className={classes.aboutBusinessTitle}>
                <b>ABOUT US</b>
              </div>
              <div className={classes.aboutContent}>
                {this.state.businessInfo.description}
              </div>
            </div>

            <div className={classes.reviewsContainer}>
              <div className={classes.overallReview}>
                <div>
                  <b>REVIEWS</b>
                </div>
                <Rating
                  size="medium"
                  value={this.state.businessInfo.performance.rating}
                  precision={0.5}
                  readOnly={true}
                />
              </div>

              <div>
                {this.state.businessReviewsShown.map((review, i) => {
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

            {this.state.businessReviewsStored.length > 0 && 
              <div>
                <Button variant="contained" onClick={() => this.showMoreReviews()}>Show More</Button>
              </div>
            }
          </div>
        ) : (
          <div className={classes.loadingContainer}>
            <CircularProgress size={75} />
          </div>
        )}
        <BusinessInfoDetails />
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
      alignItems: 'center',
    },
    businessOverview: {
      padding: '2.5rem',
    },
    businessPicture: {
      width: '100%',
    },
    carouselContainer: {
      marginBottom: '0.5rem',
    },
    businessInformation: {
      color: 'black',
      justifyContent: 'center',
    },
    businessInfoName: {
      fontSize: '2rem',
      marginBottom: '0.25rem'
    },
    businessInfoAddress: {
      marginBottom: '0.25rem'
    },
    distanceContainer: {
      display: 'flex',
      justifyContent: 'center',
      color: 'red',
      alignItems: 'center',
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
    aboutBusinessTitle: {
      marginBottom: '0.25rem'
    },
    aboutContent: {
      textAlign: 'start',
    },
    reviewsContainer: {
      color: 'black',
    },
    overallReview: {
      marginBottom: '1rem',
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
      alignContent: 'center',
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
      paddingRight: '1rem',
    },
  });

export default connect(mapStateToProps, { addEmployeeForBusiness, clearEmployeesForBusiness, setSelectedEmployee })(
  withStyles(styles, { withTheme: true })(BusinessInfo)
);
