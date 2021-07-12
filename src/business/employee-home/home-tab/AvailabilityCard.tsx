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
  Snackbar,
  IconButton,
  Checkbox,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { StoreState } from '../../../shared/store/types';
import { connect } from 'react-redux';
import { firestore } from '../../../config/FirebaseConfig';

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
  employeeSchedule: any;
  editInfo: boolean;
  displayInvalidTimes: boolean;
};

function mapStateToProps(state: StoreState) {
  return({
    employeeId: state.system.user?.employeeId,
    employeeSchedule: state.system.user.employeeInfo?.availability,
    businessSchedule: state.business.businessAvailability.daysOpen
  })
}

interface Props extends WithStyles<typeof styles> {
  employeeSchedule?: any[];
  employeeId?: any;
  businessSchedule?: any;
}

class AvailablityCard extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      employeeSchedule: props.employeeSchedule,
      editInfo: true,
      displayInvalidTimes: false
    };

    this.handleEdit = this.handleEdit.bind(this);
  }

  handleStartTimeChange(index, e) {
    let employeeScheduleToUpdate = this.state.employeeSchedule;
    employeeScheduleToUpdate[index].start = e.target.value;

    this.setState({
      employeeSchedule: employeeScheduleToUpdate
    });
  }

  handleCloseTimeChange(index, e) {
    let employeeScheduleToUpdate = this.state.employeeSchedule;
    employeeScheduleToUpdate[index].end = e.target.value;

    this.setState({
      employeeSchedule: employeeScheduleToUpdate
    });
  }

  updateEmployeeSchedule(businessSchedule: any[]) {
    firestore.collection('employees').doc(`${this.props.employeeId}`).update({
      availability: businessSchedule
    })
  }

  updateEnabled(event, index) {
    let daysOpen = this.state.employeeSchedule;
    daysOpen[index].enabled = event.target.checked;

    this.setState({
      employeeSchedule: daysOpen
    });
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
              {this.state.employeeSchedule && this.state.employeeSchedule.map((item, index) => (
                <div key={item.day} className={classes.dayOfWeek}>
                  <Checkbox
                    disabled={editInfo || !this.props.businessSchedule[index].enabled}
                    checked={item.enabled}
                    onChange={(e) => this.updateEnabled(e, index)}
                  />
                  <Typography className={classes.dayText}>{item.day.substring(0,3) + '.'}</Typography>
                  <div className={classes.hourlyAvailability}>
                    <TextField
                      id="time"
                      type="Time"
                      onChange={(e) => this.handleStartTimeChange(index, e)}
                      disabled={editInfo || !this.props.businessSchedule[index].enabled || !item.enabled}
                      defaultValue={item.start}
                    />
                    <Typography style={{ marginRight: '0.25rem' }}>-</Typography>
                    <TextField
                      id="time"
                      type="Time"
                      onChange={(e) => this.handleCloseTimeChange(index, e)}
                      disabled={editInfo || !this.props.businessSchedule[index].enabled || !item.enabled}
                      defaultValue={item.end}
                      style={{ width: 104 }}
                      size='small'
                    />
                  </div>
                </div>
              ))}
          </CardContent>
          <CardActions style={{ justifyContent: 'center'}}>
            {this.state.editInfo ? (
              <Button
                size="small"
                color="secondary"
                // tslint:disable-next-line: jsx-no-lambda
                onClick={() => this.handleEdit('editClicked')}
              >
                Edit
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
            vertical: 'top',
            horizontal: 'right',
          }}
          open={this.state.displayInvalidTimes}
          autoHideDuration={6000}
          onClose={() => this.handleCloseDisplayInvalidTimes()}
          message={'Times selected are outside the business hours'}
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
    if (!this.state.editInfo) {
      let validTimes = true;
  
      for (let businessDay of this.state.employeeSchedule) {
        if (businessDay.end <= businessDay.start) {
          validTimes = false;
          break;
        }

        for (let overallBusinessDay of this.props.businessSchedule) {
          if (overallBusinessDay.day === businessDay.day) {
            if (businessDay.end > overallBusinessDay.end || businessDay.start < overallBusinessDay.start ||
                (!overallBusinessDay.enabled && businessDay.enabled)) {
              validTimes = false;
              break;
            }
          }
        }

        if (!validTimes) {
          break;
        }
      }
  
      if (validTimes) {
        this.setState({ editInfo: !this.state.editInfo });

        this.updateEmployeeSchedule(this.state.employeeSchedule);
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

export default connect(mapStateToProps, null)(
  withStyles(styles, { withTheme: true })(AvailablityCard)
);
