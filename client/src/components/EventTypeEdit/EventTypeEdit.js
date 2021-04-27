import React, { Component } from 'react';
import Header from "../Header/Header";
import jwt_decode from "jwt-decode";
import axios from 'axios';


var isValidated = false;
var decoded = [];

function setValidated() {
    isValidated = true;
}
function setAuthToken(jwtToken) {
    decoded = jwt_decode(jwtToken);
}



export default class EventTypeEdit extends Component {
 
    constructor(props){
        super(props);
        this.state = {
            eventTypeData: {},
            eventTypeName: "",
            formErrors: {
                eventTypeName: "",
            }
        };
        this.eventTypes = [];

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
            this.props.history.push("/");
        } else {
            axios.get(`/api/control_panel/event_type/${this.props.match.params.id}`)
            .then(res => {   
                    const data = Object.values(res.data);
                    const element = Object.values(data);
                    var eventType = {
                        id: element[0],
                    eventTypeName: element[1]
                    }
                    
                    this.setState({
                        eventTypeData: eventType
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
            }
      
        
}
onSubmit(e) {
    e.preventDefault();

    const eventType = {
        id: this.props.match.params.id,     
        eventTypeName: this.state.eventTypeName,
    };
            
    fetch('/api/control_panel/update_event_type', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            eventType
        })
    })
    .then(() => {
            this.props.history.push("/control_panel/event_types");
    })
}

onChange(e) {
    e.preventDefault();
    const { name, value } = e.target;
    let formErrors = { ...this.state.formErrors };

    switch (name) {
      case "eventTypeName":
        formErrors.eventTypeName =
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
    <div className="main">
        <div>
        <Header />
        </div>
        <div className="form-mover" style={{marginBottom: "400px", marginTop: "150px"}}>
            <div className="form-wrapper" >
                <h1>Uređivanje tipa događaja</h1>
                    <form method="POST" onSubmit={this.onSubmit}>
                        <div className="email">
                            <label  htmlFor="email">Tip događaja</label>
                                <input type="text" 
                                        className={formErrors.eventTypeName.length > 0 ? "error" : null}
                                        list="data-6"
                                        placeholder={this.state.eventTypeData.eventTypeName}
                                        defaultValue={this.state.eventTypeData.eventTypeName}
                                        name="eventTypeName"
                                        onChange={this.onChange}
                                        />
                                 <datalist id="data-6">
                                    {this.eventTypes.map(eventType =>
                                            <option key={eventType.id} value={eventType.eventTypeName} />
                                        )}         
                                 </datalist>        
                                {formErrors.eventTypeName.length > 0 && (
                                    <span className="errorMessage">{formErrors.eventTypeName}</span>
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