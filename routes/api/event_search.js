const express = require("express");
var router = express.Router();
const EventModel = require("../../database/EventModel");

// filtriraj listu dogadaja prema imenu i tipu dogadaja
router.post("/event_list", (req, res) => {
    res.setHeader("content-type", "application/json");
    EventModel.searchEventsList(req.body.event).then(result => {
        res.send(result);
    }).catch(e => console.log(e));
});

// filtriraj listu dogadaja prema imenu
router.post("/event_control_panel", (req, res) => {
    res.setHeader("content-type", "application/json");
    EventModel.searchEvents(req.body.event).then(result => {
        res.send(result);
    }).catch(e => console.log(e));
});


module.exports = router;