const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
var router = express.Router();
const User = require('../../database/User');

process.env.SECRET_KEY = "eventsapp";

// registriraj korisnika
router.post("/register", (req, res) => {

	const userData = {
        username: req.body.username,
        name: req.body.name,
        lastName: req.body.lastName,
        email: req.body.email,
		password: req.body.password
	};

	const user = User.findUserByUserName(req.body.username); 
	user.then(function(result) {
		// korisnik ne postoji
		if (!result) {
			bcrypt.hash(req.body.password, 10, (err, hash) => {
				userData.password = hash;
				const focPromise = User.findOrCreateUser(userData);
				focPromise.then(resp => {
					var created = resp[1];
					if(!created) {
						res.send({error: "Korisničko ime već postoji!"});
					} else {
						console.log("Kreiran korisnik");
						res.send({okstatus: 'ok'});
					}
				}).catch(e => console.log(e));
			});
		// korisnik vec postoji
		} else {
			res.json({ error: "Korisničko ime već postoji" });
		}
	});
});

// ulogiraj korisnika
router.post("/login", (req, res) => {
	const user = User.findUserByUserName(req.body.username);
	user.then(function(result) {	
		if(result){
			var array = Object.values(result);
			const userData = {
				username: array[0],
				password: array[5]
			};
			if (bcrypt.compareSync(req.body.password, userData.password)) {
				let token = jwt.sign(userData, process.env.SECRET_KEY, {
					expiresIn: 1440
				});
				res.send(token);
			} else {
				res.json({ passwordError: 'Kriva lozinka!'});
				//res.send();
			}
		} else {
			res.json({usernameError: 'Korisničko ime ne postoji!'});
		}
		
	});
});


module.exports = router;