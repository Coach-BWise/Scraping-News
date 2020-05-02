var express = require("express");
var mongoose = require("mongoose");
var exphb = require("express-handlebars");
var path = require("path");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();
var router = express.Router();
require("./routes/routes")(router);
// Configure handlebars
app.engine(
  "handlebars",
  exphb({
    defaultLayout: "main",
    layoutsDir: __dirname + "/views/layouts",
  })
);
app.set("view engine", "handlebars");

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));
app.use(router);
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});
