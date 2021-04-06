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
  List,
  RadioGroup,
  FormControlLabel,
  Radio,
  Grid
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
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions } from '@material-ui/core';
import firebase from 'firebase';

type BusinessInfoState = {
  businessKey: string;
  businessInfo: Business;
  businessName: string;
  businessReviewsShown: Review[];
  businessReviewsStored: Review[];
  businessEmployees: any[];
  isAddReviewOpen: boolean;
  addReview: Review;
};

function mapStateToProps(state: StoreState) {
  return {
    business: state.business,
    customerId: state.system.user.customerId,
  };
}

const mapsLibraries: any[] = ['places'];

class BusinessInfo extends React.Component<any, BusinessInfoState> {
  constructor(props: any) {
    super(props);
    this.state = {
      businessKey: this.props.selectedBusinessKey,
      businessInfo: this.props.selectedBusinessInfo,
      businessName: props.business.businessName,
      businessReviewsShown: [],
      businessReviewsStored: [],
      businessEmployees: [],
      isAddReviewOpen: false,
      addReview: {
        businessId: this.props.selectedBusinessKey,
        customerId: this.props.customerId,
        date: firebase.firestore.Timestamp.fromDate(new Date()),
        employeeId: '',
        message: '',
        rating: 0,
        poster: '',
      },
    };
  }

  dispatchAddEmployeeForBusiness = (employee) => {
    this.props.addEmployeeForBusiness(employee);
    
    const employees = this.state.businessEmployees;
    employees.push(employee);
    this.setState({
      businessEmployees: employees,
    });
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
        let employeeAppointments = [];
        let employeeReviews = [];

        this.state.businessInfo.employees.forEach((employeeId, index) => {
          let tempEmployee: Employee;

          firestore.collection('employees').doc(`${employeeId}`).get()
            .then((employee) => {
              const employeeData = employee.data();

              
              if (employeeData) {
                tempEmployee = {
                  id: employee.id,
                  reviews: [],
                  appointments: [],
                  services: employeeData.services,
                  todos: employeeData.todos,
                  isOwner: employeeData.isOwner,
                  position: employeeData.position,
                  clients: employeeData.clients
                };
              }
            })
            .then(() => {
              firestore.collection('appointments').where('employeeId', '==', `${employeeId}`).get()
                .then((querySnapshot) => {
                  querySnapshot.forEach((doc) => {
                    const appointmentData = doc.data();

                    if (appointmentData) {
                      tempEmployee.appointments.push(appointmentData);
                    }
                  })
                })
            })
            .then(() => {
              firestore.collection('reviews').where('employeeId', '==', `${employeeId}`).get()
                .then((querySnapshot) => {
                  querySnapshot.forEach((doc) => {
                    const reviewInfo = doc.data();

                    if (reviewInfo) {
                      tempEmployee.reviews.push(reviewInfo);
                    }
                  })
                })
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

  handleAddReviewOpen() {
    this.setState({
      isAddReviewOpen: true
    });
  }

  handleAddReviewClose() {
    this.setState({
      isAddReviewOpen: false
    });
  }

  handleAddReviewSave() {
    const review = this.state.addReview;
    review.date = firebase.firestore.Timestamp.fromDate(new Date());
    let reviewIds: string[];

    const businessRef = firestore.collection('businesses').doc(`${this.state.businessKey}`);

    businessRef.get().then((value) => {
      reviewIds = value.data()?.reviews;
    });

    firestore.collection('reviews').add(review).then((value) => {
      reviewIds.push(value.id);
      businessRef.update({
        reviews: reviewIds,
      })
    });
    
    this.setState({
      addReview: {
        businessId: this.props.selectedBusinessKey,
        customerId: '',
        date: firebase.firestore.Timestamp.fromDate(new Date()),
        employeeId: '',
        message: '',
        rating: 0,
        poster: '',
      },
    })
    this.setState({
      isAddReviewOpen: false
    });
  }

  changeReviewRating(value) {
    const review = this.state.addReview;
    review.rating = value;
    this.setState({
      addReview: review,
    })
  }

  changeReviewMessage(e) {
    const review = this.state.addReview;
    review.message = e.target.value;
    this.setState({
      addReview: review,
    })
  }

  changeReviewEmployee(e) {
    const review = this.state.addReview;
    review.employeeId = e.target.value;
    this.setState({
      addReview: review,
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
          <div>
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
                  <div className={classes.businessInfoAddressFirstLine}>
                    {this.state.businessInfo.about.address} 
                  </div>
                  <div className={classes.businessInfoAddressSecondLine}>
                    {this.state.businessInfo.about.city},{' '}
                    {this.state.businessInfo.about.state}{' '}
                    {this.state.businessInfo.about.zipcode}
                  </div>
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
                    libraries={mapsLibraries}
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
                  <List className={classes.reviewsList}>
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
                  </List>
                </div>
              </div>

              {this.state.businessReviewsStored.length > 0 && 
                <div>
                  <Button variant="contained" onClick={() => this.showMoreReviews()}>Show More</Button>
                </div>
              } 
              <Button variant="contained" color="primary" onClick={() => this.handleAddReviewOpen()} className={classes.addReview}>Add Review</Button>
              <Dialog open={this.state.isAddReviewOpen} onClose={() => this.handleAddReviewClose()} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Add Review</DialogTitle>
                <DialogContent className={classes.dialogContent}>
                  <DialogContentText>
                    How was your experience at
                  </DialogContentText>
                  <DialogContentText>
                    {this.state.businessInfo.name}
                  </DialogContentText>
                  <Rating
                    size="small"
                    name="rating"
                    value={this.state.addReview.rating}
                    precision={0.5}
                    onChange={(event, newValue) => {
                      this.changeReviewRating(newValue);
                    }}
                    classes={{
                      iconFilled: classes.starRatingFilled,
                      iconHover: classes.starRatingHover,
                    }}
                  />
                  <DialogContentText>
                    Here you can write the review about a specific employee
                  </DialogContentText>
                  <RadioGroup aria-label="employee" name="employees" onChange={(e) => this.changeReviewEmployee(e)}>
                    {this.state.businessEmployees.map((employee) => {
                      return (
                        <div key={employee.id}>
                          <FormControlLabel
                            labelPlacement="end"
                            value={employee.id}
                            control={
                              <Radio />
                            }
                            label={employee.firstName}
                          />
                        </div>
                      )})
                    }
                    <FormControlLabel
                      labelPlacement="end"
                      value=""
                      control={<Radio />}
                      label="Business Only"
                    />
                  </RadioGroup>
                  <TextField
                    autoFocus={true}
                    margin="dense"
                    id="review"
                    label="Leave your review!"
                    type="text"
                    onChange={(event) => {
                      this.changeReviewMessage(event);
                    }}
                    fullWidth={true}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => this.handleAddReviewClose()} color="primary">
                    Cancel
                  </Button>
                  <Button onClick={() => this.handleAddReviewSave()} color="primary">
                    Save
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
            <BusinessInfoDetails
              businessId={this.state.businessKey}
              businessOpeningTime={this.state.businessInfo.about.openingTime}
              businessClosingTime={this.state.businessInfo.about.closingTime}
              businessOpenDates={this.state.businessInfo.about.daysOpen}  
            />
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
    reviewsList: {
      maxHeight: '10rem',
      overflow: 'auto'
    },
    addReview: {
      marginTop: '0.5rem',
      color: 'white',
    },
    dialogContent: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    // dialogText: {
    //   alignItems: 'center',
    // }
  });

export default connect(mapStateToProps, { addEmployeeForBusiness, clearEmployeesForBusiness, setSelectedEmployee })(
  withStyles(styles, { withTheme: true })(BusinessInfo)
);
