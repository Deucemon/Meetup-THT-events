import React, { Component } from 'react';
import './App.css';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import TextBlock from './components/TextBlock/TextBlock.js';
import ChartBlock from './components/ChartBlock/ChartBlock.js';
import StatsList from './components/StatsList/StatsList.js';
import RsvpsThroughTime from './components/Charts/RsvpsThroughTime.js';

class AppTab extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="tab-container">

        <div className="flex">
          <ChartBlock title="Groups" primaryStat="200" secondaryStat="10 at The Hague Tech" backgroundColor="#b35da0" />
          <ChartBlock title="RSVP's" primaryStat="200" secondaryStat="10 at The Hague Tech" backgroundColor="#f28a17" />
          <ChartBlock title="Events" primaryStat="200" secondaryStat="10 at The Hague Tech" backgroundColor="#f0c214" />
        </div>

        <RsvpsThroughTime />

        <StatsList />

      </div>
    )
  }
}

class App extends Component {

  constructor(props) {
    super(props);

    this.state = { tabIndex: 0 };
  }

  render() {
    return (
      <div className="App">

        <TextBlock title="The Hague - Tech">

          <p className="link-style-10">
            We are happy to see that <a href="https://denhaag.com/en" target="_blank">The Hague</a> is <a href="https://2018.stateofeuropeantech.com/chapter/tech-hubs/article/growing-communities/#chart-25" target="_blank">listed</a> as one of the top growing tech cities in the world.
          </p>

          <p className="link-style-10">
            We were curious: How much of the tech community growth was caused by <a href="https://www.thehaguetech.com/">The Hague Tech</a>, a new tech hub that exists for +- 1 year now.
          </p>

          <p className="link-style-10">
            On this page you find some nice stats, based on the <a href="https://www.meetup.com" target="_blank"><img src="/logo/meetup.svg" height="30" alt="Meetup" style={{position: 'relative', top: '7px'}} /></a> API. All is <a href="https://github.com/Deucemon/Meetup-THT-events" target="_blank">open source</a>, feel free to contribute. Enjoy!
          </p>

        </TextBlock>

        <div class="App-tabs-wrapper">
          <Tabs selectedIndex={this.state.tabIndex} onSelect={tabIndex => this.setState({ tabIndex })}>
            <TabList>
              <nav className="tabs">
                <Tab><button>2017</button></Tab>
                <Tab><button>2018</button></Tab>
              </nav>
            </TabList>
            <TabPanel>
              <AppTab year={this.state.tabIndex + 2017}></AppTab>
            </TabPanel>
            <TabPanel>
              <AppTab year={this.state.tabIndex + 2017}></AppTab>
            </TabPanel>
          </Tabs>
        </div>

      </div>
    );
  }
}

export default App;
