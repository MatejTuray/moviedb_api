const request = require("supertest");
const expect = require("expect");
const { User } = require("../db/models/User");
const { app } = require("../server");


describe("/POST Users", () => {
    it('should create a new user with password and email', (done) => {
        let user = {
            email: "test@gmail.com",
            password: "test123"
        }
        request(app).post("/users").send(user).expect(200).expect((response) => { expect(response.body.email).toBe(user.email); expect(response.body.password).toBe(user.password) }).end(done())
    })
    it('should not create a new user', (done) => {
        let user = {
            email: "test@gmail.com",
            password: "test123"
        }
        request(app).post("/users").send(user).expect(400).expect((response) => { expect(response.body.code).toBe(11000) }).end(done())


    })

})
