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
  updateUser,
  setUserInfo, 
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

  dispatchUpdateUser = (newUser) => {
    this.props.updateUser(newUser);
  };

  dispatchSetUserInfo = (userInfo) => {
    this.props.setUserInfo(userInfo);
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
                let employeeAppts: any[] = [];
                let employeeReviews: any[] = [];

                firestore.collection('employees').doc(userInfo.employeeId).get()
                  .then((employeeObj) => {
                    let employeeInfo = employeeObj.data();
                    userInfo.employeeInfo = employeeInfo;
                  })
                  .then(() => {
                    firestore.collection('reviews').where('employeeId', '==', `${userInfo.employeeId}`).get()
                      .then((querySnapshot) => {
                        querySnapshot.forEach((reviewDoc) => {
                          employeeReviews.push(reviewDoc.data());
                        });

                        userInfo.employeeInfo.reviews = employeeReviews;
                      })
                  })
                  .then(() => {
                    firestore.collection('appointments').where('employeeId', '==', `${userInfo.employeeId}`).get()
                      .then((querySnapshot) => {
                        let employeeClients = {};

                        querySnapshot.forEach((apptDoc) => {
                          const apptData = apptDoc.data();

                          apptData.appointmentId = apptDoc.id;

                          firestore.collection('users').where('customerId', '==', `${apptData.customerId}`).get()
                            .then((querySnapshot) => {
                              querySnapshot.forEach((userDoc) => {
                                const userData = userDoc.data();
                                let numVisits = 0;

                                if (apptData.datetime.toDate() < Date.now()) {
                                  if (employeeClients[`${apptData.customerId}`]) {
                                    let numVisits = employeeClients[`${apptData.customerId}`] + 1;
  
                                    employeeClients[`${apptData.customerId}`].numVisits += 1;
                                  } else {
                                    numVisits = 1;
  
                                    employeeClients[`${apptData.customerId}`] = {
                                      firstName: userData.firstName,
                                      lastName: userData.lastName,
                                      numVisits: numVisits
                                    }
                                  }
                                }

                                apptData.client = {
                                  firstName: userData.firstName,
                                  lastName: userData.lastName
                                }

                                employeeAppts.push(apptData);
                                
                                userInfo.employeeInfo.appointments = employeeAppts;
                                userInfo.employeeInfo.clients = employeeClients;

                                this.dispatchSetUserInfo(userInfo);
                              });
                            })
                        });
                      })
                  })
                  .then(() => {
                    firestore.collection('businesses').where('employees', 'array-contains', `${userInfo.employeeId}`).get()
                      .then((querySnapshot) => {
                        querySnapshot.forEach((businessDoc) => {
                          console.log(businessDoc.data());
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
              this.dispatchUpdateUser(userInfo);
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

export default connect(mapStateToProps, { updateUser, setUserInfo, setBusinessAvailability })(
  withStyles(styles, { withTheme: true })(TempLoginPage),
);
