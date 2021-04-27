import React, { Component } from "react";
import MapContainer from "../MapContainer/MapContainer";
import "./Home.css";
import Button from 'react-bootstrap/Button';
import Header from "../Header/Header";
import axios from 'axios';
import Geocode from "react-geocode";



Geocode.setLanguage("hr");
Geocode.enableDebug();


const dateRegex = RegExp(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);

export default class Home extends Component {
	constructor() {
		super();
		this.state = {
			startDate: "",
			endDate: "",
			newLocation: "",
			formErrors: {   
			  startDate: "",
			  endDate: "",
			  newLocation: ""
			},
			events: [],
			showingInfoWindow: false,  //Hides or the shows the infoWindow
			activeMarker: {},          //Shows the active marker upon click
			selectedPlace: {},        //Shows the infoWindow to the selected place upon a marker
			eventId: "", 
			currentLat: 55.7539303,
			currentLng: 37.620795,
			zoom: 4
		};
		this.events = [];
        this.eventTypes = [];
        this.eventLocations = [];


		this.updatePosition = this.updatePosition.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.locationSearch = this.locationSearch.bind(this);
		this.onChangeLocation = this.onChangeLocation.bind(this);
	}

	// uredi geografsku poziciju
	updatePosition = (position) => {
		this.setState({
		  currentLat: position.coords.latitude,
		  currentLng: position.coords.currentLng
		});
	  }

	// klik na marker na karti
	onMarkerClick = (props, marker, e) =>
		this.setState({
			selectedPlace: props,
			activeMarker: marker,
			showingInfoWindow: true,
			eventId: props.id
		});

	// zatvaranje informacijskog prozora markera
    onClose = props => {
      if (this.state.showingInfoWindow) {
        this.setState({
          showingInfoWindow: false,
          activeMarker: null,
          selectedPlace: null
        });
      }
    };


	 componentDidMount() {
	
		// dohvati oznake na karti
		 axios.get('/api/map_locations')
		.then(res => {   
			const data = Object.values(res.data);
			data.forEach(row => {
	
			var event = Object.values(row);

			var eventData = {
				id: event[0],
				description: event[5],
				startDate: event[6],
				endDate: event[7],
				eventName: event[9],
				eventType: event[11],
				eventAdress: event[17],
				eventGeoWidth: event[14],
				eventGeoLength: event[15]
				}
				let events = this.state.events;
				events.push(eventData);
				
				this.setState({
				events: events
				});
			});
      	});
	}
	// filtriranje prema vremenskom razdoblju
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


	  onSubmit(e) {
		e.preventDefault();
		const startDate  = this.state.startDate;
		const endDate = this.state.endDate;

		fetch('/api/event_list/filter_events_locations', {
			method: 'POST',
			headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				startDate,
				endDate
			})
		})
		.then(res => res.json())
		.then(data => {
			let events = this.state.events;
			events = [];
			this.setState({
				events: events
			}, function() {
				data.forEach(row => {
					var event = Object.values(row);	
					var eventData = {
						id: event[0],
						description: event[5],
						startDate: event[6],
						endDate: event[7],
						eventName: event[9],
						eventType: event[11],
						eventAdress: event[17],
						eventGeoWidth: event[14],
						eventGeoLength: event[15],
						eventImagePath: ""
					}
					
					let events = this.state.events;
					events.push(eventData);

					this.setState({
					events: events
					});
				});
			})
			
		})
	  }

	  // filtriranje prema lokaciji
	  onChangeLocation(e) {
		e.preventDefault();
		const { name, value } = e.target;
		this.setState({[name]: value});
	  }

	  locationSearch(e) {
		e.preventDefault();
		let formErrors = { ...this.state.formErrors };
		if(this.state.newLocation) {
			Geocode.fromAddress(this.state.newLocation).then(
				response => {
					const { lat, lng } = response.results[0].geometry.location;
					console.log(lat, lng);
					this.setState({
						currentLat: lat,
						currentLng: lng,
						zoom: 9
					});
			}).catch(e => {
				formErrors.newLocation = "Nepostojeće mjesto";
				this.setState({formErrors});
			});
		}
	  }

	render() {
		const { formErrors } = this.state;
        return (
            <div className="home" >
				<div className="headerDiv">
					<Header />
                </div>
				<div className='header'>
					<div className="header-image">
					</div>
					<div className='header-title'>
						Dobrodošli!
						<div className="header-text">
							Istražite kulturne događaje u svijetu i svojoj okolici!
							Iskoristite kartu!
						</div>
					</div>
        		</div>

				<div className="forms">	
					<div className="first-form">
						<form method="POST" className="form-inline" onSubmit={this.onSubmit}>
								
									<input
										className="form-control"
										placeholder="Početak (dd.mm.yyyy)"
										className={formErrors.startDate.length > 0 ? "error" : null}
										type="text"
										name="startDate"
										onChange={this.onChange}
									></input>
									
									<input
										className="end"
										placeholder="Kraj (dd.mm.yyyy)"
										className={formErrors.endDate.length > 0 ? "error" : null}
										type="text"
										name="endDate"
										onChange={this.onChange}
									></input>
									
							 
								<div className="map-input-button-period">
									<Button variant="secondary" className="map-button" type="submit">
										Filtriraj prema razdoblju
									</Button>
								</div>
								
						</form>
						
					</div>
			
					<div className="second-form">
						<form method="POST" className="form-inline" onSubmit={this.locationSearch}>
							
								<input
									className="form-control"
									placeholder="Mjesto"
									className={formErrors.newLocation.length > 0 ? "error" : null}
									type="text"
									name="newLocation"
									onChange={this.onChangeLocation}
								/>
								
								<span>
								<div className="map-input-button-location">
									<Button variant="secondary" className="map-button" type="submit">
										Filtriraj prema mjestu
									</Button>
								</div>
								</span>
						</form>
					</div>
				</div>	
		
				<div className="map-cont">	
					<div className="karta">
						<MapContainer center={{lat: this.state.currentLat, lng: this.state.currentLng}} zoom={this.state.zoom} events={this.state.events}></MapContainer>				
					</div>
				</div>	
			
        </div>
        );
	}
}
