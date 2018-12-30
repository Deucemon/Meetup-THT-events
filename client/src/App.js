import React, { Component } from 'react';
import './App.css';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import TextBlock from './components/TextBlock/TextBlock.js';
import ChartBlock from './components/ChartBlock/ChartBlock.js';
import TotalGroups from './components/ChartBlock/TotalGroups.js';
import TotalEvents from './components/ChartBlock/TotalEvents.js';
import TotalRsvps from './components/ChartBlock/TotalRsvps.js';
import StatsList from './components/StatsList/StatsList.js';
import RsvpsThroughTime from './components/Charts/RsvpsThroughTime.js';

class AppTab extends Component {

  render() {
    return (
      <div className="tab-container">

        <div className="flex">
          <TotalGroups year={this.props.year} />
          <TotalEvents year={this.props.year} />
          <TotalRsvps year={this.props.year} />
        </div>

        {/*<RsvpsThroughTime />*/}

        <div style={{margin: '0 10px'}}>
          <StatsList year={this.props.year} />
        </div>

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
            We are happy to see that <a href="https://denhaag.com/en" target="_blank" rel="noopener noreferrer">The Hague</a> is <a href="https://2018.stateofeuropeantech.com/chapter/tech-hubs/article/growing-communities/#chart-25" target="_blank" rel="noopener noreferrer">listed</a> as one of the top growing tech cities in the world.
          </p>

          <p className="link-style-10">
            We were curious: How much of the tech community growth was caused by <a href="https://www.thehaguetech.com/" rel="noopener noreferrer">The Hague Tech</a>, a new tech hub that exists for +- 1 year now.
          </p>

          <p className="link-style-10">
            On this page you find some nice stats, based on the <a href="https://www.meetup.com" target="_blank" rel="noopener noreferrer"><img src="/logo/meetup.svg" height="30" alt="Meetup" style={{position: 'relative', top: '7px'}} /></a> API. All is <a href="https://github.com/Deucemon/Meetup-THT-events" target="_blank" rel="noopener noreferrer">open source</a>, feel free to contribute. Enjoy!
          </p>

        </TextBlock>

        <div className="App-tabs-wrapper">
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
