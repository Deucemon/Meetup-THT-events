import * as R from 'ramda';

// Function that filters on THT events
const isThtEvent = (event) => event && event.venue && event.venue.name === 'The Hague Tech'

let globalDelay = 0;

function sleep() {
  globalDelay += 1500;
  return new Promise(resolve => setTimeout(resolve, globalDelay));
}

async function hasCache() {
  const response = await fetch('/api/cache?name=groups');
  const json = await response.json();

  return json.hasCache;
}

function getCity() {
  const allowedCities = ['Rotterdam', 'The Hague', 'Amsterdam']
  // Get 'city' query param
  const urlParams = new URLSearchParams(window.location.search)
  const city = urlParams.get('city')
  // Return city. Default to The Hague
  return ! city || allowedCities.indexOf(city) == -1 ? 'The Hague' : city;
}

async function getGroups() {
  const city = getCity()
  // Create API response
  const response = await fetch('/api/findGroups' + (city ? '?city='+city : ''));
  const json = await response.json();

  return json;
}

/*
* EVENTS
*/

async function getEvents(groups, year, hasDelay) {

  // Get all events of all groups
  const allEventsForGroups = await Promise.all(
    R.map((group) =>
      getEventsForGroup(group.urlname, year, hasDelay)
      , groups)
  );

  // Flatten object
  const eventsObject = R.unnest(
    R.map(R.prop('results'), allEventsForGroups)
  );

  // Return all events
  return eventsObject;

}

async function getEventsForGroups(groups, year) {

  // Set year if it was not set
  if(!year) year = 2018;

  // Set timespan
  let fromTimestamp = new Date(year + '-01-01').getTime();
  let toTimestamp = new Date(year + '-12-31').getTime();

  // Get all groupIds
  let groupIds = R.map((group) => {
    return group.id;
  }, groups)

  // Get events for these groupIds & timespan
  const response = await fetch('/api/getEventsForGroups?groupIds='+groupIds.join()+'&fromTimestamp='+fromTimestamp+'&toTimestamp='+toTimestamp);
  const json = await response.json();

  // Return all events
  return json.results;
}

async function getEventsForGroup(groupUrlName, year, hasDelay = true) {

  // Set year if it was not set
  if(!year) year = 2018;

  // Set timespan
  let fromTimestamp = new Date(year + '-01-01').getTime();
  let toTimestamp = new Date(year + '-12-31').getTime();

  // Add an delay, because of the Meetup API rate limit 
  if(hasDelay)
    await sleep();

  // Get events for this group & timespan
  const response = await fetch('/api/getEventsForGroup?groupUrlName='+groupUrlName+'&fromTimestamp='+fromTimestamp+'&toTimestamp='+toTimestamp);
  const json = await response.json();

  // Return
  return json;
}

/*
 * RSVP's
 */
function getRsvpsPerGroup(events) {
  let rsvpsPerGroup = [];

  let event;
  for (let i = events.length - 1; i >= 0; i--) {
    event = events[i];

    if(!event) {
      console.log('Strange. No event, getRsvpsPerGroup');
      break;
    }

    // If this is the first event for this group: Return RSVP count.
    if( ! rsvpsPerGroup[event.group.name])
      rsvpsPerGroup[event.group.name] = {
        rsvps: event.yes_rsvp_count,
        group_urlname: event.group.urlname
      }

    // Otherwise: Sum up
    else
      rsvpsPerGroup[event.group.name].rsvps += event.yes_rsvp_count;

    var date = new Date(event.created*1000);

    if(event.group.name.indexOf('Permissionless Society Blockchains') > -1) {
      console.log(date.toDateString(), event.group.name, event.name, rsvpsPerGroup[event.group.name].rsvps);
    }

  }

  return rsvpsPerGroup;
}

export default {
  sleep,
  getEventsForGroups,
  isThtEvent,
  hasCache,
  getGroups,
  getRsvpsPerGroup,
  getCity
}
