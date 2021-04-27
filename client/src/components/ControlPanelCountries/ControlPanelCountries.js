import React, { Component } from 'react';
import Header from "../Header/Header";
import "../ControlPanel/ControlPanel.css";
import jwt_decode from "jwt-decode";
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import axios from 'axios';


var isValidated = false;
var decoded = [];

function setValidated() {
    isValidated = true;
}
function setAuthToken(jwtToken) {
    decoded = jwt_decode(jwtToken);
}

export default class ControlPanelCountries extends Component {
 
    constructor(props){
        super(props);
        this.eventCountries = [];
        this.error = "";
        this.formErrors = {
          country: ""
        }
        this.searchedEventCountry = null;
        
        let jwtToken = localStorage.usertoken;

        if (jwtToken) {
            setValidated();
            setAuthToken(jwtToken);
            //console.log(isValidated);
        }
        
        this.deleteEventCountry = this.deleteEventCountry.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
        this.onNameSearch = this.onNameSearch.bind(this);
       
    }

    onNameSearch(e) {
      e.preventDefault();
      axios.post("/api/control_panel/country_search", {
              event: {
                  eventCountry: this.state.searchedEventCountry
              }       
          }
        )
        .then(res => {
          const data = Object.values(res.data);

          this.eventCountries = [];

          if(data.length == 0) {
            this.setState({
              eventCountries: []
            })
          }
          data.forEach(row => {
              const element = Object.values(row);
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
      });
    }

    onNameChange(e) {
        e.preventDefault();
        const { name, value } = e.target;
        this.setState({searchedEventCountry: value});
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

       deleteEventCountry(id) {
        let formErrors = { ...this.state.formErrors };
          fetch("/api/control_panel/delete_event_country", {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: id
            })
          }).
          then(res => res.json()).
          then(result => {   
              console.log(result);
          })

        }
      
        render() {
            return (
             <div className="main">
              <div>
                <Header />
              </div>
               <div className="userWelcome">
                  <h1>Dobrodošao, {decoded.username}</h1>
                </div>
           
              <div style={{marginBottom: "300px"}}>
                <div className="cont-locations">
                  <div className="box-locations">
                    {this.eventCountries.length > 0 && (
                      <div className="tab-locations">
                      <Table striped bordered hover variant="dark" style={{width: "100%"}}>
                          <thead>
                            <tr>
                              <th>Država</th>
                              <th>
                                  <form  method="POST" onSubmit={this.onNameSearch}>
                                    <input 
                                      style={{textAlign: "center", marginLeft: "100px", height:"40px"}}
                                      placeholder="Država"
                                      name="name"
                                      onChange={this.onNameChange}
                                    />
                                  </form>
                              </th>
                              <th colSpan="2"><Button className="commentButton" variant="secondary" href={`/control_panel/add_event_country`}>Dodaj</Button></th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.eventCountries.map(eventCountry => 
                              <tr key={eventCountry.id}>
                                <td>{eventCountry.id}</td>
                                <td>{eventCountry.eventCountry}</td>
                                <td> 
                                    <Button className="commentButton" variant="secondary" href={`/control_panel/edit_event_country/${eventCountry.id}`}>Uredi</Button>
                                </td>
                                <td>
                                    <Button className="commentButton" variant="secondary"  href="/control_panel/countries" onClick={() => this.deleteEventCountry(eventCountry.id)}>Obriši</Button>
                                    {this.formErrors.country.length > 0 && (
                                        <span className="errorMessage">{this.formErrors.country}</span>
                                    )}
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </Table>
                    </div>
                    )}

                    {this.eventCountries.length == 0 && (
                      <Table striped bordered hover variant="dark" style={{width: "100%"}}>
                        <thead>
                          <tr>
                            <th>Država</th>
                            <th>
                                <form  method="POST" onSubmit={this.onNameSearch}>
                                  <input 
                                    style={{textAlign: "center", marginLeft: "100px", height:"40px"}}
                                    placeholder="Država"
                                    name="name"
                                    onChange={this.onNameChange}
                                  />
                                </form>
                            </th>
                            <th colSpan="2"><Button className="commentButton" variant="secondary" href={`/control_panel/add_event_country`}>Dodaj</Button></th>
                          </tr>
                        </thead>
                        <tbody>
                            <tr>
                              <th colSpan="3">Trenutno nema država</th>
                            </tr>
          
                        </tbody>
                      </Table>
                    )}
                      
                </div>
              </div>
            </div>   
          </div>);
        }
        
}