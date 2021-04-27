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

export default class ControlPanelEvents extends Component {
 
    constructor(props){
        super(props);
        this.state = {
          events: [],
          isReady: false
        }
        this.error = "";
        this.searchedEventName = null;
        
        let jwtToken = localStorage.usertoken;

        if (jwtToken) {
            setValidated();
            setAuthToken(jwtToken);
            //console.log(isValidated);
        }
        
        this.deleteEvent= this.deleteEvent.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
        this.onNameSearch = this.onNameSearch.bind(this);
       
    }

    onNameSearch(e) {
      e.preventDefault();
      axios.post("/api/event_search/event_control_panel", {
              event: {
                  eventName: this.state.searchedEventName,
                  username: decoded.username
              }       
          }
        )
        .then(res => {
          const data = Object.values(res.data);
          console.log(JSON.stringify(data));
          this.state.events = [];

          if(data.length == 0) {
            this.setState({
              events: []
            })
          }
      
          data.forEach(row => {
            var event = Object.values(row);
            var contains = false;
            this.state.events.map(e => {
              if(e.id == event[0]) {
                contains = true;
              }
            })
            if(!contains) {
                var eventData = {
                  id: event[0],
                  eventName: event[9],
                }
                let events = this.state.events;
                events.push(eventData);
                this.setState({
                  events: events
                }, console.log(this.state.events));
            }
          });
      });
    }

    onNameChange(e) {
        e.preventDefault();
        const { name, value } = e.target;
        this.setState({searchedEventName: value});
    }

   

    async componentWillMount() {

        if(!isValidated) {
          this.props.history.push("/");
        } else {

         await axios({
            method: 'post',
            url: '/api/control_panel',
            headers: {'Accept': 'application/json',
            'Content-Type': 'application/json',}, 
            data: {
              username: decoded.username, // This is the body part
            }
          }).then(res => {

            const data = Object.values(res.data);

            if(data.length == 0) {
              let isReady = this.state.isReady;
              isReady = true;
              this.setState({
                isReady: isReady
              });
            }
            
            data.forEach(row => {
              var event = Object.values(row);
              var eventData = {
                id: event[0],
                eventName: event[9]

              } 
              let events = this.state.events;
              events.push(eventData);
              this.setState({
                events: events,
              });
            });
          })
          .then(() => {
            let isReady = this.state.isReady;
            isReady = true;
            this.setState({isReady: isReady});
          });;
     
        
        }


      }



      deleteEvent(id) {
          let isReady = this.state.isReady;
          isReady = false;
    
          axios({
            method: 'post',
            url: '/api/control_panel/delete_event',
            headers: {'Accept': 'application/json',
            'Content-Type': 'application/json',}, 
            data: {
              id: id,
              username: decoded.username // This is the body part
            }
          }).then(res => {
           console.log(res);
          })
      
          
      }

      
  
      
        render() {
            return (
            <div className="eventBody" style={{fontSize: "18px"}}>
              <div>
                <Header />
              </div>
               <div className="userWelcome">
                  <h1>Dobrodošao, {decoded.username}</h1>
                </div>

              <div className="cont-1">
                {this.state.isReady && (
                  <div className="box-1">
                    {this.state.events.length > 0 && (
                      <div className="tab">
                          <Table key={this.state.events.length} striped bordered hover variant="dark" >
                              <thead>
                              <tr>
                                  <th>Događaj</th>
                                  <th>
                                    <form  method="POST" onSubmit={this.onNameSearch}>
                                      <input 
                                        style={{textAlign: "center", marginLeft: "260px", height:"40px"}}
                                        placeholder="Naziv događaja"
                                        name="name"
                                        onChange={this.onNameChange}
                                      />
                                    </form>
                                  </th>
                                  <th colSpan="2"><Button className="commentButton" style={{fontSize: "18px"}} variant="secondary" href={`/control_panel/add_event`}>Dodaj</Button></th>
                              </tr>
                              </thead>
                              <tbody>
                                  {this.state.events.map(event => 
                                  <tr key={event.id}>
                                      <td>{event.id}</td>
                                      <td>{event.eventName}</td>
                                      <td> 
                                          <Button className="commentButton" style={{fontSize: "18px"}} variant="secondary" href={`/control_panel/edit_event/${event.id}`}>Uredi</Button>
                                      </td>
                                      <td>
                                          <Button className="commentButton" style={{fontSize: "18px"}} variant="secondary"  href="/control_panel/events" onClick={() => this.deleteEvent(event.id)}>Obriši</Button>
                                      </td>
                                  </tr>
                                  )}
                              </tbody>
                          </Table>
                    </div>
                    )}
                    {this.state.events.length == 0 && (
                      <Table key={this.state.events.length} striped bordered hover variant="dark" style={{width: "100%"}}>
                        <thead>
                        <tr>
                                  <th>Događaj</th>
                                  <th>
                                    <form  method="POST" onSubmit={this.onNameSearch}>
                                      <input 
                                        style={{textAlign: "center", marginLeft: "260px", height:"40px"}}
                                        placeholder="Naziv događaja"
                                        name="name"
                                        onChange={this.onNameChange}
                                      />
                                    </form>
                                  </th>
                                  <th colSpan="2"><Button className="commentButton" variant="secondary" href={`/control_panel/add_event`}>Dodaj</Button></th>
                              </tr>
                        </thead>
                        <tbody>
                          
                            <tr>
                              <th colSpan="3">Trenutno nema događaja</th>
                            </tr>
          
                        </tbody>
                      </Table>
                    )}
                </div>
              )}        
            </div>   
        </div>
        );}
        
        
}