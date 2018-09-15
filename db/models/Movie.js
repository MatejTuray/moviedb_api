const mongoose = require("mongoose");
const moment = require("moment");
const Movie = mongoose.model("Movie", {
    name: {
        type: String,
        required: true,
        minlength: 1,
    },
    year: {
        type: Number,
        required: true,
        min: 1900,
    },
    director: {
        type: String,
        required: true,
        minlength: 1,
    },
    rating: {
        type: Number,
        required: true,

    },
    plot: {
        type: String,
        default: "",
        minlength: 1,
        required: true,
    },
    watched: {
        type: Boolean,
        default: false,
    },
    dateToWatch: {
        type: Date,
        required: false,
        default: null,
    },
    note: {
        type: String,
        required: false,
        trim: true,
        default: null,
    },
    poster: {
        type: String,
        default: null,
    },
    _creator: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
    }
})

module.exports = { Movie }