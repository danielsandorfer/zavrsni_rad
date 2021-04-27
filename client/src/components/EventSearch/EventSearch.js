import React, { Component } from "react";
import Header from "../Header/Header";
import "./EventSearch.css";
import Button from 'react-bootstrap/Button';
import axios from 'axios';

export default class EventSearch extends Component {
 
    constructor(props){
        super(props);
        this.events = [];
        this.searchedEventName = null;

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    
   onSubmit(e) {
        e.preventDefault();
        axios.post("/api/event_search", {
                event: {
                    eventName: this.state.searchedEventName
                }       
            }
          )
          .then(res => {
            const data = Object.values(res.data);
            console.log(JSON.stringify(data));
            data.forEach(element => {
            element = Object.values(element);
               const event = {
                id: element[0],
                startDate: element[5],
                endDate: element[6],
                eventName: element[8],
                eventAddress: element[14],
               }  
               let events = this.events;
               events.push(event);
               this.setState({
                 events: events
               });
            });
        });
      }

      onChange(e) {
          e.preventDefault();
          const { name, value } = e.target;
          this.setState({searchedEventName: value});
      }


      render() {
        return (
        <div className="top">
            <div>
                <Header currentPage='search'/>
            </div>
            <div className="form-wrapper">
                <div className="username">
                    <form method="POST" onSubmit={this.onSubmit}>
                           
                            <input
                                className="inputField"
                                placeholder="Pretraživanje"
                                type="text"
                                name="searchedEventName"
                                onChange={this.onChange}
                                required
                            />
                    </form>   
                 </div>
            </div>

            {this.events.length > 0 && (
                <div className="searchBlok">
                    <div className="listaDogadaja"> 
                        {this.events.map(event => 
                                <div className="container">
                                    <h3 key={event.id} className="naziv">{event.eventName}</h3>
                                    <h4>Adresa - {event.eventAddress}</h4>
                                    <div className="container-2">
                                        <Button variant="outline-success" href={`/event/${event.id}`}>Vidi više</Button>
                                    </div>
                                </div>
                        )}
                    </div>
                </div>
            )}
            

           
        </div>   
        );
      }
    }