const request = require("supertest");
const expect = require("expect");
const { Movie } = require("../db/models/Movie");
const { app } = require("../server");

describe("GET /movies/:id", () => {

    it('should get a single movie with given ID', (done) => {
        request(app).get("/movies/5b901a6740c402b679c691ca").expect(200).expect((res) => { expect(res.body.movie._id).toBe("5b901a6740c402b679c691ca") }).end(done);
    })
    it('should return ID format invalid!', (done) => {
        request(app).get("/movies/5b01a6740c402b679c691ca").expect(400).expect((res) => { expect(res.body.response).toBe("Invalid ID format!") }).end(done)
    })
    it('should return Movie not found', (done) => {
        request(app).get("/movies/3b901a6740c402b679c691ca").expect(404).expect((res) => { expect(res.body.response).toBe("Movie not found") }).end(done)
    })
})