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
  Divider,
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
    contacts: {},
  });

type State = {
  editInfo: boolean;
  bank: string;
  email: string;
};

interface Props extends WithStyles<typeof styles> {}

class PreferenceCard extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      editInfo: true,
      bank: 'Stride',
      email: 'emailBusiness@email.com'
    };
    this.handleEdit = this.handleEdit.bind(this);
  }

  render() {
    const { classes } = this.props;

    return (
      <Card className={classes.card}>
        <Typography variant="h5">Account Preferences</Typography>
        <Divider />
        {this.state.editInfo ? (
          <Typography align="left" className={classes.contacts}>
            Link Bank Account: {this.state.bank}
          </Typography>
        ) : (
          // Edit/Update Phone Number
          <form autoComplete="off" style={{ padding: 10 }}>
            <TextField
              label="Link Bank Account"
              id="edit-bank"
              defaultValue={this.state.bank}
            />
            <br />
          </form>
        )}

        {this.state.editInfo ? (
          <Typography className={classes.contacts} align="left">
            Email: {this.state.email}
          </Typography>
        ) : (
          // Edit/Update Email
          <form autoComplete="off" style={{ padding: 10 }}>
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
      bank: this.state.bank,
      email: this.state.email,
    });
    this.update();
  }
}

export default withStyles(styles, { withTheme: true })(PreferenceCard);
