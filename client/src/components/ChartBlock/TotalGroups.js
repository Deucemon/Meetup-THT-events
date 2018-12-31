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

    // Set localStorage
    localStorage.setItem('numberOfGroups' + this.props.year, groups.length);

    // Set state
    this.setState({ numberOfGroups: groups.length })
  }

  render() {
    return (
      <ChartBlock title="Tech Groups"
                  primaryStat={this.state.numberOfGroups}
                  secondaryStat={'currently in The Hague'}
                  backgroundColor="#f28a17"
                  />
    )
  }
}
