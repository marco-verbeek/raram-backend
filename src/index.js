const express = require("express")
const app = express()
require('dotenv').config()

app.use(express.json())

const routes = require("../api/routes")
app.use("/api", routes)

app.get("/", function (req, res) {
    return res.send('<p>API for Ranked ARAM Tool</p>').status(200)
});

module.exports = app