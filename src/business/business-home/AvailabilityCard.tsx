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
      padding: theme.spacing(1),
    },
    cardContent: {
      padding: '2px',
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
        <Card>
          <CardContent className={classes.cardContent}>
            <Typography variant="h5">Availability</Typography>
            <Divider />
            <List>
              {this.state.businessSchedule.map((item: BusinessSchedule, index) => (
                <ListItem key={item.day}>
                  <Checkbox
                    disabled={!this.state.editInfo}
                    checked={item.enabled}
                    onChange={(e) => this.updateEnabled(e, index)}
                  />
                  <ListItemText
                    primary={item.day}
                    classes={{ primary: classes.dayOfWeek }}
                  />
                  <ListItemSecondaryAction>
                    <Grid container={true} justify="flex-start" spacing={1}>
                      <Grid item={true} xs={true}>
                        <TextField
                          id="time"
                          type="Time"
                          disabled={!editInfo || !item.enabled}
                          onChange={(e) => this.handleStartTimeChange(index, e)}
                          defaultValue={item.start}
                          style={{ width: 104 }}
                        />
                      </Grid>
                      <Typography style={{ margin: 'auto' }}>-</Typography>
                      <Grid item={true} xs={true}>
                        <TextField
                          id="time"
                          type="Time"
                          disabled={!editInfo || !item.enabled}
                          onChange={(e) => this.handleCloseTimeChange(index, e)}
                          defaultValue={item.end}
                          style={{ width: 104 }}
                        />
                      </Grid>
                    </Grid>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
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
