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

export default class ControlPanelPlaces extends Component {
 
    constructor(props){
        super(props);
        this.eventPlaces = [];
        this.error = "";
        this.searchedPlace = null;
        
        let jwtToken = localStorage.usertoken;

        if (jwtToken) {
            setValidated();
            setAuthToken(jwtToken);
            //console.log(isValidated);
        }
        
        this.deleteEventPlace = this.deleteEventPlace.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
        this.onNameSearch = this.onNameSearch.bind(this);
    }

    onNameSearch(e) {
      e.preventDefault();
      axios.post("/api/control_panel/place_search", {
              event: {
                  eventPlace: this.state.searchedPlace
              }       
          }
        )
        .then(res => {
          const data = Object.values(res.data);

          this.eventPlaces = [];

          if(data.length == 0) {
            this.setState({
              eventPlaces: []
            })
          }
          data.forEach(row => {
            const element = Object.values(row);
           var eventPlace = {
              id: element[0],
              eventPostalCode: element[1],
              eventPlace: element[2],
              eventCountry: element[5]
            }
            let eventPlaces = this.eventPlaces;
            eventPlaces.push(eventPlace);
            this.setState({
              eventPlaces: eventPlaces
            });
        })
      });
    }

    onNameChange(e) {
        e.preventDefault();
        const { name, value } = e.target;
        this.setState({searchedPlace: value});
    }

   

    componentDidMount() {

        if(!isValidated) {
          this.props.history.push("/");
        } else {
          
          axios.get("/api/control_panel/places")
          .then(res => {
              const data = Object.values(res.data);
              data.forEach(row => {
                  const element = Object.values(row);
                  console.log(element);
                 var eventPlace = {
                    id: element[0],
                    eventPostalCode: element[1],
                    eventPlace: element[2],
                    eventCountry: element[5]
                  }
                  let eventPlaces = this.eventPlaces;
                  eventPlaces.push(eventPlace);
                  this.setState({
                    eventPlaces: eventPlaces
                  });
              })
          })

        }


      }

       deleteEventPlace(id) {

          fetch("/api/control_panel/delete_event_place", {
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
              //window.location.reload();
              console.log(result);
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
          
              <div style={{marginBottom: "250px"}}>
                <div className="cont-locations">
                  <div className="box-locations">
                    {this.eventPlaces.length > 0 && (
                      <div className="tab-locations">
                      <Table striped bordered hover variant="dark" style={{width: "100%"}}>
                          <thead>
                            <tr>
                              <th>Mjesto</th>
                              <th>
                                  <form  method="POST" onSubmit={this.onNameSearch}>
                                    <input 
                                      style={{textAlign: "center", marginLeft: "10px", height:"40px"}}
                                      placeholder="Naziv mjesta"
                                      name="name"
                                      onChange={this.onNameChange}
                                    />
                                  </form>
                              </th>
                              <th></th>
                              <th></th>
                              <th colSpan="2"><Button className="commentButton" variant="secondary" href={`/control_panel/add_event_place`}>Dodaj</Button></th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.eventPlaces.map(eventPlace => 
                              <tr key={eventPlace.id}>
                                <td>{eventPlace.id}</td>   
                                <td>{eventPlace.eventPlace}</td>
                                <td>{eventPlace.eventPostalCode}</td>
                                <td>{eventPlace.eventCountry}</td>
                                <td> 
                                    <Button className="commentButton" variant="secondary" href={`/control_panel/edit_event_place/${eventPlace.id}`}>Uredi</Button>
                                </td>
                                <td>
                                    <Button className="commentButton" variant="secondary"  href="/control_panel/places" onClick={() => this.deleteEventPlace(eventPlace.id)}>Obriši</Button>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </Table>
                    </div>
                    )}

                    {this.eventPlaces.length == 0 && (
                      <Table striped bordered hover variant="dark" style={{width: "100%"}}>
                        <thead>
                          <tr>
                            <th>Mjesto</th>
                            <th>
                                <form  method="POST" onSubmit={this.onNameSearch}>
                                  <input 
                                    style={{textAlign: "center", marginLeft: "10px", height:"40px"}}
                                    placeholder="Naziv mjesta"
                                    name="name"
                                    onChange={this.onNameChange}
                                  />
                                </form>
                            </th>
                            <th></th>
                            <th></th>
                            <th colSpan="2"><Button className="commentButton" variant="secondary" href={`/control_panel/add_event_place`}>Dodaj</Button></th>
                          </tr>
                        </thead>
                        <tbody>
                            <tr>
                              <th colSpan="5">Trenutno nema mjesta</th>
                            </tr>
                        </tbody>
                      </Table>
                    )}
                      
                  </div>
                </div>
              </div>
    
            </div> );
        }
        
}