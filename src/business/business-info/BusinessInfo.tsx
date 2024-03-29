import {
  Avatar, Button, CircularProgress, createStyles, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, IconButton, List, Radio, RadioGroup, Snackbar, TextField, Theme, Typography, withStyles
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { Rating } from '@material-ui/lab';
import { LoadScript } from '@react-google-maps/api';
import firebase from 'firebase';
import React from 'react';
import { connect } from 'react-redux';
import { firestore } from '../../config/FirebaseConfig';
import { Business } from '../../models/Business.interface';
import { Employee } from '../../models/Employee.interface';
import { Review } from '../../models/Review.interface';
import { User } from '../../models/User.interface';
import { addEmployeeForBusiness, clearEmployeesForBusiness, setSelectedEmployee } from '../../shared/store/actions';
import { StoreState } from '../../shared/store/types';
import BusinessInfoDetails from './business-info-details/BusinessInfoDetails';
import MapsContainer from './MapsContainer';


type BusinessInfoState = {
  businessKey: string;
  businessInfo: Business;
  businessReviewsShown: Review[];
  businessReviewsStored: Review[];
  businessEmployees: any[];
  businessTotalScore: number;
  isAddReviewOpen: boolean;
  isAddReviewDisabled: boolean;
  addReview: Review;
  notLoggedInMessageOpen: boolean;
};

function mapStateToProps(state: StoreState) {
  if (state.system.user === undefined) {
    return {
      customerId: undefined,
      business: state.business
    }
  } else {
    return {
      business: state.business,
      customerId: state.system.user.customerId,
    };
  }

}

const mapsLibraries: any[] = ['places'];

class BusinessInfo extends React.Component<any, BusinessInfoState> {
  constructor(props: any) {
    super(props);
    this.state = {
      businessKey: this.props.selectedBusinessKey,
      businessInfo: this.props.selectedBusinessInfo,
      businessReviewsShown: [],
      businessReviewsStored: [],
      businessTotalScore: 0,
      businessEmployees: [],
      isAddReviewOpen: false,
      isAddReviewDisabled: true,
      addReview: {
        businessId: this.props.selectedBusinessKey,
        customerId: this.props.customerId,
        date: firebase.firestore.Timestamp.fromDate(new Date()),
        employeeId: '',
        message: '',
        rating: 0,
        poster: '',
      },
      notLoggedInMessageOpen: false
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
    this.addProfileView();
   // this.updateCompletedAppointments();
    this.checkCustomer();
  }

  // updateCompletedAppointments(){
  //   firestore.collection('customers')
  //       .doc(this.state.addReview.customerId)
  //       .get() 
  //       .then((value) => {
  //         const appointments = value.data()?.appointments;
  //         appointments.forEach(id => {
  //           const appointmentRef = firestore.collection('appointments').doc(id)
  //             appointmentRef
  //             .get()
  //             .then(value => {
  //               const appointment = value.data();
  //               if (appointment?.status === 'accepted' && appointment?.datetime.toDate() < Date.now()){
  //                 appointmentRef.update({
  //                   status: "completed"
  //                 })
  //                 this.setState({
  //                   notLoggedInMessageOpen : false
  //                 })
  //               }
  //             });
  //         });
  //       });
  // }

  checkCustomer() {
    if (this.props.customerId !== undefined) {
      firestore.collection('customers')
        .doc(this.state.addReview.customerId)
        .get() 
        .then((value) => {
          const appointments = value.data()?.appointments;
          appointments.forEach(id => {
            const appointmentRef = firestore.collection('appointments').doc(id)
              appointmentRef.get()
              .then(value => {
                const appointment = value.data();
                if ((appointment?.businessId === this.state.businessKey && appointment?.status === 'completed') || (appointment?.status === 'accepted' && appointment?.datetime.toDate() < Date.now())) {
                  this.setState({
                    isAddReviewDisabled: false
                  });
                  appointmentRef.update({
                    status: "completed"
                  })
                }
              });
          });
        });
    }
  }

  addProfileView() {
    const businessData = firestore
      .collection('businesses')
      .doc(`${this.state.businessKey}`);
      businessData.update({
        performance: firebase.firestore.FieldValue.arrayUnion({
          type: 'ProfileView',
          date: firebase.firestore.Timestamp.fromDate(new Date())
        })
      })
  }

  getBusinessInfoData() {
    this.setState({
      businessReviewsShown: [],
      businessReviewsStored: [],
      businessTotalScore: 0,
      businessEmployees: []
    })

    this.dispatchClearEmployeesForBusiness();
    this.dispatchSetSelectedEmployee(null);

    const businessDoc = firestore
      .collection('businesses')
      .doc(`${this.state.businessKey}`);

    businessDoc
      .get()
      // Get business reviews
      .then((businessDocInfo) => {
        const businessData = businessDocInfo.data()

        let numberReviewsShown = 0;

        businessData?.reviews.forEach((reviewId: any, index: number) => {
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
                      businessReviewsShown: [...this.state.businessReviewsShown, tempBusinessReview],
                      businessTotalScore: this.state.businessTotalScore + tempBusinessReview.rating
                    });

                    numberReviewsShown += 1;
                  } else {
                    this.setState({
                      businessReviewsStored: [...this.state.businessReviewsStored, tempBusinessReview],
                      businessTotalScore: this.state.businessTotalScore + tempBusinessReview.rating
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

          firestore.collection('employees').doc(`${employeeId}`).get()
            .then((employee) => {
              const employeeData = employee.data();

              
              if (employeeData) {
                tempEmployee = {
                  id: employee.id,
                  availability: employeeData.availability,
                  reviews: [],
                  appointments: [],
                  services: employeeData.services,
                  todos: employeeData.todos,
                  isOwner: employeeData.isOwner,
                  position: employeeData.position,
                  clients: employeeData.clients,
                  businessId: employeeData.businessId,
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
    const tempReviewsStored = this.state.businessReviewsStored.slice();
    const tempReviewsShown = this.state.businessReviewsShown.slice();

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
    if (this.props.customerId === undefined) {
      this.setState({
        notLoggedInMessageOpen: true
      });
    } else {
      this.setState({
        isAddReviewOpen: true
      });
    }
  }

  handleAddReviewClose() {
    this.setState({
      isAddReviewOpen: false
    });
  }

  handleAddReviewSave() {
    const review = this.state.addReview;
    let overallRating = this.state.businessInfo.overallRating;
    review.date = firebase.firestore.Timestamp.fromDate(new Date());
    let businessReviewIds: string[];

    const businessRef = firestore.collection('businesses').doc(`${this.state.businessKey}`);

    businessRef.get().then((value) => {
      businessReviewIds = value.data()?.reviews;
    }).then(() => {
      const average = overallRating * businessReviewIds.length;
      overallRating = (average + review.rating) / (businessReviewIds.length + 1);

      firestore.collection('reviews').add(review).then((value) => {
        businessReviewIds.push(value.id);
  
        businessRef.update({
          reviews: businessReviewIds,
          overallRating,
        }).then(() => {
  
          if (review.employeeId !== '') {
            let employeeReviewIds: string[];
            const employeeRef = firestore.collection('employees').doc(`${review.employeeId}`);
      
            employeeRef.get().then((value) => {
              employeeReviewIds = value.data()?.reviews;
            }).then(() => {
              firestore.collection('reviews').add(review).then((value) => {
                employeeReviewIds.push(value.id);
                employeeRef.update({
                  reviews: businessReviewIds,
                });
              });
            });
          }
          
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
            isAddReviewOpen: false,
          });
      
          this.getBusinessInfoData();
        })
      });
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

  handleCloseNotLoggedInMessage() {
    this.setState({
      notLoggedInMessageOpen: false
    });
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.businessInfoPage}>
        {this.state.businessInfo !== undefined ? (
          <div>
            <div className={classes.businessOverview}>
              {/* <div className={classes.carouselContainer}>
                    Business Pictures could go here
                  </div> */}

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
                {/* <div className={classes.distanceContainer}>
                  <div>
                    <LocationOn />
                  </div>
                  <div className={classes.distanceToBusiness}>0.02 Mi</div>
                </div> */}
                <div className={classes.mapContainerStyle}>
                  <LoadScript
                    googleMapsApiKey={`${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`}
                    libraries={mapsLibraries}
                  >
                    <MapsContainer
                      businessLocation={this.state.businessInfo.about.location}
                    />
                  </LoadScript>
                </div>
              </div>

              <div className={classes.aboutBusiness}>
                <div className={classes.aboutBusinessTitle}>
                  <b>ABOUT US</b>
                </div>
                <div className={classes.aboutContent}>
                  <Typography align="center">
                  {this.state.businessInfo.description}
                  </Typography>
                </div>
              </div>

              <div className={classes.reviewsContainer}>
                <div className={classes.overallReview}>
                  <div>
                    <b>REVIEWS</b>
                  </div>
                  {this.props.selectedBusinessInfo.overallRating === 0 ?
                    (<Typography variant="body2">{this.props.selectedBusinessInfo.name} currently has no reviews. Book now and add one!</Typography>) : 
                    (<Rating
                      size="medium"
                      value={this.props.selectedBusinessInfo.overallRating}
                      precision={0.5}
                      readOnly={true}
                      classes={{
                        iconFilled: classes.starRatingFilled
                      }}
                    />)
                  }
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
              <Button disabled={this.state.isAddReviewDisabled} variant="contained" color="primary" onClick={() => this.handleAddReviewOpen()} className={classes.addReview}>Add Review</Button>
              {this.state.isAddReviewDisabled &&
                <div className={classes.addReviewDisabled}>
                  { this.props.customerId === undefined ? '* You must be logged in to leave a review' : '* You must have a completed appointment with this business!'}
                </div>
              }

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
                  <DialogContentText className={classes.dialogContentText}>
                    Which employee did you meet with
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

              <Snackbar
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={this.state.notLoggedInMessageOpen}
                autoHideDuration={6000}
                onClose={() => this.handleCloseNotLoggedInMessage()}
                message={'Please log in to add a review'}
                action={
                  <React.Fragment>
                    <IconButton size="small" aria-label="close" color="inherit" onClick={() => this.handleCloseNotLoggedInMessage()}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </React.Fragment>
                }
              />
            </div>
            <BusinessInfoDetails
              businessId={this.state.businessKey}
              businessOpenDates={this.state.businessInfo.about.daysOpen}  
              businessName={this.state.businessInfo.name}
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
    dialogContentText: {
      marginTop: '1rem',
    },
    addReviewDisabled: {
      fontSize: '0.75rem',
      color: 'red',
    }
  });

export default connect(mapStateToProps, { addEmployeeForBusiness, clearEmployeesForBusiness, setSelectedEmployee })(
  withStyles(styles, { withTheme: true })(BusinessInfo)
);
