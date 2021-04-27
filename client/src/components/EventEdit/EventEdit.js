import React, { Component } from 'react';
import Header from "../Header/Header";
import "./EventEdit.css";
import jwt_decode from "jwt-decode";
import Geocode from "react-geocode";
import { Editor } from "@tinymce/tinymce-react";
import axios from 'axios';




Geocode.setLanguage("hr");
Geocode.enableDebug();
const config = {
    //bucketName: ,//process.env.REACT_APP_BUCKET_NAME,
  //  dirName: 'events', /* optional */
   // region: 'eu-west-2',//process.env.REACT_APP_BUCKET_REGION,
   // accessKeyId: ,//process.env.REACT_APP_S3_KEY,
  //  secretAccessKey: ,//process.env.REACT_APP_S3_SECRET,
    //endpoint: "https://s3.amazonaws.com"
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

export default class EventEdit extends Component {
 
    constructor(props){
        super(props);
        this.state = {
            eventData: {},
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
            }
        };
        this.eventTypes = [];
        this.eventCountries = [];
        this.eventPlaces = [];
        this.eventAddresses = [];
        this.eventPostalCodes = [];

        let jwtToken = localStorage.usertoken;

        if (jwtToken) {
            setValidated();
            setAuthToken(jwtToken);
        }

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(eventDescription, editor) {
        let formErrors = { ...this.state.formErrors };
        formErrors.eventDescription =
        eventDescription.length < 5 ? "Unesite barem 5 znakova!" : "";
        this.setState({ eventDescription, formErrors}, console.log(this.state.eventDescription));
    }


componentDidMount() {
    if(!isValidated) {
        this.props.history.push("/");
    } else {
        axios.get(`/api/control_panel/edit_event/${this.props.match.params.id}`)
        .then(res => {       
            const data = Object.values(res.data);
            const event = Object.values(data[0]);
            console.log(JSON.stringify(event))
            
            var eventObject = {
              id: event[0],
              locationId: event[1],
              placeId: event[2],
              addressId: event[13],
              countryId: event[23],
              eventTypeId: event[3],
              eventDescription: event[5],
              startDate: (event[6].split("-")[2] + "." + event[6].split("-")[1] + "." + event[6].split("-")[0]),
              endDate: (event[7].split("-")[2] + "." + event[7].split("-")[1] + "." + event[7].split("-")[0]),
              eventName: event[9],
              eventType: event[11],
              eventCountry: event[24],
              eventPlace: event[21],
              eventAddress: event[17],
              eventPostalCode: event[20],
              eventGeoWidth: event[14],
              eventGeoLength: event[15],
              
            }

            this.setState({
              eventData: eventObject
            });          
          });

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
            id: this.props.match.params.id,
            eventCountry: this.state.country,
            eventPlace: this.state.place,
            eventPostalCode: this.state.postalCode,
            eventAddress: this.state.address,
            eventGeoWidth: "",
            eventGeoLength: "",
            eventType: this.state.eventType,
            eventDescription: this.state.eventDescription,
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            eventName: this.state.eventName,
            username: decoded.username
        };
        const oldEvent = this.state.eventData;
       
          
         if(event.eventAddress) {
             Geocode.fromAddress(this.state.address).then(response => {
                    const { lat, lng } = response.results[0].geometry.location;
                    event.eventGeoWidth = lat;
                    event.eventGeoLength = lng;
                    fetch('/api/control_panel/update_event', {
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
                }).catch(error => {
                    let formErrors = { ...this.state.formErrors };
                    formErrors.address = "Adresa ne postoji!";
                    this.setState({formErrors: formErrors});
            });
         } else {
            fetch('/api/control_panel/update_event', {
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


render() {
    const { formErrors } = this.state;
    return (
    <div>
        <div>
        <Header />
        </div>
        <div className="form-wrapper">
            <h1>Uređivanje događaja</h1>
                <form method="POST" onSubmit={this.onSubmit}>

                <div className="username">
                    <label htmlFor="username">Naziv događaja</label>
                    <input
                        className={formErrors.eventName.length > 0 ? "error" : null}
                        placeholder={this.state.eventData.eventName}
                        defaultValue={this.state.eventData.eventName}
                        type="text"
                        name="eventName"
                        onChange={this.onChange}
                    />
                     {formErrors.eventName.length > 0 && (
                        <span className="errorMessage">{formErrors.eventName}</span>
                     )}
                </div>

                <div className="name">
                    <label htmlFor="name">Mjesto</label>
                    <input
                        className={formErrors.place.length > 0 ? "error" : null}
                        placeholder={this.state.eventData.eventPlace}      
                        defaultValue={this.state.eventData.eventPlace}    
                        list="data"
                        type="text"
                        name="place"
                        onChange={this.onChange}
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
                        placeholder={this.state.eventData.eventCountry}
                        defaultValue={this.state.eventData.eventCountry}
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
                        placeholder={this.state.eventData.eventPostalCode}
                        defaultValue={this.state.eventData.eventPostalCode}
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

                <div className="email">
                    <label htmlFor="email">Adresa</label>
                    <input
                        className={formErrors.address.length > 0 ? "error" : null}
                        placeholder={this.state.eventData.eventAddress}
                        defaultValue={this.state.eventData.eventAddress}
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
                <label  htmlFor="email">Tip događaja</label>
                    <input type="text" 
                            className={formErrors.eventType.length > 0 ? "error" : null}
                            list="data-3"
                            placeholder={this.state.eventData.eventType}
                            defaultValue={this.state.eventData.eventType}
                            name="eventType"
                            onChange={this.onChange}
                             />
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
                        value={this.state.eventData.eventDescription}
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
                        placeholder={this.state.eventData.startDate}
                        defaultValue={this.state.eventData.startDate}
                        type="text"
                        name="startDate"
                        onChange={this.onChange}
                    />
                     {formErrors.startDate.length > 0 && (
                        <span className="errorMessage">{formErrors.startDate}</span>
                    )}
                </div>
                <div className="email">
                    <label htmlFor="email">Datum završetka</label>
                    <input
                        className={formErrors.endDate.length > 0 ? "error" : null}
                        placeholder={this.state.eventData.endDate}
                        defaultValue={this.state.eventData.endDate}
                        type="text"
                        name="endDate"
                        onChange={this.onChange}
                    />
                     {formErrors.endDate.length > 0 && (
                        <span className="errorMessage">{formErrors.endDate}</span>
                    )}
                </div>
           
 
            <div className="createAccount">
              <button type="submit">Pohrani promjene</button>
            </div>

            </form>
        </div>
    </div>);
    }
}