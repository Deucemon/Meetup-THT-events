const { getCache, writeCache } = require("./cache-service.js");

const express = require("express")
const path = require("path")
const app = express()

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

const staticFiles = express.static(path.join(__dirname, '../../client/build'))

app.use(staticFiles)

const hasCache = async (name) => {
  if(! name)
    return console.error('No name given to hasCache function');

  const cache = await getCache(name)

  return cache;
}

// Get cache
app.get("/api/cache", async (req, res) => {
  if(! req.query.name)
    return console.error('Please give a cache name, i.e. /api/cache?name=groups')

  let cache = await getCache(req.query.name)
  return res.json({ "hasCache": (cache ? true : false) });
});

// Find locations
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
 * Get events for groups
 */
app.get("/api/getEventsForGroups", async (req, res) => {

  // Input validation: timespan
  if(! req.query.fromTimestamp || ! req.query.toTimestamp) {
    console.log('ERR', 'No timestamps given')
    return;
  }

  // Input validation: groupIds
  if(! req.query.groupIds) {
    console.log('ERR', 'No groupIds given')
    return;
  }

  // Define filename for cache
  let cacheName = 'events-'+req.query.fromTimestamp+'-'+req.query.toTimestamp;

  // Get from cache it's available there
  let cache = await getCache(cacheName);
  if(cache) return res.json(cache);

  // Query Meetup API
  await meetup.getEvents({
    status: "past",
    group_id: req.query.groupIds,
    time: req.query.fromTimestamp + ',' + req.query.toTimestamp
  }, function (err, results) {
    // Give results back to user
    res.json(results);
    // Cache results
    writeCache(cacheName, results);
  });

});

/*
 * Get events for group
 */
app.get("/api/getEventsForGroup", async (req, res) => {

  // Input validation: timespan
  if(! req.query.fromTimestamp || ! req.query.toTimestamp) {
    console.log('ERR', 'No timestamps given')
    return;
  }

  // Input validation: group
  if(! req.query.groupUrlName) {
    console.log('ERR', 'No groupUrlName given')
    return;
  }

  // Define filename for cache
  let cacheName = 'events-'+req.query.fromTimestamp+'-'+req.query.toTimestamp+'-'+req.query.groupUrlName;

  // Get from cache it's available there
  let cache = await getCache(cacheName);
  if(cache) return res.json(cache);

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

app.use('/*', staticFiles)

app.set('port', (process.env.PORT || 3001));
app.listen(app.get("port"), () => {
  console.log(`Find the server at: http://localhost:${app.get("port")}/`); // eslint-disable-line no-console
});
