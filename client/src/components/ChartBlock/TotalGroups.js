import React, { Component } from 'react';
import ApiProxy from '../../services/ApiProxy.service.js';
import ChartBlock from './ChartBlock.js';

export default class TotalGroups extends Component {

  constructor(props) {
    super(props);

    this.state = {
      numberOfGroups: localStorage.getItem('numberOfGroups' + props.year) || '...',
    }
  }

  componentDidMount() {
    this.populateData();
  }

  async populateData() {
    // Get groups
    const groups = await ApiProxy.getGroups()

    // Get events
    const events = await ApiProxy.getEventsForGroups(groups, this.props.year);

    // Count groups that had events in $year
    let uniqueGroups = [];
    // Loop all events
    for (var i = 0; i < events.length; i++) {
      // If event group is not yet in the list
      if( uniqueGroups.indexOf(events[i].group.id) <= -1) {
        // Add group to the 'uniqueGroups' array.
        // Now you have a list of unique Groups for this year.
        uniqueGroups.push(events[i].group.id)
      }
    }

    // Set localStorage
    localStorage.setItem('numberOfGroups' + this.props.year, uniqueGroups.length);

    // Set state
    this.setState({ numberOfGroups: uniqueGroups.length })
  }

  render() {
    return (
      <ChartBlock title="Tech Groups"
                  primaryStat={this.state.numberOfGroups}
                  secondaryStat={'in The Hague'}
                  backgroundColor="#f28a17"
                  />
    )
  }
}
