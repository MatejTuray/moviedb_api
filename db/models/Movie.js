const mongoose = require("mongoose");

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
    watched: {
        type: Boolean,
        default: false,
    },
    dateToWatch: {
        type: Number,
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
    }
})

module.exports = { Movie }