import React, { Component } from 'react';
import Header from "../Header/Header";
import "./EventPage.css";
import jwt_decode from "jwt-decode";
import S3FileUpload from 'react-s3';
import 'bootstrap/dist/css/bootstrap.min.css';
import StarRatings from 'react-star-ratings';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import ImageGallery from 'react-image-gallery';
import "../../../node_modules/react-image-gallery/styles/css/image-gallery.css";

const config = {
    //bucketName: ,//process.env.REACT_APP_BUCKET_NAME,
    //dirName: 'events', /* optional */
   // region: 'eu-west-2',//process.env.REACT_APP_BUCKET_REGION,
  //  accessKeyId: ,//process.env.REACT_APP_S3_KEY,
   // secretAccessKey: ,//process.env.REACT_APP_S3_SECRET,
   // endpoint: "https://s3.amazonaws.com"
}

var isValidated = false;
var decoded = [];

function setValidated() {
    isValidated = true;
}
function setAuthToken(jwtToken) {
    decoded = jwt_decode(jwtToken);
}


export default class EventPage extends Component {
 
    constructor(props){
        super(props);
        this.state = {
            eventData: {},
            addedFile: null
        };
        this.comments = [];
        this.images = [];
        this.addedComment = {};
        this.averageGrade = null;
        this.rating = null;
        this.previousRating = null;

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.deleteComment= this.deleteComment.bind(this);
        this.addImage = this.addImage.bind(this);
        this.handleFile = this.handleFile.bind(this);
        this.changeRating = this.changeRating.bind(this);

        let jwtToken = localStorage.usertoken;

        if (jwtToken) {
            setValidated();
            setAuthToken(jwtToken);
        }
    }

    // promjena ocjene
    changeRating( newRating, name ) {
      this.setState({
        rating: newRating
      });

      axios.post("/api/event/scores/add_score", {
        score: {
          eventId: this.state.eventData.id,
          username: decoded.username,
          grade: newRating
        }
      }).then(res =>{
        console.log(res);
        window.location.reload();
      })
    }

    // promjena komentara
    onChange(e) {
        e.preventDefault();
        const {value} = e.target;
        const comment = {
            eventId: this.props.match.params.id,
            username: decoded.username,
            commentText: value
        }
        this.setState({
            addedComment: comment
        })
    }

    // dodavanje komentara
    onSubmit(e) {
        e.preventDefault();
        const comment = this.state.addedComment;

         axios.post("/api/event/comments/add_comment", {
            comment
         }).then(res => {
           const data = Object.values(res.data);

           let date = data[0].split("T")[0];
           date = (date.split("-")[2] + "." + date.split("-")[1] + "." + date.split("-")[0]);
           var utcDate = data[0];  // ISO-8601 formatted date returned from server
           var localDate = new Date(utcDate);
           var time = localDate.toString().split(" ")[4];

           const comment = {
            id: data[1],
            username: data[2],
            dateTime: data[0],
            commentText: data[3],
            displayDate: date + "-" + time
            } 
          
            let comments = this.comments;
            comments.unshift(comment);
            this.setState({
              comments
            });
         })
    }



    async componentDidMount() {

      // dohvati prosjecnu ocjenu dogadaja
     await axios.get(`/api/event/scores/average/${this.props.match.params.id}`)
      .then(res => {
        const grade = Object.values(res.data);
        var averageGrade;
        if(grade[0]) {
          averageGrade = grade[0].totalgrade;
        } else {
          averageGrade = 0;
        }     
        this.setState({
          averageGrade: (Math.round(averageGrade * 100) / 100)
        });
      });

      // dohvati podatke o dogadaju
     await axios.get(`/api/event/${this.props.match.params.id}`)
      .then(res => {   
          const event = Object.values(res.data[0]);

          var eventObject = {
            id: event[0],
            description: event[5],
            startDate: (event[6].split("-")[2] + "." + event[6].split("-")[1] + "." + event[6].split("-")[0]),
            endDate: (event[7].split("-")[2] + "." + event[7].split("-")[1] + "." + event[7].split("-")[0]),
            eventName: event[9],
            eventType: event[11],
            eventCountry: event[24],
            eventCity: event[21],
            eventAddress: event[17],
            eventPostalCode: event[18],
            eventGeoWidth: event[14],
            eventGeoLength: event[15]
            }
          this.setState({
            eventData: eventObject
          });          
        });

      // ako je korisnik ulogiran, dohvati njegovu ocjenu dogadaja 
      if(decoded.username) {
        await axios.post("/api/event/scores/user_score", {
            score: {
              eventId: this.props.match.params.id,
              username: decoded.username
            }       
          }
        ).then(res => {
            var ocjena;
            if(res.data[0]) {
              ocjena = res.data[0].ocjena;
            } else {
              ocjena = 0;
            }
            this.setState({
              rating: ocjena
            });
        });
      }
    
      // dohvati komentare dogadaja
      await  axios.get(`/api/event/comments/${this.props.match.params.id}`)
        .then(res => {   
            const event = Object.values(res.data);
            event.forEach(element => {
            element = Object.values(element);

            let date = element[2].split("T")[0];
            date = (date.split("-")[2] + "." + date.split("-")[1] + "." + date.split("-")[0]);
            var utcDate = element[2];  // ISO-8601 formatted date returned from server
            var localDate = new Date(utcDate);
            var time = localDate.toString().split(" ")[4];
              
               const comment = {
                   id: element[0],
                   username: element[1],
                   dateTime: element[2],
                   commentText: element[3],
                   displayDate: date + "-" + time
               } 
              
               let comments = this.comments;
               comments.push(comment);
               this.setState({
                 comments
               });
            });
        });

      // dohvati slike
      await  axios.get(`/api/event/images/${this.props.match.params.id}`)
        .then(res => {   
            const images = Object.values(res.data);
            images.forEach(element => {
            element = Object.values(element);
            const image = {
              original: "https://eventappfer.s3.eu-west-2.amazonaws.com/" + element[3],
              thumbnail: "https://eventappfer.s3.eu-west-2.amazonaws.com/" + element[3]
            }
            let images = this.images;
            images.push(image);
            this.setState({
              image
            });
        });
      });

       
 
    }
    
    // obrisi komentar
      deleteComment(id, username, dateTime) {
           axios({
            method: 'post',
            url: '/api/event/comments/delete_comment',
            headers: {'Accept': 'application/json',
            'Content-Type': 'application/json',}, 
            data: {
              comment: {
                eventId: id,
                username: username,
                dateTime: dateTime 
              }
            }
          }).then(res => {
            console.log(res);
          });
      }


      addImage(e) {
        e.preventDefault();
        if(this.state.addedFile) {
            // uploadaj sliku na S3 posluzitelj
            S3FileUpload
            .uploadFile(this.state.addedFile[0], config)
            .then(data => {
                 // dodaj sliku u bazu
                 axios.post("/api/event/images/add_image", {
                   image: {
                    eventId: this.state.eventData.id,
                    username: decoded.username,
                    eventImagePath: data.key
                   }
                 }).then(res => {
                   console.log(res);
                   window.location.reload();
                 })
            });
        }
      }

      // dodan file (slika)
      handleFile = (event) => {
        let file = event.target.files;
        this.setState({addedFile: file});
      }
       
      
        render() {
            return (
            <div className="eventPage">
                <div>
                <Header />
                </div>

                <div className="info">
                    <h1 className="nazivDog">{this.state.eventData.eventName}</h1>
                    <h2>
                    <div  dangerouslySetInnerHTML={{__html: this.state.eventData.description}}>
                    </div>              
                    </h2>
                    
                    <h4> </h4>
                    <h2 className="centerData">{this.state.eventData.eventAddress}</h2>
                    <h2 className="centerData">{this.state.eventData.eventCountry}, {this.state.eventData.eventCity}, {this.state.eventData.eventPostalCode}</h2>
                    <h2 className="centerData">{this.state.eventData.startDate} - {this.state.eventData.endDate}</h2>
                </div>
                <div className="slike">
                  <div className="carousel">
                      <ImageGallery showPlayButton={this.images.length > 1 ? true: false} showFullscreenButton={this.images.length > 0 ? true: false} items={this.images} />
                  </div>

                  <div className="addImages">
                    {decoded.username && (
                      <form method="POST" onSubmit={this.addImage}>
                        <div className="image-input">
                          <input 
                              type='file'
                              placeholder="Dodajte sliku"
                              name="file_upload"
                              onChange={(e) => this.handleFile(e)}
                              />
                        </div>
                        <div className="image-input-button">
                          <span><Button className="imageButton"variant="secondary" type="submit">Dodaj sliku</Button></span>
                        </div>
                      </form>
                    )}        
                  </div>
                </div>

                 <div className="container-event">  
                      <div className="ocjene">
                            {decoded.username && (
                              <div className="ocjenaKorisnika">
                                <h4>Vaša ocjena</h4>
                                <StarRatings
                                rating={this.state.rating}
                                starRatedColor="gold"
                                changeRating={this.changeRating}
                                numberOfStars={5}
                                name='rating'
                                />
                              </div>
                            )}
                            <div className="ocjenaDogadaja">
                              <h4>Ocjena događaja</h4>
                                <StarRatings
                                  rating={this.state.averageGrade}
                                  starDimension="40px"
                                  starSpacing="15px"
                                />
                            </div>
                        </div>  


                    <div className="komentari">
                       <div className="komentari-box">
                          {this.comments.length == 0 && (
                            <div className="komentariInfo">
                            <h2 style={{padding:"5px"}}>Nema komentara</h2> 
                            </div>    
                          )}
                            {this.comments.map(comment => 
                                <div key={comment.dateTime} className="komentariInfo">
                                    <h3 style={{padding: "2px"}}>{comment.commentText}</h3>     
                                    <span style={{padding: "5px"}}>{comment.username} ({comment.displayDate})</span>
                                    {comment.username == decoded.username && (
                                    
                                  <Button style={{marginRight: "5px"}} className="deleteComButton" variant="outline-dark" href={`${this.state.eventData.id}`} onClick={() => this.deleteComment(comment.id, comment.username, comment.dateTime)}>Obriši</Button>
                                  )}
                                  <hr></hr>
                                </div>
                            )}
                        </div>
                        <div className="addComment">
                          {decoded.username && (
                            <form method="POST" onSubmit={this.onSubmit}>
                            <div className="commentText">
                                <textarea
                                    rows="2"
                                    cols="40"
                                    style={{textAlign: "center"}}
                                    className="comment"
                                    placeholder="Novi komentar"
                                    type="text"
                                    name="comment"
                                    onChange={this.onChange}
                                />   
                            </div>
                            <div className="commentButtonAdd">
                              <span><Button className="commentButton"variant="secondary" type="submit">Dodaj komentar</Button></span>
                            </div>
                          </form>
                          )}         
                        </div>
                      </div>   
                  </div>

            </div>);
        }
        
}