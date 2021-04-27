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


export default class EventCountryAdd extends Component {

    constructor(props){
        super(props);

        this.state = {
            country: "",
            formErrors: {
                country: "",
            },
        }
        this.eventCountries = [];
       

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
       
          default:
            break;
        }
    
        this.setState({ formErrors, [name]: value });
    }
    
    componentDidMount() {
      
        if(!isValidated) {
            this.props.history.push("/");
        } else {     
            axios.get("/api/control_panel/countries")
            .then(res => {
                const data = Object.values(res.data);
                data.forEach(row => {
                    const element = Object.values(row);
                    console.log(element);
                    var eventCountry= {
                        id: element[0],
                        eventCountry: element[1]
                    }
                    let eventCountries = this.eventCountries;
                    eventCountries.push(eventCountry);
                    this.setState({
                        eventCountries: eventCountries
                    });
                })
            })
        }   
       
        
    }

	onSubmit(e) {
        e.preventDefault();
        const country = {
            country: this.state.country,
        };
        
        fetch('/api/control_panel/add_event_country', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                country
            })
            })
            .then(() => {
                this.props.history.push("/control_panel/countries");
            })
		
	}

    render() {
        const { formErrors } = this.state;
        return (
        <div className="main">
            <div>
                <Header />
            </div>
            <div className="form-event-type" style={{marginBottom: "400px", marginTop: "150px"}}>
                <div className="form-wrapper">
                    <h1>Dodavanje države</h1>
                        <form method="POST" onSubmit={this.onSubmit}>

                        <div className="email">
                            <label htmlFor="email">Država</label>
                            <input
                                className={formErrors.country.length > 0 ? "error" : null}
                                placeholder="Država"
                                type="text"
                                name="country"
                                list="data-1"
                                onChange={this.onChange}
                                required
                            />
                            {formErrors.country.length > 0 && (
                                <span className="errorMessage">{formErrors.country}</span>
                            )}
                        </div>
                        <div className="createAccount">
                            <button type="submit">Dodaj državu</button>
                        </div>

                    </form>
                </div>
            </div>
    </div>);
    }
}