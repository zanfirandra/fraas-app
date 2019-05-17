const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const app = express();
const port = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/api/hello", (req, res) => {
  res.send({ express: "Hello From Express" });
});

app.post("/", (req, res, next) => {
  axios
    .post(" http://127.0.0.1:2000/image", req.body)
    .then(function(response) {
      res.send(response.data);
    })
    .catch(function(error) {
      console.log("error");
      next(error);
    });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
