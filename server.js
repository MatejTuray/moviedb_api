const env = process.env.NODE_ENV || "developement";
if (env === "developement") {
    process.env.PORT = 5000;
    process.env.MONGODB_URI = "mongodb://localhost:27017/Movies"
}
else if (env === "test") {
    process.env.PORT = 5000;
    process.env.MONGODB_URI = "mongodb://localhost:27017/test"
}
console.log("env:", env)
const express = require("express");
const app = express();
const bodyParser = require("body-parser");



const port = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
require("./routes/routes")(app)
app.get("*", (req, res) => {
    res.send("Live on port 5000!")
})
app.listen(port, () => {
    console.log(`Server is up on port: ${port}`)
})

module.exports = { app }