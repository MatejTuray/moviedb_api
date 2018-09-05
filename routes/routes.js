const express = require("express");
const app = express();
const { mongoose } = require("../db/mongoose");
const { Movie } = require("../db/models/Movie");
const { ObjectId } = require("mongodb");

module.exports = (app) => {
    // POST
    app.post("/movies/", (req, res) => {
        let newMovie = new Movie({
            name: req.body.name, year: req.body.year, director: req.body.director, rating: req.body.rating, watched: req.body.watched, dateToWatch: req.body.dateToWatch, note: req.body.note, poster: req.body.poster
        })
        newMovie.save().then((movie) => res.send(movie)).catch((e) => res.status(400).send(e))
    })
    // GET
    app.get("/movies/", (req, res) => {
        Movie.find().then((movies) => res.send({ movies })).catch((e) => console.log(e));
    })

    app.get("/movies/:id", (req, res) => {
        let id = req.params.id
        if (!ObjectId.isValid(id)) {
            return res.status(400).send({ response: "Invalid ID format!" })
        }

        Movie.findById(id).then((movie) => {
            if (movie) {
                res.send({ movie })
            }
            else if (!movie) {
                res.status(404).send({ response: "Movie not found" })
            }
        }).catch((e) => console.log(e))


    })
    // DELETE
    app.delete("/movies/:id", (req, res) => {
        let id = req.params.id
        if (!ObjectId.isValid(id)) {
            return res.status(400).send({ response: "Invalid ID format" })
        }
        Movie.findByIdAndRemove(id).then((movie) => {
            if (movie) {
                res.send({ movie })
            }
            else if (!movie) {
                res.status(404).send({ response: "Movie not found" })
            }
        }).catch((e) => console.log(e))
    })
    // UPDATE
    app.patch("/movies/:id", (req, res) => {
        let id = req.params.id
        if (!ObjectId.isValid(id)) {
            return res.status(400).send({ response: "Invalid ID format" })
        }
        Movie.findByIdAndUpdate(id, {
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