const env = require("./config").env;

console.log("env:", env)
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const helmet = require("helmet")



const port = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(helmet())
app.use(express.urlencoded({ extended: true }));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
require("./routes/routes")(app)

app.get("*", (req, res) => {
    res.send("Live on port 5000!")
})
app.listen(port, () => {
    console.log(`Server is up on port: ${port}`)
})

module.exports = { app }