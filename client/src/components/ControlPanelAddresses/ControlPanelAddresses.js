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

export default class ControlPanelAddresses extends Component {
 
    constructor(props){
        super(props);
        this.eventAddresses = [];
        this.error = "";
        this.searchedAddress = null;
        
        let jwtToken = localStorage.usertoken;

        if (jwtToken) {
            setValidated();
            setAuthToken(jwtToken);
            //console.log(isValidated);
        }
        
        this.deleteEventAddress = this.deleteEventAddress.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
        this.onNameSearch = this.onNameSearch.bind(this);
    }


    onNameSearch(e) {
      e.preventDefault();
      axios.post("/api/control_panel/address_search", {
              event: {
                  eventAddress: this.state.searchedAddress
              }       
          }
        )
        .then(res => {
          const data = Object.values(res.data);
          this.eventAddresses = [];

          if(data.length == 0) {
            this.setState({
              eventAddresses: []
            })
          }
          data.forEach(row => {
              const element = Object.values(row);
              console.log(element);
              var eventAddress = {
                id: element[0],
                eventAddress: element[1],
                eventPostalCode: element[2]
              }
              let eventAddresses = this.eventAddresses;
              eventAddresses.push(eventAddress);
              this.setState({
                eventAddresses: eventAddresses
              });
          })
      
      });
    }

    onNameChange(e) {
        e.preventDefault();
        const { name, value } = e.target;
        this.setState({searchedAddress: value}, console.log(this.state.searchedAddress));
    }

   

    componentDidMount() {

        if(!isValidated) {
          this.props.history.push("/");
        } else {
          
          axios.get("/api/control_panel/addresses")
          .then(res => {
              const data = Object.values(res.data);
              data.forEach(row => {
                const element = Object.values(row);
                 var eventAddress = {
                    id: element[0],
                    eventAddress: element[1],
                    eventPostalCode: element[2]
                  }
                  let eventAddresses = this.eventAddresses;
                  eventAddresses.push(eventAddress);
                  this.setState({
                    eventAddresses: eventAddresses
                  });
              })
          })

        }


      }

       deleteEventAddress(id) {

          fetch("/api/control_panel/delete_event_address", {
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
            
              <div style={{marginBottom: "300px"}}>
                <div className="cont-locations">
                  <div className="box-locations">
                    {this.eventAddresses.length > 0 && (
                      <div className="tab-locations">
                        <Table striped bordered hover variant="dark" style={{width: "100%"}}>
                            <thead>
                              <tr>
                                <th>Adresa</th>
                                <th>
                                    <form  method="POST" onSubmit={this.onNameSearch}>
                                      <input 
                                        style={{textAlign: "center", marginLeft: "65px", height:"40px"}}
                                        placeholder="Adresa"
                                        name="name"
                                        onChange={this.onNameChange}
                                      />
                                    </form>
                                </th>
                                <th></th>
                                <th colSpan="2"><Button className="commentButton" variant="secondary" href={`/control_panel/add_event_address`}>Dodaj</Button></th>
                              </tr>
                            </thead>
                            <tbody>
                              {this.eventAddresses.map(eventAddress => 
                                <tr key={eventAddress.id}>
                                  <td>{eventAddress.id}</td>
                                  <td>{eventAddress.eventAddress}</td>
                                  <td>{eventAddress.eventPostalCode}</td>
                                  <td> 
                                      <Button className="commentButton" variant="secondary" href={`/control_panel/edit_event_address/${eventAddress.id}`}>Uredi</Button>
                                  </td>
                                  <td>
                                      <Button className="commentButton" variant="secondary"  href="/control_panel/addresses" onClick={() => this.deleteEventAddress(eventAddress.id)}>Obriši</Button>
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </Table>
                      </div>
                    )}

                    {this.eventAddresses.length == 0 && (
                       <Table striped bordered hover variant="dark" style={{width: "100%"}}>
                       <thead>
                         <tr>
                           <th>Adresa</th>
                           <th>
                               <form  method="POST" onSubmit={this.onNameSearch}>
                                 <input 
                                   style={{textAlign: "center", marginLeft: "65px", height:"40px"}}
                                   placeholder="Adresa"
                                   name="name"
                                   onChange={this.onNameChange}
                                 />
                               </form>
                           </th>
                           <th></th>
                           <th colSpan="2"><Button className="commentButton" variant="secondary" href={`/control_panel/add_event_address`}>Dodaj</Button></th>
                         </tr>
                       </thead>
                       <tbody>
                            <tr>
                              <th colSpan="4">Trenutno nema adresa</th>
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