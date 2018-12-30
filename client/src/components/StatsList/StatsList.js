import React, { Component } from 'react';
import './StatsList.css';
import * as R from 'ramda';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

let globalDelay = 0;
let thtPercentage2017 = 0;
let thtPercentage2018 = 0;

// If true limits the 2018 results to september
const limit = false;

function sleep() {
  globalDelay += 1500;
  return new Promise(resolve => setTimeout(resolve, globalDelay));
}

export default class StatsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stats: {_2017: null, _2018: null}
    }

  }

  async componentDidMount() {
    const self = this;

    // Check if app has cache
    await this.hasCache().then(async function(fromCache, err) {

      // If so: set fromCache state
      self.setState({ fromCache: fromCache });

      // Then load results
      let _2017 = await self.getStats(2017);
      let _2018 = await self.getStats(2018);

      self.setState({
        'stats': {
          _2017: _2017,
          _2018: _2018
        }
      })
    })

  }

  /*
  * GROUPS
  */

  renderGroup(data) {
    return (
      <p className="group-list-row" key={data.groupName}>
        <b>
          {data.groupName}
        </b>

        <span>
          {data.rsvps}
        </span>
      </p>
    )
  }


  async getStats(year) {
    // Function that filters on THT events
    const isThtEvent = (event) => event && event.venue && event.venue.name === 'The Hague Tech'

    // Get groups
    const groups = await this.getGroups()

    // Get events & RSVPs
    const events = await this.getEvents(groups, year)
    const rsvps  = this.getRsvpsPerGroup(events)

    // The Hague Tech (THT) only
    const thtEvents = R.filter(isThtEvent, events)
    const thtRsvps  = this.getRsvpsPerGroup(thtEvents)

    return {
      groups: groups,
      events: events,
      rsvps: rsvps,
      thtEvents: thtEvents,
      thtRsvps: thtRsvps
    }

    // const onlyFromGroup = (groupName) =>
    //   R.filter((event) =>
    //     event.group.urlname == groupName
    //   , events)
    // console.log(onlyFromGroup('oc070netwerkevent'))
  }

  async hasCache() {
    const response = await fetch('/api/cache');
    const json = await response.json();

    return json.hasCache;
  }

  async getGroups() {
    const response = await fetch('/api/findGroups');
    const json = await response.json();

    return json;
  }

  getRsvpsPerGroup(events) {
    let rsvpsPerGroup = [];

    let event;
    for (let i = events.length - 1; i >= 0; i--) {
      event = events[i];

      if(!event) break;

      // If this is the first event for this group: Return RSVP count.
      if( ! rsvpsPerGroup[event.group.name])
        rsvpsPerGroup[event.group.name] = event.yes_rsvp_count;

      // Otherwise: Sum up
      else
        rsvpsPerGroup[event.group.name] += event.yes_rsvp_count;
    }

    return rsvpsPerGroup;
  }

  /*
  * EVENTS
  */

  async getEvents(groups, year) {

    // Get all events of all groups
    const allEventsForGroups = await Promise.all(
      R.map((group) =>
        this.getEventsForGroup(group.urlname, year)
        , groups)
    );

    // Flatten object
    const eventsObject = R.unnest(
      R.map(R.prop('results'), allEventsForGroups)
    );

    // Return all events
    return eventsObject;
  }

  async getEventsForGroup(groupUrlName, year) {
    // Set year if it was not set
    if(!year) year = 2018;

    // Set timespan
    let fromTimestamp = new Date(year + '-01-01').getTime();
    let toTimestamp = new Date(year + '-12-31').getTime();

    // For 2018, only get results until end of September
    if (year === 2018 && limit === true) {
      toTimestamp = new Date(year + '-09-30').getTime();
    }

    // Add an delay, because of the Meetup API rate limit 
    if(! this.state.fromCache)
      await sleep();

    // Get events for this group & timespan
    const response = await fetch('/api/getEvents?groupUrlName='+groupUrlName+'&fromTimestamp='+fromTimestamp+'&toTimestamp='+toTimestamp);
    const json = await response.json();

    // Return
    return json;
  }

  render() {

    // Get totalRsvps in The Hague 2017
    let rsvpList2017 = [], totalRsvps2017 = 0;
    if(this.state.stats._2017 && this.state.stats._2017.rsvps) {
      for(let groupName in this.state.stats._2017.rsvps) {
        rsvpList2017.push({
          groupName: groupName,
          rsvps: this.state.stats._2017.rsvps[groupName]
        });
        totalRsvps2017 += this.state.stats._2017.rsvps[groupName];
      }
    }
    rsvpList2017.sort((a, b) => a.rsvps - b.rsvps);
    rsvpList2017.reverse();


    // Get totalRsvps of The Hague Tech events 2017
    let thtRsvpList2017 = [], thtTotalRsvps2017 = 0;
    if(this.state.stats._2017 && this.state.stats._2017.thtRsvps) {
      for(let groupName in this.state.stats._2017.thtRsvps) {
        thtRsvpList2017.push({
          groupName: groupName,
          rsvps: this.state.stats._2017.thtRsvps[groupName]
        });
        thtTotalRsvps2017 += this.state.stats._2017.thtRsvps[groupName];
        thtPercentage2017 = Math.round((thtTotalRsvps2017/totalRsvps2017)*100);
      }
    }
    thtRsvpList2017.sort((a, b) => a.rsvps - b.rsvps);
    thtRsvpList2017.reverse();


    // Get totalRsvps in The Hague 2018
    let rsvpList2018 = [], totalRsvps2018 = 0;
    if(this.state.stats._2018 && this.state.stats._2018.rsvps) {
      for(let groupName in this.state.stats._2018.rsvps) {
        rsvpList2018.push({
          groupName: groupName,
          rsvps: this.state.stats._2018.rsvps[groupName]
        });
        totalRsvps2018 += this.state.stats._2018.rsvps[groupName];
      }
    }
    rsvpList2018.sort((a, b) => a.rsvps - b.rsvps);
    rsvpList2018.reverse();


    // Get totalRsvps of The Hague Tech events 2018
    let thtRsvpList2018 = [], thtTotalRsvps2018 = 0;
    if(this.state.stats._2018 && this.state.stats._2018.thtRsvps) {
      for(let groupName in this.state.stats._2018.thtRsvps) {
        thtRsvpList2018.push({
          groupName: groupName,
          rsvps: this.state.stats._2018.thtRsvps[groupName]
        });
        thtTotalRsvps2018 += this.state.stats._2018.thtRsvps[groupName];
        thtPercentage2018 = Math.round((thtTotalRsvps2018/totalRsvps2018)*100);
      }
    }
    thtRsvpList2018.sort((a, b) => a.rsvps - b.rsvps);
    thtRsvpList2018.reverse();

    return (
      <div className="StatsList">

        <Tabs>
          <TabList>
            <nav className="tabs">
              <Tab><button>2017</button></Tab>
              <Tab><button>2018</button></Tab>
            </nav>
          </TabList>
          <TabPanel>

            <div className="tab-container">

              <h2>
                Groups in The Hague /
                <span> {this.state.stats._2017 && this.state.stats._2017.events.length} </span>
                events
              </h2>

              <div className="group-list">
                {R.map(this.renderGroup.bind(this), rsvpList2017)}
                
                <div className="group-list-row" id="rsvp1">
                  <b>Total RSVP's</b>
                  <span>{totalRsvps2017}</span>
                </div>

              </div>

              <hr />

              <img src="https://www.thehaguetech.nl/images/THT_Anim_once.gif" width="100" alt="THT logo" />
              <h2>
                Groups at The Hague Tech /
                <span> {this.state.stats._2017 && this.state.stats._2017.thtEvents.length} </span>
                events 
              </h2>

              <div className="group-list">

                {R.map(this.renderGroup.bind(this), thtRsvpList2017)}

                <div className="group-list-row"  id="rsvp2">
                  <b>Total RSVP's</b>
                  <span>{thtTotalRsvps2017}</span>
                </div>

                <div className="group-list-row"  id="rsvp2">
                  <b>Percentage of Total RSVP's</b> 
                  <span>{thtPercentage2017}%</span> 
                </div>

              </div>

            </div>

          </TabPanel>
          {/*
           * 2018 panel
           */}
          <TabPanel>
              <div className="tab-container">

              <h2>
                Groups in The Hague /
                <span> {this.state.stats._2018 && this.state.stats._2018.events.length} </span>
                events
              </h2>

              <div className="group-list">

                  
                {R.map(this.renderGroup.bind(this), rsvpList2018)}
                

                <div className="group-list-row" id="rsvp1">
                  <b>Total RSVP's</b>
                  <span>{totalRsvps2018}</span>
                </div>

              </div>

              <hr />

              <img src="https://www.thehaguetech.nl/images/THT_Anim_once.gif" width="100" alt="THT logo" />
              <h2>
                Groups at The Hague Tech /
                <span> {this.state.stats._2018 && this.state.stats._2018.thtEvents.length} </span>
                events 
              </h2>

              <div className="group-list">
                {R.map(this.renderGroup.bind(this), thtRsvpList2018)}

                <div className="group-list-row"  id="rsvp2">
                  <b>Total RSVP's</b>
                  <span>{thtTotalRsvps2018}</span>
                </div>

                <div className="group-list-row"  id="rsvp2">
                  <b>Percentage of Total RSVP's</b> 
                  <span>{thtPercentage2018}%</span> 
                </div>

              </div>

            </div>

          </TabPanel>
        </Tabs> 

      </div>
    )
  }
}