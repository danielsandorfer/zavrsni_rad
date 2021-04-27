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

export default class EventAddressEdit extends Component {
 
    constructor(props){
        super(props);
        this.state = {
            eventAddressData: {},
            postalCode: "",
            address: "",
           
            formErrors: {
                postalCode: "",
                address: "",       
            }
        };

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


componentDidMount() {

    if(!isValidated) {
        this.props.histoy.push("/");
    } else {
        
        axios.get(`/api/control_panel/address/${this.props.match.params.id}`)
        .then(res => {
            const data = Object.values(res.data);
            var event = Object.values(data[0]);
            var addressObject = {
                id: event[0],
                eventAddress: event[1],
                eventPostalCode: event[2],   
              } 

            this.setState({
                eventAddressData: addressObject
            })
        })


        
        var addresses = new Set(); 
        var postalCodes = new Set();

        axios.get("/api/control_panel/addresses")
        .then(res => {
            const data = Object.values(res.data);
            data.forEach(row => {
                const element = Object.values(row);
                var address = element[1];
                var postalCode = element[2];
                addresses.add(address)
                postalCodes.add(postalCode);
            })
        }).then(() => {
            let eventAddresses = this.eventAddresses;
            let eventPostalCodes = this.eventPostalCodes;
           
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
                eventAddresses: eventAddresses,
                eventPostalCodes: eventPostalCodes
            });
            
        })
    }
        
        
}
onSubmit(e) {
    e.preventDefault();

        var event = {
            id: this.props.match.params.id,
            eventPostalCode: this.state.postalCode,
            eventAddress: this.state.address,
        };
        const oldEvent = this.state.eventAddressData;
      
        if(this.state.address) {
            Geocode.fromAddress(this.state.address).then(result => {
                fetch('/api/control_panel/update_event_address', {
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
            }).catch(e => {
                let formErrors = { ...this.state.formErrors };
                formErrors.address = "Adresa ne postoji!";
                this.setState({formErrors: formErrors});
            })
        } else {
            fetch('/api/control_panel/update_event_address', {
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
        
             

    
}

onChange(e) {
    e.preventDefault();
    const { name, value } = e.target;
    let formErrors = { ...this.state.formErrors };

    switch (name) {
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


render() {
    const { formErrors } = this.state;
    return (
        <div className="main">
            <div>
                <Header  />
            </div>
            <div className="form-event-location-edit" style={{marginBottom: "250px", marginTop: "140px"}}>
                <div className="form-wrapper">
                    <h1>Uređivanje adrese</h1>
                        <form method="POST" onSubmit={this.onSubmit}>

                        <div className="email">
                            <label htmlFor="email">Adresa</label>
                            <input
                                className={formErrors.address.length > 0 ? "error" : null}
                                placeholder={this.state.eventAddressData.eventAddress}
                                defaultValue={this.state.eventAddressData.eventAddress}
                                list="data-2"
                                type="text"
                                name="address"
                                onChange={this.onChange}
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

                        <div className="email">
                            <label htmlFor="email">Poštanski broj</label>
                            <input
                                className={formErrors.postalCode.length > 0 ? "error" : null}
                                placeholder={this.state.eventAddressData.eventPostalCode}
                                defaultValue={this.state.eventAddressData.eventPostalCode}
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