import React, { Component } from 'react';
import Header from "../Header/Header";
import axios from 'axios';
import Geocode from "react-geocode";
import jwt_decode from "jwt-decode";



Geocode.setLanguage("hr");
Geocode.enableDebug();

var isValidated = false;
var decoded = [];

function setValidated() {
    isValidated = true;
}
function setAuthToken(jwtToken) {
    decoded = jwt_decode(jwtToken);
}

export default class EventPlaceEdit extends Component {
 
    constructor(props){
        super(props);
        this.state = {
            eventPlaceData: {},
            country: "",
            place: "",
            postalCode: "",    
            formErrors: {
                country: "",
                place: "",
                postalCode: "",
            }
        };
        this.eventCountries = [];
        this.eventPlaces = [];
        this.eventPostalCodes = [];

        
        let jwtToken = localStorage.usertoken;

        if (jwtToken) {
            setValidated();
            setAuthToken(jwtToken);
        }
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }


componentDidMount() {

    if(!isValidated) {
        this.props.histoy.push("/");
    } else {

        // dohvati mjesto
        axios.get(`/api/control_panel/place/${this.props.match.params.id}`)
        .then(res => {
            const data = Object.values(res.data);
            var event = Object.values(data[0]);
            var placeObject = {
                id: event[0],
                eventPostalCode: event[1],   
                eventPlace: event[2], 
                eventCountry: event[5]
              }
    
            this.setState({
                eventPlaceData: placeObject
            })
        })

        // dohvati postojece drzave, mjesta, postanske brojeve iz baze
        var countries = new Set(); 
        var places = new Set(); 
        var postalCodes = new Set();

        axios.get("/api/control_panel/places")
        .then(res => {
            const data = Object.values(res.data);
            data.forEach(row => {
                const element = Object.values(row);  
                var place = element[2];
                var postalCode = element[1];
                places.add(place);
                postalCodes.add(postalCode);
            })
        }).then(() => {
            let eventPlaces = this.eventPlaces;
            let eventPostalCodes = this.eventPostalCodes;
           
            places.forEach(e => {
                const place = {
                    eventPlace: e 
                }
                eventPlaces.push(place);
             })
             postalCodes.forEach(e => {
                 const postalCode = {
                     eventPostalCode: e
                 }
                 eventPostalCodes.push(postalCode);
             })

             this.setState({
                eventPlaces: eventPlaces,
                eventPostalCodes: eventPostalCodes
            });
            
        })

        axios.get("/api/control_panel/countries")
        .then(res => {
            const data = Object.values(res.data);
            data.forEach(row => {
                const element = Object.values(row);  
                var country = element[1];
                countries.add(country);
            })
        }).then(() => {
            let eventCountries = this.eventCountries;
            countries.forEach(e => {
                const country = {
                    eventCountry: e 
                }
                eventCountries.push(country);
             })
             this.setState({
                eventCountries: eventCountries,
            });
        });
    }
        
        
}
onSubmit(e) {
    e.preventDefault();

        var place = {
            id: this.props.match.params.id,
            eventCountry: this.state.country,
            eventPlace: this.state.place,
            eventPostalCode: this.state.postalCode,
        };
        const oldPlace = this.state.eventPlaceData;
      
          
        
        fetch('/api/control_panel/update_event_place', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                oldPlace,
                place
            })
            })
            .then(() => {
                //this.props.history.push("/control_panel");
                window.location.reload();
            })
               

    
}

onChange(e) {
    e.preventDefault();
    const { name, value } = e.target;
    let formErrors = { ...this.state.formErrors };

    switch (name) {
      case "country":
          formErrors.country =
          value.length < 2 ? "Unesite barem 2 znaka" : "";
      break;  
      case "place":
        formErrors.place =
          value.length < 2 ? "Unesite barem 2 znaka!" : "";
        break;
      case "postalCode":
        formErrors.postalCode =
          value.length < 4 ? "Unesite barem 4 znaka!" : "";
        break;
      default:
        break;
    }

    this.setState({ formErrors, [name]: value });
}


render() {
    const { formErrors } = this.state;
    return (
    <div className="main">
        <div>
            <Header  />
        </div>
        <div className="form-event-location-edit" style={{marginBottom: "250px", marginTop: "140px"}}>
            <div className="form-wrapper">
                <h1>Uređivanje mjesta</h1>
                    <form method="POST" onSubmit={this.onSubmit}>

                    <div className="name">
                        <label htmlFor="name">Mjesto</label>
                        <input
                            className={formErrors.place.length > 0 ? "error" : null}
                            placeholder={this.state.eventPlaceData.eventPlace}
                            defaultValue={this.state.eventPlaceData.eventPlace}       
                            list="data"
                            type="text"
                            name="place"
                            onChange={this.onChange}
                        />
                        <datalist id="data">
                        {this.eventPlaces.map(eventPlace =>
                                <option  key={eventPlace.eventPlace} value={eventPlace.eventPlace} />
                            )}         
                        </datalist>
                        {formErrors.place.length > 0 && (
                            <span className="errorMessage">{formErrors.place}</span>
                        )}
                    </div>

                    <div className="lastName">
                        <label htmlFor="lastName">Država</label>
                        <input
                            className={formErrors.country.length > 0 ? "error" : null}
                            placeholder={this.state.eventPlaceData.eventCountry}
                            defaultValue={this.state.eventPlaceData.eventCountry}
                            list="data-1"
                            type="text"
                            name="country"
                            onChange={this.onChange}
                        />
                        <datalist id="data-1">
                        {this.eventCountries.map(eventCountry =>
                                <option key={eventCountry.eventCountry} value={eventCountry.eventCountry} />
                            )}         
                        </datalist>
                        {formErrors.country.length > 0 && (
                            <span className="errorMessage">{formErrors.country}</span>
                        )}
                    </div>

                    <div className="email">
                        <label htmlFor="email">Poštanski broj</label>
                        <input
                            className={formErrors.postalCode.length > 0 ? "error" : null}
                            placeholder={this.state.eventPlaceData.eventPostalCode}
                            defaultValue={this.state.eventPlaceData.eventPostalCode}
                            type="text"
                            list="data-10"
                            name="postalCode"
                            onChange={this.onChange}
                        />
                        <datalist id="data-10">
                        {this.eventPostalCodes.map(eventPostalCode =>
                                <option key={eventPostalCode.eventPostalCode} value={eventPostalCode.eventPostalCode} />
                            )}         
                        </datalist>
                        {formErrors.postalCode.length > 0 && (
                            <span className="errorMessage">{formErrors.postalCode}</span>
                        )}
                    </div>
            
    
                    <div className="createAccount">
                        <button type="submit">Pohrani promjene</button>
                    </div>
                </form>
            </div>
        </div>
    </div>);
    }
}