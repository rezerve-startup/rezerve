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
} from '@material-ui/core';
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
      padding: theme.spacing(1),
      textAlign: 'center',
      backgroundColor: theme.palette.background.paper,
      insert: true,
    },
    dayOfWeek: {
      marginRight: '100px',
      fontSize: '14px',
    },
  });

type State = {
  employeeSchedule: any;
  editInfo: boolean;
};

function mapStateToProps(state: StoreState) {
  return({
    employeeId: state.system.user.employeeId,
    employeeSchedule: state.system.user.employeeInfo.availability,
    businessSchedule: state.business.businessAvailability
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

  render() {
    const { classes } = this.props;
    const { editInfo } = this.state;
    return (
      <Card className={classes.card} elevation={0}>
        <CardContent>
          <Typography variant="h5">Availability</Typography>
          <Divider />
          <List>
            {this.state.employeeSchedule && this.state.employeeSchedule.map((item, index) => (
              <ListItem key={item.day}>
                <ListItemText
                  primary={item.day}
                  classes={{ primary: classes.dayOfWeek }}
                />
                <ListItemSecondaryAction>
                  <Grid container={true} justify="flex-start" spacing={1}>
                    <Grid item={true} xs={true}>
                      <form noValidate={true}>
                        <TextField
                          id="time"
                          type="Time"
                          onChange={(e) => this.handleStartTimeChange(index, e)}
                          disabled={editInfo}
                          defaultValue={item.start}
                          style={{ width: 104 }}
                        />
                      </form>
                    </Grid>
                    <Typography style={{ margin: 'auto' }}>-</Typography>
                    <Grid item={true} xs={true}>
                      <form noValidate={true}>
                        <TextField
                          id="time"
                          type="Time"
                          onChange={(e) => this.handleCloseTimeChange(index, e)}
                          disabled={editInfo}
                          defaultValue={item.end}
                          style={{ width: 104 }}
                        />
                      </form>
                    </Grid>
                  </Grid>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
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
        if (businessDay.end < businessDay.start) {
          validTimes = false;
          break;
        }

        if (businessDay.end > this.props.businessSchedule.closingTime || businessDay.start < this.props.businessSchedule.openingTime) {
          validTimes = false;
          break;
        }
      }
  
      if (validTimes) {
        this.setState({ editInfo: !this.state.editInfo });

        this.updateEmployeeSchedule(this.state.employeeSchedule);
      }
    } else {
      this.setState({ editInfo: !this.state.editInfo });
    }


  }
}

export default connect(mapStateToProps, null)(
  withStyles(styles, { withTheme: true })(AvailablityCard)
);
