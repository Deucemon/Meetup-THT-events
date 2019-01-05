import React, { Component } from 'react';
import ApiProxy from '../../services/ApiProxy.service.js';
import * as R from 'ramda';

import './TopVenues.css';

export default class TopVenues extends Component {
  constructor(props) {
    // You need to use 'super',
    // if you want to access 'this.varName' like variables
    super(props);

    // On component creation: create an empty topVenues state variable.
    // The state variable is used for variables that define the component state.
    // Once a state variables changes, the component gets automatically re-rendered.
    this.state = {
      topVenues: []
    }
  }

  // Once the component is added to the DOM, this function is called:
  async componentDidMount() {
    let topVenues = await this.getTopVenues();

    this.setState({ topVenues: topVenues });
  }

  async getTopVenues() {
    // Get groups
    const groups = await ApiProxy.getGroups()

    // Get events for groups
    const events = await ApiProxy.getEventsForGroups(groups, this.props.year);

    // Now get the unique event locations
    // ...

    // Sort event locations on most popular 'count'
    // ...

    // return topVenues;

    return [
      {
        name: "NCIM",
        address_1: "Overgoo 11",
        city: "Leidschendam",
        count: 20
      },
      {
        name: "het Ondernemerscafé",
        address_1: "Binckhorstlaan 36 M.5.00",
        city: "Den Haag",
        count: 10
      }
    ]
  }

  renderVenue(venue) {
    return (
      <div>
        <b>{venue.name}: </b>
        {venue.count}
      </div>
    )
  }

  render() {
    return (
      <div className="TopVenues">

        <h1>
          Top venues {this.props.year}
        </h1>
        
        <p>
          These were the top venues of {this.props.year}:
        </p>

        <div>
          {R.map(this.renderVenue, this.state.topVenues)}
        </div>

      </div>
    )
  }
}
