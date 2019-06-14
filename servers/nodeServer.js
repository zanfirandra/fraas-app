const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const app = express();
const port = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/third-party", (request, response, next) => {
  const bearerToken = request.get("Authorization");

  const auth_token = { auth_token: bearerToken };
  axios
    .post("http://127.0.0.1:2000/third-party", auth_token)
    .then(function(resp) {
      console.log(resp);
      response.send(resp.data);
    })
    .catch(function(error) {
      console.log("error");
      next(error);
    });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
