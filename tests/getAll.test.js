const request = require("supertest");
const expect = require("expect");
const { Movie } = require("../db/models/Movie");
const { app } = require("../server");

describe('GET /movies', () => {
    it('should get all the movies from DB', (done) => {
        request(app).get("/movies").expect(200).expect((res) => { expect(res.body.movies.length).toBe(2); expect(res.body.movies[0].name).toBe("Star Wars Ep 1") }).end(done)

    })
})
