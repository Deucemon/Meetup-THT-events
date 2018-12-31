import React, { Component } from 'react';
import ApiProxy from '../../services/ApiProxy.service.js';
import ChartBlock from './ChartBlock.js';

import * as R from 'ramda';

export default class TotalEvents extends Component {

  constructor(props) {
    super(props);

    this.state = {
      numberOfEvents: localStorage.getItem('numberOfEvents' + props.year) || '...',
      percentageOfThtEvents: localStorage.getItem('percentageOfThtEvents' + props.year) || '..'
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

    // The Hague Tech (THT) only
    const thtEvents = R.filter(ApiProxy.isThtEvent, events)

    // Calculate percentage of RSVPs at THT
    let percentageOfThtEvents = Math.round(thtEvents.length / events.length * 100)

    // Set localStorage
    localStorage.setItem('numberOfEvents' + this.props.year, events.length);
    localStorage.setItem('percentageOfThtRsvps' + this.props.year, percentageOfThtEvents);

    // Set state
    this.setState({
      numberOfEvents: events.length,
      percentageOfThtEvents: percentageOfThtEvents
    })
  }

  render() {
    return (
      <ChartBlock title="Tech Events"
                  primaryStat={this.state.numberOfEvents}
                  secondaryStat={`${this.state.percentageOfThtEvents}% at The Hague Tech`}
                  backgroundColor="#f0c214"
                  />
    )
  }
}
