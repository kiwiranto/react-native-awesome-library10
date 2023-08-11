import {
  withGoogleMap,
  GoogleMap,
  withScriptjs,
  // InfoWindow,
  Marker,
} from 'react-google-maps';
import Geocode from 'react-geocode';
import React, {Component} from 'react';
// import Autocomplete from 'react-google-autocomplete';

import(/* webpackPrefetch: true */ "./style.css")

import {search} from '../Assets/index';

Geocode.setApiKey('AIzaSyBRwB_ucmbKODmTBXa9h8kqc168J2URFJM');
Geocode.enableDebug();

const AsyncMap = withScriptjs(
  withGoogleMap(props => (
    <GoogleMap
      google={props.google}
      defaultZoom={props.zoom}
      defaultCenter={props.defaultCenter}
      options={{
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
        scaleControl: false,
      }}>
      <Marker
        google={props.google}
        draggable={props.draggable}
        onDragEnd={props.onDragEnd}
        position={props.position}
      />
    </GoogleMap>
  )),
);

class CMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: '',
      city: '',
      area: '',
      state: '',
      mapPosition: {
        lat: this.props.center.lat,
        lng: this.props.center.lng,
      },
      markerPosition: {
        lat: this.props.center.lat,
        lng: this.props.center.lng,
      },
      prevPosition: {
        lat: false,
        lng: false,
      },
      loading: true,
      autocomplete: '',
      statusRender: false,
    };
  }
  /**
   * Get the current address from the default map position and set those values in the state
   */
  componentDidMount() {
    this.setState({loading: true});
    Geocode.fromLatLng(
      this.state.mapPosition.lat,
      this.state.mapPosition.lng,
    ).then(
      response => {
        const address = response.results[0].formatted_address,
          addressArray = response.results[0].address_components,
          city = this.getCity(addressArray),
          area = this.getArea(addressArray),
          state = this.getState(addressArray);

        this.setState({
          address: address ? address : '',
          area: area ? area : '',
          city: city ? city : '',
          state: state ? state : '',
          loading: false,
          autocomplete: '',
        });
      },
      error => {
        this.setState({loading: false});
      },
    );
  }
  /**
   * Get the city and set the city input value to the one selected
   *
   * @param addressArray
   * @return {string}
   */
  getCity = addressArray => {
    let city = '';
    for (let i = 0; i < addressArray.length; i++) {
      if (
        addressArray[i].types[0] &&
        addressArray[i].types[0] === 'administrative_area_level_2'
      ) {
        city = addressArray[i].long_name;
        return city;
      }
    }
  };
  /**
   * Get the area and set the area input value to the one selected
   *
   * @param addressArray
   * @return {string}
   */
  getArea = addressArray => {
    let area = '';
    for (let i = 0; i < addressArray.length; i++) {
      if (addressArray[i].types[0]) {
        for (let j = 0; j < addressArray[i].types.length; j++) {
          if (
            addressArray[i].types[j] === 'sublocality_level_1' ||
            addressArray[i].types[j] === 'locality'
          ) {
            area = addressArray[i].long_name;
            return area;
          }
        }
      }
    }
  };
  /**
   * Get the address and set the address input value to the one selected
   *
   * @param addressArray
   * @return {string}
   */
  getState = addressArray => {
    let state = '';
    for (let i = 0; i < addressArray.length; i++) {
      for (let i = 0; i < addressArray.length; i++) {
        if (
          addressArray[i].types[0] &&
          addressArray[i].types[0] === 'administrative_area_level_1'
        ) {
          state = addressArray[i].long_name;
          return state;
        }
      }
    }
  };
  /**
   * And function for city,state and address input
   * @param event
   */
  onChange = event => {
    this.setState({[event.target.name]: event.target.value});
  };
  /**
   * This Event triggers when the marker window is closed
   *
   * @param event
   */
  onMarkerDragEnd = event => {
    let newLat = event.latLng.lat(),
      newLng = event.latLng.lng();
    // addressArray = []
    Geocode.fromLatLng(newLat, newLng).then(
      response => {
        const address = response.results[0].formatted_address,
          addressArray = response.results[0].address_components,
          city = this.getCity(addressArray),
          area = this.getArea(addressArray),
          state = this.getState(addressArray);
        let lat = response.results[0].geometry.location.lat;
        let lng = response.results[0].geometry.location.lng;
        this.props.onMarkerDragEnd(lat, lng);
        this.setState({
          address: address ? address : '',
          area: area ? area : '',
          city: city ? city : '',
          state: state ? state : '',
          markerPosition: {lat: lat, lng: lng},
          mapPosition: {lat: lat, lng: lng},
          statusRender: true,
        });
      },
      error => {
        console.log('Error Drag' + error);
      },
    );
  };

  _handleonPlaceSelected = data => {
    const google = window.google;
    const config = {
      types: [
        {
          establishment: 'establishment',
          address: 'address',
          geocode: 'geocode',
          regions: 'regions',
        },
      ],
      componentRestrictions: {
        country: 'id',
      },
      fields: [
        'address_components',
        'geometry.location',
        'place_id',
        'formatted_address',
      ],
    };
    let autoComplete = new google.maps.places.Autocomplete(
      document.getElementById('autocomplete'),
      config,
    );

    google.maps.event.addListener(autoComplete, 'place_changed', () => {
      let place = autoComplete.getPlace();
      let address = place.formatted_address;
      if (address) {
        let addressArray = place.address_components,
          city = this.getCity(addressArray),
          area = this.getArea(addressArray),
          state = this.getState(addressArray),
          latValue = place.geometry.location.lat(),
          lngValue = place.geometry.location.lng();
        this.props.onMarkerDragEnd(latValue, lngValue);
        // Set these values in the state.

        this.setState({
          address: address ? address : '',
          area: area ? area : '',
          city: city ? city : '',
          state: state ? state : '',
          markerPosition: {
            lat: latValue,
            lng: lngValue,
          },
          mapPosition: {
            lat: latValue,
            lng: lngValue,
          },
          autocomplete: addressArray,
          statusRender: true,
        });
      }
    });
  };

  _renderMap = () => {
    if (this.state.markerPosition.lat !== this.state.prevPosition.lat) {
      if (this.state.statusRender === true) {
        this.setState({statusRender: false});
        const AsyncMap = withScriptjs(
          withGoogleMap(props => (
            <GoogleMap
              google={this.props.google}
              defaultZoom={this.props.zoom}
              defaultCenter={{
                lat: this.state.mapPosition.lat,
                lng: this.state.mapPosition.lng,
              }}>
              <Marker
                google={this.props.google}
                draggable={true}
                onDragEnd={this.onMarkerDragEnd}
                position={{
                  lat: this.state.markerPosition.lat,
                  lng: this.state.markerPosition.lng,
                }}
              />
            </GoogleMap>
          )),
        );
        return (
          <div className="app-google-maps-cont">
            <AsyncMap
              googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBRwB_ucmbKODmTBXa9h8kqc168J2URFJM&libraries=geometry,places"
              loadingElement={<div style={{height: '100%'}} />}
              containerElement={<div className="app-google-maps" />}
              mapElement={<div style={{height: '100%'}} />}
              onDragEnd={this.onMarkerDragEnd}
              defaultCenter={{
                lat: this.state.mapPosition.lat,
                lng: this.state.mapPosition.lng,
              }}
              position={{
                lat: this.state.markerPosition.lat,
                lng: this.state.markerPosition.lng,
              }}
              zoom={this.props.zoom}
              draggable={true}
            />
          </div>
        );
      }
      return (
        <div className="app-google-maps-cont">
          <AsyncMap
            googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBRwB_ucmbKODmTBXa9h8kqc168J2URFJM&libraries=geometry,places"
            loadingElement={<div style={{height: '100%'}} />}
            containerElement={<div className="app-google-maps" />}
            mapElement={<div style={{height: '100%'}} />}
            onDragEnd={this.onMarkerDragEnd}
            defaultCenter={{
              lat: this.state.mapPosition.lat,
              lng: this.state.mapPosition.lng,
            }}
            position={{
              lat: this.state.markerPosition.lat,
              lng: this.state.markerPosition.lng,
            }}
            zoom={this.props.zoom}
            draggable={true}
          />
        </div>
      );
    } else {
      const AsyncMap = withScriptjs(
        withGoogleMap(props => (
          <GoogleMap
            google={this.props.google}
            defaultZoom={this.props.zoom}
            defaultCenter={{
              lat: this.state.mapPosition.lat,
              lng: this.state.mapPosition.lng,
            }}>
            <Marker
              google={this.props.google}
              draggable={true}
              onDragEnd={this.onMarkerDragEnd}
              position={{
                lat: this.state.markerPosition.lat,
                lng: this.state.markerPosition.lng,
              }}
            />
          </GoogleMap>
        )),
      );
      return (
        <div className="app-google-maps-cont">
          <AsyncMap
            googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBRwB_ucmbKODmTBXa9h8kqc168J2URFJM&libraries=geometry,places"
            loadingElement={<div style={{height: '100%'}} />}
            containerElement={<div className="app-google-maps" />}
            mapElement={<div style={{height: '100%'}} />}
            onDragEnd={this.onMarkerDragEnd}
            defaultCenter={{
              lat: this.state.mapPosition.lat,
              lng: this.state.mapPosition.lng,
            }}
            position={{
              lat: this.state.markerPosition.lat,
              lng: this.state.markerPosition.lng,
            }}
            zoom={this.props.zoom}
            draggable={true}
          />
        </div>
      );
    }
  };
  _handleOnChangeAddress = data => {
    this.setState({address: data.target.value});
  };
  render() {
    if (this.state.loading) {
      return (
        <div>
          <p>Loading Map</p>
        </div>
      );
    }

    let map;
    if (this.props.center.lat !== undefined) {
      map = (
        <div>
          <div className="app-google-maps-container-content">
            <div className="app-google-maps-content-text">
              <p className="app-google-maps-style-text-coverage">
                Cek Jangkauan
              </p>
              <p className="app-google-maps-style-text-service">layanan.</p>
              <p className="app-google-maps-style-text-desc">
                Kami selalu memberikan kualitas jaringan internet terbaik di
                indonesia.
              </p>
              <p className="app-google-maps-style-text-desc">
                Silahkan periksa jaringan HEKSA di lokasi Anda.
              </p>
            </div>
          </div>
          <div className="app-google-maps-input-holder">
            <img src={search} alt="search" className="app-map-style-search" />
            <input
              className="app-map-input"
              type="text"
              id="autocomplete"
              onFocus={this._handleonPlaceSelected}
              onChange={val => this._handleOnChangeAddress(val)}
              placeholder="Masukan Lokasi"
              value={this.state.address}
            />
            <button className="app-map-style-button">Cari</button>
          </div>
          {this._renderMap()}
        </div>
      );
    }
    return map;
  }
}
export default CMap;
