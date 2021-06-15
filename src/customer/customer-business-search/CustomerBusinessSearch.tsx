import React from 'react';
import { Search } from '@material-ui/icons';
import { Rating } from '@material-ui/lab';
import { LocationOn } from '@material-ui/icons';
import firebase from 'firebase';
import {
  InstantSearch,
  Hits,
  SearchBox,
  connectAutoComplete
} from 'react-instantsearch-dom';

import {
  Card,
  withStyles,
  createStyles,
  Theme,
  TextField,
  InputAdornment,
  CardActionArea,
  CardMedia,
  Button,
  Box,
  Grid,
  FormControl,
  Select,
  Typography,
  Paper,
  MenuList,
  MenuItem,
  ClickAwayListener,
  Grow,
  Popper,
} from '@material-ui/core';

import LocationOnIcon from '@material-ui/icons/LocationOn';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { firestore } from '../../config/FirebaseConfig';
import { connect } from 'react-redux';
import { LoadScript, StandaloneSearchBox } from '@react-google-maps/api';
import BusinessInfo from '../../business/business-info/BusinessInfo';
import { StoreState } from '../../shared/store/types';
import { addBusinessFound, clearBusinessesFound, setSelectedEmployee, clearEmployeesForBusiness,
  updateCurrentLatitude,
  updateCurrentLongitude
 } from '../../shared/store/actions';
import { Business } from '../../models/Business.interface';

import cat1 from '../../assets/cat1.jpg';
import algoliasearch from 'algoliasearch';
import { Link } from 'react-router-dom';

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
  open: boolean;
  anchorRef: any;
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
      count: 2,
      miles: 0,
      hidden: true,
      buttonValue: 'Search by Business Name',
      open: false,
      anchorRef: undefined,
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
    this.showPosition();
    if(distance > this.state.count)
    {
      this.setState({count: 52});
    }
    
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
    this.setState({count: this.state.count + 2});
    this.searchBarbershopsByLocation(this.state.userLatitude, this.state.userLongitude, this.state.count);
    //console.log("Count: " + this.state.count);
  }

  getAddress(): string {
    this.showPosition();
    return this.state.address;
  }

  setZip = (address) => {
    //console.log("City: " + JSON.stringify(address.results[0].formatted_address));
    this.setState({address: address.results[1].formatted_address});
  }

  showPosition = () => {
    //console.log("Latitude from props: " + this.state.userLatitude);
    //console.log("Longitude from props: " + this.state.userLongitude);
    if(this.state.userLatitude !== 0 && this.state.userLongitude !== 0)
    {
      fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.state.userLatitude},${this.state.userLongitude}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`)
        .then(res => res.json())
        .then((address) => {
          if((address.results).length !== 0)
          {
            this.setZip(address);
          }
        })
    }
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
    if(this.state.buttonValue === 'Search by Business Name')
    {
      this.setState({ buttonValue: 'Search by City' });
    }
    else
    {
      this.setState({ buttonValue: 'Search by Business Name' });
    }
    //console.log(this.state.buttonValue);
  }

  handleOnSearchByName = event => {
    this.setState({
      open: true
    });
  }

  handleClosePopper() {
    this.setState({
      open: false
    });
  }

  setAnchor = event => {
    console.log(event.currentTarget);
    this.setState({
      anchorRef: event.currentTarget
    });
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
    this.setState({count: this.state.count + 2});

    //console.log("Latitude from props: " + this.props.curLatitude);
  }

  render() {
    const { classes } = this.props;
    //Algolia implementation
    const searchClient = algoliasearch("QDMMNJHF77","3a233c2bc51c8de99d7da44b86f8e1b0");
    const Autocomplete = ({ hits, currentRefinement, refine }) => (
      <div>
        <TextField
          //inputRef={this.state.anchorEl}
          className={classes.search}
          id="standard-basic"
          placeholder="Search by Business Name"
          value={currentRefinement}
          onChange={
            (event) => {
              refine(event.currentTarget.value);     
            }
          }
          onFocus={this.handleOnSearchByName}
          fullWidth
          InputProps={{
            startAdornment: (
            <InputAdornment position="start">
              <Search/>
            </InputAdornment>
            ),
            }}
          />
            <Popper open={this.state.open} anchorEl={this.state.anchorRef} placement={'bottom'} transition>            
                  <Paper>
                    <MenuList >
                      {hits.map(hit => (
                        <MenuItem 
                        onClick={() => {
                          this.handleMenuSelection(hit.name);
                          this.handleClosePopper();
                        }}
                        > {hit.name}</MenuItem>))}
                    </MenuList>
                  </Paper>
              </Popper>
      </div>
    );
    
    const CustomAutocomplete = connectAutoComplete(Autocomplete);

    return (
      <div>
        {this.state.businessSelectedIndicator === false ? (
          <div className={classes.customerBusinessSearchPage}>
            <div className={classes.changingColors}>
              <div className={classes.searchBoxContainer}>
                <LoadScript
                  googleMapsApiKey={`${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`}
                  libraries={mapsLibraries}
                >
                  <Grid container alignItems="center">
                    <Grid item xs={3}>
                      <Button 
                        variant="outlined" 
                        color="secondary"
                        disabled={true}
                        onClick={(event)=>{
                          this.handleSwitchcSearch();
                          this.setAnchor(event);
                          this.handleClosePopper();
                        }}
                        >
                          {this.state.buttonValue}
                      </Button>
                    </Grid>
                    <Grid item xs={9} hidden={!this.state.hidden}>
                      <StandaloneSearchBox
                        onLoad={this.onLoad}
                        onPlacesChanged={this.onPlaceSelection}
                        ref={searchBox}
                      >
                        <TextField
                          className={classes.search}
                          id="standard-basic"
                          placeholder="Search by city"
                          value={this.state.locationSearchValue}
                          onChange={this.handleSearchChange.bind(this)}
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
                    </Grid>
                    <Grid item xs={9} hidden={this.state.hidden}>
                      <InstantSearch
                        indexName="Business_Data"
                        searchClient={searchClient} 
                      >
                        <CustomAutocomplete/>
                      </InstantSearch>
                    </Grid>
                  </Grid>

                </LoadScript>
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
                return (
                  <Card className={classes.businessInfoPreview} key={i}>
                    <CardActionArea
                      style={{ height: '100%' }}
                      onClick={() => this.selectBusiness(business)}
                    >
                      <CardMedia
                        image={cat1}
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
              <Grid container justify='center' >
                <Grid item hidden={!this.state.hidden}>
                  <Button variant="contained" onClick={() => this.displayMore()}>
                    More businesses
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
