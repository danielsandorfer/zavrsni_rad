const express = require("express");
var router = express.Router();
const EventModel = require("../../database/EventModel");
const User = require("../../database/User");
const EventType = require("../../database/EventType");
const Image = require("../../database/Image");
const Comment = require("../../database/Comment");
const Country = require("../../database/Country");
const Address = require("../../database/Address");
const Place = require("../../database/Place");

// provjeri je li korisnik admin
router.get("/check_admin/:username",  function(req, res, next) {
	res.setHeader("content-type", "application/json");
	User.isAdmin(req.params.username).then(result => {
		const isAdmin = result;
		if(isAdmin) {
			const status = true;
			res.send(status);
		} else {
			const status = false;
			res.send(status);
		}
		
	});
});

// TIP DOGADAJA

// dohvati sve tipove dogadaja
router.get("/event_types", (req, res) => {
    res.setHeader("content-type", "application/json");
    EventType.findAllEventTypes(req.params.id).then(result => {
        res.send(result);
    }).catch(e => console.log(e));
});

// dohvati tip dogadaja prema sifri dogadaja
router.get("/event_type/:id", (req, res) => {
	res.setHeader("content-type", "application/json");
	EventType.findEventTypeById(req.params.id).then(result => {
		res.send(result);
	}).catch(e => console.log(e));
});

// stvori tip dogadaja
router.post("/add_event_type", function(req, res, next) {
	res.setHeader("content-type", "application/json");
	EventType.findOrCreateEventType(req.body.eventType).then(result => {
		if(result){
			res.send(result);
		} else {
			res.send({error: "No return"});
		}
	
	}).catch(e => console.log(e));
});

// updateaj tip dogadaja
router.post("/update_event_type", function(req, res, next) {
	res.setHeader("content-type", "application/json");
	EventType.updateEventType(req.body.eventType).then(result => {
		if(result){
			res.send(result);
		} else {
			res.send({error: "No return"});
		}
	
	}).catch(e => console.log(e));
});

// obrisi tip dogadaja
router.post("/delete_event_type", function(req, res, next) {
	res.setHeader("content-type", "application/json");
	EventType.deleteEventType(req.body).then(result => {
		return result;
	}).catch(e => console.log(e));
});


// DOGADAJ

// dohvati dogadaj prema sifri
router.get("/edit_event/:id", (req, res) => {
    res.setHeader("content-type", "application/json");
    EventModel.findEventById(req.params.id).then(result => {
        res.send(result);
    }).catch(e => console.log(e));
});

// stvori dogadaj
router.post("/add_event", function(req, res, next) {
	res.setHeader("content-type", "application/json");
	EventModel.findOrCreateEvent(req.body.newEvent).then(result => {
		if(result){
			res.send(result);
		} else {
			res.send({error: "No return"});
		}
	
	}).catch(e => console.log(e));
});

// obrisi dogadaj
router.post("/delete_event", function(req, res, next) {
	res.setHeader("content-type", "application/json");
	EventModel.deleteEvent(req.body).then(result => {
		return result;
	}).catch(e => console.log(e));
});

// updateaj dogadaj
router.post("/update_event", function(req, res, next) {
	res.setHeader("content-type", "application/json");
	EventModel.updateEvent(req.body.oldEvent, req.body.event).then(result => {
		if(result){
			res.send(result);
		} else {
			res.send({error: "No return"});
		}
	
	}).catch(e => console.log(e));
});


// SLIKA

// dohvati sve slike (admin) / slike pojedinog korisnika
router.post("/images", (req, res) => {
	res.setHeader("content-type", "application/json");
	User.isOwner(req.body.username).then(result => {
		const isAdmin = result;
		if(isAdmin){
			Image.getAllImages().then(result => {
				res.send(result);
			}).catch(e => console.log(e));
		} else {
			Image.getAllImagesByUser(req.body.username).then(result => {
				res.send(result);
			}).catch(e => console.log(e));
		}

	});	
});

// obrisi sliku
router.post("/images/delete_image", (req, res) => {
	res.setHeader("content-type", "application/json");
	Image.deleteImage(req.body.id).then(result => {
		return result;
	}).catch(e => console.log(e));
});


// KOMENTAR

// dohvati sve komentare (admin) / komentare pojedinog korisnika
router.post("/comments", (req, res) => {
	res.setHeader("content-type", "application/json");
	User.isOwner(req.body.username).then(result => {
		const isAdmin = result;
		if(isAdmin){
			Comment.getAllComments().then(result => {
				res.send(result);
			}).catch(e => console.log(e));
		} else {
			Comment.getAllCommentsByUser(req.body.username).then(result => {
				res.send(result);
			}).catch(e => console.log(e));
		}

	});	
});

// obrisi komentar
router.post("/comments/delete_comment", (req, res) => {
	res.setHeader("content-type", "application/json");
	Comment.deleteComment(req.body).then(result => {
		return result;
	}).catch(e => console.log(e));
});


// DRZAVA

// dohvati drzavu prema sifri
router.get("/country/:id", (req, res) => {
	res.setHeader("content-type", "application/json");
	Country.findCountryById(req.params.id).then(result => {
		res.send(result);
	}).catch(e => console.log(e));
});

// dohvati sve drzave
router.get("/countries", (req, res) => {
    res.setHeader("content-type", "application/json");
    Country.findAllCountries().then(result => {
        res.send(result);
    }).catch(e => console.log(e));
});

// dodaj drzavu
router.post("/add_event_country", (req, res) => {
	res.setHeader("content-type", "application/json");
	Country.findOrCreateCountry(req.body.country).then(result => {
		if(result){
			res.send(result);
		} else {
			res.send({error: "No return"});
		}
	});
});

// obrisi drzavu
router.post("/delete_event_country" , (req, res) => {
	res.setHeader("content-type", "application/json");
	Country.deleteCountry(req.body).then(result => {
		return result;
	});
});

// updateaj drzavu
router.post("/update_event_country", (req, res) => {
	res.setHeader("content-type", "application/json");
	Country.updateCountry(req.body.oldEvent, req.body.event).then(result => {
		if(result){
			res.send(result);
		} else {
			res.send({error: "No return"});
		}
	
	}).catch(e => console.log(e));
});


// ADRESA

// dohvati adresu prema sifri
router.get("/address/:id", (req, res) => {
	res.setHeader("content-type", "application/json");
	Address.findAddressById(req.params.id).then(result => {
		res.send(result);
	}).catch(e => console.log(e));
});


// dohvati sve adrese
router.get("/addresses", (req, res) => {
    res.setHeader("content-type", "application/json");
    Address.findAllAddresses().then(result => {
        res.send(result);
    }).catch(e => console.log(e));
});

// dodaj adresu
router.post("/add_event_address", (req, res) => {
	res.setHeader("content-type", "application/json");
	Address.findOrCreateAddress(req.body.address).then(result => {
		if(result){
			res.send(result);
		} else {
			res.send({error: "No return"});
		}
	});
});


// obrisi adresu
router.post("/delete_event_address" , (req, res) => {
	res.setHeader("content-type", "application/json");
	Address.deleteAddress(req.body).then(result => {
		return result;
	}).catch(e => console.log(e));
});

// updateaj adresu
router.post("/update_event_address", (req, res) => {
	res.setHeader("content-type", "application/json");
	Address.updateAddress(req.body.oldEvent, req.body.event).then(result => {
		if(result){
			res.send(result);
		} else {
			res.send({error: "No return"});
		}
	
	}).catch(e => console.log(e));
});

// MJESTO

// dohvati mjesto prema sifri
router.get("/place/:id", (req, res) => {
	res.setHeader("content-type", "application/json");
	Place.findPlaceById(req.params.id).then(result => {
		res.send(result);
	}).catch(e => console.log(e));
});

// dohvati sva mjesta
router.get("/places", (req, res) => {
    res.setHeader("content-type", "application/json");
    Place.findAllPlaces().then(result => {
        res.send(result);
    }).catch(e => console.log(e));
});

// dodaj mjesto
router.post("/add_event_place", (req, res) => {
	res.setHeader("content-type", "application/json");
	Place.findOrCreatePlace(req.body.place).then(result => {
		if(result){
			res.send(result);
		} else {
			res.send({error: "No return"});
		}
	});
});

// obrisi mjesto
router.post("/delete_event_place" , (req, res) => {
	res.setHeader("content-type", "application/json");
	Place.deletePlace(req.body).then(result => {
		return result;
	}).catch(e => console.log(e));
});

// updateaj mjesto
router.post("/update_event_place", (req, res) => {
	res.setHeader("content-type", "application/json");
	Place.updatePlace(req.body.oldEvent, req.body.event).then(result => {
		if(result){
			res.send(result);
		} else {
			res.send({error: "No return"});
		}
	
	}).catch(e => console.log(e));
});


// PRETRAZIVANJE

// pretraži slike po imenu dogadaja
router.post("/image_search", (req, res) => {
    res.setHeader("content-type", "application/json");
    Image.searchImages(req.body.event).then(result => {
        res.send(result);
    }).catch(e => console.log(e));
});

// pretraži adrese prema nazivu
router.post("/address_search", (req, res) => {
    res.setHeader("content-type", "application/json");
    Address.searchAddresses(req.body.event).then(result => {
        res.send(result);
    }).catch(e => console.log(e));
});

// pretraži mjesta prema nazivu
router.post("/place_search", (req, res) => {
    res.setHeader("content-type", "application/json");
    Place.searchPlaces(req.body.event).then(result => {
        res.send(result);
    }).catch(e => console.log(e));
});

// pretraži države prema nazivu
router.post("/country_search", (req, res) => {
    res.setHeader("content-type", "application/json");
    Country.searchCountries(req.body.event).then(result => {
        res.send(result);
    }).catch(e => console.log(e));
});

// pretraži komentare prema nazivu događaja
router.post("/comment_search", (req, res) => {
    res.setHeader("content-type", "application/json");
    Comment.searchComments(req.body.event).then(result => {
        res.send(result);
    }).catch(e => console.log(e));
});

// pretraži tipove događaja prema nazivu
router.post("/event_type_search", (req, res) => {
    res.setHeader("content-type", "application/json");
    EventType.searchEventTypes(req.body.event).then(result => {
        res.send(result);
    }).catch(e => console.log(e));
});


module.exports = router;