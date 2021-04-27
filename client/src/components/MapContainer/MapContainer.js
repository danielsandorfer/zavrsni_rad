import { Map, GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';
import React, { Component } from "react";

const mapStyles = {
    width: '95%',
    height: '85%',
};

  export class MapContainer extends Component {
    constructor(props) {
      super(props);

        this.state = {
          showingInfoWindow: false,  //Hides or the shows the infoWindow
          activeMarker: {},          //Shows the active marker upon click
          selectedPlace: {},        //Shows the infoWindow to the selected place upon a marker
          eventId: "", 
          currentLat:  45.800656,
          currentLng:  15.978737
        };
        this.events = [];
        this.updatePosition = this.updatePosition.bind(this);
  }

   updatePosition = (position) => {
      this.setState({
        currentLat: position.coords.latitude,
        currentLng: position.coords.currentLng
      });
    }


    componentDidMount() {  
     
      this.events = this.props.events;

    }
    componentDidUpdate() {

      this.events = this.props.events

    }

    onMarkerClick = (props, marker, e) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true,
      eventId: props.id
    });

    onClose = props => {
      if (this.state.showingInfoWindow) {
        this.setState({
          showingInfoWindow: false,
          activeMarker: null,
          selectedPlace: null
        });
      }
    };
    
    render() {
      return (
        <Map
       
        google={this.props.google}
        zoom={this.props.zoom}
        center={this.props.center}
        style={mapStyles}
        initialCenter={{
         lat: this.state.currentLat,
         lng: this.state.currentLng
        }}
      >
        {this.props.events.map(event =>
           <Marker
           key={event.id}
           onClick={this.onMarkerClick}
           id={event.id}
           name={event.eventAdress}
           eventName={event.eventName}
           position={{lat: event.eventGeoWidth, lng: event.eventGeoLength}}
           />
        )}
            {this.state.showingInfoWindow && (
            <InfoWindow
            marker={this.state.activeMarker}
            visible={this.state.showingInfoWindow}
            onClose={this.onClose}
          >
            <div>
            <h4>{this.state.selectedPlace.eventName}</h4>
            <span><a href={`/event/${this.state.eventId}`} style={{color:"black"}} >Vidi više!</a></span>
          </div>
        </InfoWindow>
           )}
      </Map>
      );
    }
  
  }
  
  export default GoogleApiWrapper({
   
  })(MapContainer);