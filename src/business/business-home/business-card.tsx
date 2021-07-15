import {
  Button,
  Card, CardActions,
  CardContent, createStyles, IconButton, Snackbar, TextField, Theme, Typography, withStyles
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { Rating } from '@material-ui/lab';
import React from 'react';
import { connect } from 'react-redux';
import { firestore } from '../../config/FirebaseConfig';
import { setEmployeeBusinessDescription, setEmployeeBusinessName } from '../../shared/store/actions';
import { StoreState } from '../../shared/store/types';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    card: {
      padding: theme.spacing(2),
    },
    cardContent: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center'
    },
    contacts: {},
    userContent: {
      flex: '1 0 auto',
    },
    userImage: {
      width: '450px',
      height: '300px',
    },
    userRating: {
      marginTop: '16px',
    },
  });

const StyledRating = withStyles((theme) => ({
  iconFilled: {
    color: theme.palette.primary.main,
  },
  iconHover: {
    color: theme.palette.primary.light,
  },
}))(Rating);

function mapStateToProps(state: StoreState) {
  return ({
    business: state.system.user.employeeInfo?.business,
    businessId: state.system.user.employeeInfo?.businessId
  })
}

class BusinessCard extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      editInfo: false,
      businessDescription: props.business.description,
      businessName: props.business.name,
      invalidBusinessChangeMessageOpen: false
    };
    this.handleEdit = this.handleEdit.bind(this);
  }

  handleBusinessNameChange(e) {
    this.setState({
      businessName: e.target.value
    });
  }

  handleBusinessDescriptionChange(e) {
    this.setState({
      businessDescription: e.target.value
    });
  }

  handleCloseInvalidBusinessChangeMessage() {
    this.setState({
      invalidBusinessChangeMessageOpen: false
    });
  }

  dispatchSetEmployeeBusinessName(businessName: string) {
    this.props.setEmployeeBusinessName(businessName);
  }

  dispatchSetEmployeeBusinessDescription(businessDescription: string) {
    this.props.setEmployeeBusinessDescription(businessDescription);
  }
  
  render() {
    const { classes } = this.props;

    return (
      <div>
        <Card className={classes.card}>
          <CardContent className={classes.userContent}>
            {!this.state.editInfo ? (
              <div className={classes.cardContent}>
                <Typography variant="h5">
                  <b>{this.props.business.name}</b>
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  {this.props.business.description}
                </Typography>
                <StyledRating
                  className={classes.userRating}
                  value={this.props.business.overallRating}
                  defaultValue={2.5}
                  precision={0.5}
                  size='medium'
                  readOnly={true}
                  disabled={!this.state.editInfo}
                />
              </div>
            ) : (
              <div>
                {/* Edit/Update Business Name */}
                <div style={{ padding: 10 }}>
                    <TextField
                      label="Business Name"
                      id="edit-businessName"
                      onChange={(e) => this.handleBusinessNameChange(e)}
                      value={this.state.businessName}
                    />
                    <br />
                </div>
                <div style={{ padding: 10 }}>
                    <TextField
                      label="Description"
                      id="edit-description"
                      onChange={(e) => this.handleBusinessDescriptionChange(e)}
                      value={this.state.businessDescription}
                    />
                </div>
              </div>
            )}
          </CardContent>
          <CardActions style={{ justifyContent: 'center' }}>
            {!this.state.editInfo ? (
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

        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={this.state.invalidBusinessChangeMessageOpen}
          autoHideDuration={6000}
          onClose={() => this.handleCloseInvalidBusinessChangeMessage()}
          message={'Business name and description must not be empty'}
          action={
            <React.Fragment>
              <IconButton size="small" aria-label="close" color="inherit" onClick={() => this.handleCloseInvalidBusinessChangeMessage()}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </React.Fragment>
          }
        />
      </div>
    );
  }

  handleEdit(action: string) {
    switch (action) {
      case 'editClicked': {
        this.update();
        break;
      }
      case 'SaveChanges': {
        this.updateData();
        break;
      }
    }
  }

  update() {
    this.setState({ editInfo: !this.state.editInfo });
  }

  updateData() {
    if (this.state.businessDescription === '' || this.state.businessName === '') {
      this.setState({
        invalidBusinessChangeMessageOpen: true
      });
    } else {
      const businessName = this.state.businessName;
      const businessDescription = this.state.businessDescription;
      firestore.collection('businesses').doc(`${this.props.businessId}`).update({
        name: businessName,
        description: businessDescription
      }).then(() => {
        this.dispatchSetEmployeeBusinessName(businessName);
        this.dispatchSetEmployeeBusinessDescription(businessDescription);

        this.setState({
          description: this.state.description,
          businessName: this.state.businessName,
          editInfo: !this.state.editInfo
        });
      })
    }
  }
}

export default connect(mapStateToProps, { setEmployeeBusinessName, setEmployeeBusinessDescription })(
  withStyles(styles, { withTheme: true })(BusinessCard)
);
