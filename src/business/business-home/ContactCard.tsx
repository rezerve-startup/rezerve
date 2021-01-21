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
import { StringDecoder } from 'string_decoder';

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
  editInfo: boolean;
  phone: string;
  email: string;
};

interface Props extends WithStyles<typeof styles> {}

class ContactCard extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      editInfo: true,
      phone: '444-444-4444',
      email: 'exampleEmail@email.com',
    };
    this.handleEdit = this.handleEdit.bind(this);
  }

  render() {
    const { classes } = this.props;
    const { editInfo } = this.state;

    return (
      <Card className={classes.card}>
        <Typography align="center">Contact Stylist</Typography>

        {this.state.editInfo ? (
          <Typography align="left">Phone Number: {this.state.phone}</Typography>
        ) : (
          <form autoComplete="off">
            Phone Number:
            <TextField
              label="Change Phone number"
              id="edit-phone"
              value={this.state.phone}
            />{' '}
            <br />
          </form>
        )}

        {this.state.editInfo ? (
          <Typography align="left">
            Email Address: {this.state.email}
          </Typography>
        ) : (
          <form autoComplete="off">
            Phone Number:
            <TextField
              label="Change email address"
              id="edit-email"
              value={this.state.email}
            />
          </form>
        )}

        <CardActions style={{ justifyContent: 'center' }}>
          {this.state.editInfo ? (
            <Button
              size="small"
              color="secondary"
              // tslint:disable-next-line: jsx-no-lambda
              onClick={() => this.handleEdit('EditStart')}
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
      case 'EditStart': {
        this.updateTimes();
        break;
      }
      case 'SaveChanges': {
        this.updateData();
        break;
      }
    }
  }

  updateTimes() {
    this.setState({ editInfo: !this.state.editInfo });
  }

  updateData() {
    this.setState({
      phone: '723-256-1232',
      email: 'newEmail@gmail.com',
    });
  }
}

export default withStyles(styles, { withTheme: true })(ContactCard);
