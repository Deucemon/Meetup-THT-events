import React, { Component } from 'react';
import ApiProxy from '../../services/ApiProxy.service.js';
import ChartBlock from './ChartBlock.js';

import * as R from 'ramda';

export default class TotalRsvps extends Component {

  constructor(props) {
    super(props);

    this.state = {
      numberOfRsvps: 0,
      percentageOfThtRsvps: 0
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
    for(let key in thtRsvps) thtRsvpsAmount += rsvps[key].rsvps

    // Set state
    this.setState({
      numberOfRsvps: rsvpsAmount,
      percentageOfThtRsvps: Math.round(thtRsvpsAmount / rsvpsAmount * 100)
    })
  }

  render() {
    return (
      <ChartBlock title="RSVP's"
                  primaryStat={this.state.numberOfRsvps}
                  secondaryStat={`${this.state.percentageOfThtRsvps}% at The Hague Tech`}
                  backgroundColor="#f28a17"
                  />
    )
  }
}
