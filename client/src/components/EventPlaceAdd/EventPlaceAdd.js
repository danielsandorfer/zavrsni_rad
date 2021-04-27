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


export default class EventPlaceAdd extends Component {

    constructor(props){
        super(props);

        this.state = {
            country: "",
            place: "",
            postalCode: "",
            formErrors: {
                country: "",
                place: "",
                postalCode: "",
               
            },
        }
        this.eventCountries = [];
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
    
    componentDidMount() {
      
        if(!isValidated) {
            this.props.history.push("/");
        } else {

            // dohvati postojece drzave i postanske brojeve u bazi
            var countries = new Set(); 
            var postalCodes = new Set();
    
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
                
            })


            axios.get("/api/control_panel/addresses")
            .then(res => {
                const data = Object.values(res.data);
                data.forEach(row => {
                    const element = Object.values(row);
                    var postalCode = element[2];
                    postalCodes.add(postalCode);
                })
            }).then(() => {        
                let eventPostalCodes = this.eventPostalCodes;
                 postalCodes.forEach(e => {
                     const postalCode = {
                         eventPostalCode: e
                     }
                     eventPostalCodes.push(postalCode);
                 })
    
                 this.setState({
                    eventPostalCodes: eventPostalCodes
                });                
            })
        }   
       
        
    }

	onSubmit(e) {
        e.preventDefault();
  
        const place = {
            country: this.state.country,
            place: this.state.place,
            postalCode: this.state.postalCode,
        };
        
        
        fetch('/api/control_panel/add_event_place', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                place
            })
            })
            .then(() => {
                this.props.history.push("/control_panel/places");
            })
           
		
	}

    render() {
        const { formErrors } = this.state;
        return (
            <div className="main">
                <div>
                    <Header />
                </div>
                <div className="form-location" style={{marginBottom: "300px", marginTop: "140px"}}>
                    <div className="form-wrapper">
                        <h1>Dodavanje mjesta</h1>
                            <form method="POST" onSubmit={this.onSubmit}>

                                <div className="name">
                                    <label htmlFor="name">Mjesto</label>
                                    <input
                                        className={formErrors.place.length > 0 ? "error" : null}
                                        placeholder="Mjesto"
                                        type="text"
                                        name="place"
                                        list="data"
                                        onChange={this.onChange}
                                        required
                                    />
                                
                                    {formErrors.place.length > 0 && (
                                        <span className="errorMessage">{formErrors.place}</span>
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

            
                                <div className="createAccount">
                                    <button type="submit">Dodaj mjesto</button>
                                </div>
                        </form>
                    </div>
                </div>
            
    </div>);
    }
}