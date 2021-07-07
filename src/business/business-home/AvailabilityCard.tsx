import React from 'react';
import {
  Button,
  Grid,
  Card,
  CardActions,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  TextField,
  withStyles,
  createStyles,
  WithStyles,
  Theme,
  CardContent,
  Divider,
  Checkbox,
  Snackbar,
  IconButton,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { firestore } from '../../config/FirebaseConfig';
import { StoreState } from '../../shared/store/types';
import { updateBusinessSchedule } from '../../shared/store/actions';
import { connect } from 'react-redux';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    card: {
      // padding: theme.spacing(1),
      // height: '27rem',
    },
    openHours: {
      textAlign: 'center',
      backgroundColor: theme.palette.background.paper,
      insert: true,
    },
    dayOfWeek: {
      // padding: theme.spacing(1),
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '1rem',
    },
    dayText: {
      textAlign: 'left',
      justifyContent: 'left',
      marginRight: '0.5rem'
    },
    hourlyAvailability: {
      display: 'flex',
      alignItems: 'center'
    }
  });

type State = {
  businessSchedule: BusinessSchedule[];
  editInfo: boolean;
};

interface BusinessSchedule {
  day: string;
  start: string;
  end: string;
  enabled: boolean;
}

interface Props extends WithStyles<typeof styles> {}

function mapStateToProps(state: StoreState) {
  return ({
    businessSchedule: state.system.user?.employeeInfo.business.about.daysOpen,
    businessId: state.system.user?.employeeInfo.businessId
  });
}

class AvailablityCard extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      businessSchedule: props.businessSchedule,
      editInfo: false,
      displayInvalidTimes: false
    };

    this.handleEdit = this.handleEdit.bind(this);
  }

  updateEnabled(event, index) {
    let daysOpen = this.state.businessSchedule;
    daysOpen[index].enabled = event.target.checked;

    this.setState({
      businessSchedule: daysOpen
    });
  }

  handleStartTimeChange(index, e) {
    let businessScheduleToUpdate = this.state.businessSchedule;
    businessScheduleToUpdate[index].start = e.target.value;

    this.setState({
      businessSchedule: businessScheduleToUpdate
    });
  }

  handleCloseTimeChange(index, e) {
    let businessScheduleToUpdate = this.state.businessSchedule;
    businessScheduleToUpdate[index].end = e.target.value;

    this.setState({
      businessSchedule: businessScheduleToUpdate
    });
  }

  updateBusinessSchedule(businessSchedule: any[]) {
    firestore.collection('businesses').doc(`${this.props.businessId}`).update({
      'about.daysOpen': businessSchedule
    })
  }

  handleCloseDisplayInvalidTimes() {
    this.setState({
      displayInvalidTimes: false
    });
  }

  render() {
    const { classes } = this.props;
    const { editInfo } = this.state;
    return (
      <div>
        <Card className={classes.card} elevation={0}>
          <CardContent>
            <Typography variant="h5">Availability</Typography>
            <Divider />
              {this.state.businessSchedule && this.state.businessSchedule.map((item, index) => (
                <div key={item.day} className={classes.dayOfWeek}>
                  <Checkbox
                    disabled={!editInfo}
                    checked={item.enabled}
                    onChange={(e) => this.updateEnabled(e, index)}
                  />
                  <Typography className={classes.dayText}>{item.day}</Typography>
                  <div className={classes.hourlyAvailability}>
                    <TextField
                      id="time"
                      type="Time"
                      onChange={(e) => this.handleStartTimeChange(index, e)}
                      disabled={!editInfo || !item.enabled}
                      defaultValue={item.start}
                    />
                    <Typography style={{ marginRight: '0.25rem' }}>-</Typography>
                    <TextField
                      id="time"
                      type="Time"
                      onChange={(e) => this.handleCloseTimeChange(index, e)}
                      disabled={!editInfo || !item.enabled}
                      defaultValue={item.end}
                      style={{ width: 104 }}
                      size='small'
                    />
                  </div>
                </div>
              ))}
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
                onClick={() => this.handleEdit('editClicked')}
              >
                Save Changes
              </Button>
            )}
          </CardActions>
        </Card>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          open={this.state.displayInvalidTimes}
          autoHideDuration={6000}
          onClose={() => this.handleCloseDisplayInvalidTimes()}
          message={'Invalid times selected'}
          action={
            <React.Fragment>
              <IconButton size="small" aria-label="close" color="inherit" onClick={() => this.handleCloseDisplayInvalidTimes()}>
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
    }
  }

  update() {
    if (this.state.editInfo) {
      let validTimes = true;
  
      for (let businessDay of this.state.businessSchedule) {
        if (businessDay.end <= businessDay.start) {
          validTimes = false;
          break;
        }
      }
  
      if (validTimes) {
        this.setState({ editInfo: !this.state.editInfo });

        this.updateBusinessSchedule(this.state.businessSchedule);
      } else {
        this.setState({
          displayInvalidTimes: true
        });
      }
    } else {
      this.setState({ editInfo: !this.state.editInfo });
    }
  }
}

export default connect(mapStateToProps, { updateBusinessSchedule })(
  withStyles(styles, { withTheme: true })(AvailablityCard)
);
