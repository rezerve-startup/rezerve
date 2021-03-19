// global google
import { GoogleMap, Marker } from '@react-google-maps/api';
import React from 'react';

let map;

export class MapContainer extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      businessLocation: {
        lat: this.props.businessLocation.latitude,
        lng: this.props.businessLocation.longitude,
      },
    };
  }

  onMapLoad = (map) => {
    navigator?.geolocation.getCurrentPosition(
      ({ coords: { latitude: lat, longitude: lng } }) => {
        const pos = { lat, lng };
        this.setState({ currentLocation: pos });
      },
    );
  };

  render() {
    return (
      <div>
        <div>
          <GoogleMap
            center={this.state.businessLocation}
            zoom={15}
            onLoad={(map) => this.onMapLoad(map)}
            mapContainerStyle={{ height: '30vh', width: '100%' }}
            options={{
              clickableIcons: false,
              disableDefaultUI: true,
              gestureHandling: 'none',
            }}
            ref={map}
          >
            <Marker position={this.state.businessLocation} />
          </GoogleMap>
        </div>
      </div>
    );
  }
}

export default MapContainer;
