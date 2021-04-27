import React, { Component } from 'react';
import './EventAdd.css';
import Header from "../Header/Header";
import jwt_decode from "jwt-decode";
import Geocode from "react-geocode";
import S3FileUpload from 'react-s3';
import axios from 'axios';
import { Editor } from "@tinymce/tinymce-react";


Geocode.setLanguage("hr");
Geocode.enableDebug();
const config = {
    //bucketName: ',//process.env.REACT_APP_BUCKET_NAME,
    //dirName: 'events', /* optional */
    //region: 'eu-west-2',//process.env.REACT_APP_BUCKET_REGION,
    //accessKeyId:
   // secretAccessKey:
   // endpoint: "https://s3.amazonaws.com"
}

var isValidated = false;
var decoded = [];

function setValidated() {
    isValidated = true;
}
function setAuthToken(jwtToken) {
    decoded = jwt_decode(jwtToken);
}

  const dateRegex = RegExp(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);

  const formValid = ({ formErrors, ...rest }) => {
    let valid = true;
  
    // validate form errors being empty
    Object.values(formErrors).forEach(val => {
      val.length > 0 && (valid = false);
    });
  
    // validate the form was filled out
    Object.values(rest).forEach(val => {
      val === null && (valid = false);
    });


  
    return valid;
  };


export default class EventAdd extends Component {

    constructor(props){
        super(props);

        this.state = {
            country: "",
            place: "",
            postalCode: "",
            address: "",
            eventType: "",
            eventDescription: "",
            startDate: "",
            endDate: "",
            eventName: "",
            formErrors: {
                country: "",
                place: "",
                postalCode: "",
                address: "",
                eventType: "",
                eventDescription: "",
                startDate: "",
                endDate: "",
                eventName: "",
            },
            file: null
        }
        this.eventTypes = [];
        this.eventCountries = [];
        this.eventPlaces = [];
        this.eventAddresses = [];
        this.eventPostalCodes = [];

        let jwtToken = localStorage.usertoken;

        if (jwtToken) {
            setValidated();
            setAuthToken(jwtToken);
            //console.log(isValidated);
        }

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.handleFile = this.handleFile.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    handleFile = (event) => {
        this.setState({file: event.target.files});
      }
    handleChange(eventDescription, editor) {
        let formErrors = { ...this.state.formErrors };
        formErrors.eventDescription =
        eventDescription.length < 5 ? "Unesite barem 5 znakova!" : "";
        this.setState({ eventDescription, formErrors}, console.log(this.state.eventDescription));
    }
    onChange(e) {
       // e.preventDefault();
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
          case "address":
            formErrors.address =
                value.length < 5 ? "Unesite barem 5 znaka!" : "";
            break;
          case "eventType":
            formErrors.eventType =
              value.length < 3 ? "Unesite barem 3 znaka!" : "";
            break;
            case "eventDescription":
            formErrors.eventDescription =
              value.length < 5 ? "Unesite barem 5 znakova!" : "";
            break;
            case "startDate":
            formErrors.startDate = dateRegex.test(value)
                ? ""
                : "Neispravan format datuma!";
            break;
            case "endDate":
            formErrors.endDate = dateRegex.test(value)
                ? ""
                : "Neispravan format datuma!";
            break;
            case "eventName":
            formErrors.eventName =
              value.length < 3 ? "Unesite barem 3 znaka!" : "";
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
            axios.get(`/api/control_panel/event_types`)
            .then(res => {
                const data = Object.values(res.data);   
                data.forEach(row => {
                    const element = Object.values(row);
                    var eventType = {
                        id: element[0],
                        eventTypeName: element[1]
                    }
                        let eventTypes = this.eventTypes;
                        eventTypes.push(eventType);
                        this.setState({
                        eventTypes: eventTypes
                        });  
                })
            
            });
            var countries = new Set(); 
            var places = new Set(); 
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


            axios.get("/api/control_panel/places")
            .then(res => {
                const data = Object.values(res.data);
                data.forEach(row => {
                    const element = Object.values(row);  
                    var place = element[2];
                    places.add(place);
                })
            }).then(() => {       
                let eventPlaces = this.eventPlaces;
               
                places.forEach(e => {
                    const place = {
                        eventPlace: e 
                    }
                    eventPlaces.push(place);
                 })
                 this.setState({ 
                    eventPlaces: eventPlaces,
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
        
     
      
            const event = {
                country: this.state.country,
                place: this.state.place,
                postalCode: this.state.postalCode,
                address: this.state.address,
                geoWidth: "",
                geoLength: "",
                eventType: this.state.eventType,
                eventDescription: this.state.eventDescription,
                startDate: this.state.startDate,
                endDate: this.state.endDate,
                eventName: this.state.eventName,
                username: decoded.username,
                imagePath: null
            };
           
            if(this.state.file) {
                S3FileUpload
                .uploadFile(this.state.file[0], config)
                .then(data => {
                    event.imagePath = data.key;
                    Geocode.fromAddress(this.state.address).then(
                        response => {
                            const { lat, lng } = response.results[0].geometry.location;
                            console.log(lat, lng);
                            event.geoWidth = lat;
                            event.geoLength = lng;
                            axios({
                                method: 'post',
                                url: '/api/control_panel/add_event',
                                headers: {'Accept': 'application/json',
                                'Content-Type': 'application/json',}, 
                                data: {
                                 newEvent: {
                                    country: event.country,
                                    place: event.place,
                                    postalCode: event.postalCode,
                                    address: event.address,
                                    geoWidth: event.geoWidth,
                                    geoLength: event.geoLength,
                                    eventType: event.eventType,
                                    eventDescription: event.eventDescription,
                                    startDate: event.startDate,
                                    endDate: event.endDate,
                                    eventName: event.eventName,
                                    username: decoded.username,
                                    imagePath: event.imagePath
                                 } // This is the body part
                                }
                              }).then(res => {
                                this.props.history.push("/control_panel/events");
                              })
                           
                        }).catch(error => {
                            let formErrors = { ...this.state.formErrors };
                            formErrors.address = "Adresa ne postoji!";
                            this.setState({formErrors: formErrors});
                    });
                })
                .catch(err => console.error(err))
            } else {
                Geocode.fromAddress(this.state.address).then(
                    response => {
                        const { lat, lng } = response.results[0].geometry.location;
                        console.log(lat, lng);
                        event.geoWidth = lat;
                        event.geoLength = lng;
                        fetch('/api/control_panel/add_event', {
                            method: 'POST',
                            headers: {
                              'Accept': 'application/json',
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                              event
                            })
                          })
                          .then(() => {
                              this.props.history.push("/control_panel/events");
                          })
                    }).catch(error => {
                        let formErrors = { ...this.state.formErrors };
                        formErrors.address = "Adresa ne postoji!";
                        this.setState({formErrors: formErrors});
                });
            }

		
	}

    render() {
        const { formErrors } = this.state;
        return (
          <div>
            <Header />
         
        <div className="">
            <div className="form-wrapper">
                <h1>Dodavanje događaja</h1>
                    <form method="POST" onSubmit={this.onSubmit}>

                        <div className="username">
                            <label htmlFor="username">Naziv događaja</label>
                            <input
                                className={formErrors.eventName.length > 0 ? "error" : null}
                                placeholder="Naziv događaja"
                                type="text"
                                name="eventName"
                                onChange={this.onChange}
                                required
                            />
                            {formErrors.eventName.length > 0 && (
                                <span className="errorMessage">{formErrors.eventName}</span>
                            )}
                        </div>

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
                            <datalist id="data">
                            {this.eventPlaces.map(eventPlace =>
                                    <option key={eventPlace.eventPlace} value={eventPlace.eventPlace} />
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
                                type="text"
                                list="data-10"
                                name="postalCode"
                                required
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
                        
                        <div className="email">
                        <label  htmlFor="email">Tip događaja</label>
                            <input  type="text" 
                                    className={formErrors.eventType.length > 0 ? "error" : null}
                                    list="data-3"
                                    placeholder="Tip događaja"
                                    name="eventType"
                                    onChange={this.onChange}
                                    required />
                            <datalist id="data-3">
                            {this.eventTypes.map(eventType =>
                                    <option key={eventType.id} value={eventType.eventTypeName} />
                                )}         
                            </datalist>
                            {formErrors.eventType.length > 0 && (
                                <span className="errorMessage">{formErrors.eventType}</span>
                            )}
                        </div>
                    
                        <div className="email">
                            <label htmlFor="email">Opis događaja</label>

                            <Editor
                                apiKey="k4yl6o4ajze6qpo57qwbv9dvs7a686x51p1y0rkob7f28lnh"
                                value={this.state.eventDescription}
                                textareaName="eventDescription"
                                init={{
                                    height: 200,
                                    menubar: false,
                                    content_css: 'dark',
                                    forced_root_block: false
                                }}
                                onEditorChange={this.handleChange}
                            />

                            {formErrors.eventDescription.length > 0 && (
                                <span className="errorMessage">{formErrors.eventDescription}</span>
                            )}
                        </div>

                        <div className="email">
                            <label htmlFor="email">Datum početka</label>
                            <input
                                className={formErrors.startDate.length > 0 ? "error" : null}
                                placeholder="Datum početka (dd.mm.yyyy format)"
                                type="text"
                                name="startDate"
                                onChange={this.onChange}
                                required
                            />
                            {formErrors.startDate.length > 0 && (
                                <span className="errorMessage">{formErrors.startDate}</span>
                            )}
                        </div>

                        <div className="email">
                            <label htmlFor="email">Datum završetka</label>
                            <input
                                className={formErrors.endDate.length > 0 ? "error" : null}
                                placeholder="Datum završetka (dd.mm.yyyy format)"
                                type="text"
                                name="endDate"
                                onChange={this.onChange}
                                required
                            />
                            {formErrors.endDate.length > 0 && (
                                <span className="errorMessage">{formErrors.endDate}</span>
                            )}
                        </div>

                        <div className="email">
                            <label htmlFor="email" >Dodajte sliku  </label>
                            <input
                                type="file"
                                required
                                placeholder="Dodajte sliku (opcionalno)"
                                name="file_upload"
                                onChange={this.handleFile}
                                />
                        </div>

                        <div className="createAccount">
                            <button type="submit">Dodaj događaj</button>
                        </div>

                    </form>
                </div>
            </div>
    </div>);
    }
}