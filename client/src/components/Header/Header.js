import React, {Component} from "react";
import  Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import jwt_decode from 'jwt-decode';

var decoded = [];


var jwtToken = localStorage.usertoken;
var isValidated = false;

	function setAuthToken(jwtToken) {
		decoded = jwt_decode(jwtToken);
	}
	if (jwtToken) {
		//console.log(jwtToken);
		setAuthToken(jwtToken);
		setValidated();
		//console.log(isValidated);
	}

	function setValidated() {
		isValidated = true;
	}

	function logOut(e) {
		e.preventDefault();
		localStorage.removeItem("usertoken");
		isValidated = false;
		window.location.reload();
	}



export default class Header extends Component {

	constructor(props){
		super(props);
		this.eventTypes = [];
		this.reloadProp = "";
		this.status = 1;
	}

	componentDidMount() {
		fetch(`/api/control_panel/event_types`)
		.then(res => res.json())
		.then(data => {
			//const data = Object.values(res.data);   
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


render() {


	return (
		<Navbar bg="light" expand="lg">
			<Navbar.Brand href="/">Event Viewer</Navbar.Brand>
			<Navbar.Toggle aria-controls="basic-navbar-nav" />
			<Navbar.Collapse id="basic-navbar-nav">
				<Nav className="mr-auto" className="justify-content-end" style={{width: "88%"}}>
				<Nav.Link href="/">Početna</Nav.Link>
				<NavDropdown title="Tipovi događaja" id="basic-nav-dropdown">
					{this.eventTypes.map(eventType => 
						<NavDropdown.Item key={eventType.id} href={`/event_list/${eventType.id}`}>{eventType.eventTypeName}</NavDropdown.Item>
					)}
				</NavDropdown>
				{isValidated ? (
					<Nav.Link href="/control_panel">Kontrolna ploča</Nav.Link>
				) : (
					<li>
						
					</li>
				)}
				{isValidated ? (		
					<NavDropdown title={<span><i className="fa fa-user icon"></i></span>}>
						<NavDropdown.Item >{decoded.username}</NavDropdown.Item>
							<NavDropdown.Item href="" onClick={logOut}>Odjava</NavDropdown.Item>
						<NavDropdown.Item href="/login/register">Registracija</NavDropdown.Item>
					</NavDropdown>
				) : (
					<li>
						<NavDropdown title={<span><i className="fa fa-user icon"></i></span>}>
							  <NavDropdown.Item href="/login/login">Prijava</NavDropdown.Item>
							<NavDropdown.Item href="/login/register">Registracija</NavDropdown.Item>
						</NavDropdown>
					</li>
				)}
				</Nav>
			</Navbar.Collapse>
		</Navbar>
		);
	}
}
