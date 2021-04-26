import React from 'react';
import {
  Button,
  Card,
  CardMedia,
  CardActions,
  CardContent,
  Grid,
  Typography,
  TextField,
  withStyles,
  createStyles,
  WithStyles,
  Theme,
  Divider,
} from '@material-ui/core';
import { StringDecoder } from 'string_decoder';
import { Rating } from '@material-ui/lab';
import image from '../../assets/business-pictures/cat1.jpg';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    card: {
      padding: theme.spacing(2),
    },
    contacts: {},

      userContent: {
        flex: '1 0 auto',
      },
      userImage: {
        width: '125px',
        height: '100%',
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

type State = {
  editInfo: boolean;
  description: string;
  businessName: string;
};


interface Props extends WithStyles<typeof styles> {
}

class BBusinessCard extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      editInfo: true,
      description: 'Description',
      businessName: 'Business Name'
    };
    this.handleEdit = this.handleEdit.bind(this);
  }
  
  
  render() {
    const { classes } = this.props;

    return (
      <Card className={classes.card}>
          <Grid container={true} justify="space-between" spacing={2}>
            <Grid item={true}>
                <CardContent className={classes.userContent}>
                {this.state.editInfo ? (
                <Typography variant="h5">{this.state.businessName}</Typography>  
                ) : (
                // Edit/Update Business Name
                <form autoComplete="off" style={{ padding: 10 }}>
                    <TextField
                    label="Business Name"
                    id="edit-businessName"
                    defaultValue={this.state.businessName}
                    />
                    <br />
                </form>
                )}
                
                {this.state.editInfo ? (
                <Typography variant="subtitle1" color="textSecondary">
                {this.state.description}
                </Typography>
                ) : (
                // Edit/Update Description
                <form autoComplete="off" style={{ padding: 10 }}>
                    <TextField
                    label="Description"
                    id="edit-description"
                    defaultValue={this.state.description}
                    />
                </form>
                )}
                <StyledRating
              className={classes.userRating}
              value={3.5}
              defaultValue={2.5}
              precision={0.5}
              size='medium'
              readOnly={true}
              disabled={!this.state.editInfo}
            />
                
                </CardContent>
                
                </Grid>
        

                
                <Grid item={true}>
                     <CardMedia
                        className={classes.userImage}
                        title="Business Image"
                        image={image}
                    />
                    </Grid>
                </Grid>
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
      description: this.state.description,
      businessName: this.state.businessName,
    });
    this.update();
  }
}

export default withStyles(styles, { withTheme: true })(BBusinessCard);
