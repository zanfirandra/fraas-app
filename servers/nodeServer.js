const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const app = express();
var mongoose = require("mongoose");
const port = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost/FraasDB", { useNewUrlParser: true });

//schema definition
var userSchema = new mongoose.Schema({
  username: String
});

//convert userSchema into a model so we can work with it
var userModel = mongoose.model("User", userSchema); // instances of Models are documents.

app.get("/api/hello", (req, res) => {
  res.send({ express: "Hello From Express" });
});

app.post("/", (req, res) => {
  res.send(
    `I received your POST request. This is what you sent me: ${
      req.body.image_data
    }`
  );
  axios
    .post(" http://127.0.0.1:2000/image", req.body)
    .then(function(response) {
      console.log(response.data);
    })
    .catch(function(error) {
      console.log("error");
    });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
