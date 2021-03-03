// global google
import { GoogleMap, LoadScript, Marker, StandaloneSearchBox } from '@react-google-maps/api'
import React, {Component} from 'react'

const mapStyle = {
    width: '400px',
    height: '400px'
}

let markerArray = [];
let map;
let searchBox;

export class MapContainer extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      currentLocation: {
        lat: 59.95,
        lng: 30.33
      },
      markers: [],
      bounds: null
    };
  }

  onMapLoad = map => {
    navigator?.geolocation.getCurrentPosition(
      ({ coords: { latitude: lat, longitude: lng } }) => {
        const pos = { lat, lng };
        this.setState({ currentLocation: pos });
      }
    );
  }

  onSBLoad = ref => {
    searchBox = ref;
  }

  onPlacesChanged = () => {
    let markerArray: any = [];
    let results = searchBox.getPlaces();
    for (let i = 0; i < results.length; i++) {
      let place: any = results[i].geometry.location;
      markerArray.push(place);
    }
    this.setState({ markers: markerArray });
    console.log(markerArray);
  };

  onBoundsChanged = (boundsIn) => {
    console.log(map.getBounds());
    this.setState({ bounds: boundsIn });
  }

  render() {
    return (
      <div>
        <div id="searchbox">
          <StandaloneSearchBox
            onLoad={this.onSBLoad}
            onPlacesChanged={this.onPlacesChanged}
            bounds={this.state.bounds}
          >
            <input
              type="text"
              placeholder="Customized your placeholder"
              style={{
                boxSizing: `border-box`,
                border: `1px solid transparent`,
                width: `240px`,
                height: `32px`,
                padding: `0 12px`,
                borderRadius: `3px`,
                boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                fontSize: `14px`,
                outline: `none`,
                textOverflow: `ellipses`
              }}
            />
          </StandaloneSearchBox>
        </div>
        <br />
        <div>
          <GoogleMap
            center={this.state.currentLocation}
            zoom={10}
            onLoad={map => this.onMapLoad(map)}
            mapContainerStyle={{ height: '80vh', width: "100%" }}
            ref={map}
          >
            {this.state.markers.map((mark, index) => (
              <Marker key={index} position={mark} />
            ))}
          </GoogleMap>
        </div>
      </div>
    )
  }
}


export default MapContainer;