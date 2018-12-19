const express = require("express");
const app = express();

// Import the Meetup API library, for easily using the Meetup API 
var meetup = require('meetup-api')({
  key: '292e34c5b515f2a58356c51c702273'
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
    city: "The Hague",
    page: 3
  }, function (err, results) {
    res.json(results);
  });

  // const param = req.query.q;
});

app.listen(app.get("port"), () => {
  console.log(`Find the server at: http://localhost:${app.get("port")}/`); // eslint-disable-line no-console
});
