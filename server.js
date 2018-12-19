const express = require("express");
const app = express();

const limit = 6;

// Import the Meetup API library, for easily using the Meetup API 
var meetup = require('meetup-api')({
  key: '2b2d6256e60525527675c6d494c4660'
});

app.set("port", process.env.PORT || 3001);

// Express only serves static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

// Method: findLocations
app.get("/api/findLocations", async (req, res) => {

  await meetup.findLocations({
    query: 'The Hague'
  }, function (err, results) {
    res.json(results);
  });

});

app.get("/api/findGroups", async (req, res) => {
  await meetup.findGroups({
    category: 34,
    radius: 4,
    lon: 4.330529,
    lat: 52.081776,
    page: limit
  }, function (err, results) {
    res.json(results);
  });
  // const param = req.query.q;
});

app.get("/api/getEvents", async (req, res) => {
  await meetup.getEvents({
    status: "past",
    group_urlname: req.query.groupUrlName,
    time: req.query.fromTimestamp + ',' + req.query.toTimestamp
  }, function (err, results) {
    res.json(results);
  });
});

app.listen(app.get("port"), () => {
  console.log(`Find the server at: http://localhost:${app.get("port")}/`); // eslint-disable-line no-console
});
