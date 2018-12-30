import React, { Component } from 'react';
import ApiProxy from '../../services/ApiProxy.service.js';
import './StatsList.css';
import * as R from 'ramda';

let thtPercentage = 0;

export default class StatsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stats: null
    }

  }

  async componentDidMount() {
    const self = this;

    // Check if app has cache
    await ApiProxy.hasCache().then(async function(fromCache, err) {

      // If so: set fromCache state
      self.setState({ fromCache: fromCache });

      // Then load results
      let stats = await self.getStats(self.props.year)

      self.setState({
        'stats': stats
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

    // Get groups
    const groups = await ApiProxy.getGroups()

    // Get events & RSVPs
    const events = await ApiProxy.getEvents(groups, year, !this.state.fromCache)
    const rsvps  = ApiProxy.getRsvpsPerGroup(events)

    // The Hague Tech (THT) only
    const thtEvents = R.filter(ApiProxy.isThtEvent, events)
    const thtRsvps  = ApiProxy.getRsvpsPerGroup(thtEvents)

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

  render() {

    // Get totalRsvps in The Hague 2017
    let rsvpList = [], totalRsvps = 0;
    if(this.state.stats && this.state.stats.rsvps) {
      for(let groupName in this.state.stats.rsvps) {
        rsvpList.push({
          groupName: groupName,
          rsvps: this.state.stats.rsvps[groupName]
        });
        totalRsvps += this.state.stats.rsvps[groupName];
      }
    }
    rsvpList.sort((a, b) => a.rsvps - b.rsvps);
    rsvpList.reverse();

    // Get totalRsvps of The Hague Tech events 2017
    let thtRsvpList = [], thtTotalRsvps = 0;
    if(this.state.stats && this.state.stats.thtRsvps) {
      for(let groupName in this.state.stats.thtRsvps) {
        thtRsvpList.push({
          groupName: groupName,
          rsvps: this.state.stats.thtRsvps[groupName]
        });
        thtTotalRsvps += this.state.stats.thtRsvps[groupName];
        thtPercentage = Math.round((thtTotalRsvps/totalRsvps)*100);
      }
    }
    thtRsvpList.sort((a, b) => a.rsvps - b.rsvps);
    thtRsvpList.reverse();

    return (
      <div className="StatsList">

        <h2>
          Groups in The Hague, {this.props.year}
        </h2>

        <div className="group-list">
          {R.map(this.renderGroup.bind(this), rsvpList)}
          
          <div className="group-list-row" id="rsvp1">
            <b>Total RSVP's</b>
            <span>{totalRsvps}</span>
          </div>

        </div>

        <h2>
          Groups at The Hague Tech, {this.props.year}
        </h2>

        <div className="group-list">
          {R.map(this.renderGroup.bind(this), thtRsvpList)}
          <div className="group-list-row"  id="rsvp2">
            <b>Total RSVP's</b>
            <span>{thtTotalRsvps}</span>
          </div>
          <p className="group-list-row"  id="rsvp2">
            <b>Percentage of Total RSVP's</b> 
            <span>{thtPercentage}%</span> 
          </p>
        </div>

      </div>
    )
  }
}
