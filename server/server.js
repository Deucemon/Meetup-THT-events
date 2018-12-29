const { getCache, writeCache } = require("./cache-service.js");

const express = require("express");
const app = express();

const limit = 99999;

// Import the Meetup API library, for easily using the Meetup API 
var meetup = require('meetup-api')({
  key: '2b2d6256e60525527675c6d494c4660'
});

app.set("port", process.env.PORT || 3001);

// Express only serves static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

app.get("/api/cache", async (req, res) => {
  let cache = await getCache('groups')
  if(cache)
    return res.json({"hasCache": true});

  res.json({"hasCache": false});
});

// Method: findLocations
app.get("/api/findLocations", async (req, res) => {

  await meetup.findLocations({
    query: 'The Hague'
  }, function (err, results) {
    res.json(results);
  });

});

/*
 * Find groups
 */
app.get("/api/findGroups", async (req, res) => {

  // Get from cache it's available there
  let cache = await getCache('groups');
  if(cache) return res.json(cache);

  // Query Meetup API
  await meetup.findGroups({
    category: 34,
    radius: 4,
    lon: 4.330529,
    lat: 52.081776,
    page: limit
  }, function (err, results) {
    writeCache('groups', results);
    res.json(results);
  });

});

/*
 * Get events
 */
app.get("/api/getEvents", async (req, res) => {

  // Input validation
  if(! req.query.fromTimestamp || ! req.query.toTimestamp) {
    console.log('ERR', 'No timestamps given')
    return;
  }

  // Define filename for cache
  let cacheName = 'events-'+req.query.fromTimestamp+'-'+req.query.toTimestamp+'-'+req.query.groupUrlName;

  // Get from cache it's available there
  let cache = await getCache(cacheName);
  if(cache) {
    res.json(cache);
    return;
  }

  // Query Meetup API
  await meetup.getEvents({
    status: "past",
    group_urlname: req.query.groupUrlName,
    time: req.query.fromTimestamp + ',' + req.query.toTimestamp
  }, function (err, results) {
    // Give results back to user
    res.json(results);
    // Cache results
    writeCache(cacheName, results);
  });

});

app.listen(app.get("port"), () => {
  console.log(`Find the server at: http://localhost:${app.get("port")}/`); // eslint-disable-line no-console
});
