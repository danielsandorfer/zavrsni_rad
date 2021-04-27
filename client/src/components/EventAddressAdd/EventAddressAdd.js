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


export default class EventAddressAdd extends Component {

    constructor(props){
        super(props);

        this.state = {
            address: "",
            postalCode: "",
            formErrors: {
                address: "",
                postalCode: ""
            },
        }
        
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

            case "address":
            formErrors.address =
                value.length < 5 ? "Unesite barem 5 znaka!" : "";
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

            var postalCodes = new Set();
    
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
        const address = {
            eventAddress: this.state.address,
            eventPostalCode: this.state.postalCode,
            geoWidth: "",
            geoLength: ""
        };
        // odredi geografske koordinate nove adrese
        Geocode.fromAddress(this.state.address).then(response => {
            const { lat, lng } = response.results[0].geometry.location;
            address.geoWidth = lat;
            address.geoLength = lng;
            fetch('/api/control_panel/add_event_address', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    address
                })
                })
                .then(() => {
                    
                    this.props.history.push("/control_panel/addresses");
            })

        }).catch(e => {
            let formErrors = { ...this.state.formErrors };
            formErrors.address = "Adresa ne postoji!";
            this.setState({formErrors: formErrors});
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
                        <h1>Dodavanje adrese</h1>
                            <form method="POST" onSubmit={this.onSubmit}>

                        
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
                                {formErrors.address.length > 0 && (
                                    <span className="errorMessage">{formErrors.address}</span>
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
                        <button type="submit">Dodaj adresu</button>
                        </div>

                        </form>
                    </div>
            </div>
    </div>);
    }
}