import React, { Component } from 'react';
import { Search } from '@material-ui/icons';
import { Rating } from '@material-ui/lab';
import { LocationOn } from '@material-ui/icons';
import firebase from 'firebase';
import {
  Card,
  withStyles,
  createStyles,
  WithStyles,
  Theme,
  TextField,
  InputAdornment,
  CardActionArea,
  CardMedia,
  Button,
} from '@material-ui/core';

import cat1 from '../../assets/business-pictures/cat1.jpg';
import { firestore } from '../../config/FirebaseConfig';
import { connect } from 'react-redux';
import { GoogleMap, LoadScript, StandaloneSearchBox } from '@react-google-maps/api';
import BusinessInfo from '../../business/business-info/BusinessInfo';
import { StoreState } from '../../shared/store/types';
import { addBusinessFound, clearBusinessesFound } from '../../shared/store/actions';
import { Business } from '../../models/Business.interface';

type CustomerBusinessSearchState = {
  searchBoxRef: any;
  businessSelectedIndicator: boolean;
  selectedBusiness: {
    key: string;
    businessInfo: Business | null;
  } | null;
  locationSearchValue: string | undefined;
}

let searchBox: any;

function mapStateToProps(state: StoreState) {
  return {
    foundBusinesses: state.customer.foundBusinesses,
  };
}

class CustomerBusinessSearch extends React.Component<any, CustomerBusinessSearchState> {
  constructor(props: any) {
    super(props);

    this.state = {
      searchBoxRef: null,
      businessSelectedIndicator: false,
      selectedBusiness: null,
      locationSearchValue: ''
    }
  }

  dispatchClearBusinessesFound(): void {
    this.props.clearBusinessesFound();
  }

  dispatchAddFoundBusiness(businessFound: any): void {
    this.props.addBusinessFound(businessFound);
  }

  // Reference https://stackoverflow.com/questions/46630507/how-to-run-a-geo-nearby-query-with-firestore
  searchBarbershopsByLocation(latitude, longitude, distance): void {
    this.dispatchClearBusinessesFound();

    let latUnit = 0.0144927536231884;
    let lngUnit = 0.0181818181818182;

    let lowerLat = latitude - (latUnit * distance);
    let lowerLng = longitude - (lngUnit * distance);
    let upperLat = latitude + (latUnit * distance);
    let upperLng = longitude + (lngUnit * distance);

    let lesserGeopoint = new firebase.firestore.GeoPoint(lowerLat, lowerLng);
    let greaterGeopoint = new firebase.firestore.GeoPoint(upperLat, upperLng);

    let docRef= firestore.collection("businesses");
    let query = docRef.where("about.location", ">=", lesserGeopoint).where("about.location", "<=", greaterGeopoint);

    query.get().then((snapshot) => {
      snapshot.forEach((doc) => {
        let businessData = doc.data() as Business;

        let businessToAdd = {
          key: doc.id,
          businessInfo: businessData
        }

        this.dispatchAddFoundBusiness(businessToAdd);
      });
    })

  }

  onLoad = ref => {
      this.setState({
          searchBoxRef: ref
      });
  }

  onPlaceSelection = () => {
    if (this.state.searchBoxRef) {
      let searchedPlace = this.state.searchBoxRef.getPlaces()[0];
  
      this.setState({
        locationSearchValue: searchedPlace.formatted_address
      });

      if (searchedPlace.geometry) {
        let latitude = searchedPlace.geometry.location.lat();
        let longitude = searchedPlace.geometry.location.lng();

        this.searchBarbershopsByLocation(latitude, longitude, 50);
      }
    }
  }

  selectBusiness(business): void {
    this.setState({
      businessSelectedIndicator: true,
      selectedBusiness: business
    })
  }

  returnToList(): void {
    this.setState({
      businessSelectedIndicator: false,
      selectedBusiness: null,
    })
  }

  handleSearchChange(searchChangeEvent): void {
    this.setState({ locationSearchValue: searchChangeEvent.target.value });
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        {this.state.businessSelectedIndicator === false ? (

          <div className={classes.customerBusinessSearchPage}>
                <div className={classes.searchBoxContainer}>
                    <LoadScript googleMapsApiKey="AIzaSyCJNy8CE-cgdwuYFX3kT3r-ELumZxjJeU0" libraries={["places"]}>
                        <StandaloneSearchBox
                            onLoad={this.onLoad}
                            onPlacesChanged={this.onPlaceSelection}
                            ref={searchBox}
                        >
                                <TextField id="standard-basic" placeholder="Search by city" 
                                    value={this.state.locationSearchValue} 
                                    onChange={ this.handleSearchChange.bind(this) } 
                                    fullWidth
                                    InputProps={{
                                        startAdornment: (
                                        <InputAdornment position="start">
                                            <Search />
                                        </InputAdornment>
                                        ),
                                    }}
                                />
                        </StandaloneSearchBox>
                    </LoadScript>
                </div>
                <div>
                  {this.props.foundBusinesses.map((business, i) => {
                    return (
                      <Card className={classes.businessInfoPreview} key={i}>
                        <CardActionArea style={{height: '100%'}} onClick={() => this.selectBusiness(business)}>
                          <CardMedia image={cat1} style={{height: '100%', position: 'relative'}}>
                              <div className={classes.previewBusinessTitle}>{business.businessInfo.name}</div>
                              <div className={classes.previewBottomInfo}>
                                <div className={classes.previewBottomDistance}>
                                  <LocationOn />0.2
                                </div>
                                <div>
                                  <Rating
                                    size="small"
                                    value={business.businessInfo.performance.rating}
                                    precision={0.5}
                                    readOnly={true}
                                    classes={{
                                      iconFilled: classes.starRatingFilled,
                                      iconHover: classes.starRatingHover,
                                    }}
                                  />
                                </div>
                              </div>
                          </CardMedia>
                        </CardActionArea>
                      </Card>
                    )
                  })
                  }
                </div>
            </div>
        ) : (
          <div>
            <div className={classes.returnToListContainer}>
              <Button variant="contained" onClick={() => this.returnToList()}>Back to List</Button>
            </div>
            {this.state.selectedBusiness && (
              <BusinessInfo selectedBusinessKey={this.state.selectedBusiness.key} selectedBusinessInfo={this.state.selectedBusiness.businessInfo} />
            )}
          </div>
        )}
      </div>
    );
  }
}

const styles = (theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    customerBusinessSearchPage: {
        padding: '1.5rem',
        justifyContent: 'center',
        alignItems: 'center'
    },
    searchBoxContainer: {
        width: '100%'
    },
    searchBox: {
        color: theme.palette.primary.main,
    },
    businessInfoPreview: {
      margin: '1rem',
      height: '20vh'
    },
    previewBusinessTitle: {
      textAlign: 'center',
      fontSize: '24px',
      color: 'white',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      width: '100%',
    },
    previewBottomInfo: {
      color: theme.palette.primary.main,
      position: 'absolute',
      padding: '0.5rem',
      bottom: 0,
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between'
    },
    previewBottomDistance: {
      alignItems: 'center',
      textAlign: 'center',
      color: theme.palette.primary.main,
      fontSize: '16px'
    },
    starRatingFilled: {
      color: theme.palette.primary.main,
    },
    starRatingHover: {
      color: theme.palette.primary.light,
    },
    returnToListContainer: {
      display: 'flex',
      width: '100%',
      justifyContent: 'center'
    }
  });

export default connect(mapStateToProps, { addBusinessFound, clearBusinessesFound })(
  withStyles(styles, { withTheme: true })(CustomerBusinessSearch)
);