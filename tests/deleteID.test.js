const request = require("supertest");
const expect = require("expect");
const { Movie } = require("../db/models/Movie");
const { app } = require("../server");

describe("DELETE /movies/:id", () => {
    it('should delete a single movie', (done) => {
        request(app).delete("/movies/5b90456c40c402b679c6a224").expect(200).expect((result) => { expect(result.body.movie.name).toBe("Matrix"); expect(result.body.movie.director).toBe("Wachovski"); }).end((err, res) => {
            Movie.findById("5b90456c40c402b679c6a224").then((res) => {
                expect(res).toNotExist()
                done()
            }).catch((e) => done(e))
        })
    })
    it('should return Invalid ID format', (done) => {
        request(app).delete("/movies/5b030c040c402b679c69ae3").expect(400).expect((res) => { expect(res.body.response).toBe("Invalid ID format") }).end(done)
    })
    it('should return Movie not found', (done) => {
        request(app).delete("/movies/4b9030c040c402b679c69ae3").expect(404).expect((res) => { expect(res.body.response).toBe("Movie not found") }).end(done)
    })
})