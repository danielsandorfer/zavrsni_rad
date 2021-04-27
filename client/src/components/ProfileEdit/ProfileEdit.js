import React, { Component } from 'react';
import { register } from "../functions";
import Header from "../Header/Header";
import axios from 'axios';
import jwt_decode from "jwt-decode";
import jwt from "jsonwebtoken";

const emailRegex = RegExp(
    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  );

  const formValid = ({ formErrors, ...rest }) => {
    let valid = true;
  
    // validate form errors being empty
    Object.values(formErrors).forEach(val => {
      val.length > 0 && (valid = false);
    });
  
    // validate the form was filled out
    Object.values(rest).forEach(val => {
      val === null && (valid = false);
    });


  
    return valid;
  };

  var isValidated = false;
  var decoded = [];
  
  function setValidated() {
      isValidated = true;
  }
  function setAuthToken(jwtToken) {
      decoded = jwt_decode(jwtToken);
  }

export default class ProfileEdit extends Component {

    constructor(props){
        super(props);

        this.state = {
            user: {},
            username: "",
            name: "",
            lastName: "",
            email: "",
            password: "",
            repeatPassword: "",
            formErrors: {
                username: "",
                name: "",
                lastName: "",
                email: "",
                password: "",
                repeatPassword: ""
            }
        }
        
        let jwtToken = localStorage.usertoken;
        
        if (jwtToken) {
            setValidated();
            setAuthToken(jwtToken);
            //console.log(isValidated);
        }
        this.onChange = this.onChange.bind(this);
	  	this.onSubmit = this.onSubmit.bind(this);
    }


    componentDidMount() {
        if(!isValidated) {
            this.props.history.push("/");
        } else {
            axios.get(`/api/users/${this.props.match.params.name}`)
            .then(res => {
                const data = Object.values(res.data);
                const user = {
                    username: data[0],
                    name: data[2],
                    lastName: data[3],
                    email: data[4],
                    password: data[5]
                }
                 this.setState({user: user});
            })
        }
     
    }
    onChange(e) {
        e.preventDefault();
        const { name, value } = e.target;
        let formErrors = { ...this.state.formErrors };
    
        switch (name) {
          case "username":
              formErrors.username =
              value.length < 5 ? "Unesite barem 5 znakova" : "";
          break;  
          case "name":
            formErrors.name =
              value.length < 2 ? "Unesite barem 2 znaka!" : "";
            break;
          case "lastName":
            formErrors.lastName =
              value.length < 3 ? "Unesite barem 3 znaka!" : "";
            break;
          case "email":
            formErrors.email = emailRegex.test(value)
              ? ""
              : "Neispravan format e-mail adrese!";
            break;
          case "password":
            formErrors.password =
              value.length < 6 ? "Unesite barem 6 znakova!" : "";
            break;
          case "repeatPassword":
            formErrors.repeatPassword =
              this.state.password != value ? "Neispravna lozinka!" : "";
              break;
          default:
            break;
        }
    
        this.setState({ formErrors, [name]: value });
	}

	onSubmit(e) {
        e.preventDefault();
        
        if((this.state.password && !this.state.repeatPassword)
             || (!this.state.password && this.state.repeatPassword)){
            let formErrors =  { ...this.state.formErrors };
            formErrors.repeatPassword = "Unesite orginalnu i ponovljenu lozinku";
            this.setState({formErrors
            }, console.log(JSON.stringify(this.state.formErrors)))
        } else {
            const newUser = {
                username: this.state.username,
                name: this.state.name,
                lastName: this.state.lastName,
                email: this.state.email,
                password: this.state.password
            };
            const oldUser = this.state.user;
            fetch('/api/users/edit_user', {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                   oldUser,
                   newUser
                })
              })
              .then(() => {
                   // decoded.username = newUser.username;
                    axios.get(`/api/users/${this.props.match.params.name}`)
                    .then(res => {
                        console.log(res.data)
                        const data = Object.values(res.data);
                        console.log(data);
                        const user = {
                            username: data[0],
                            name: data[2],
                            lastName: data[3],
                            email: data[4],
                            password: data[5]
                        }
                        const userData = {
                            username: newUser.username,
                            password: data[5]
                        }
                        
                        let token = jwt.sign(userData, "SECRET_KEY", {
                            expiresIn: 1440
                        });
                        localStorage.setItem("usertoken", token);
                        setValidated();
                        setAuthToken(token);
                         this.setState({user: user}, window.location.reload());
                    })
                    
                })
                  
                  
             
        }
       
           
    

		
	}

    render() {
        const { formErrors } = this.state;
        return (
          <div>
            <Header />
         
        <div className="">
        <div className="form-wrapper">
            <h1>Uredite svoje podatke</h1>
                <form method="POST" onSubmit={this.onSubmit}>

                <div className="username">
                    <label htmlFor="username">Korisničko ime</label>
                    <input
                        className={formErrors.username.length > 0 ? "error" : null}
                        placeholder={this.state.user.username}
                        type="text"
                        name="username"
                        onChange={this.onChange}
                    />
                     {formErrors.username.length > 0 && (
                        <span className="errorMessage">{formErrors.username}</span>
                     )}
                </div>

                <div className="name">
                    <label htmlFor="name">Ime</label>
                    <input
                        className={formErrors.name.length > 0 ? "error" : null}
                        placeholder={this.state.user.name}
                        type="text"
                        name="name"
                        onChange={this.onChange}
                    />
                     {formErrors.name.length > 0 && (
                        <span className="errorMessage">{formErrors.name}</span>
                    )}
                </div>

                <div className="lastName">
                    <label htmlFor="lastName">Prezime</label>
                    <input
                        className={formErrors.lastName.length > 0 ? "error" : null}
                        placeholder={this.state.user.lastName}
                        type="text"
                        name="lastName"
                        onChange={this.onChange}
                    />
                     {formErrors.lastName.length > 0 && (
                         <span className="errorMessage">{formErrors.lastName}</span>
                    )}
                </div>

                <div className="email">
                    <label htmlFor="email">E-mail</label>
                    <input
                        className={formErrors.email.length > 0 ? "error" : null}
                        placeholder={this.state.user.email}
                        type="text"
                        name="email"
                        onChange={this.onChange}
                    />
                     {formErrors.email.length > 0 && (
                        <span className="errorMessage">{formErrors.email}</span>
                    )}
                </div>

                <div className="password">
                    <label htmlFor="password">Lozinka</label>
                    <input
                        className={formErrors.password.length > 0 ? "error" : null}
                        placeholder="Lozinka"
                        type="password"
                        name="password"
                        onChange={this.onChange}
                    />
                    {formErrors.password.length > 0 && (
                        <span className="errorMessage">{formErrors.password}</span>
                    )}
                </div>
                <div className="password">
                    <label htmlFor="password">Lozinka</label>
                    <input
                        className={formErrors.repeatPassword.length > 0 ? "error" : null}
                        placeholder="Ponovno unesite lozinku"
                        type="password"
                        name="repeatPassword"
                        onChange={this.onChange}
                    />
                    {formErrors.repeatPassword.length > 0 && (
                        <span className="errorMessage">{formErrors.repeatPassword}</span>
                    )}
                </div>
 
            <div className="createAccount">
              <button type="submit">Uredi</button>
            </div>

            </form>
        </div>
    </div>
    </div>);
    }
}