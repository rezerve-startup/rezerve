import { Button, Container, createStyles, Grid, makeStyles, Theme, withStyles } from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';
import { auth, firestore } from '../config/FirebaseConfig';
import { updateUser } from '../shared/store/actions';
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
        }
    }

    dispatchUpdateUser = (newUser) => {
        this.props.updateUser(newUser)
    }

    loginEmployee() {
        // Other account is 'testcustomer@test.com', 'testcustomer'
        auth.signInWithEmailAndPassword('testemployee@test.com', 'testemployee')
          .then((userCredential) => {
            if (userCredential !== null && userCredential.user) {
              const user = userCredential.user;
    
              firestore.collection('users').doc(`${user.uid}`).get()
                .then((userObj) => {
                  const userInfo = userObj.data();
                  console.log(userInfo);
                  this.dispatchUpdateUser(userInfo);
                });
            }
          });
      }
    
      loginCustomer() {
        auth.signInWithEmailAndPassword('testCustomer@test.com', 'testcustomer')
          .then((userCredential) => {
            if (userCredential !== null && userCredential.user) {
              const user = userCredential.user;
    
              firestore.collection('users').doc(`${user.uid}`).get()
                .then((userObj) => {
                  const userInfo = userObj.data();
                  this.dispatchUpdateUser(userInfo);
                });
            }
          });
      }
    
      signInEmployee = () => {
        this.loginEmployee();
      }
    
      signInCustomer = () => {
        this.loginCustomer();
      }

    render() {
        const { classes } = this.props;

        return (
            <Container className={classes.root} maxWidth={false}>
                <Grid container alignItems="center" direction='column'>
                    <Grid item>
                    <h4>Temp Login</h4>
                    <Button className={classes.button} onClick={this.signInCustomer}>Customer</Button>
                    </Grid>
                    <Grid item>
                    <h4>Temp Login</h4>
                    <Button className={classes.button} onClick={this.signInEmployee} href='/business-home'>Business</Button>
                    </Grid>
                </Grid>
            </Container>
        )
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
      }
    },
    whiteTextPlease: {
        color: 'white'
    }
});

export default connect(mapStateToProps, { updateUser })(
    withStyles(styles, { withTheme: true })(TempLoginPage)
);