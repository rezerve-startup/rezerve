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
    contacts: {
      height: '50%',
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

    return (
      <Card className={classes.card}>
        <Typography align="center">Contact Stylist</Typography>

        {this.state.editInfo ? (
          <Typography align="left" className={classes.contacts}>
            Phone Number: {this.state.phone}
          </Typography>
        ) : (
          // Edit/Update Phone Number
          <form autoComplete="off">
            Phone Number:
            <TextField
              label="Change Phone number"
              id="edit-phone"
              defaultValue={this.state.phone}
            />
            <br />
          </form>
        )}

        {this.state.editInfo ? (
          <Typography className={classes.contacts} align="left">
            Email Address: {this.state.email}
          </Typography>
        ) : (
          // Edit/Update Email
          <form autoComplete="off">
            Email Address:
            <TextField
              label="Change email address"
              id="edit-email"
              defaultValue={this.state.email}
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
        this.updateData();
        break;
      }
    }
  }

  update() {
    this.setState({ editInfo: !this.state.editInfo });
  }

  updateData() {
    this.setState({
      phone: this.state.phone,
      email: this.state.email,
    });
    this.update();
  }
}

export default withStyles(styles, { withTheme: true })(ContactCard);
