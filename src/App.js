import React, { Component } from 'react';
import * as R from 'ramda';
import './App.css';

let globalDelay = 0;

function sleep() {
  globalDelay += 600;
  return new Promise(resolve => setTimeout(resolve, globalDelay));
}

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      stats: {_2017: null, _2018: null}
    }
  }

  async componentDidMount() {
    let _2017 = {};
    let _2018 = await this.getStats(2018);

    this.setState({
      'stats': {
        _2017: _2017,
        _2018: _2018
      }
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
    const isThtEvent = (event) => event.venue && event.venue.name === 'The Hague Tech'

    const groups = await this.getGroups()

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

    // Add an delay, because of the Meetup API rate limit 
    await sleep();

    // Get events for this group & timespan
    const response = await fetch('/api/getEvents?groupUrlName='+groupUrlName+'&fromTimestamp='+fromTimestamp+'&toTimestamp='+toTimestamp);
    const json = await response.json();

    // Return
    return json;
  }

  render() {

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

    let thtRsvpList2018 = [], thtTotalRsvps2018 = 0;
    if(this.state.stats._2018 && this.state.stats._2018.thtRsvps) {
      for(let groupName in this.state.stats._2018.thtRsvps) {
        thtRsvpList2018.push({
          groupName: groupName,
          rsvps: this.state.stats._2018.thtRsvps[groupName]
        });
        thtTotalRsvps2018 += this.state.stats._2018.thtRsvps[groupName];
      }
    }

    return (
      <div className="App">

        <img src="https://secure.meetup.com/s/img/0/logo/svg/logo--script.svg" width="200" alt="Meetup logo" />

        <section className="Stats-the-hague">

          <nav className="tabs">
            <a href="#2017">2017</a>
            <a href="#2018">2018</a>
          </nav>

          <div className="tab-container">

            <h3>
              Groups in The Hague /
              <span> {this.state.stats._2018 && this.state.stats._2018.events.length} </span>
              events
            </h3>
            
            <div className="group-list">

              {R.map(this.renderGroup.bind(this), rsvpList2018)}

              <div className="group-list-row">
                <b>Total RSVP's</b>
                <span>{totalRsvps2018}</span>
              </div>

            </div>

            <hr />

            <h3>
              Groups at The Hague Tech /
              <span> {this.state.stats._2018 && this.state.stats._2018.thtEvents.length} </span>
              events
            </h3>
            
            <div className="group-list">

              {R.map(this.renderGroup.bind(this), thtRsvpList2018)}

              <div className="group-list-row">
                <b>Total RSVP's</b>
                <span>{thtTotalRsvps2018}</span>
              </div>

            </div>

          </div>

        </section>

      </div>
    );
  }
}

export default App;
