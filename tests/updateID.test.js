const request = require("supertest");
const expect = require("expect");
const { Movie } = require("../db/models/Movie");
const { app } = require("../server");

describe("PATCH /movies/:id", () => {
    let update = {
        note: "Test case updated me!",
        dateToWatch: 222333,
    }
    it('should update some props', (done) => {
        request(app).patch("/movies/5b9050d740c402b679c6a586").send(update).expect(200).expect((res) => { expect(res.body.movie.note).toBe("Test case updated me!") }).end(done)
    })
    it('should return Invalid ID format', (done) => {
        request(app).patch("/movies/5b030c040c402b679c69ae3").send(update).expect(400).expect((res) => { expect(res.body.response).toBe("Invalid ID format") }).end(done)
    })
    it('should return Movie not found', (done) => {
        request(app).patch("/movies/4b9030c040c402b679c69ae3").send(update).expect(404).expect((res) => { expect(res.body.response).toBe("Movie not found") }).end(done)
    })
})