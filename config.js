const env = process.env.NODE_ENV || "developement";
if (env === "developement") {
    process.env.PORT = 5000;
    process.env.MONGODB_URI = "mongodb://localhost:27017/Movies"
}
else if (env === "test") {
    process.env.PORT = 5000;
    process.env.MONGODB_URI = "mongodb://localhost:27017/test"
}
const secret = "asdasfqkptqjt2314091598138626";

module.exports = { env, secret };