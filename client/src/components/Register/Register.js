import React, { Component } from 'react';
import './Register.css';
import { register } from "../functions";
import Header from "../Header/Header";

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


export default class Register extends Component {

    constructor(props){
        super(props);

        this.state = {
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
        this.onChange = this.onChange.bind(this);
	  	  this.onSubmit = this.onSubmit.bind(this);
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
        
        if (formValid(this.state)) {
            console.log(`
              --SUBMITTING--
              Username: ${this.state.username}
              First Name: ${this.state.name}
              Last Name: ${this.state.lastName}
              Email: ${this.state.email}
              Password: ${this.state.password}
            `);
            const user = {
                username: this.state.username,
                name: this.state.name,
                lastName: this.state.lastName,
                email: this.state.email,
                password: this.state.password
            };
            register(user).then(res => {
                if (res.error) {
                  let formErrors = { ...this.state.formErrors };
                    let error = Object.values(res);
                    formErrors.username = error[0].error;
                    this.setState({formErrors: formErrors});         
                } else {
                      // salji na home
                    //window.location.reload();
                    console.log("PUSH");
                    this.props.history.push("/login/login");
                }
            });
          } else {
            console.error("FORM INVALID - DISPLAY ERROR MESSAGE");
          }

		
	}

    render() {
        const { formErrors } = this.state;
        return (
          <div className="main">
            <div>
              <Header />
            </div>
            <div className="form-register">
              <div className="form-wrapper">
                  <h1>Registrirajte se!</h1>
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

                      <div className="name">
                          <label htmlFor="name">Ime</label>
                          <input
                              className={formErrors.name.length > 0 ? "error" : null}
                              placeholder="Ime"
                              type="text"
                              name="name"
                              onChange={this.onChange}
                              required
                          />
                          {formErrors.name.length > 0 && (
                              <span className="errorMessage">{formErrors.name}</span>
                          )}
                      </div>

                      <div className="lastName">
                          <label htmlFor="lastName">Prezime</label>
                          <input
                              className={formErrors.lastName.length > 0 ? "error" : null}
                              placeholder="Prezime"
                              type="text"
                              name="lastName"
                              onChange={this.onChange}
                              required
                          />
                          {formErrors.lastName.length > 0 && (
                              <span className="errorMessage">{formErrors.lastName}</span>
                          )}
                      </div>

                      <div className="email">
                          <label htmlFor="email">E-mail</label>
                          <input
                              className={formErrors.email.length > 0 ? "error" : null}
                              placeholder="E-mail"
                              type="text"
                              name="email"
                              onChange={this.onChange}
                              required
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
                              required
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
                              required
                          />
                          {formErrors.repeatPassword.length > 0 && (
                              <span className="errorMessage">{formErrors.repeatPassword}</span>
                          )}
                      </div>
      
                    <div className="createAccount">
                      <button type="submit">Registriraj se</button>
                    </div>

                  </form>
              </div>
          </div>
    </div>);
    }
}