const express = require("express");
const app = express();

var meetup = require('meetup-api')();

app.set("port", process.env.PORT || 3001);

// Express only serves static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

app.get("/api/findLocations", (req, res) => {

  // meetup.findLocations({
  //   query: 'Córdoba'
  // }, function (err, results) {
  //     console.log(results);
  // });

  // const param = req.query.q;
  res.json({
    'test': 'test'
  });
});

app.get("/api/getCities", (req, res) => {

  // meetup.getCities({
  //   lat: -34.603722,
  //   lon: -58.381592,
  //   country: 'AR'
  // }, function (err, results) {
  //     console.log(results);
  // });

  // const param = req.query.q;
  res.json({
    'test': 'test'
  });
});

app.listen(app.get("port"), () => {
  console.log(`Find the server at: http://localhost:${app.get("port")}/`); // eslint-disable-line no-console
});
