import React, { Component } from 'react';
import './App.css';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import ApiProxy from './services/ApiProxy.service.js';

import Banner from './components/Banner/Banner.js';
import TextBlock from './components/TextBlock/TextBlock.js';
import TotalGroups from './components/ChartBlock/TotalGroups.js';
import TotalEvents from './components/ChartBlock/TotalEvents.js';
import TotalRsvps from './components/ChartBlock/TotalRsvps.js';
import StatsList from './components/StatsList/StatsList.js';
import RsvpsThroughTime from './components/Charts/RsvpsThroughTime.js';
import MailChimpSubscribe from './components/MailChimpSubscribe/MailChimpSubscribe.js';

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

    this.state = { tabIndex: 2 };
  }

  render() {
    return (
      <div className="App">

        <TextBlock title={ApiProxy.getCity() + ' - Tech'}>

          <div style={{display: ApiProxy.getCity() != 'The Hague' ? 'block' : 'none'}}>
            <p className="link-style-10">
              On this page you see the top visited Meetup groups of <b>{ApiProxy.getCity()}</b> that are categorized as <b>Tech</b>.
            </p>

            <p className="link-style-10">
              The stats are from the <a href="https://www.meetup.com" target="_blank" rel="noopener noreferrer"><img src="/logo/meetup.svg" height="30" alt="Meetup" style={{position: 'relative', top: '7px'}} /></a> API. All is <a href="https://github.com/Deucemon/Meetup-THT-events" target="_blank" rel="noopener noreferrer">open source</a>, feel free to contribute. Enjoy!
            </p>
          </div>

          <div style={{display: ApiProxy.getCity() == 'The Hague' ? 'block' : 'none'}}>
            <p className="link-style-10">
              We are happy to see that <a href="https://denhaag.com/en" target="_blank" rel="noopener noreferrer">The Hague</a> is <a href="https://2018.stateofeuropeantech.com/chapter/tech-hubs/article/growing-communities/#chart-25" target="_blank" rel="noopener noreferrer">listed</a> as one of the top growing tech cities in the world.
            </p>

            <p className="link-style-10">
              We were curious: How much of the tech community growth was caused by <a href="https://www.thehaguetech.com/" target="_blank" rel="noopener noreferrer">The Hague Tech</a>, a new tech hub that exists for +- 1 year now.
            </p>

            <p className="link-style-10">
              On this page you find some nice stats, based on the <a href="https://www.meetup.com" target="_blank" rel="noopener noreferrer"><img src="/logo/meetup.svg" height="30" alt="Meetup" style={{position: 'relative', top: '7px'}} /></a> API. All is <a href="https://github.com/Deucemon/Meetup-THT-events" target="_blank" rel="noopener noreferrer">open source</a>, feel free to contribute. Enjoy!
            </p>
          </div> 

        </TextBlock>

        <Banner />

        <div className="App-tabs-wrapper">
          <Tabs selectedIndex={this.state.tabIndex} onSelect={tabIndex => this.setState({ tabIndex })}>
            <TabList>
              <nav className="tabs">
                <Tab><button>2016</button></Tab>
                <Tab><button>2017</button></Tab>
                <Tab><button>2018</button></Tab>
                <Tab><button>2019</button></Tab>
              </nav>
            </TabList>
            <TabPanel><AppTab year={this.state.tabIndex + 2016}></AppTab></TabPanel>
            <TabPanel><AppTab year={this.state.tabIndex + 2016}></AppTab></TabPanel>
            <TabPanel><AppTab year={this.state.tabIndex + 2016}></AppTab></TabPanel>
            <TabPanel><AppTab year={this.state.tabIndex + 2016}></AppTab></TabPanel>
          </Tabs>
        </div>

        <br />
        <br />
        <br />

        <TextBlock title="Some notes on the data">
          <div className="link-style-10">
            <p>
              We use the <a href="https://secure.meetup.com/meetup_api" target="_blank" rel="noopener noreferrer">Meetup API</a>.
            </p>
            <p>
              We select only the meetups that are categorised as "Tech". At Meetup this is category <tt>34</tt>. Click on 'Show Response' <a href="https://secure.meetup.com/meetup_api/console/?path=/2/categories" target="_blank" rel="noopener noreferrer">here</a> to see all category types.
            </p>
            <div style={{display: ApiProxy.getCity() == 'The Hague' ? 'block' : 'none'}}>
              <p>
                For The Hague area we have set the center on longitude 4.330529 and latitude 52.081776, with a radius of 4 miles. This includes for example the area from The Hague centre to Scheveningen. It doesn't include Leiden and Delft.
              </p>
            </div>
          </div>
        </TextBlock>

        <MailChimpSubscribe />

        <footer className="Footer link-style-10">
          <p>
            This project was initiated by <a href="https://www.linkedin.com/in/charlesulin/" target="_blank" rel="noopener noreferrer">Charles Weiler-Ulin</a>, <a href="https://github.com/Deucemon" target="_blank" rel="noopener noreferrer">Deucemon</a> & <a href="https://www.bartroorda.nl" target="_blank" rel="noopener noreferrer">Bart Roorda</a>. You're welcome to contribute to this project: Share your ideas via <a href="mailto:mail@bartroorda.nl?subject=Hello from the-hague-meetup-stats&body=I like to">mail@bartroorda.nl</a> or start working on improving <a href="https://github.com/Deucemon/Meetup-THT-events" target="_blank" rel="noopener noreferrer">the code</a>.
          </p>
          <div style={{display: ApiProxy.getCity() == 'The Hague' ? 'block' : 'none'}}>
            <p>
              <a href="https://denhaag.com/en" target="_blank" rel="noopener noreferrer">The Hague</a> is a beautiful city in The Netherlands. With a tech scene. And people. Might meet you there sometime.
            </p>
          </div>
        </footer>

      </div>
    );
  }
}

export default App;
