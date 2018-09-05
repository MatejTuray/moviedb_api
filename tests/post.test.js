const request = require("supertest");
const expect = require("expect");
const { Movie } = require("../db/models/Movie");
const { app } = require("../server");

const movies = [{
    "dateToWatch": null,
    "watched": false,
    "name": "Star Wars Ep 1",
    "year": 1999,
    "director": "George Lucas",
    "rating": 9,
    "note": "fetchMe!",
    "__v": 0
},
{
    "dateToWatch": null,
    "watched": false,
    "name": "Matrix",
    "year": 1999,
    "director": "Wachovski",
    "rating": 9,
    "note": "fetchMe!",
    "__v": 0
}]
before((done) => {
    Movie.deleteOne({}).then(() => Movie.insertMany(movies)).then(() => done()).catch((e) => console.log(e))
})

describe("POST /movies", () => {
    it('should post a new movie to MongoDB', (done) => {
        let text = {
            name: "Memento",
            year: 2000,
            director: "Christopher Nolan",
            rating: 7,
        }
        request(app).post("/movies").send(text).expect(200).expect((res) => { expect(res.body.name).toBe(text.name) }).end((err, res) => {
            if (err) {
                return done(err)
            }
            Movie.find().then((res) => {
                expect(res.length).toBe(3);
                expect(res[2].name).toBe(text.name);
                done()
            }).catch((e) => done(e))
        })
    })
    after((done) => {
        Movie.deleteMany().then(() => done())
    })
})