import {
  Button,
  Container,
  createStyles,
  Grid,
  Theme,
  withStyles,
} from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';
import { auth, firestore } from '../config/FirebaseConfig';
import {
  setUserEmployeeInfo,
  setUserCustomerInfo, 
  setBusinessAvailability
} from '../shared/store/actions';
import { StoreState } from './store/types';

function mapStateToProps(state: StoreState) {
  return {
    system: state.system,
  };
}
class TempLoginPage extends React.Component<any, any> {
  constructor(props) {
    super(props);

    this.state = {
      user: props.system.user,
    };
  }

  dispatchSetUserEmployeeInfo = (userEmployeeInfo) => {
    this.props.setUserEmployeeInfo(userEmployeeInfo);
  }

  dispatchSetUserCustomerInfo = (userCustomerInfo) => {
    this.props.setUserCustomerInfo(userCustomerInfo)
  }

  dispatchSetBusinessAvailability = (businessAvailability) => {
    this.props.setBusinessAvailability(businessAvailability);
  }

  loginEmployee() {
    // Other account is 'testcustomer@test.com', 'testcustomer'
    auth
      .signInWithEmailAndPassword('testemployee@test.com', 'testemployee')
      .then((userCredential) => {
        if (userCredential !== null && userCredential.user) {
          const user = userCredential.user;

          firestore
            .collection('users')
            .doc(`${user.uid}`)
            .get()
            .then((userObj) => {
              const userInfo = userObj.data();

              if (userInfo && userInfo.employeeId !== '') {

                firestore.collection('employees').doc(userInfo.employeeId).get()
                  .then((employeeObj) => {
                    let employeeInfo = employeeObj.data();

                    let employeeInfoToAdd = {
                      availability: employeeInfo?.availability,
                      isOwner: employeeInfo?.isOwner,
                      position: employeeInfo?.position,
                      services: employeeInfo?.services,
                      todos: employeeInfo?.todos
                    }
                    userInfo.employeeInfo = employeeInfoToAdd;
                  })
                  .then(() => {
                    firestore.collection('businesses').where('employees', 'array-contains', `${userInfo.employeeId}`).get()
                      .then((querySnapshot) => {
                        querySnapshot.forEach((businessDoc) => {
                          let businessInfoData = businessDoc.data();

                          let businessAvailability = {
                            daysOpen: businessInfoData.about.daysOpen,
                            openingTime: businessInfoData.about.openingTime,
                            closingTime: businessInfoData.about.closingTime
                          };

                          this.dispatchSetBusinessAvailability(businessAvailability);
                        })
                      })
                  })
                  .then(() => {
                    this.dispatchSetUserEmployeeInfo(userInfo);
                  })
              }
            });
        }
      });
  }

  loginCustomer() {
    auth
      .signInWithEmailAndPassword('testCustomer@test.com', 'testcustomer')
      .then((userCredential) => {
        if (userCredential !== null && userCredential.user) {
          const user = userCredential.user;

          firestore
            .collection('users')
            .doc(`${user.uid}`)
            .get()
            .then((userObj) => {
              const userInfo = userObj.data();
              this.dispatchSetUserCustomerInfo(userInfo);

              if (userInfo && userInfo.customerId !== '') {
                let customerAppts: any[] = [];
                let customerReviews: any[] = [];

                firestore.collection('customers').doc(userInfo.customerId).get()
                  .then((customerObj) => {
                    let customerInfo = customerObj.data();
                    userInfo.customerInfo = customerInfo;
                  })
                  .then(() => {
                    firestore.collection('reviews').where('customerId', '==', `${userInfo.customerId}`).get()
                      .then((querySnapshot) => {
                        querySnapshot.forEach((reviewDoc) => {
                          customerReviews.push(reviewDoc.data());
                        });

                        userInfo.customerInfo.reviews = customerReviews;
                      })
                  })
                  .then(() => {
                    firestore.collection('appointments').where('customerId', '==', `${userInfo.customerId}`).get()
                      .then((querySnapshot) => {
                        querySnapshot.forEach((apptDoc) => {
                          const apptData = apptDoc.data();

                          apptData.appointmentId = apptDoc.id;

                          firestore.collection('users').where('employeeId', '==', `${apptData.employeeId}`).get()
                            .then((querySnapshot) => {
                              querySnapshot.forEach((userDoc) => {
                                const userData = userDoc.data();

                                apptData.employee = {
                                  firstName: userData.firstName,
                                  lastName: userData.lastName
                                }

                                customerAppts.push(apptData);
                                
                                userInfo.customerInfo.appointments = customerAppts;

                                this.dispatchSetUserCustomerInfo(userInfo);
                              });
                            })
                        });
                      })
                  })
                  .then(() => {
                    this.dispatchSetUserCustomerInfo(userInfo);
                  })
              }
            });
        }
      });
  }

  signInEmployee = () => {
    this.loginEmployee();
  };

  signInCustomer = () => {
    this.loginCustomer();
  };

  render() {
    const { classes } = this.props;

    return (
      <Container className={classes.root} maxWidth={false}>
        <Grid container alignItems="center" direction="column">
          <Grid item>
            <h3>Temp Login</h3>
            <Button
              variant="contained"
              className={classes.button}
              onClick={this.signInCustomer}
            >
              Customer
            </Button>
          </Grid>
          <Grid item>
            <h3>Temp Login</h3>
            <Button
              variant="contained"
              className={classes.button}
              onClick={this.signInEmployee}
            >
              Business
            </Button>
          </Grid>
        </Grid>
      </Container>
    );
  }
}

const styles = (theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.secondary.dark,
      minHeight: '100vh',
      color: theme.palette.secondary.light,
      paddingTop: 15,
    },
    button: {
      backgroundColor: theme.palette.secondary.dark,
      color: theme.palette.secondary.light,
      border: '1px solid white',
      '&:hover': {
        backgroundColor: theme.palette.secondary.dark,
        color: theme.palette.secondary.light,
      },
    },
    whiteTextPlease: {
      color: 'white',
    },
  });

export default connect(mapStateToProps, { setUserEmployeeInfo, setUserCustomerInfo, setBusinessAvailability })(
  withStyles(styles, { withTheme: true })(TempLoginPage),
);
