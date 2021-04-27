import React, { Component } from 'react';
import Header from "../Header/Header";
import "./ControlPanel.css";
import jwt_decode from "jwt-decode";
import Button from 'react-bootstrap/Button';
import axios from 'axios';


var isValidated = false;
var decoded = [];

function setValidated() {
    isValidated = true;
}
function setAuthToken(jwtToken) {
    decoded = jwt_decode(jwtToken);
}

export default class ControlPanel extends Component {
 
    constructor(props){
       super(props);
        this.state = {
          isAdmin: false
        }
  
        let jwtToken = localStorage.usertoken;

        if (jwtToken) {
            setValidated();
            setAuthToken(jwtToken);
        }
       
    }

   

    componentDidMount() {

      // ako je korisnik ulogiran, provjeri je li administrator
      if(!isValidated) {
        this.props.history.push("/");
      } else {
          axios.get(`/api/control_panel/check_admin/${decoded.username}`)
          .then(res => {
              let isAdmin = this.isAdmin;
              isAdmin = res.data;
              this.setState({
                isAdmin: isAdmin
              })
          });
        
        }
      }

        render() {
            return (
            <div className="panelBody">
              <div>
                <Header />
              </div>
                <div className="userWelcome-panel">
                  <h1>Dobrodošao, {decoded.username}</h1>
                </div>

                <div className="adminCards">
                    <div className="adminCard">
                      <div className="adminCardLeft">
                        <h1>Događaji</h1>
                        <Button variant="outline-dark" href="/control_panel/events">Uredi</Button>
                      </div>

                      <div className="adminCardRight"></div>
                    </div>

                    {this.state.isAdmin && (
                    <div className="adminCard">
                      <div className="adminCardLeft">
                        <h1>Tipovi događaja</h1>
                        <Button variant="outline-dark" href="/control_panel/event_types">Uredi</Button>
                      </div>

                      <div className="adminCardRight" id="sredstvo2"></div>
                    </div>

                  )}

                  {this.state.isAdmin && (
                    <div className="adminCard">
                        <div className="adminCardLeft">
                          <h1>Države</h1>
                          <Button variant="outline-dark" href="/control_panel/countries">Uredi</Button>
                        </div>

                        <div className="adminCardRight" id="sredstvo7"></div>
                    </div>
                   )}

                  {this.state.isAdmin && (
                    <div className="adminCard">
                        <div className="adminCardLeft">
                          <h1>Adrese</h1>
                          <Button variant="outline-dark" href="/control_panel/addresses">Uredi</Button>
                        </div>

                        <div className="adminCardRight" id="sredstvo8"></div>
                    </div>
                   )}

                  {this.state.isAdmin && (
                    <div className="adminCard">
                        <div className="adminCardLeft">
                          <h1>Mjesta</h1>
                          <Button variant="outline-dark" href="/control_panel/places">Uredi</Button>
                        </div>

                        <div className="adminCardRight" id="sredstvo3"></div>
                    </div>
                   )}

                    <div className="adminCard">
                      <div className="adminCardLeft">
                        <h1>Slike</h1>
                        <Button variant="outline-dark" href="/control_panel/images">Uredi</Button>
                      </div>

                      <div className="adminCardRight" id="sredstvo4"></div>
                    </div>
    
                   {this.state.isAdmin && (
                    <div className="adminCard">
                        <div className="adminCardLeft">
                          <h1>Komentari</h1>
                          <Button variant="outline-dark" href="/control_panel/comments">Uredi</Button>
                        </div>

                        <div className="adminCardRight" id="sredstvo5"></div>
                    </div>
                   )}           

                </div>
            </div>);
        }
        
}		