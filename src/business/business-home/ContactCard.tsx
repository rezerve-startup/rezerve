import React from 'react';
import {
  Button,
  Card,
  CardActions,
  Typography,
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

type State = {};

interface Props extends WithStyles<typeof styles> {
  editInfo: boolean;
}

class ContactCard extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  render() {
    const { classes } = this.props;
    return (
      <Card className={classes.card}>
        <Typography align="center">Contact Stylist</Typography>

        {this.props.editInfo ? (
          <Typography align="left">Phone Number: 444-444-4444</Typography>
        ) : (
          <form autoComplete="off">
            <TextField label="Edit Phone number" id="edit-phone" /> <br />
          </form>
        )}

        {this.props.editInfo ? (
          <Typography align="left">
            Email Address: exampleEmail@email.com
          </Typography>
        ) : (
          <form autoComplete="off">
            <TextField label="Edit email address" id="edit-email" />
          </form>
        )}

        <CardActions style={{ justifyContent: 'center' }}>
          <Button size="small" color="secondary">
            edit
          </Button>
        </CardActions>
      </Card>
    );
  }
}

export default withStyles(styles, { withTheme: true })(ContactCard);
