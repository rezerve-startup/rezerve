import React from 'react';
import {
  Button,
  Card,
  CardActions,
  Typography,
  TextField,
  withStyles,
  createStyles,
  Theme,
  Divider,
} from '@material-ui/core';
import { StoreState } from '../../../shared/store/types';
import { setEmployeeEmail, setEmployeePhone } from '../../../shared/store/actions';
import { connect } from 'react-redux';
import { auth, firestore } from '../../../config/FirebaseConfig';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    card: {
      padding: theme.spacing(1),
      height: '400px',
    },
    contacts: {},
  });

type State = {
  editInfo: boolean;
  phone: string;
  email: string;
};


function mapStateToProps(state: StoreState) {
  return ({
    employeeId: state.system.user.employeeId,
    employeePhone: state.system.user.phone,
    employeeEmail: state.system.user.email
  });
}

class ContactCard extends React.Component<any, State> {
  constructor(props) {
    super(props);
    this.state = {
      editInfo: true,
      phone: props.employeePhone,
      email: props.employeeEmail,
    };
    this.handleEdit = this.handleEdit.bind(this);
  }

  dispatchSetEmployeePhone(phoneNumber: string) {
    this.props.setEmployeePhone(phoneNumber);
  }

  dispatchSetEmployeeEmail(email: string) {
    this.props.setEmployeeEmail(email);
  }

  handleUpdatePhoneChange(e: any) {
    this.setState({
      phone: e.target.value
    });
  }

  handleUpdateEmailChange(e: any) {
    this.setState({
      email: e.target.value
    });
  }

  render() {
    const { classes } = this.props;

    return (
      <Card className={classes.card} elevation={0}>
        <Typography variant="h5">Contact Stylist</Typography>
        <Divider />
        {this.state.editInfo ? (
          <Typography align="left" className={classes.contacts}>
            Phone: {this.props.employeePhone}
          </Typography>
        ) : (
          // Edit/Update Phone Number
          <form autoComplete="off" style={{ padding: 10 }}>
            <TextField
              label="Change Phone number"
              id="edit-phone"
              defaultValue={this.props.employeePhone}
              placeholder={"123-456-7890"}
              inputProps={{ pattern: /[0-9]{3}-[0-9]{3}-[0-9]{4}/}}
              onChange={(e) => this.handleUpdatePhoneChange(e)}
            />
            <br />
          </form>
        )}

        {this.state.editInfo ? (
          <Typography className={classes.contacts} align="left">
            Email: {this.props.employeeEmail}
          </Typography>
        ) : (
          // Edit/Update Email
          <form autoComplete="off" style={{ padding: 10 }}>
            <TextField
              label="Change email address"
              id="edit-email"
              defaultValue={this.props.employeeEmail}
              placeholder={"user@gmail.com"}
              inputProps={{ pattern: /.*@.*/}}
              onChange={(e) => this.handleUpdateEmailChange(e)}
            />
          </form>
        )}

        <CardActions style={{ justifyContent: 'center' }}>
          {this.state.editInfo ? (
            <Button
              size="small"
              color="secondary"
              // tslint:disable-next-line: jsx-no-lambda
              onClick={() => this.handleEdit('editClicked')}
            >
              edit
            </Button>
          ) : (
            <Button
              size="small"
              color="secondary"
              // tslint:disable-next-line: jsx-no-lambda
              onClick={() => this.handleEdit('SaveChanges')}
            >
              Save Changes
            </Button>
          )}
        </CardActions>
      </Card>
    );
  }

  handleEdit(action: string) {
    switch (action) {
      case 'editClicked': {
        this.update();
        break;
      }
      case 'SaveChanges': {
        this.updatePhoneAndEmail();
        break;
      }
    }
  }

  update() {
    this.setState({ editInfo: !this.state.editInfo });
  }

  updatePhoneAndEmail() {
    const phoneRegex = /[0-9]{3}-[0-9]{3}-[0-9]{4}/;
    const emailRegex = /.+@.+/;

    if (this.state.phone.match(phoneRegex) && this.state.email.match(emailRegex)) {
      this.dispatchSetEmployeePhone(this.state.phone);
      this.dispatchSetEmployeeEmail(this.state.email);
      this.update();

      firestore.collection('users').doc(`${auth.currentUser?.uid}`).update({
        phone: this.state.phone,
        email: this.state.email
      })
    }
  }
}

export default connect(mapStateToProps, { setEmployeePhone, setEmployeeEmail })(
  withStyles(styles, { withTheme: true })(ContactCard)
);

