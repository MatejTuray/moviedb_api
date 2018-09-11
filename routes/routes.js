const express = require("express");
const app = express();
const { mongoose } = require("../db/mongoose");
const { Movie } = require("../db/models/Movie");
const { ObjectId } = require("mongodb");
const { User } = require("../db/models/User");
const { auth } = require("./auth");
const _ = require("lodash");

module.exports = (app) => {
    // POST
    app.post("/movies/", auth, (req, res) => {
        let newMovie = new Movie({
            name: req.body.name, year: req.body.year, director: req.body.director, rating: req.body.rating, watched: req.body.watched, dateToWatch: req.body.dateToWatch, note: req.body.note, poster: req.body.poster, _creator: req.user._id
        })
        newMovie.save().then((movie) => res.send(movie)).catch((e) => res.status(400).send(e))
    })
    // POST_USERS
    app.post("/users/", (req, res) => {
        let user = new User({
            email: req.body.email, password: req.body.password,
        })
        user.save().then((user) => { return user.generateAuthToken() }).then((token) => { res.header("x-auth", token).send(user) }).catch((e) => res.status(400 || 404).send(e));
    })
    // GET
    app.get("/movies/", auth, (req, res) => {
        Movie.find({
            _creator: req.user._id
        }).then((movies) => res.send({ movies })).catch((e) => console.log(e));
    })

    app.get("/movies/:id", auth, (req, res) => {
        let id = req.params.id
        if (!ObjectId.isValid(id)) {
            return res.status(400).send({ response: "Invalid ID format!" })
        }

        Movie.findOne({
            _id: id,
            _creator: req.user._id
        }).then((movie) => {
            if (movie) {
                res.send({ movie })
            }
            else if (!movie) {
                res.status(404).send({ response: "Movie not found" })
            }
        }).catch((e) => console.log(e))


    })
    //GET PRIVATE

    app.get("/users/me", auth, (req, res) => {
        res.send(req.user);
    })

    //POST LOGIN

    app.post("/users/login", (req, res) => {
        let body = _.pick(req.body, ["email", "password"])
        User.findByCred(body.email, body.password).then((user) => {
            return user.generateAuthToken().then((token) => { res.header("x-auth", token).send(user) })
        }).catch((e) => {
            res.status(400).send({ response: "User not found" });
            console.log(e)
        })

    })
    //DELETE LOGOUT

    app.delete("/users/me/token", auth, (req, res) => {
        req.user.removeToken(req.token).then(() => { res.status(200).send() }, () => { res.status(401).send() })
    })
    // DELETE
    app.delete("/movies/:id", auth, (req, res) => {
        let id = req.params.id
        if (!ObjectId.isValid(id)) {
            return res.status(400).send({ response: "Invalid ID format" })
        }
        Movie.findOneAndRemove({
            _id: id,
            _creator: req.user._id
        }).then((movie) => {
            if (movie) {
                res.send({ movie })
            }
            else if (!movie) {
                res.status(404).send({ response: "Movie not found" })
            }
        }).catch((e) => console.log(e))
    })
    // UPDATE
    app.patch("/movies/:id", auth, (req, res) => {
        let id = req.params.id
        if (!ObjectId.isValid(id)) {
            return res.status(400).send({ response: "Invalid ID format" })
        }
        Movie.findOneAndUpdate({
            _id: id,
            _creator: req.user._id
        }, {
                $set: {
                    watched: req.body.watched,
                    dateToWatch: req.body.dateToWatch,
                    note: req.body.note,
                    poster: req.body.poster,
                },
            }, {
                new: true

            }).then((movie) => {
                if (movie) {
                    res.send({ movie })
                }
                else {
                    res.status(404).send({ response: "Movie not found" })
                }
            }).catch((e) => console.log(e))
    })

}