const express = require("express");
var logger = require("morgan");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
const PORT = process.env.PORT || 3001;

mongoose.Promise = Promise;

const app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var db = process.env.MONGODB_URI || "mongodb://localhost/nytreactapp";

mongoose.connect(db, function(error) {
  
  if (error) {
    console.log(error);
  }
  
  else {
    console.log("mongoose connection is successful");
  }
});

app.use(express.static("public"));

// Add routes, both API and view
// app.use(routes);
require("./controllers/articleController")(app);


app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
  // console.log("here on server?");
  // res.sendFile("../client/build/index.html");
});

app.listen(PORT, function() {
    console.log("App running on http://localhost:" + PORT);
});