var express = require("express");
var router = express.Router();
const User = require("../../database/User");

// dohvati korisnika prema korisnickom imenu
router.get("/:name", function(req, res, next) {
	res.setHeader("content-type", "application/json");
	User.findUserByUserName(req.params.name).
	then(user=> {
		res.send(user);
	});
});

// updateaj korisnika
router.post("/edit_user", function(req, res, next) {
	res.setHeader("content-type", "application/json");
    User.editUser(req.body.oldUser, req.body.newUser).
    then(user => {
        res.send(user);
    });
    
	
});

module.exports = router;