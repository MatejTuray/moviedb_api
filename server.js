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