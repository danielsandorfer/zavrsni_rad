const express = require("express");
var router = express.Router();
const EventModel = require("../../database/EventModel");
const Image = require("../../database/Image");

// dohvati dogadaje prema tipu dogadaja
router.get("/:id", (req, res) => {
    res.setHeader("content-type", "application/json");
    EventModel.findEventsByTypeId(req.params.id).then(result => {
        res.send(result);
    }).catch(e => console.log(e));
});

// dohvati sliku dogadaja za listu dogadaja
router.get("/event_image/:id", (req, res) => {
    res.setHeader("content-type", "application/json");
    Image.getOneImageByEventId(req.params.id).then(result => {
        res.send(result);
    }).catch(e => console.log(e));
});

// dohvati filtrirane dogadaje prema vremenskom razdoblju
router.post("/filter_events", (req, res) => {
    res.setHeader("content-type", "application/json");
    EventModel.findFilteredEvents(req.body.startDate, req.body.endDate, req.body.eventTypeId).then(result => {
        res.send(result);
    }).catch(e => console.log(e));
});
// dohvati filtrirane dogadaje prema lokaciji
router.post("/filter_events_locations", (req, res) => {
    res.setHeader("content-type", "application/json");
    EventModel.findFilteredEventLocations(req.body.startDate, req.body.endDate).then(result => {
        res.send(result);
    }).catch(e => console.log(e));
})
module.exports = router;