import React, { Component } from "react";
import { login } from "../functions";
import Header from "../Header/Header";
import './Login.css';
import jwt_decode from "jwt-decode";

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
  

export default class Login extends Component {
	constructor() {
		super();
		this.state = {
			username: "",
			password: "",
			formErrors: {
                username: "",
                password: ""
            }
		};

		this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        let jwtToken = localStorage.usertoken;
        
        if (jwtToken) {
            setValidated();
            setAuthToken(jwtToken);
            //console.log(isValidated);
        }
	}

	onChange(e) {
        //this.setState({ [e.target.name]: e.target.value });
        e.preventDefault();
        const { name, value } = e.target;
        let formErrors = { ...this.state.formErrors };
    
        switch (name) {
          case "username":
              formErrors.username =
              value.length < 5 ? "Unesite barem 5 znakova" : "";
          break;  
          case "password":
            formErrors.password =
              value.length < 6 ? "Unesite barem 6 znakova!" : "";
            break;
          default:
            break;
        }
    
        this.setState({ formErrors, [name]: value });
	}

	onSubmit(e) {
        e.preventDefault();
        
        if (formValid(this.state)) {
            const user = {
                username: this.state.username,
                password: this.state.password
            };
    
            login(user).then(res => {
                if (res) {
                    let formErrors = { ...this.state.formErrors };
                    let error = Object.values(res);
                    if(error[0].usernameError){
                        formErrors.username = error[0].usernameError;
                    } else if (error[0].passwordError){
                        formErrors.password = error[0].passwordError;
                    } else {
                        localStorage.setItem("usertoken", error[0]);
                        //this.props.history.push("/");
                        window.location.reload()    
                    }
                    this.setState({formErrors: formErrors})
                  //  window.location.reload();
                }
            });
        } else {
            console.error("FORM INVALID - DISPLAY ERROR MESSAGE");
          }

		
	}

	goToRoute(e) {
		this.props.history.push(`/login/register`);
	}
    render() {
        const { formErrors } = this.state;
        return (
            <div className="loginBody">
            <Header/>  
                <div className="form">
                    <div className="form-wrapper">
                        <h1>Prijavite se!</h1>
                            <form method="POST" onSubmit={this.onSubmit}>
            
                                <div className="username">
                                    <label htmlFor="username">Korisničko ime</label>
                                    <input
                                        className={formErrors.username.length > 0 ? "error" : null}
                                        placeholder="Korisničko ime"
                                        type="text"
                                        name="username"
                                        onChange={this.onChange}
                                        required
                                    />
                                    {formErrors.username.length > 0 && (
                                        <span className="errorMessage">{formErrors.username}</span>
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
                                        required
                                    />
                                {formErrors.password.length > 0 && (
                                    <span className="errorMessage">{formErrors.password}</span>
                                )}
                                </div>
                                {decoded.username && (
                                <span className="errorMessage" style={{color: "white", fontSize: "30px", textAlign: "center"}}>Dobrodošli, {decoded.username}</span>
                                )}
            
                        <div className="createAccount">
                            <button type="submit">Prijavi se</button>
                            <button id="registerButton" onClick={e => this.goToRoute(e)}>Registracija</button>
                        </div>
                    </form>
                </div>
            </div>
         </div>
     );
    }  
}