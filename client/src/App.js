import React, { Component } from 'react';
import './App.css';

import TextBlock from './components/TextBlock/TextBlock.js';
import StatsList from './components/StatsList/StatsList.js';
import RsvpsThroughTime from './components/Charts/RsvpsThroughTime.js';

class App extends Component {

  render() {
    return (
      <div className="App">

        <TextBlock title="The Hague - Tech">

          <p>
            We are happy to see that <a href="https://denhaag.com/en" target="_blank">The Hague</a> is listed as one of the top growing tech cities in the world.
          </p>

          <p>
            We are members of The Hague Tech, a tech hub of +- 1 year old. We were curious if The Hague Tech has played a big role in this growth, so we did some research.
          </p>

          <p>
            A interactive overview of what happened in The Hague meetup scene last years.
          </p>

        </TextBlock>

        <RsvpsThroughTime />

        <p hidden>
      	  <img src="https://secure.meetup.com/s/img/0/logo/svg/logo--script.svg" width="200" alt="Meetup logo" />
        </p>

        <StatsList />

      </div>
    );
  }
}

export default App;
