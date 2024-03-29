import {
  Button,
  Card, CardActions, CardContent, Grid, TextField, Typography, withStyles
} from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import React from 'react';
import { connect } from 'react-redux';
import { firestore } from '../../../config/FirebaseConfig';
import { setEmployeePosition, setEmployeeReviews } from '../../../shared/store/actions';
import { StoreState } from '../../../shared/store/types';

const StyledRating = withStyles((theme) => ({
  iconFilled: {
    color: theme.palette.primary.main,
  },
  iconHover: {
    color: theme.palette.primary.light,
  },
}))(Rating);

function mapStateToProps(state: StoreState) {
  const employeeReviews = state.system.user.employeeInfo.reviews;
  const reviewsToAdd: any[] = [];

  if (employeeReviews) {
    for (const review of employeeReviews) {
      reviewsToAdd.push(review);
    }
  }

  return {
    employeeFirstName: state.system.user?.firstName,
    employeeLastName: state.system.user?.lastName,
    employeeUserId: state.system.user.id,
    employeeId: state.system.user?.employeeId,
    employeePosition: state.system.user.employeeInfo?.position,
    employeeReviews: reviewsToAdd
  };
};

class StylistCard extends React.Component<any, any>{
  
  constructor(props: any) {
    super(props);

    this.state = {
      employeeFirstName: props.employeeFirstName,
      employeeLastName: props.employeeLastName,
      employeeId: props.employeeId,
      employeePosition: props.employeePosition,
      editInfo: false,
      avgEmployeeReview: 0
    };

    this.handleEdit = this.handleEdit.bind(this);
  }
  
  computeAvgReviewRating(reviews: any[]) {
    let totalReviewRating = 0;
  
    reviews.forEach((review) => {
      totalReviewRating += review.rating;
    });
  
    return totalReviewRating / reviews.length;
  }

  componentDidMount(){
    firestore.collection('reviews').where('employeeId', '==', `${this.props.employeeId}`).get()
      .then((querySnapshot) => {
        const employeeReviews: any[] = [];

        querySnapshot.forEach((reviewDoc) => {
          employeeReviews.push(reviewDoc.data());
        });

        this.dispatchSetEmployeeReviews(employeeReviews);
      })

      
  }

  updateEmployeePosition(){
    firestore.collection('employees').doc(`${this.props.employeeId}`).update({
      position: this.state.employeePosition
    }).then(() => {
      this.dispatchSetEmployeePosition(this.state.employeePosition)
    })
  }


  handleEmployeePositionChange(e) {
    this.setState({
      employeePosition: e.target.value
    });
  }

  dispatchSetEmployeeReviews = (employeeReviews: any[]) => {
    this.props.setEmployeeReviews(employeeReviews);
  }
  
  dispatchSetEmployeePosition = (employeePosition: string) => {
    this.props.setEmployeePosition(employeePosition);
  }

  render(){
    return (
      <Card className={this.props.card} elevation={0}>
        <Grid container={true} justify="space-between" spacing={2}>
          <Grid item={true}>
            <CardContent className={this.props.userContent}>
            {!this.state.editInfo ? (
                <div>
                  <Typography variant="h5">
                    <b>{this.state.employeeFirstName}</b>
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    {this.state.employeePosition}
                  </Typography>
                  <StyledRating
                    className={this.props.userRating}
                    value={this.computeAvgReviewRating(this.props.employeeReviews)}
                    defaultValue={2.5}
                    precision={0.5}
                    size='medium'
                    readOnly={true}
                    disabled={!this.state.editInfo}
                  />
                </div>
              ) : (
                <div>
                  {/* Edit/Update Business Name */}
                  <div style={{ padding: 10 }}>
                  <Typography variant="h5">
                    {this.state.employeeFirstName}  
                  </Typography>
                      
                      {/* <TextField
                        label="Last Name"
                        id="edit-firstName"
                        onChange={(e) => this.handleEmployeeLastNameChange(e)}
                        value={this.state.employeeLastName}
                      /> <span/> */}
                      <br />
                  </div>
                  <div style={{ padding: 10 }}>
                      <TextField
                        label="Position"
                        id="edit-position"
                        onChange={(e) => this.handleEmployeePositionChange(e)}
                        value={this.state.employeePosition}
                      />
                  </div>
                </div>
              )}
            </CardContent>
          </Grid>
          {/* <Grid item={true}>
            <CardMedia
              className={classes.userImage}
              // image={image}
              title="Employee Image"
            />
          </Grid> */}
        </Grid>
        <CardActions style={{ justifyContent: 'center' }}>
              {!this.state.editInfo ? (
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
                  onClick={() => this.handleEdit('SaveChanges')}
                  >
                  Save Changes
                  </Button>
              )}
            </CardActions>
      </Card>
    );
    }
  handleEdit(action: string){
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
    this.setState({editInfo: !this.state.editInfo})
  }
  
  updateData() {
    if (this.state.employeeFirstName === '' || this.state.employeeFirstName === ''  || this.state.employeePosition === '') {
      console.log("whoopsies")
    } else {
      this.updateEmployeePosition()
    }
    
    this.setState({
      employeeFirstName: this.state.employeeFirstName,
      employeeLastName: this.state.employeeLastName,
      employeePosition: this.state.employeePosition,
      editInfo: !this.state.editInfo
    })
  }
}

export default connect(mapStateToProps, {setEmployeeReviews, setEmployeePosition})(StylistCard);
