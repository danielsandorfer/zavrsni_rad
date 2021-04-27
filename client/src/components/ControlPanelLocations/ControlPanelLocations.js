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

export default class ControlPanelLocations extends Component {
 
    constructor(props){
        super(props);
        this.events = [];
        this.eventTypes = [];
        this.eventLocations = [];
        this.error = "";
        
        let jwtToken = localStorage.usertoken;

        if (jwtToken) {
            setValidated();
            setAuthToken(jwtToken);
            //console.log(isValidated);
        }
        
        this.deleteEventLocation= this.deleteEventLocation.bind(this);
       
    }

   

    componentDidMount() {

        if(!isValidated) {
          this.props.history.push("/");
        } else {
          
          axios.get("/api/locations")
          .then(res => {
              const data = Object.values(res.data);
              data.forEach(row => {
                  const element = Object.values(row);
                  console.log(element);
                  var eventLocation = {
                    id: element[0],
                    eventCountry: element[1],
                    eventCity: element[2],
                    eventAddress: element[3],
                    eventPostalCode: element[4]
                  }
                  let eventLocations = this.eventLocations;
                  eventLocations.push(eventLocation);
                  this.setState({
                    eventLocations: eventLocations
                  });
              })
          })

        }


      }

       deleteEventLocation(id) {

          fetch("/api/control_panel/delete_event_location", {
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
            <div className="">
               <Header />
                <div className="userWelcome">
                  <h1>Dobrodošao, {decoded.username}</h1>
                </div>

                <div className="cont-locations">
                  <div className="box-locations">
                      <div className="tab-locations">
                        <Table striped bordered hover variant="dark" style={{width: "100%"}}>
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>Lokacija</th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th colSpan="2"><Button className="commentButton" variant="secondary" href={`/control_panel/add_event_location`}>Dodaj</Button></th>
                              </tr>
                            </thead>
                            <tbody>
                              {this.eventLocations.map(eventLocation => 
                                <tr key={eventLocation.id}>
                                  <td>{eventLocation.id}</td>
                                  <td>{eventLocation.eventCountry}</td>
                                  <td>{eventLocation.eventCity}</td>
                                  <td>{eventLocation.eventAddress}</td>
                                  <td>{eventLocation.eventPostalCode}</td>
                                  <td> 
                                      <Button className="commentButton" variant="secondary" href={`/control_panel/edit_event_location/${eventLocation.id}`}>Uredi</Button>
                                  </td>
                                  <td>
                                      <Button className="commentButton" variant="secondary"  href="/control_panel/locations" onClick={() => this.deleteEventLocation(eventLocation.id)}>Obriši</Button>
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </Table>
                      </div>
                  </div>
                </div>

                  
               
            </div>
           
            
            
            );
        }
        
}