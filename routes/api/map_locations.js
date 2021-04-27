var express = require("express");
var router = express.Router();
const EventModel = require("../../database/EventModel");

// dohvati sve dogadaje za kartu
router.get("/", function(req, res, next) {
	res.setHeader("content-type", "application/json");
	EventModel.findAllEvents().
	then(events => {
		res.send(events);
	});
});

module.exports = router;