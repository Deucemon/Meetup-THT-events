import React, { Component } from 'react';
import './ChartBlock.css';

export default class ChartBlock extends Component {
  render() {
    return (
      <div className="ChartBlock" style={{backgroundColor: this.props.backgroundColor}}>

        <h1>
          {this.props.title}
        </h1>
        
        <div>

          <b>
            {this.props.primaryStat}
          </b>

          <small>
            {this.props.secondaryStat}
          </small>

        </div>

      </div>
    )
  }
}
