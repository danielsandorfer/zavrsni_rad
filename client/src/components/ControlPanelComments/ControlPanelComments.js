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

export default class ControlPanelComments extends Component {
 
    constructor(props){
        super(props);
        this.comments = [];
        this.error = "";
        this.searchedEvent = null;
        
        let jwtToken = localStorage.usertoken;

        if (jwtToken) {
            setValidated();
            setAuthToken(jwtToken);
            //console.log(isValidated);
        }
        
        this.deleteComment = this.deleteComment.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
        this.onNameSearch = this.onNameSearch.bind(this);
    }

    onNameSearch(e) {
      e.preventDefault();
      axios.post("/api/control_panel/comment_search", {
              event: {
                  eventCommentName: this.state.searchedEvent
              }       
          }
        )
        .then(res => {
          const data = Object.values(res.data);

          this.comments = [];

          if(data.length == 0) {
            this.setState({
              comments: []
            })
          }
          data.forEach(row => {
            var comment = Object.values(row);
            var commentData = {
              eventId: comment[0],
              username: comment[1],
              dateTime: comment[2],
              commentText: comment[3],
              eventName: comment[12]
            }
            let comments = this.comments;
            comments.push(commentData);
            this.setState({
              comments: comments
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
            url: '/api/control_panel/comments',
            headers: {'Accept': 'application/json',
            'Content-Type': 'application/json',}, 
            data: {
              username: decoded.username 
            }
          }).then(res => {
              const data = Object.values(res.data);
              console.log(JSON.stringify(data))
              data.forEach(row => {
                var comment = Object.values(row);
                var commentData = {
                  eventId: comment[0],
                  username: comment[1],
                  dateTime: comment[2],
                  commentText: comment[3],
                  eventName: comment[12]
                }
                let comments = this.comments;
                comments.push(commentData);
                this.setState({
                  comments: comments
                });
  
              });
          })
        }
      }

    deleteComment(id, username, dateTime) {
        const comment = {
          eventId: id,
          username: username,
          dateTime: dateTime
        }
      axios.post("/api/event/comments/delete_comment", {
          comment
        }).then(res => {
          console.log(res);
        });
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
                      {this.comments.length > 0 && (
                        <div className="tab-images">
                          <Table striped bordered hover variant="dark" style={{width: "100%"}}>
                              <thead>
                                <tr>
                                  <th>Komentar</th>
                                  <th></th>
                                  <th>
                                    <form  method="POST" onSubmit={this.onNameSearch}>
                                      <input 
                                        style={{textAlign: "center", marginLeft: "90px", height:"40px"}}
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
                                  {this.comments.map(comment => 
                                    <tr key={comment.dateTime}>
                                      <td>{comment.eventId}</td>
                                      <td>{comment.username}</td>
                                      <td>{comment.eventName}</td>
                                      <td>{comment.commentText}</td>
                                      <td>
                                          <Button className="commentButton" variant="secondary"  href="/control_panel/comments" onClick={() => this.deleteComment(comment.eventId, comment.username, comment.dateTime)}>Obriši</Button>
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                            </Table>
                         </div>
                      )}

                      {this.comments.length == 0 && (
                         <Table striped bordered hover variant="dark" style={{width: "100%"}}>
                            <thead>
                                <tr>
                                  <th>Komentar</th>
                                  <th></th>
                                  <th>
                                    <form  method="POST" onSubmit={this.onNameSearch}>
                                      <input 
                                        style={{textAlign: "center", marginLeft: "90px", height:"40px"}}
                                        placeholder="Naziv događaja"
                                        name="name"
                                        onChange={this.onNameChange}
                                      />
                                    </form>
                                  </th>
                                
                                </tr>
                              </thead>
                            <tbody>
                              
                                <tr>
                                  <th colSpan="3">Trenutno nema komentara</th>
                                </tr>
                              
                              
                            </tbody>
                       </Table>
                      )}

                    </div>
                </div>
            </div>);
        }
        
}