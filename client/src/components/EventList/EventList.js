import React, { Component, useState } from "react";
import Header from "../Header/Header";
import "./EventList.css";
import Button from 'react-bootstrap/Button';
import axios from 'axios';


const dateRegex = RegExp(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);

export default class EventList extends Component {
 
    constructor(props){
        super(props);
        this.state = {
          startDate: "",
          endDate: "",
          formErrors: {   
            startDate: "",
            endDate: "",
          }
        }
        this.searchedEventName = null;
        this.events = [];

        
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
        this.onNameSearch = this.onNameSearch.bind(this);
    }

    onChange(e) {
      e.preventDefault();
      const { name, value } = e.target;
      let formErrors = { ...this.state.formErrors };

      switch (name) {
          case "startDate":
          formErrors.startDate = dateRegex.test(value)
              ? ""
              : "Neispravan format datuma!";
          break;
          case "endDate":
          formErrors.endDate = dateRegex.test(value)
              ? ""
              : "Neispravan format datuma!";
          break;
        default:
          break;
      }
  
      this.setState({ formErrors, [name]: value });
    }

    // filtriranje prema vremenskom razdoblju
    onSubmit(e) {
      e.preventDefault();
      const startDate  = this.state.startDate;
      const endDate = this.state.endDate;
      const eventTypeId = this.props.match.params.id;

      fetch('/api/event_list/filter_events', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            startDate,
            endDate,
            eventTypeId
        })
      })
      .then(res => res.json())
      .then(data => {
          if(data.length == 0) {
            this.setState({
              events: []
            })
          }
      
          data.forEach(row => {
            var event = Object.values(row);
            var contains = false;
            this.events.map(e => {
              if(e.id == event[0]) {
                contains = true;
              }
            })
            if(!contains) {
                var eventData = {
                  id: event[0],
                  description: event[5],
                  startDate: event[6],
                  endDate: event[7],
                  eventName: event[9],
                  eventAddress: event[21],
                  eventCity: event[12],
                  eventGeoWidth: event[18],
                  eventGeoLength: event[19],
                  eventImagePath: "https://eventappfer.s3.eu-west-2.amazonaws.com/" + event[26]
                }
                let events = this.events;
                events.push(eventData);
                this.setState({
                  events: events
                }, console.log(this.events));
            }
          });

      })
    }
    
    componentDidMount() {
        axios.get(`/api/event_list/${this.props.match.params.id}`)
        .then(res => { 
          const data = Object.values(res.data);
          data.forEach(row => {
            var event = Object.values(row);
            var contains = false;
            this.events.map(e => {
              if(e.id == event[0]) {
                contains = true;
              }
            })
            if(!contains) {
              var eventData = {
                id: event[0],
                description: event[5],
                startDate: event[6],
                endDate: event[7],
                eventName: event[9],
                eventAddress: event[15],
                eventGeoWidth: event[12],
                eventGeoLength: event[13],
                eventCity: event[19],
                eventImagePath: "https://eventappfer.s3.eu-west-2.amazonaws.com/" + event[26]
              }
            
              let events = this.events;
              events.push(eventData);
              this.setState({
                events: events
              });
            }            
          });
        });
      }

      // pretrazivanje prema imenu
      onNameSearch(e) {
        e.preventDefault();
        axios.post("/api/event_search/event_list", {
                event: {
                    eventName: this.state.searchedEventName,
                    eventTypeId: this.props.match.params.id
                }       
            }
          )
          .then(res => {
            const data = Object.values(res.data);
            console.log(JSON.stringify(data));
            this.events = [];

            if(data.length == 0) {
              this.setState({
                events: []
              })
            }
            data.forEach(row => {
              var event = Object.values(row);
              var contains = false;
              this.events.map(e => {
                if(e.id == event[0]) {
                  contains = true;
                }
              })
              if(!contains) {
                  var eventData = {
                    id: event[0],
                    description: event[5],
                    startDate: event[6],
                    endDate: event[7],
                    eventName: event[9],
                    eventAddress: event[15],
                    eventGeoWidth: event[12],
                    eventGeoLength: event[13],
                    eventCity: event[19],
                    eventImagePath: "https://eventappfer.s3.eu-west-2.amazonaws.com/" + event[26]
                  }
                  let events = this.events;
                  events.push(eventData);
                  this.setState({
                    events: events
                  }, console.log(this.events));
              }
            });
        });
      }

      onNameChange(e) {
          e.preventDefault();
          const { name, value } = e.target;
          this.setState({searchedEventName: value});
      }
     


      render() {
        const { formErrors } = this.state;
        return (

        <div className="main">
            <div>
                <Header />
            </div>
            <div style={{marginBottom: '30px', marginRight: '100px'}}>
                <div className="filter-container">
                    <form method="POST" onSubmit={this.onSubmit}>
                      <input
                        className="start-input"
                        placeholder="Početak (dd.mm.yyyy)"
                        className={formErrors.startDate.length > 0 ? "error" : null}
                        type="text"
                        name="startDate"
                        onChange={this.onChange}
                      ></input>
                      
                      <input
                        className="end-input"
                        placeholder="Kraj (dd.mm.yyyy)"
                        className={formErrors.endDate.length > 0 ? "error" : null}
                        type="text"
                        name="endDate"
                        onChange={this.onChange}
                      ></input>
                    
                      <Button variant="secondary" type="submit" className="filter-button">
                        Filtriraj prema razdoblju
                      </Button>
                      
                    </form>
                  </div>
              </div>
              
              <div className="filter-container" style={{marginLeft: '150px', marginTop: '50px'}}>
                <form method="POST" onSubmit={this.onNameSearch}>
                  <input
                    className="start-input"
                    placeholder="Naziv događaja"
                    type="text"
                    name="name"
                    onChange={this.onNameChange}
                  ></input>
                  <Button variant="secondary" type="submit" className="filter-button">
                    Pretraži prema nazivu
                  </Button>
                  
                </form>
              </div>
              
                  {this.events.length == 0 && (
                    <div className="container-events-list">
                      <div className="infoLeft">
                          <h3>Nema događaja</h3>
                      </div>
                    </div>
                  )}
                  <div className="grid-events">
                    {this.events.map(event => 
                      
                        <div key={event.id} className="grid-3">
                            <div className="container-grid">
                                <div className="infoTop"
                                  style={{ backgroundImage: `url(${event.eventImagePath})`}}>                 
                                </div>
                                <div className="infoBottom">
                                  <h3 key={event.id} className="naziv">{event.eventName}</h3>
                                  <hr />
                                  <h4>{event.eventCity}, {event.eventAddress}</h4>
                                  <h4>{event.startDate.split("-")[2] + "." + event.startDate.split("-")[1] + "." + event.startDate.split("-")[0]
                                        + " - " +
                                      event.endDate.split("-")[2] + "." + event.endDate.split("-")[1] + "." + event.endDate.split("-")[0]}</h4>
                                  <div className="container-2"> 
                                      <Button className="more-button" variant="outline-dark"  href={`/event/${event.id}`}>Vidi više</Button>
                                  </div>
                                </div>
                              </div>
                        </div>
                      )}
                </div>
        </div>   
        );
      }
    }