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

export default class EventCountryEdit extends Component {
 
    constructor(props){
        super(props);
        this.state = {
            eventCountryData: {},
            country: "",    
            formErrors: {
                country: "",
            }
        };
        this.eventCountries = [];

        
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

        axios.get(`/api/control_panel/country/${this.props.match.params.id}`)
        .then(res => {
            const data = Object.values(res.data);
            var event = Object.values(data[0]);
            console.log(event);
            var countryObject = {
                id: event[0],
                eventCountry: event[1],  
              } 
  
    
            this.setState({
                eventCountryData: countryObject
            })
        })



        var countries = new Set(); 

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



    }
        
        
}
onSubmit(e) {
    e.preventDefault();

        var event = {
            id: this.props.match.params.id,
            eventCountry: this.state.country,
        };
        const oldEvent = this.state.eventCountryData;
      
       
        fetch('/api/control_panel/update_event_country', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                oldEvent,
                event
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
        <div className="form-event-location-edit" style={{marginBottom: "350px", marginTop: "140px"}}>
            <div className="form-wrapper">
                <h1>Uređivanje države</h1>
                    <form method="POST" onSubmit={this.onSubmit}>

                    <div className="email">
                        <label htmlFor="email">Država</label>
                        <input
                            className={formErrors.country.length > 0 ? "error" : null}
                            placeholder={this.state.eventCountryData.eventCountry}
                            defaultValue={this.state.eventCountryData.eventCountry}
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

    
                    <div className="createAccount">
                        <button type="submit">Pohrani promjene</button>
                    </div>

                </form>
            </div>
        </div>
    </div>);
    }
}