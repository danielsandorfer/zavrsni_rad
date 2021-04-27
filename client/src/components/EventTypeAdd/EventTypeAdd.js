import React, { Component } from 'react';
//import './EventTypeAdd.css';
import Header from "../Header/Header";
import jwt_decode from "jwt-decode";

var isValidated = false;
var decoded = [];

function setValidated() {
    isValidated = true;
}
function setAuthToken(jwtToken) {
    decoded = jwt_decode(jwtToken);
}



export default class EventTypeAdd extends Component {

    constructor(props){
        super(props);

        this.state = {      
            eventTypeName: "",
            formErrors: {   
                eventTypeName: "",
            }
        }


        let jwtToken = localStorage.usertoken;

        if (jwtToken) {
            setValidated();
            setAuthToken(jwtToken);
            //console.log(isValidated);
        }

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

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
    
    componentDidMount() {
       if(!isValidated) {
           this.props.history.push("/");
       }
    }

	onSubmit(e) {
        e.preventDefault();
        
        const eventType = {
            id: this.props.match.params.id,
            eventTypeName: this.state.eventTypeName
        }

        fetch('/api/control_panel/add_event_type', {
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

    render() {
        const { formErrors } = this.state;
        return (
        <div className="main">
            <div>
                <Header />
            </div>
            <div className="form-event-type" style={{marginBottom: "400px", marginTop: "150px"}}>
                <div className="form-wrapper">
                    <h1>Dodavanje tipa događaja</h1>
                        <form method="POST" onSubmit={this.onSubmit}>
                            <div className="email">
                                <label  htmlFor="email">Tip događaja</label>
                                    <input  type="text" 
                                            className={formErrors.eventTypeName.length > 0 ? "error" : null}
                                            placeholder="Tip događaja"
                                            name="eventTypeName"
                                            onChange={this.onChange}
                                            required />
                                    {formErrors.eventTypeName.length > 0 && (
                                        <span className="errorMessage">{formErrors.eventTypeName}</span>
                                    )}
                            </div>                   
                            <div className="createAccount">
                                <button type="submit">Dodaj tip događaja</button>
                            </div>                     
                        </form>
                </div>
            </div>
        </div>);
    }
}