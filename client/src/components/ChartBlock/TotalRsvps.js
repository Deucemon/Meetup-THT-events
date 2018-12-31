import React, { Component } from 'react';
import ApiProxy from '../../services/ApiProxy.service.js';
import ChartBlock from './ChartBlock.js';

import * as R from 'ramda';

export default class TotalRsvps extends Component {

  constructor(props) {
    super(props);

    this.state = {
      numberOfRsvps: localStorage.getItem('numberOfRsvps' + props.year) || '...',
      percentageOfThtRsvps: '..'
    }
  }

  async componentDidMount() {
    let self = this;

    // Check if app has cache
    await ApiProxy.hasCache().then(async function(fromCache, err) {
      self.populateData(fromCache);
    })
  }

  async populateData(fromCache) {
    // Get groups
    const groups = await ApiProxy.getGroups()

    // Get events
    const events = await ApiProxy.getEvents(groups, this.props.year, !fromCache);
    const rsvps  = ApiProxy.getRsvpsPerGroup(events)

    // The Hague Tech (THT) only
    const thtEvents = R.filter(ApiProxy.isThtEvent, events)
    const thtRsvps  = ApiProxy.getRsvpsPerGroup(thtEvents)

    // Calculate amount of RSVPs
    let rsvpsAmount = 0
    for(let key in rsvps) rsvpsAmount += rsvps[key].rsvps

    // Calculate amount of THT based RSVPs
    let thtRsvpsAmount = 0
    for(let key in thtRsvps) thtRsvpsAmount += thtRsvps[key].rsvps

    // Calculate percentage of RSVPs at THT
    let percentageOfThtRsvps = Math.round((thtRsvpsAmount / rsvpsAmount) * 100)

    // Set localStorage
    localStorage.setItem('numberOfRsvps' + this.props.year, rsvpsAmount);
    localStorage.setItem('percentageOfThtRsvps' + this.props.year, percentageOfThtRsvps);

    // Set state
    this.setState({
      numberOfRsvps: rsvpsAmount,
      percentageOfThtRsvps: percentageOfThtRsvps
    })
  }

  render() {
    return (
      <ChartBlock title="RSVP's"
                  primaryStat={this.state.numberOfRsvps}
                  secondaryStat={`${this.state.percentageOfThtRsvps}% at The Hague Tech`}
                  backgroundColor="#b35da0"
                  />
    )
  }
}
