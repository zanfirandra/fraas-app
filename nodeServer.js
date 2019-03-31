const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});
app.post('/', (req, res) => {
  res.send(
    `I received your POST request. This is what you sent me: ${req.body.image_data}`,
  );
  axios.post('http://127.0.0.1:2000/image', {name: 'din node'})
});

app.listen(port, () => console.log(`Listening on port ${port}`));