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
const mailpass = "personalmoviedb"
const google_client_id = "225917510343-d2mine7afr8rl6l6nfdih15k723me8kj.apps.googleusercontent.com"
const google_client_secret = "1pvUf3S-x29PzuJq73Ink4zi"


module.exports = { env, secret, mailpass, google_client_id, google_client_secret };