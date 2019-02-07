const { getCache, writeCache } = require("./cache-service.js");

const express = require("express")
const path = require("path")
const CryptoJS = require('crypto-js')
const app = express()

const limit = 99999;

// Import the Meetup API library, for easily using the Meetup API 
var meetup = require('meetup-api')({
  key: '74492f3a52513c481b7850148286f37'
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

/*
 * Find groups
 */
app.get("/api/findGroups", async (req, res) => {

  let city = req.query.city;

  // Get from cache it's available there
  let cache = await getCache('groups-'+CryptoJS.MD5(city));
  if(cache) return res.json(cache);

  let config;
  switch(city) {
    case 'Rotterdam':
      config = {
        radius: 4,
        lon: 4.4554598,
        lat: 51.9248438
      }
      break;
    case 'Amsterdam':
      config = {
        radius: 4,
        lon: 4.828412,
        lat: 52.3547321
      }
      break;
    case 'The Hague':
    default:
      config = {
        radius: 4,
        lon: 4.330529,
        lat: 52.081776
      }
      break;
  }

  // Query Meetup API
  config = Object.assign({
    category: 34,
    order: 'most_active',
    page: limit > 80 ? 80 : limit
  }, config);

  await meetup.findGroups(config, function (err, results) {
    writeCache('groups-'+CryptoJS.MD5(city), results);
    res.json(results);
  });

});

/*
 * Get events for groups
 */
app.get("/api/getEventsForGroups", async (req, res) => {

  let city = req.query.city;
  const allowedCities = ['Rotterdam', 'The Hague', 'Amsterdam']
  if( ! city || allowedCities.indexOf(city) == -1 )
    city = 'The Hague';

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
  let cacheName = 'events-'+CryptoJS.MD5(city)+'-'+CryptoJS.MD5(req.query.groupIds)+'-'+req.query.fromTimestamp+'-'+req.query.toTimestamp;

  // Get from cache it's available there
  let cache = await getCache(cacheName);
  if(cache) return res.json(cache);

  // Query Meetup API
  let getEventsNow = async (allEvents = {results: []}, offset = 0) => {
    await meetup.getEvents({
      status: "past",
      page: 200,// Maximum amount of results
      offset: offset,
      group_id: req.query.groupIds,
      time: req.query.fromTimestamp + ',' + req.query.toTimestamp
    }, function (err, events) {

      for (var i = 0; i < events.results.length; i++) {
        allEvents.results.push(events.results[i]);
      }

      // If there are less than 200 results: return results
      if(events.meta.total_count <= (200 * (offset+1))) {
        writeCache(cacheName, allEvents);
        res.json(allEvents);
      }

      // If there are more than 200 events: do another call for 'page 2'
      else {
        getEventsNow(allEvents, (offset+1))
      }
    });
  }
  getEventsNow();
})

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
  let cacheName = 'events-'+CryptoJS.MD5(city)+'-'+req.query.fromTimestamp+'-'+req.query.toTimestamp+'-'+req.query.groupUrlName;

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
