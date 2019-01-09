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
    let venueList = [];
    events.forEach(function(event){
      if (! (typeof event.venue === "undefined"))  {
      venueList.push(event.venue.name);
    }
          
    });
    
    //Eliminate duplicates
    let uniqueVenues = [...new Set(venueList)];

    //Count events per location
    let venueCount = [];
    for (let i = 0; i < uniqueVenues.length; i++) {
      venueCount[i]= 0;
      for (let j = 0; j < venueList.length; j++) {
        if (uniqueVenues[i] === venueList[j]){
            venueCount[i]++;
        };
      };  
    };
    //Combine into object and sort.
    let venueRank = {};
    for (let i = 0; i < uniqueVenues.length; i++){
      venueRank[uniqueVenues[i]] = venueCount[i];
    };
    let venueSort = [];
    for (let venue in venueRank) {
      venueSort.push([venue, venueRank[venue]]);
    };
    

    // Sort event locations on most popular 'count'
    // ...
    venueSort.sort(function(a, b) {
      return b[1] - a[1];
    });
    const topThree = venueSort.slice(0,3);
    let topVenues = [];
    for (let i =0; i < topThree.length; i++) {
      topVenues[i] = {name : topThree[i][0], address_1: "",city:"", count:topThree[i][1] };
    };
    
    
    


    // return topVenues;

    return topVenues
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
