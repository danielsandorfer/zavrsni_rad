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

export default class ControlPanelImages extends Component {
 
    constructor(props){
        super(props);
        this.images = [];
        this.error = "";
        this.searchedEvent = null;
        
        let jwtToken = localStorage.usertoken;

        if (jwtToken) {
            setValidated();
            setAuthToken(jwtToken);
            //console.log(isValidated);
        }
        
        this.deleteImage = this.deleteImage.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
        this.onNameSearch = this.onNameSearch.bind(this);
    }

    onNameSearch(e) {
      e.preventDefault();
      axios.post("/api/control_panel/image_search", {
              event: {
                  eventName: this.state.searchedEvent,
                  username: decoded.username
              }       
          }
        )
        .then(res => {
          const data = Object.values(res.data);

          this.images = [];

          if(data.length == 0) {
            this.setState({
              images: []
            })
          }
          data.forEach(row => {
            var image = Object.values(row);
            var imageData = {
              id: image[2],
              username: image[1],
              eventId: image[2],
              imagePath: image[3],
              eventName: image[12]
            }
            let images = this.images;
            images.push(imageData);
            this.setState({
              images: images
            });
  
          });
      });
    }

    onNameChange(e) {
        e.preventDefault();
        const { name, value } = e.target;
        this.setState({searchedEvent: value});
    }


   

    componentDidMount() {

        if(!isValidated) {
          this.props.history.push("/");
        } else {
          axios({
            method: 'post',
            url: '/api/control_panel/images',
            headers: {'Accept': 'application/json',
            'Content-Type': 'application/json',}, 
            data: {
              username: decoded.username 
            }
          }).then(res => {
            const data = Object.values(res.data);
            data.forEach(row => {
              var image = Object.values(row);
              var imageData = {
                id: image[2],
                username: image[1],
                eventId: image[2],
                imagePath: image[3],
                eventName: image[12]
              }
              let images = this.images;
              images.push(imageData);
              this.setState({
                images: images
              });
    
            });
          })
        }


      }

       deleteImage(id) {
          fetch("/api/control_panel/images/delete_image", {
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

                <div className="cont-images">
                    <div className="box-images">
                      {this.images.length > 0 && (
                        <div className="tab-images">
                          <Table striped bordered hover variant="dark" style={{width: "100%"}}>
                              <thead>
                                <tr>
                                  <th>Slika</th>
                                  <th></th>
                                  <th>
                                    <form  method="POST" onSubmit={this.onNameSearch}>
                                      <input 
                                        style={{textAlign: "center", marginLeft: "65px", height:"40px"}}
                                        placeholder="Naziv događaja"
                                        name="name"
                                        onChange={this.onNameChange}
                                      />
                                    </form>
                                  </th>
                                  <th></th>
                                  <th colSpan="2"></th>
                                </tr>
                              </thead>
                              <tbody>
                                {this.images.map(image => 
                                  <tr key={image.id}>
                                    <td>{image.id}</td>
                                    <td>{image.username}</td>
                                    <td>{image.eventName}</td>
                                    <td>{image.imagePath}</td>
                                    <td>
                                        <Button className="commentButton" variant="secondary"  href="/control_panel/images" onClick={() => this.deleteImage(image.id)}>Obriši</Button>
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </Table>
                        </div>
                      )}
                      
                      {this.images.length == 0 && (
                        <div className="tab-images">
                          <Table striped bordered hover variant="dark" style={{width: "100%"}}>
                          <thead>
                                <tr>
                                  <th>Slika</th>
                                  <th></th>
                                  <th>
                                    <form  method="POST" onSubmit={this.onNameSearch}>
                                      <input 
                                        style={{textAlign: "center", marginLeft: "65px", height:"40px"}}
                                        placeholder="Naziv događaja"
                                        name="name"
                                        onChange={this.onNameChange}
                                      />
                                    </form>
                                  </th>
                                <th></th>
                                  <th colSpan="2"></th>
                                </tr>
                              </thead>
                              <tbody>
                                  <tr>
                                      <th colSpan="5">Trenutno nema slika</th>
                                  </tr>                        
                              </tbody>
                            </Table>
                        </div>
                      )}
                  </div>
                </div>
            </div> 
            );
        }
        
}