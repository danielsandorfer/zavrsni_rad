import React, { Component } from 'react';
import jwt_decode from "jwt-decode";
import Header from "../Header/Header";
import axios from 'axios';
import Geocode from "react-geocode";



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


export default class EventLocationAdd extends Component {

    constructor(props){
        super(props);

        this.state = {
            country: "",
            city: "",
            postalCode: "",
            address: "",
            formErrors: {
                country: "",
                city: "",
                postalCode: "",
                address: "",
            },
        }
        this.eventCountries = [];
        this.eventCities = [];
        this.eventAddresses = [];
        this.eventPostalCodes = [];

        let jwtToken = localStorage.usertoken;

        if (jwtToken) {
            setValidated();
            setAuthToken(jwtToken);
        }


        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
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
          case "city":
            formErrors.city =
              value.length < 2 ? "Unesite barem 2 znaka!" : "";
            break;
          case "postalCode":
            formErrors.postalCode =
              value.length < 4 ? "Unesite barem 4 znaka!" : "";
            break;
          case "address":
            formErrors.address =
                value.length < 5 ? "Unesite barem 5 znaka!" : "";
            break;
       
          default:
            break;
        }
    
        this.setState({ formErrors, [name]: value });
    }
    
    componentDidMount() {
      
        if(!isValidated) {
            this.props.history.push("/");
        } else {
            var countries = new Set(); 
            var cities = new Set(); 
            var addresses = new Set(); 
            var postalCodes = new Set();
    
            axios.get("/api/locations")
            .then(res => {
                const data = Object.values(res.data);
                data.forEach(row => {
                    const element = Object.values(row);
                    var state = element[1];
                    var city = element[2];
                    var address = element[3];
                    var postalCode = element[4];
                    countries.add(state);
                    cities.add(city);
                    addresses.add(address)
                    postalCodes.add(postalCode);
                })
            }).then(() => {
                let eventCountries = this.eventCountries;
                let eventCities = this.eventCities;
                let eventAddresses = this.eventAddresses;
                let eventPostalCodes = this.eventPostalCodes;
               
                countries.forEach(e => {
                   const country = {
                       eventCountry: e 
                   }
                   eventCountries.push(country);
                })
                cities.forEach(e => {
                    const city = {
                        eventCity: e 
                    }
                    eventCities.push(city);
                 })
                addresses.forEach(e => {
                    const address = {
                        eventAddress: e 
                    }
                    eventAddresses.push(address);
                 })
    
                 postalCodes.forEach(e => {
                     const postalCode = {
                         eventPostalCode: e
                     }
                     eventPostalCodes.push(postalCode);
                 })
    
                 this.setState({
                    eventCountries: eventCountries,
                    eventCities: eventCities,
                    eventAddresses: eventAddresses,
                    eventPostalCodes: eventPostalCodes
                });
                
            })
        }   
       
        
    }

	onSubmit(e) {
        e.preventDefault();
        const location = {
            country: this.state.country,
            city: this.state.city,
            postalCode: this.state.postalCode,
            address: this.state.address,
            geoWidth: "",
            geoLength: "",
        };
        // odredi geografske koordinate lokacije
        Geocode.fromAddress(this.state.address).then(
            response => {
                const { lat, lng } = response.results[0].geometry.location;
                console.log(lat, lng);
                location.geoWidth = lat;
                location.geoLength = lng;
                fetch('/api/control_panel/add_event_location', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        location
                    })
                    })
                    .then(() => {
                        this.props.history.push("/control_panel/locations");
                    })
            });
		
	}

    render() {
        const { formErrors } = this.state;
        return (
            <div className="main">
            <div>
                <Header />
            </div>
            <div className="form-location" style={{marginBottom: "200px", marginTop: "140px"}}>
                <div className="form-wrapper">
                    <h1>Dodajte lokaciju!</h1>
                        <form method="POST" onSubmit={this.onSubmit}>

                        <div className="name">
                            <label htmlFor="name">Grad</label>
                            <input
                                className={formErrors.city.length > 0 ? "error" : null}
                                placeholder="Grad"
                                type="text"
                                name="city"
                                list="data"
                                onChange={this.onChange}
                                required
                            />
                            <datalist id="data">
                            {this.eventCities.map(eventCity =>
                                    <option key={eventCity.eventCity} value={eventCity.eventCity} />
                                )}         
                            </datalist>
                            {formErrors.city.length > 0 && (
                                <span className="errorMessage">{formErrors.city}</span>
                            )}
                        </div>

                        <div className="lastName">
                            <label htmlFor="lastName">Država</label>
                            <input
                                className={formErrors.country.length > 0 ? "error" : null}
                                placeholder="Država"
                                type="text"
                                name="country"
                                list="data-1"
                                onChange={this.onChange}
                                required
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
                                placeholder="Poštanski broj"
                                list="data-10"
                                type="text"
                                name="postalCode"
                                onChange={this.onChange}
                                required
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

                        <div className="email">
                            <label htmlFor="email">Adresa</label>
                            <input
                                className={formErrors.address.length > 0 ? "error" : null}
                                placeholder="Adresa"
                                type="text"
                                name="address"
                                list="data-2"
                                onChange={this.onChange}
                                required
                            />
                            <datalist id="data-2">
                            {this.eventAddresses.map(eventAddress =>
                                    <option key={eventAddress.eventAddress} value={eventAddress.eventAddress} />
                                )}         
                            </datalist>
                            {formErrors.address.length > 0 && (
                                <span className="errorMessage">{formErrors.address}</span>
                            )}
                        </div>
        
                        <div className="createAccount">
                            <button type="submit">Dodaj lokaciju</button>
                        </div>

                    </form>
                </div>
            </div>
    </div>);
    }
}