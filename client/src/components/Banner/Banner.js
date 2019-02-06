import React, { Component } from 'react';
import './Banner.css';

export default class Banner extends Component {
  render() {
    return (
      <div className="Banner link-style-10">

        <p>
          <span role="img">🏙</span> <a href="/">#thisisthehague</a>.
          &nbsp;Curious to
          &nbsp;<span role="img">🌇</span> <a href="?city=Amsterdam">Amsterdam</a> and 
          &nbsp;<span role="img">🌃</span> <a href="?city=Rotterdam">Rotterdam</a>?
        </p>
      
      </div>
    )
  }
}
