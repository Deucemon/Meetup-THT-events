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
    let stats = await this.getStats(this.props.year)

    this.setState({
      'stats': stats
    })
  }

  /*
  * GROUPS
  */

  renderGroup(data) {
    return (
      <p className="group-list-row" key={data.groupName}>
        <b>
          <a href={`https://www.meetup.com/${data.group_urlname}/`} target="_blank" rel="noopener noreferrer">{data.groupName}</a>
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
    const events = await ApiProxy.getEventsForGroups(groups, year)
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

  }

  render() {

    // Get totalRsvps in The Hague
    let rsvpList = [], totalRsvps = 0;
    if(this.state.stats && this.state.stats.rsvps) {
      for(let groupName in this.state.stats.rsvps) {
        rsvpList.push({
          groupName: groupName,
          rsvps: this.state.stats.rsvps[groupName].rsvps,
          group_urlname: this.state.stats.rsvps[groupName].group_urlname
        });
        totalRsvps += this.state.stats.rsvps[groupName].rsvps;
      }
    }
    rsvpList.sort((a, b) => a.rsvps - b.rsvps);
    rsvpList.reverse();

    // Get totalRsvps of The Hague Tech events
    let thtRsvpList = [], thtTotalRsvps = 0;
    if(this.state.stats && this.state.stats.thtRsvps) {
      for(let groupName in this.state.stats.thtRsvps) {
        thtRsvpList.push({
          groupName: groupName,
          rsvps: this.state.stats.thtRsvps[groupName].rsvps,
          group_urlname: this.state.stats.rsvps[groupName].group_urlname
        });
        thtTotalRsvps += this.state.stats.thtRsvps[groupName].rsvps;
      }
      thtPercentage = Math.round((thtTotalRsvps/totalRsvps)*100);
    }
    thtRsvpList.sort((a, b) => a.rsvps - b.rsvps);
    thtRsvpList.reverse();

    return (
      <div className="StatsList">

        <h2>
          RSVPs for groups in {ApiProxy.getCity()}, {this.props.year}
        </h2>

        <div className="group-list link-style-10">
          {R.map(this.renderGroup.bind(this), rsvpList)}
          
          <div className="group-list-row" id="rsvp1">
            <b>Total RSVP's</b>
            <span>{totalRsvps}</span>
          </div>

        </div>

        <div style={{display: ApiProxy.getCity() == 'The Hague' ? 'block' : 'none'}}>

          <h2>
            RSVPs at The Hague Tech, {this.props.year}
          </h2>

          <div className="group-list link-style-10">
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

      </div>
    )
  }
}
