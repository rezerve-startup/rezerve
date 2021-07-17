import {
  Button, Card, CardActionArea,
  CardMedia, createStyles, Grid, TextField, Theme, Typography, withStyles
} from '@material-ui/core';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';
import { Search } from '@material-ui/icons';
import { Rating } from '@material-ui/lab';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { LoadScript, StandaloneSearchBox } from '@react-google-maps/api';
import algoliasearch from 'algoliasearch';
import firebase from 'firebase';
import React, { Fragment } from 'react';
import {
  connectAutoComplete, InstantSearch
} from 'react-instantsearch-dom';
import { connect } from 'react-redux';
import { ReactComponent as algoliaLogo } from '../../assets/algolia-blue-mark.svg';
import Barber from '../../assets/business-card-covers/Barber.jpg';
import Hair from '../../assets/business-card-covers/Hair.jpg';
import House_Call from '../../assets/business-card-covers/House_Call.jpg';
import Nail from '../../assets/business-card-covers/Nail.jpg';
import cat1 from '../../assets/cat1.jpg';
import BusinessInfo from '../../business/business-info/BusinessInfo';
import { firestore } from '../../config/FirebaseConfig';
import { Business } from '../../models/Business.interface';
import {
  addBusinessFound, clearBusinessesFound, clearEmployeesForBusiness, setSelectedEmployee, updateCurrentLatitude,
  updateCurrentLongitude
} from '../../shared/store/actions';
import { StoreState } from '../../shared/store/types';



type CustomerBusinessSearchState = {
  searchBoxRef: any;
  businessSelectedIndicator: boolean;
  selectedBusiness: {
    key: string;
    businessInfo: Business | null;
  } | null;
  locationSearchValue: string | undefined;
  nameSearchValue: string | undefined;
  address: string;
  userLatitude: number;
  userLongitude: number;
  count: number;
  miles: number;
  hidden: boolean;
  buttonValue: string;
};

let searchBox: any;
const mapsLibraries: any[] = ['places'];

function mapStateToProps(state: StoreState) {

  return {
    foundBusinesses: state.customer.foundBusinesses,
    curLatitude: state.location.newLat,
    curLongitude: state.location.newLong,
    locStatus: state.location.newStatus
  };
}

function CustomIcon (props: SvgIconProps) {
  return(
    <SvgIcon component={algoliaLogo} viewBox="0 0 60 50"/>
  );
}


class CustomerBusinessSearch extends React.Component<
  any,
  CustomerBusinessSearchState
> {
  constructor(props: any) {
    super(props);

    this.state = {
      searchBoxRef: null,
      businessSelectedIndicator: false,
      selectedBusiness: null,
      locationSearchValue: '',
      nameSearchValue: '',
      address: '',
      userLatitude: this.props.curLatitude,
      userLongitude: this.props.curLongitude,
      count: 5,
      miles: 0,
      hidden: false,
      buttonValue: 'by City',
    };
  }

  dispatchClearBusinessesFound(): void {
    this.props.clearBusinessesFound();
  }

  dispatchAddFoundBusiness(businessFound: any): void {
    this.props.addBusinessFound(businessFound);
  }

  dispatchSetSelectedEmployee(employee: any): void {
    this.props.setSelectedEmployee(employee);
  }

  dispatchClearEmployeesForBusiness(): void {
    this.props.clearEmployeesForBusiness();
  }

  // Reference https://stackoverflow.com/questions/46630507/how-to-run-a-geo-nearby-query-with-firestore
  searchBarbershopsByLocation(latitude, longitude, distance): void {
    this.dispatchClearBusinessesFound();

    this.setState({userLatitude: latitude});
    this.setState({userLongitude: longitude});
    this.setState({miles: distance});
    if(distance > this.state.count)
    {
      this.setState({count: 55});
    }
    
    // tslint:disable-next-line: comment-format
    //console.log("Latitude from state: " + this.state.userLatitude);
    //console.log("Longitude from state: " + this.state.userLongitude);

    let latUnit = 0.0144927536231884;
    let lngUnit = 0.0181818181818182;

    let lowerLat = latitude - latUnit * distance;
    let lowerLng = longitude - lngUnit * distance;
    let upperLat = latitude + latUnit * distance;
    let upperLng = longitude + lngUnit * distance;

    let lesserGeopoint = new firebase.firestore.GeoPoint(lowerLat, lowerLng);
    let greaterGeopoint = new firebase.firestore.GeoPoint(upperLat, upperLng);

    let docRef = firestore.collection('businesses');
    let query = docRef
      .where('about.location', '>=', lesserGeopoint)
      .where('about.location', '<=', greaterGeopoint);


    query.get().then((snapshot) => {
      snapshot.forEach((doc) => {
        let businessData = doc.data() as Business;
        //console.log(this.props.tabSelected)
        //console.log(" = " + businessData.type)
        if(businessData.type === this.props.tabSelected)
        {      
          let businessToAdd = {
            key: doc.id,
            businessInfo: businessData,
          };

          this.dispatchAddFoundBusiness(businessToAdd);
        }
      }
      );
    })
  }

  onLoad = (ref) => {
    this.setState({
      searchBoxRef: ref,
    });
  };

  onPlaceSelection = () => {
    if (this.state.searchBoxRef) {
      let searchedPlace = this.state.searchBoxRef.getPlaces()[0];

      this.setState({
        locationSearchValue: searchedPlace.formatted_address,
      });

      if (searchedPlace.geometry) {
        let latitude = searchedPlace.geometry.location.lat();
        let longitude = searchedPlace.geometry.location.lng();

        this.searchBarbershopsByLocation(latitude, longitude, 50);
      }
    }
  };

  selectBusiness(business): void {
    this.setState({
      businessSelectedIndicator: true,
      selectedBusiness: business,
    });
  }

  displayMore(): void {
    this.setState({count: this.state.count + 5});
    this.searchBarbershopsByLocation(this.state.userLatitude, this.state.userLongitude, this.state.count);
    //console.log("Count: " + this.state.count);
  }

  returnToList(): void {
    this.setState({
      businessSelectedIndicator: false,
      selectedBusiness: null,
    });

    this.dispatchClearEmployeesForBusiness();
    this.dispatchSetSelectedEmployee(null);
  }
  

  handleSearchChange(searchChangeEvent): void {
    this.setState({ locationSearchValue: searchChangeEvent.target.value });
  }

  handleNameSearchChange(searchChangeEvent): void {
    this.setState({ nameSearchValue: searchChangeEvent.target.value });
  }
  
  handleSwitchcSearch():void {
    this.setState({ hidden: !this.state.hidden });
    if(this.state.buttonValue === 'by Name')
    {
      this.setState({ buttonValue: 'by City' });
    }
    else
    {
      this.setState({ buttonValue: 'by Name' });
    }
  }


  handleMenuSelection(selection) {
    this.dispatchClearBusinessesFound();
    let docRef = firestore.collection('businesses');
    let query = docRef
      .where('name', '==', selection);

    query.get().then((snapshot) => {
      snapshot.forEach((doc) => {
        let businessData = doc.data() as Business;

        let businessToAdd = {
          key: doc.id,
          businessInfo: businessData,
        };

        this.dispatchAddFoundBusiness(businessToAdd);
      }
      );
    })
  }

  
  componentDidMount() {
    this.searchBarbershopsByLocation(this.state.userLatitude, this.state.userLongitude, this.state.count);
    this.setState({count: this.state.count + 5});

    //console.log("Latitude from props: " + this.props.curLatitude);
  }

  render() {
    const { classes } = this.props;
    //Algolia implementation
    const searchClient = algoliasearch("QDMMNJHF77","3a233c2bc51c8de99d7da44b86f8e1b0");


    const autocomplete = ({hits, currentRefinement, refine }) => (
      <div>
      <Autocomplete
          id="combo-box-demo"
          freeSolo
          options={hits.map(hit => (hit.name))}
          //popupIcon={<CustomIcon />}
          onChange={(event: any, newValue: string | null) => {
            this.handleMenuSelection(newValue);
          }}
          renderInput={(params) =>
            <Fragment>
              <Grid container>
                <Grid item xs>
                  <TextField
                  {... params}
                  className={classes.search}
                  id="standard-basic"
                  placeholder="Search by Business Name"
                  fullWidth={true}
                  value={currentRefinement}
                  onChange={
                    (event) => {
                      refine(event.currentTarget.value);
                    }
                  }
                  />
                </Grid>
                <Grid item>
                  <CustomIcon />
                </Grid>
              </Grid>
            </Fragment>
        }
        />
        
      </div>
    );
    
    const CustomAutocomplete = connectAutoComplete(autocomplete);

    return (
      <div>
        {this.state.businessSelectedIndicator === false ? (
          <div className={classes.customerBusinessSearchPage}>
            <div className={classes.changingColors}>
              <div className={classes.searchBoxContainer}>
                  <Grid container={true} alignItems="center" spacing={1}>
                  <LoadScript
                    googleMapsApiKey={`${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`}
                    libraries={mapsLibraries}
                  >
                    {/* GOOGLE MAPS SEARCH */}            
                    <Grid item={true} xs={8} sm={10} hidden={!this.state.hidden} >
                      <StandaloneSearchBox
                        onLoad={ (event)=>{
                          this.onLoad(event);
                        }
                        }
                        onPlacesChanged={this.onPlaceSelection}
                        ref={searchBox}
                      >
                        <TextField
                          className={classes.search}
                          id="standard-basic"
                          placeholder="Search by city"
                          value={this.state.locationSearchValue}
                          // tslint:disable-next-line: jsx-no-bind
                          onChange={this.handleSearchChange.bind(this)}
                          fullWidth={true}
                        />
                      </StandaloneSearchBox>
                    </Grid>

                    {/* ALGOLIA SEARCH */}
                    <Grid item={true} xs={8} sm={10} hidden={this.state.hidden}>
                    <InstantSearch
                        indexName="Business_Data"
                        searchClient={searchClient}
                        refresh={true}
                      >
                      <CustomAutocomplete />
                      </InstantSearch>
                    </Grid>                    
                    <Grid item={true} xs={4} sm={2}> 
                      <Button 
                            className={classes.searchButton}
                            variant="outlined"
                            fullWidth={true}
                            color="secondary"
                            onClick={(event)=>{
                              this.handleSwitchcSearch();
                            }}
                            >
                              <Search/>
                              {this.state.buttonValue}
                        </Button>
                      </Grid>
                </LoadScript>
                </Grid>

                
                <Typography
                  hidden={!this.state.hidden}
                  className={classes.location}
                  variant="subtitle1"
                  align="center">
                    {(this.props.foundBusinesses).length === 0 ? 
                      (
                        <div>No business found</div>
                      ):
                      (
                        <div>
                          {(this.props.foundBusinesses).length === 1 ? 
                          (
                            <div>Business located within {this.state.miles} miles from {this.state.address}</div>
                          ): 
                          (
                            <div>Businesses located within {this.state.miles} miles from {this.state.address}</div>
                          )}
                        </div>
                      )
                    }
                </Typography>
              </div>

              {this.props.foundBusinesses.map((business, i) => {
                let imageType = cat1
                if (business.businessInfo.type === "Hair"){
                  imageType = Hair
                }
                else if (business.businessInfo.type === "Barber"){
                  imageType = Barber
                }
                else if (business.businessInfo.type === "Nail"){
                  imageType = Nail
                }
                else if (business.businessInfo.type === "House Call"){
                  imageType = House_Call
                }
                return (
                  <Card className={classes.businessInfoPreview} key={i}>
                    <CardActionArea
                      style={{ height: '100%' }}
                      onClick={() => this.selectBusiness(business)}
                    >
                      <CardMedia
                        image={imageType}
                        style={{ height: '100%', position: 'relative' }}
                      >
                        <div className={classes.previewBusinessTitle}>
                          {business.businessInfo.name}
                        </div>
                        <div className={classes.previewBottomInfo}>
                          {/* <div className={classes.previewBottomDistance}>
                            <LocationOn />
                            0.2 mi
                          </div> */}
                          <div className={classes.previewBottomRating}>
                            <Rating
                              size="small"
                              value={business.businessInfo.overallRating}
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
                );
              })}
              <Grid container={true} justify='center' >
                <Grid item={true} hidden={!this.state.hidden}>
                  <Button variant="contained" onClick={() => this.displayMore()}>
                    Load More Businesses
                  </Button>
                </Grid>
              </Grid>
                
            </div>
          </div>
        ) : (
          <div>
            <div className={classes.returnToListContainer}>
              <Button variant="contained" onClick={() => this.returnToList()}>
                Back to List
              </Button>
            </div>
            {this.state.selectedBusiness && (
              <BusinessInfo
                selectedBusinessKey={this.state.selectedBusiness.key}
                selectedBusinessInfo={this.state.selectedBusiness.businessInfo}
              />
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
      justifyContent: 'center',
      alignItems: 'center',
    },
    searchBoxContainer: {
      width: '100%',
    },
    searchBox: {
      color: theme.palette.primary.main,
    },
    search: {
      '& label.MuiInputLabel-root': {
        color: theme.palette.primary.dark,
      },
      '& label.Mui-focused': {
        color: theme.palette.secondary.light,
      },
      '& .MuiInputBase-input': {
        color: theme.palette.primary.dark, // Text color
      },
      '& .MuiInput-underline:before': {
        borderBottomColor: theme.palette.secondary.light,
      },
      '& .MuiInput-underline:hover:before': {
        borderBottomColor: theme.palette.secondary.light,
      },
      '& .MuiInput-underline:after': {
        borderBottomColor: theme.palette.secondary.light,
      },
    },
    popper: {
      minWidth: '100vh',
      width: '100vh',
    },
    select: {
      borderRadius: '30px',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.secondary.light,
      },
      '&:hover': {
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.secondary.light,
          borderWidth: '1px',
        },
      },
      '&.Mui-focused': {
        color: theme.palette.primary.light,
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.secondary.light,
          borderWidth: '1px',
          boxShadow: 'none',
        },
      },
      '&after': {
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.secondary.light,
        },
      },
      '& .MuiSelect-icon': {
        color: theme.palette.primary.light,
      },
    },
    businessInfoPreview: {
      margin: '1rem',
      height: '20vh',
    },
    location: {
      color: theme.palette.primary.dark,
      marginTop: '10px',
      [theme.breakpoints.down('xs')]:{
        fontSize: '12px',
        marginBottom: '0px',
        paddingBottome: '0px'
      }
    },
    searchButton: {
      [theme.breakpoints.down('xs')]:{
        fontSize: '11px',
        padding: 0,
      }
    }
    ,
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
      justifyContent: 'space-between',
    },
    previewBottomDistance: {
      display: 'flex',
      alignItems: 'center',
      textAlign: 'center',
      color: theme.palette.primary.main,
      fontSize: '16px',
    },
    previewBottomRating: {
      marginRight: '1rem',
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
      justifyContent: 'center',
    },
  });

export default connect(mapStateToProps, { addBusinessFound, clearBusinessesFound, setSelectedEmployee,
   clearEmployeesForBusiness, updateCurrentLatitude, updateCurrentLongitude })(
  withStyles(styles, { withTheme: true })(CustomerBusinessSearch)
);
