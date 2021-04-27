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

export default class ControlPanelTypes extends Component {
 
    constructor(props){
        super(props);
        this.events = [];
        this.eventTypes = [];
        this.eventLocations = [];
        this.error = "";
        this.searchedEventTypeName = null;
        
        let jwtToken = localStorage.usertoken;

        if (jwtToken) {
            setValidated();
            setAuthToken(jwtToken);
            //console.log(isValidated);
        }
        
        this.deleteEventType = this.deleteEventType.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
        this.onNameSearch = this.onNameSearch.bind(this);
    }

    onNameSearch(e) {
      e.preventDefault();
      axios.post("/api/control_panel/event_type_search", {
              event: {
                  eventTypeName: this.state.searchedEventTypeName
              }       
          }
        )
        .then(res => {
          const data = Object.values(res.data);
          this.eventTypes = [];

          if(data.length == 0) {
            this.setState({
              eventTypes: []
            })
          }
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

    onNameChange(e) {
        e.preventDefault();
        const { name, value } = e.target;
        this.setState({searchedEventTypeName: value});
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

        }
      }

      deleteEventType(id) {
        fetch("/api/control_panel/delete_event_type", {
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
          //window.location.reload();
        }).catch(error => console.log(error));
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

              <div className="cont-types">
                    <div className="box-types">
                      {this.eventTypes.length > 0 && (
                        <div className="tab-types">
                          <Table striped bordered hover variant="dark" >
                              <thead>
                              <tr>
                                  <th>Tip događaja</th>
                                  <th>
                                      <form  method="POST" onSubmit={this.onNameSearch}>
                                        <input 
                                          style={{textAlign: "center", marginLeft: "100px", height:"40px"}}
                                          placeholder="Tip događaja"
                                          name="name"
                                          onChange={this.onNameChange}
                                        />
                                      </form>
                                  </th>
                                  <th colSpan="2"><Button className="commentButton" variant="secondary" href={`/control_panel/add_event_type`}>Dodaj</Button></th>
                              </tr>
                              </thead>
                              <tbody>
                              {this.eventTypes.map(eventType => 
                                  <tr key={eventType.id}>
                                  <td>{eventType.id}</td>
                                  <td>{eventType.eventTypeName}</td>
                                  <td> 
                                      <Button className="commentButton" variant="secondary" href={`/control_panel/edit_event_type/${eventType.id}`}>Uredi</Button>
                                  </td>
                                  <td>
                                      <Button className="commentButton" variant="secondary"  href="/control_panel/event_types" onClick={() => this.deleteEventType(eventType.id)}>Obriši</Button>
                                  </td>
                                  </tr>
                              )}
                              
                              </tbody>
                          </Table>
                        </div>
                      )}

                      {this.eventTypes.length == 0 && (
                         <Table striped bordered hover variant="dark" >
                          <thead>
                          <tr>
                              <th>Tip događaja</th>
                              <th>
                                  <form  method="POST" onSubmit={this.onNameSearch}>
                                    <input 
                                      style={{textAlign: "center", marginLeft: "100px", height:"40px"}}
                                      placeholder="Tip događaja"
                                      name="name"
                                      onChange={this.onNameChange}
                                    />
                                  </form>
                              </th>
                              <th colSpan="2"><Button className="commentButton" variant="secondary" href={`/control_panel/add_event_type`}>Dodaj</Button></th>
                          </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <th colSpan="3">Trenutno nema tipova događaja</th>
                            </tr>
                          </tbody>
                        </Table>
                      )}
                      
                  </div>
              </div>       
            </div>);
        }
        
}