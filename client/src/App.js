import React, { Component } from 'react';
import './App.css';

import TextBlock from './components/TextBlock/TextBlock.js';
import ChartBlock from './components/ChartBlock/ChartBlock.js';
import StatsList from './components/StatsList/StatsList.js';
import RsvpsThroughTime from './components/Charts/RsvpsThroughTime.js';

class App extends Component {

  render() {
    return (
      <div className="App">

        <TextBlock title="The Hague - Tech">

          <p class="link-style-10">
            We are happy to see that <a href="https://denhaag.com/en" target="_blank">The Hague</a> is <a href="https://2018.stateofeuropeantech.com/chapter/tech-hubs/article/growing-communities/#chart-25" target="_blank">listed</a> as one of the top growing tech cities in the world.
          </p>

          <p class="link-style-10">
            We were curious: How much of the tech community growth was caused by <a href="https://www.thehaguetech.com/">The Hague Tech</a>, a new tech hub that exists for +- 1 year now.
          </p>

          <p class="link-style-10">
            On this page you find some nice stats, based on the <img src="/logo/meetup.svg" height="30" alt="Meetup" style={{position: 'relative', top: '7px'}} /> API. All is <a href="https://github.com/Deucemon/Meetup-THT-events" target="_blank">open source</a>, feel free to contribute. Enjoy!
          </p>

        </TextBlock>

        <div className="flex" style={{margin: '40px 0'}}>
          <ChartBlock title="Groups" primaryStat="200" secondaryStat="10 at The Hague Tech" backgroundColor="#b35da0" />
          <ChartBlock title="RSVP's" primaryStat="200" secondaryStat="10 at The Hague Tech" backgroundColor="#f28a17" />
          <ChartBlock title="Events" primaryStat="200" secondaryStat="10 at The Hague Tech" backgroundColor="#f0c214" />
        </div>

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
