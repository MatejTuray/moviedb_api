const express = require("express");
const app = express();
const { mongoose } = require("../db/mongoose");
const { Movie } = require("../db/models/Movie");
const { ObjectId } = require("mongodb");
const { User } = require("../db/models/User");
const { auth } = require("./auth");
const _ = require("lodash");
const nodemailer = require("nodemailer");
const mailpass = require("../config").mailpass


module.exports = (app) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "server.personalmoviedb@gmail.com",
            pass: mailpass,
        }
    })
    // POST
    app.post("/movies/", auth, (req, res) => {
        let newMovie = new Movie({
            name: req.body.name, year: req.body.year, director: req.body.director, rating: req.body.rating, watched: req.body.watched, type: req.body.type, dateToWatch: req.body.dateToWatch, note: req.body.note, plot: req.body.plot, poster: req.body.poster, _creator: req.user._id
        })
        newMovie.save().then((movie) => res.send(movie)).catch((e) => res.status(400).send(e))
    })
    // POST_USERS
    app.post("/users/", (req, res) => {
        let user = new User({
            username: req.body.username, email: req.body.email, password: req.body.password,
        })
        user.save().then((user) => { return user.generateAuthToken() }).then((token) => {
            res.header("x-auth", token).send(user);
            let mailOptions = {
                from: 'server.personalmoviedb@gmail.com',
                to: req.body.email,
                subject: "Personal Movie DB Sign Up",
                text: `Hello and welcome to PMDB, glad to have you on board.
            }
            transporter.sendMail(mailOptions, (err, info) => {
                if (error) {
                    console.log(err)
                }
                else {
                    console.log("Email sent", info.response)
                }
            })
        }).catch((e) => res.status(400 || 404).send(e));
    })

    app.post("/social/", (req, res) => {
        let user = new User({
            username: req.body.username, email: req.body.email, password: req.body.password,
        })
        user.save().then((user) => { return user.generateAuthToken() }).then((token) => {
            res.header("x-auth", token).send(user);


        }).catch((e) => res.status(400 || 404).send(e));
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
    //  POST FILTER

    app.post("/movies/filter/", auth, (req, res) => {
        console.log(req.body)
        if (req.body.watched !== "" && req.body.type !== "" && req.body.year !== "") {
            Movie.find({
                _creator: req.user._id,
                type: req.body.type,
                watched: req.body.watched,
                year: req.body.year
            }).then((movies) => res.send({ movies })).catch((e) => console.log(e));
        }
        else if (req.body.watched !== "" && req.body.type !== "") {
            Movie.find({
                _creator: req.user._id,
                watched: req.body.watched,
                type: req.body.type
            }).then((movies) => res.send({ movies })).catch((e) => console.log(e));

        }
        else if (req.body.watched !== "" && req.body.year !== "") {
            Movie.find({
                _creator: req.user._id,
                watched: req.body.watched,
                year: req.body.year
            }).then((movies) => res.send({ movies })).catch((e) => console.log(e));

        }
        else if (req.body.type !== "" && req.body.year !== "") {
            Movie.find({
                _creator: req.user._id,
                type: req.body.type,
                year: req.body.year
            }).then((movies) => res.send({ movies })).catch((e) => console.log(e));
        }
        else if (req.body.year !== "") {
            Movie.find({
                _creator: req.user._id,
                year: req.body.year
            }).then((movies) => res.send({ movies })).catch((e) => console.log(e));
        }
        else if (req.body.type !== "") {
            Movie.find({
                _creator: req.user._id,
                type: req.body.type
            }).then((movies) => res.send({ movies })).catch((e) => console.log(e));
        }
        else if (req.body.watched !== "") {
            Movie.find({
                _creator: req.user._id,
                watched: req.body.watched
            }).then((movies) => res.send({ movies })).catch((e) => console.log(e));
        }
        else {
            Movie.find({
                _creator: req.user._id,
            }).then((movies) => res.send({ movies })).catch((e) => console.log(e));
        }
    })
    //GET PRIVATE

    app.get("/users/me", auth, (req, res) => {
        res.send(req.user);
    })

    //POST LOGIN

    app.post("/login", (req, res) => {
        let body = _.pick(req.body, ["email", "password",])
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
                    rating: req.body.rating,
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
    // UPDATE WATCHED
    app.patch("/movies/:id/watched", auth, (req, res) => {
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
    // UPDATE STARS
    app.patch("/movies/:id/rating", auth, (req, res) => {
        let id = req.params.id
        if (!ObjectId.isValid(id)) {
            return res.status(400).send({ response: "Invalid ID format" })
        }
        Movie.findOneAndUpdate({
            _id: id,
            _creator: req.user._id
        }, {
                $set: {
                    rating: req.body.rating,
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
