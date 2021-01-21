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
} from '@material-ui/core';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    card: {
      padding: theme.spacing(2),
    },
    openHours: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
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
}

interface Props extends WithStyles<typeof styles> {}

class AvailablityCard extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      businessSchedule: [
        { day: 'Monday', start: '09:00', end: '17:00' },
        { day: 'Tuesday', start: '09:00', end: '17:00' },
        { day: 'Wednesday', start: '09:00', end: '17:00' },
        { day: 'Thursday', start: '09:00', end: '17:00' },
        { day: 'Friday', start: '09:00', end: '17:00' },
        { day: 'Saturday', start: '09:00', end: '17:00' },
        { day: 'Sunday', start: '09:00', end: '17:00' },
      ],
      editInfo: false,
    };

    this.handleEdit = this.handleEdit.bind(this);
  }

  render() {
    const { classes } = this.props;
    const { editInfo } = this.state;
    return (
      <Card className={classes.card}>
        <Typography align="center">Avaliability</Typography>
        <List className={classes.openHours}>
          {this.state.businessSchedule.map((item: BusinessSchedule) => (
            <ListItem key={item.day}>
              <ListItemText primary={item.day} />
              <ListItemSecondaryAction>
                <Grid container={true} justify="space-between" spacing={1}>
                  <Grid item={true} xs={true}>
                    <form noValidate={true}>
                      <TextField
                        id="time"
                        type="Time"
                        disabled={editInfo}
                        defaultValue={item.start}
                      />
                    </form>
                  </Grid>
                  to
                  <Grid item={true} xs={true}>
                    <form noValidate={true}>
                      <TextField
                        id="time"
                        type="Time"
                        disabled={editInfo}
                        defaultValue={item.end}
                      />
                    </form>
                  </Grid>
                </Grid>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
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
    this.setState({ editInfo: !this.state.editInfo });
  }
}

export default withStyles(styles, { withTheme: true })(AvailablityCard);
