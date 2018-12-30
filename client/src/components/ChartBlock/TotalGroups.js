import React, { Component } from 'react';
import ApiProxy from '../../services/ApiProxy.service.js';
import ChartBlock from './ChartBlock.js';

export default class TotalGroups extends Component {

  constructor(props) {
    super(props);

    this.state = {
      numberOfGroups: 0
    }
  }

  componentDidMount() {
    this.populateData();
  }

  async populateData() {
    // Get groups
    const groups = await ApiProxy.getGroups()
    // Set state
    this.setState({ numberOfGroups: groups.length })
  }

  render() {
    return (
      <ChartBlock title="Tech Groups"
                  primaryStat={this.state.numberOfGroups}
                  secondaryStat={''}
                  backgroundColor="#b35da0"
                  />
    )
  }
}
