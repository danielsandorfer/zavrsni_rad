const express = require("express");
var router = express.Router();
const EventModel = require("../../database/EventModel");
const Comment = require("../../database/Comment");
const Image = require("../../database/Image");
const Score = require("../../database/Score");

// dohvati dogadaj prema sifri
router.get("/:id", (req, res) => {
    res.setHeader("content-type", "application/json");
    EventModel.findEventById(req.params.id).then(result => {
        res.send(result);
    }).catch(e => console.log(e));
});

// dohvati sve komentare za pojedini dogadaj
router.get("/comments/:id", (req, res) => {
    res.setHeader("content-type", "application/json");
    Comment.getAllCommentsByEventId(req.params.id).then(result => {
        res.send(result);
    }).catch(e => console.log(e));
});

// dohvati sve slike za pojedini dogadaj
router.get("/images/:id", (req, res) => {
    res.setHeader("content-type", "application/json");
    Image.getAllImagesByEventId(req.params.id).then(result => {
        res.send(result);
    }).catch(e => console.log(e));
});

// dodaj komentar
router.post("/comments/add_comment", (req, res) => {
    res.setHeader("content-type", "application/json");
    Comment.findOrCreateComment(req.body.comment).then(result => {
        res.send(result);
    }).catch(e => console.log(e));
});

// obrisi komentar
router.post("/comments/delete_comment", (req, res) => {
    res.setHeader("content-type", "application/json");
    Comment.deleteComment(req.body.comment).then(result => {
        res.send(result);
    }).catch(e => console.log(e));
});

// dodaj sliku
router.post("/images/add_image", (req, res) => {
    res.setHeader("content-type", "application/json");
    Image.findOrCreateImage(req.body.image).then(result => {
        res.send(result);
    }).catch(e => console.log(e));
});

// dohvati prosjecnu ocjenu dogadaja
router.get("/scores/average/:id", (req, res) => {
    res.setHeader("content-type", "application/json");
    Score.getAverageScoreForEvent(req.params.id).then(result => {
        res.send(result);
    }).catch(e => console.log(e));
});

// dodaj ocjenu dogadaja
router.post("/scores/add_score", (req, res) => {
    res.setHeader("content-type", "application/json");
    Score.findOrCreateScore(req.body.score).then(result => {
        res.send(result);
    }).catch(e => console.log(e));
});

// dohvati ocjenu korisnika za dogadaj
router.post("/scores/user_score", (req, res) => {
    res.setHeader("content-type", "application/json");
    Score.findUserScoreForEvent(req.body.score).then(result => {
        res.send(result);
    }).catch(e => console.log(e));
});


module.exports = router;